import { exerciseModel } from '@/entities/exercise';
import { useWorkoutPermissions, workoutModel } from '@/entities/workout';
import { Api } from '@/shared/api';
import { DeleteOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd/lib';
import { useCallback, useMemo } from 'react';
import { useRevalidator } from 'react-router';

export const useDeleteExerciseInstanceAction = (
  w: workoutModel.Workout,
  task: exerciseModel.ExerciseInstance,
  key: string,
) => {
  const { revalidate } = useRevalidator();
  const permissions = useWorkoutPermissions(w, task);

  const deleteExerciseInstance = useCallback(async () => {
    try {
      await Api.task.deleteTask(task.task_id);
      revalidate();
    } catch (e) {
      console.error(e);
    }
  }, [task.task_id]);

  return useMemo<Required<MenuProps>['items'][number]>(
    () =>
      permissions.deleteTask
        ? {
            key,
            label: 'Удалить',
            icon: <DeleteOutlined />,
            onClick: deleteExerciseInstance,
          }
        : null,
    [key, permissions.deleteTask, deleteExerciseInstance],
  );
};
