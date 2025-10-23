import { Api } from '@/shared/api';
import { CopyOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRevalidator } from 'react-router';

export type CopyWorkoutButtonProps = {
  workoutId: number;
};

export const CopyWorkoutButton = (props: CopyWorkoutButtonProps) => {
  const { revalidate } = useRevalidator();

  const copyWorkout = async () => {
    await Api.taskGroup.copyTaskGroup(props.workoutId);
    revalidate();
  };

  return (
    <Button
      icon={<CopyOutlined />}
      onClick={copyWorkout}
      type="text"
      size="small"
    />
  );
};
