import { useWorkoutAccesses, workoutModel } from '@/entities/workout';
import { Api } from '@/shared/api';
import { DeleteOutlined } from '@ant-design/icons';
import { ItemType } from 'antd/es/menu/interface';
import { useCallback, useMemo } from 'react';
import { useRevalidator } from 'react-router';

export const useDeleteWorkoutAction = (
  w: workoutModel.Workout,
  key: string,
) => {
  const { revalidate } = useRevalidator();
  const accesses = useWorkoutAccesses(w);

  const deleteWorkout = useCallback(async () => {
    try {
      await Api.taskGroup.deleteTaskGroup(w.task_group_id);
      revalidate();
    } catch (e) {
      console.error(e);
    }
  }, [w.task_group_id]);

  return useMemo<ItemType>(
    () =>
      accesses.deleteWorkout
        ? {
            key,
            label: 'Удалить',
            icon: <DeleteOutlined />,
            onClick: deleteWorkout,
          }
        : null,
    [key, accesses.deleteWorkout, deleteWorkout],
  );
};
