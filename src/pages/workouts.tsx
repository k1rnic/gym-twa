import { viewerModel } from '@/entities/viewer';
import { workoutModel } from '@/entities/workout';
import { Api, TaskGroupStatus } from '@/shared/api';
import { useSortableList } from '@/shared/lib/hooks';
import { Flex } from '@/shared/ui/flex';
import {
  WorkoutCardPreview,
  WorkoutCardPreviewProps,
} from '@/widgets/workout-card-preview';
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
import { Button, Segmented } from 'antd';
import { SegmentedOptions } from 'antd/es/segmented';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useRevalidator } from 'react-router';
import { Route } from './+types/workouts';

const FILTERS: SegmentedOptions<TaskGroupStatus> = [
  { label: 'новые', value: TaskGroupStatus.Planned },
  { label: 'текущие', value: TaskGroupStatus.Running },
  { label: 'завершенные', value: TaskGroupStatus.Finished },
];

const SortableWorkout = ({
  status,
  ...props
}: WorkoutCardPreviewProps & { status: TaskGroupStatus }) => {
  const navigate = useNavigate();
  const viewer = viewerModel.useViewer();
  const isMineWorkout = props.workout.gymer_id === viewer.gymer?.gymer_id;
  const hasExercises = Boolean(props.workout.tasks?.length);

  const { setNodeRef, style, handler } = useSortableList(
    props.workout.task_group_id,
  );

  const goGym = () => {
    navigate(`${props.workout.task_group_id}/gym`);
  };

  const canGym =
    status !== TaskGroupStatus.Finished && isMineWorkout && hasExercises;

  return (
    <div ref={setNodeRef} style={style}>
      <WorkoutCardPreview
        {...props}
        titleExtraBefore={handler}
        extraAfter={
          canGym ? (
            <Button size="small" type="primary" onClick={goGym}>
              GYM
            </Button>
          ) : undefined
        }
      />
    </div>
  );
};

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.taskGroup
    .listTaskGroup({
      gymer_id: +params.gId,
      status: params.status as TaskGroupStatus,
    })
    .catch(() => []);
};

const Page = ({ loaderData: workouts, params }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  const viewer = viewerModel.useViewer();

  const [innerWorkouts, setInnerWorkouts] = useState(workouts);

  const status = params.status as TaskGroupStatus;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = innerWorkouts.findIndex(
      (i) => i.task_group_id === active.id,
    );
    const newIndex = innerWorkouts.findIndex(
      (i) => i.task_group_id === over.id,
    );

    const reordered = arrayMove(innerWorkouts, oldIndex, newIndex);

    setInnerWorkouts(reordered);

    await Api.taskGroup.reorderTaskGroup(
      reordered.map((w, idx) => ({
        task_group_id: w.task_group_id,
        order_idx: idx,
      })),
    );
    revalidate();
  };

  const createWorkout = async () => {
    const data = await Api.taskGroup.createTaskGroup({
      master_id: viewer.master!.master_id!,
      gymer_id: +params.gId,
      title: 'Новая тренировка',
    });

    navigate(`../${TaskGroupStatus.Planned}/${data.task_group_id}/details`, {
      relative: 'path',
    });
  };

  const filterWorkouts = (status: TaskGroupStatus) => {
    navigate(`../${status}`, { relative: 'path' });
  };

  const goToWorkoutDetails = (w: workoutModel.Workout) => {
    navigate(`${w.task_group_id}/details`);
  };

  useEffect(() => {
    setInnerWorkouts(workouts);
  }, [workouts]);

  return (
    <Flex height="100%" style={{ overflow: 'hidden' }} gap={8}>
      <Outlet />

      <Segmented
        block
        options={FILTERS}
        value={status}
        onChange={filterWorkouts}
      />

      <Button
        block
        type="primary"
        size="middle"
        icon={<PlusOutlined />}
        onClick={createWorkout}
      >
        Добавить тренировку
      </Button>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      >
        <SortableContext
          items={innerWorkouts.map((i) => i.task_group_id)}
          strategy={verticalListSortingStrategy}
        >
          <Flex height="100%" gap={8} style={{ overflowY: 'auto' }}>
            {innerWorkouts.map((w, idx, { length }) => (
              <SortableWorkout
                key={w.task_group_id}
                workout={w}
                status={status}
                style={{ marginBottom: idx === length - 1 ? 72 : 0 }}
                onClick={() => goToWorkoutDetails(w)}
              />
            ))}
          </Flex>
        </SortableContext>
      </DndContext>
    </Flex>
  );
};

export default Page;
