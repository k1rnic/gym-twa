import { Api } from '@/shared/api';
import { FloatButton } from '@/shared/ui/float-button';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

type Props = {
  workoutId: number;
};

export const CreateExerciseInstanceButton = (props: Props) => {
  const navigate = useNavigate();

  const createExerciseInstance = async () => {
    try {
      const instance = await Api.task.createTask({
        task_group_id: props.workoutId,
      });
      navigate(`${instance?.task_id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <FloatButton onClick={createExerciseInstance} icon={<PlusOutlined />} />
  );
};
