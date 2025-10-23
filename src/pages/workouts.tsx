import { viewerModel } from '@/entities/viewer';
import { workoutModel } from '@/entities/workout';
import { Api, TaskGroupStatus } from '@/shared/api';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import {
  WorkoutCardPreview,
  WorkoutCardPreviewProps,
} from '@/widgets/workout-card-preview';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Segmented, Space } from 'antd';
import { SegmentedOptions } from 'antd/es/segmented';
import { FloatButton } from 'antd/lib';
import { Outlet, useNavigate } from 'react-router';
import { Route } from './+types/workouts';

const FILTERS: SegmentedOptions<TaskGroupStatus> = [
  { label: 'новые', value: TaskGroupStatus.Planned },
  { label: 'текущие', value: TaskGroupStatus.Running },
  { label: 'завершенные', value: TaskGroupStatus.Finished },
];

const WorkoutComponent = ({
  status,
  ...props
}: WorkoutCardPreviewProps & { status: TaskGroupStatus }) => {
  const navigate = useNavigate();
  const viewer = viewerModel.useViewer();
  const isMineWorkout = props.workout.gymer_id === viewer.gymer?.gymer_id;
  const hasExercises = Boolean(props.workout.tasks?.length);

  const goGym = () => {
    navigate(`${props.workout.task_group_id}/gym`);
  };

  switch (status) {
    case TaskGroupStatus.Planned:
    case TaskGroupStatus.Running:
      return (
        <WorkoutCardPreview
          {...props}
          extraAfter={
            <Button
              hidden={!isMineWorkout || !hasExercises}
              size="small"
              type="primary"
              onClick={goGym}
            >
              GYM
            </Button>
          }
        />
      );
    case TaskGroupStatus.Finished:
      return <WorkoutCardPreview {...props} />;
  }
};

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.taskGroup
    .listTaskGroup({
      gymer_id: +params.gId,
      master_id: +params.mId,
      status: params.status as TaskGroupStatus,
    })
    .catch(() => []);
};

const Page = ({ loaderData: workouts, params }: Route.ComponentProps) => {
  const navigate = useNavigate();

  const { token } = useTheme();

  const status = params.status as TaskGroupStatus;

  const createWorkout = async () => {
    const data = await Api.taskGroup.createTaskGroup({
      master_id: +params.mId,
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

  return (
    <Flex height="100%" style={{ overflow: 'hidden' }}>
      <Outlet />

      <Segmented
        block
        options={FILTERS}
        value={status}
        onChange={filterWorkouts}
        style={{ marginBottom: 8 }}
      />

      <Space direction="vertical" style={{ overflowY: 'auto', height: '110%' }}>
        {workouts.map((w, idx, { length }) => (
          <WorkoutComponent
            key={w.task_group_id}
            workout={w}
            status={status}
            style={{ marginBottom: idx === length - 1 ? 64 : 0 }}
            onClick={() => goToWorkoutDetails(w)}
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
