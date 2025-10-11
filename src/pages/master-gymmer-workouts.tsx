import { exerciseModel } from '@/entities/exercise';
import { workoutModel } from '@/entities/workout';
import { WorkoutFilter, WorkoutsFilterProps } from '@/features/filter-workouts';
import { Api, TaskGroupStatus } from '@/shared/api';
import { sortByCreated } from '@/shared/lib/date';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import {
  WorkoutCardPlanned,
  WorkoutCardPlannedProps,
} from '@/widgets/workout-card-planned';
import {
  WorkoutCardRunning,
  WorkoutCardRunningProps,
} from '@/widgets/workout-card-running';
import { PlusOutlined } from '@ant-design/icons';
import { FloatButton, Space } from 'antd';
import { useState } from 'react';
import { Outlet, useNavigate, useRevalidator } from 'react-router';
import { Route } from './+types/master-gymmer-workouts';

export const clientLoader = async ({
  params: { mId, gId },
}: Route.ClientLoaderArgs): Promise<workoutModel.Workout[]> => {
  return await Api.taskGroup
    .listTaskGroup({ gymer_id: +gId, master_id: +mId })
    .then((data) =>
      data
        .map(({ tasks, ...data }) => ({
          ...data,
          tasks: tasks?.sort(sortByCreated) ?? [],
        }))
        .sort(sortByCreated),
    )
    .catch(() => []);
};

const Page = ({ loaderData, params }: Route.ComponentProps) => {
  const { token } = useTheme();
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();

  const [status, setStatus] = useState<TaskGroupStatus>(
    TaskGroupStatus.Running,
  );

  const [filteredWorkouts, setFilteredWorkouts] = useState<
    workoutModel.Workout[]
  >([]);

  const WorkoutComponent = (
    props: (WorkoutCardPlannedProps | WorkoutCardRunningProps) & {
      idx: number;
    },
  ) => {
    switch (status) {
      case TaskGroupStatus.Planned:
        return (
          <WorkoutCardPlanned
            title={`Тренировка ${filteredWorkouts.length - props.idx}`}
            {...props}
          />
        );
      case TaskGroupStatus.Running:
      case TaskGroupStatus.Finished:
        return <WorkoutCardRunning {...props} />;
    }
  };

  const createWorkout = async () => {
    await Api.taskGroup.createTaskGroup({
      master_id: +params.mId,
      gymer_id: +params.gId,
    });
    await revalidate();
  };

  const goToExercise = (
    workout: workoutModel.Workout,
    ex: exerciseModel.ExerciseInstance,
  ) =>
    navigate({
      pathname: `${workout.task_group_id}/${ex.task_id}`,
      search: `status=${workout.status}`,
    });

  const handleFilter: WorkoutsFilterProps['onFilter'] = (workouts, status) => {
    setFilteredWorkouts(workouts);
    setStatus(status);
  };

  return (
    <Flex height="100%" style={{ overflow: 'hidden' }}>
      <Outlet />
      <WorkoutFilter
        initialStatus={status}
        workouts={loaderData}
        onFilter={handleFilter}
      />

      <Space direction="vertical" style={{ overflowY: 'auto', height: '110%' }}>
        {filteredWorkouts.map((w, idx, { length }) => (
          <WorkoutComponent
            copyEnabled
            createEnabled
            idx={idx}
            key={w.task_group_id}
            masterId={+params.mId}
            style={{ marginBottom: idx === length - 1 ? 48 : 0 }}
            workout={w}
            onExClick={goToExercise}
          />
        ))}
      </Space>

      <FloatButton
        type="primary"
        icon={<PlusOutlined />}
        style={{ bottom: token.paddingLG }}
        onClick={createWorkout}
      />
    </Flex>
  );
};

export default Page;
