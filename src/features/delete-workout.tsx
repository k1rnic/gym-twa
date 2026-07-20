import { useWorkoutPermissions, workoutModel } from '@/entities/workout';
import { Api } from '@/shared/api';
import { TrashIcon } from '@phosphor-icons/react';
import { ItemType } from 'antd/es/menu/interface';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevalidator } from 'react-router';

export const useDeleteWorkoutAction = (
  w: workoutModel.Workout,
  key: string,
) => {
  const { t } = useTranslation();

  const { revalidate } = useRevalidator();
  const permissions = useWorkoutPermissions(w);

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
      permissions.deleteWorkout
        ? {
            key,
            label: t('common.delete'),
            icon: <TrashIcon />,
            onClick: deleteWorkout,
          }
        : null,
    [t, key, permissions.deleteWorkout, deleteWorkout],
  );
};
