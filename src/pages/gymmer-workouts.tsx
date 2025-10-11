import { workoutModel } from '@/entities/workout';
import { WorkoutFilter, WorkoutsFilterProps } from '@/features/filter-workouts';
import { Api, TaskGroupStatus } from '@/shared/api';
import { sortByCreated } from '@/shared/lib/date';
import { Flex } from '@/shared/ui/flex';
import {
  WorkoutCardPlanned,
  WorkoutCardPlannedProps,
} from '@/widgets/workout-card-planned';
import {
  WorkoutCardRunning,
  WorkoutCardRunningProps,
} from '@/widgets/workout-card-running';
import { Button, Space } from 'antd';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Route } from './+types/gymmer-workouts';

export const clientLoader = async ({
  params: { gId },
}: Route.ClientLoaderArgs): Promise<workoutModel.Workout[]> => {
  return await Api.taskGroup
    .listTaskGroup({ gymer_id: +gId })
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

const Page = ({ loaderData }: Route.ComponentProps) => {
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
            extraAfter={
              <Button
                type="primary"
                disabled={!props.workout.tasks?.length}
                onClick={() => navigate(`${props.workout.task_group_id}`)}
              >
                GYM
              </Button>
            }
            {...props}
          />
        );
      case TaskGroupStatus.Running:
      case TaskGroupStatus.Finished:
        return (
          <WorkoutCardRunning
            extraAfter={
              <Button
                type="primary"
                disabled={!props.workout.tasks?.length}
                onClick={() => navigate(`${props.workout.task_group_id}`)}
              >
                GYM
              </Button>
            }
            {...props}
          />
        );
    }
  };

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
            idx={idx}
            key={w.task_group_id}
            style={{ marginBottom: idx === length - 1 ? 48 : 0 }}
            workout={w}
          />
        ))}
      </Space>
    </Flex>
  );
};

export default Page;
