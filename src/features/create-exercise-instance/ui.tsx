import { Api } from '@/shared/api';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
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
  );
};
