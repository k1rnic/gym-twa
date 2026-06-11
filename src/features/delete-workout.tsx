import { Api } from '@/shared/api';
import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { MenuProps } from 'antd/lib';
import { useCallback, useMemo } from 'react';
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
      size="small"
      type="text"
    >
      Удалить
    </Button>
  );
};

export const useDeleteWorkoutAction = (wId: number, key: string) => {
  const { revalidate } = useRevalidator();

  const deleteWorkout = useCallback(async () => {
    try {
      await Api.taskGroup.deleteTaskGroup(wId);
    } finally {
      revalidate();
    }
  }, [wId]);

  return useMemo<Required<MenuProps>['items'][number]>(
    () => ({
      key,
      label: 'Удалить',
      icon: <DeleteOutlined />,
      onClick: deleteWorkout,
    }),
    [key, deleteWorkout],
  );
};
