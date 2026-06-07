import { Api } from '@/shared/api';
import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRevalidator } from 'react-router';

export type DeleteWorkoutButtonProps = {
  workoutId: number;
};

export const DeleteWorkoutButton = (props: DeleteWorkoutButtonProps) => {
  const { revalidate } = useRevalidator();

  const deleteWorkout = async () => {
    try {
      await Api.taskGroup.deleteTaskGroup(props.workoutId);
    } finally {
      revalidate();
    }
  };

  return (
    <Button
      icon={<DeleteOutlined />}
      onClick={deleteWorkout}
      type="dashed"
      size="small"
    />
  );
};
