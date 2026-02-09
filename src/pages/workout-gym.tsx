import { exerciseModel } from '@/entities/exercise';
import { workoutModel } from '@/entities/workout';
import { Api, Set, TaskGroupStatus } from '@/shared/api';
import { useSortableList } from '@/shared/lib/hooks';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { PlusOutlined } from '@ant-design/icons';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button, Card, Descriptions, Form, Input, Typography } from 'antd';
import { DescriptionsItemType } from 'antd/lib/descriptions';
import { useCallback, useMemo, useState } from 'react';
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
  const { setNodeRef, style, handler } = useSortableList(ex.task_id);

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
            {handler}
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
  const theme = useTheme();

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

  const hasFinishedExercises = useCallback(
    (set: Set) => set.fact_value !== null && set.fact_rep !== null,
    [],
  );

  const getExerciseDescriptions = useCallback(
    (ex: exerciseModel.ExerciseInstance): DescriptionsItemType[] => [
      ...(ex.task_properties?.sets?.map((s, idx) => ({
        key: s.set_id,
        label: `${idx + 1}`,
        children: (
          <Flex vertical={false} width="100%">
            <Flex
              flex={1}
              align="flex-start"
              style={{ color: theme.token.colorSuccess }}
              hidden={!hasFinishedExercises(s)}
            >{`${s.fact_value ?? 0} кг x ${s.fact_rep ?? 0} раз`}</Flex>
            <Flex flex={1} align="flex-end">{`${s.plan_value ?? 0} кг x ${
              s.plan_rep ?? 0
            } раз`}</Flex>
          </Flex>
        ),
      })) ?? []),
      {
        key: 'rest',
        label: 'Отдых',
        children: `${ex.task_properties?.rest || 0} сек`,
      },
    ],
    [theme.token.colorSuccess, hasFinishedExercises],
  );

  const goToExercise = (id: exerciseModel.ExerciseInstance['task_id']) => {
    navigate(`${id}`);
  };

  const goToWorkouts = (status: TaskGroupStatus) => {
    navigate(`../../../${status}`, { relative: 'path' });
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

  const submitChanges = async () => {
    try {
      if (form.isFieldTouched('title')) {
        await Api.taskGroup.updateTaskGroupTitle(workout!.task_group_id, {
          title: form.getFieldValue('title') || 'Без названия',
        });
      }
      if (status === TaskGroupStatus.Planned) {
        await Api.taskGroup.updateTaskGroupStatus(+params.wId, {
          status: TaskGroupStatus.Running,
        });
        goToWorkouts(TaskGroupStatus.Running);
      }
    } catch {
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

  const finishWorkout = async () => {
    try {
      await Api.taskGroup.updateTaskGroupStatus(+params.wId, {
        status: TaskGroupStatus.Finished,
      });
      goToWorkouts(TaskGroupStatus.Finished);
    } catch {
      navigate('../');
    }
  };

  return (
    <PageDrawer
      open
      title="Тренировка"
      onClose={submitChanges}
      extra={
        <Button type="primary" onClick={finishWorkout}>
          Завершить
        </Button>
      }
    >
      <Flex height="100%" style={{ overflow: 'hidden' }}>
        <Form<FormValues> form={form} initialValues={initialData} size="middle">
          <Form.Item<FormValues> name="title">
            <Input style={{ width: '100%' }} placeholder="Название" disabled />
          </Form.Item>
        </Form>

        <Form.Item>
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
      </Flex>

      <Outlet />
    </PageDrawer>
  );
};

export default Page;
