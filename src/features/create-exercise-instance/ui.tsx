import { viewerModel } from '@/entities/viewer';
import { useWorkoutAccesses, workoutModel } from '@/entities/workout';
import { Api } from '@/shared/api';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router';

type Props = {
  workout: workoutModel.Workout;
};

export const CreateExerciseInstanceButton = ({ workout }: Props) => {
  const navigate = useNavigate();
  const viewer = viewerModel.useViewer();
  const accesses = useWorkoutAccesses(workout);

  const createExerciseInstance = async () => {
    try {
      const instance = await Api.task.createTask({
        task_group_id: workout.task_group_id,
        owner_id: viewer.user_id,
      });
      navigate(`${instance?.task_id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Button
      block
      size="large"
      type="dashed"
      hidden={!accesses.addTask}
      onClick={createExerciseInstance}
      icon={<PlusOutlined />}
    >
      Новое упражнение
    </Button>
  );
};
