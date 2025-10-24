import { exerciseModel } from '@/entities/exercise';
import { workoutModel } from '@/entities/workout';
import { Api, TaskGroupStatus } from '@/shared/api';
import { DeleteButton } from '@/shared/ui/delete-button';
import { Flex } from '@/shared/ui/flex';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { HolderOutlined, PlusOutlined } from '@ant-design/icons';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  restrictToFirstScrollableAncestor,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Card, Descriptions, Form, Input, Typography } from 'antd';
import { DescriptionsItemType } from 'antd/lib/descriptions';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Route } from './+types/workout-details';

type FormValues = workoutModel.Workout;

const SortableExerciseCard = ({
  ex,
  readonly,
  getExerciseDescriptions,
  onClick,
}: {
  ex: exerciseModel.ExerciseInstance;
  readonly: boolean;
  getExerciseDescriptions: (
    ex: exerciseModel.ExerciseInstance,
  ) => DescriptionsItemType[];
  onClick: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ex.task_id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.95 : 1,
    touchAction: 'none',
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        size="small"
        title={
          <Flex
            vertical={false}
            align="center"
            gap={8}
            style={{ whiteSpace: 'break-spaces' }}
          >
            <HolderOutlined
              hidden={readonly}
              style={{ cursor: 'grab', color: '#999' }}
              {...listeners}
              {...attributes}
            />
            <Typography.Text ellipsis>
              {ex.exercise?.exercise_name ?? 'Не выбрано'}
            </Typography.Text>
          </Flex>
        }
        onClick={onClick}
      >
        <Descriptions column={1} items={getExerciseDescriptions(ex)} />
      </Card>
    </div>
  );
};

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.taskGroup.taskGroupById(+params.wId);
};

const Page = ({ loaderData: workout, params }: Route.ComponentProps) => {
  const navigate = useNavigate();

  const [form] = Form.useForm<FormValues>();

  const [innerTasks, setInnerTasks] = useState(workout?.tasks ?? []);

  const initialData = useMemo<DeepPartial<FormValues>>(
    () => ({ ...workout }),
    [workout],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const status = params.status as TaskGroupStatus;
  const readonly = status === TaskGroupStatus.Finished;

  const getExerciseDescriptions = useCallback(
    (ex: exerciseModel.ExerciseInstance): DescriptionsItemType[] => [
      {
        key: 'rest',
        label: 'Отдых',
        children: `${ex.task_properties?.rest || 0} сек`,
      },
      ...(ex.task_properties?.sets?.map((s, idx) => ({
        key: s.set_id,
        label: `${idx + 1} Подход`,
        children: `${s.plan_value ?? 0} кг x ${s.plan_rep ?? 0} раз`,
      })) ?? []),
    ],
    [],
  );

  const goToExercise = (id: exerciseModel.ExerciseInstance['task_id']) => {
    navigate(`${id}`);
  };

  const createExerciseInstance = async () => {
    try {
      const instance = await Api.task.createTask({
        task_group_id: workout!.task_group_id,
      });
      navigate(`${instance?.task_id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteWorkout = async () => {
    try {
      await Api.taskGroup.deleteTaskGroup(workout!.task_group_id);
    } finally {
      navigate('../');
    }
  };

  const submitChanges = async () => {
    try {
      if (form.isFieldTouched('title')) {
        await Api.taskGroup.updateTaskGroupTitle(workout!.task_group_id, {
          title: form.getFieldValue('title') || 'Без названия',
        });
      }
    } finally {
      navigate('../');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = innerTasks.findIndex((t) => t.task_id === active.id);
    const newIndex = innerTasks.findIndex((t) => t.task_id === over.id);
    const reordered = arrayMove(innerTasks, oldIndex, newIndex);
    setInnerTasks(reordered);

    try {
      await Api.task.reorderTask(
        reordered.map((t, idx) => ({
          task_id: t.task_id,
          order_idx: idx,
        })),
      );
    } catch (e) {
      console.error('Failed to reorder tasks', e);
    }
  };

  useEffect(() => {
    setInnerTasks(workout?.tasks ?? []);
  }, [workout]);

  return (
    <PageDrawer
      open
      placement="bottom"
      title="Тренировка"
      height="100%"
      onClose={submitChanges}
    >
      <Flex height="100%" style={{ overflow: 'hidden' }}>
        <Form<FormValues>
          form={form}
          initialValues={initialData}
          size="middle"
          disabled={readonly}
        >
          <Form.Item<FormValues> name="title">
            <Input style={{ width: '100%' }} placeholder="Название" />
          </Form.Item>
        </Form>

        <Form.Item hidden={status !== TaskGroupStatus.Planned}>
          <Button
            block
            size="middle"
            type="dashed"
            className="m-5"
            onClick={createExerciseInstance}
            icon={<PlusOutlined />}
          >
            Добавить упражнение
          </Button>
        </Form.Item>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[
            restrictToVerticalAxis,
            restrictToFirstScrollableAncestor,
          ]}
        >
          <SortableContext
            items={innerTasks.map((t) => t.task_id)}
            strategy={verticalListSortingStrategy}
          >
            <Flex flex={1} gap={8} style={{ overflow: 'auto' }}>
              {innerTasks.map((ex) => (
                <SortableExerciseCard
                  key={ex.task_id}
                  ex={ex}
                  readonly={readonly}
                  getExerciseDescriptions={getExerciseDescriptions}
                  onClick={() => goToExercise(ex.task_id)}
                />
              ))}
            </Flex>
          </SortableContext>
        </DndContext>

        <DeleteButton hidden={readonly} onDelete={deleteWorkout} />
      </Flex>

      <Outlet />
    </PageDrawer>
  );
};

export default Page;
