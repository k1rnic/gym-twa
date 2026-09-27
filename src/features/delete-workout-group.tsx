import { useWorkoutPermissions, workoutModel } from '@/entities/workout';
import { Api } from '@/shared/api';
import { LinkBreakIcon } from '@phosphor-icons/react';
import { MenuProps } from 'antd/lib';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevalidator } from 'react-router';

export const useDeleteWorkoutGroupAction = (
  workout: workoutModel.Workout,
  groupId: number,
) => {
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();
  const permissions = useWorkoutPermissions(workout);

  const deleteWorkoutGroup = useCallback(async () => {
    try {
      await Api.taskGroupBlock.deleteTaskGroupBlock(groupId);
      revalidate();
    } catch (e) {
      console.error(e);
    }
  }, [groupId, revalidate]);

  return useMemo<Required<MenuProps>['items'][number]>(
    () =>
      permissions.modifyWorkout
        ? {
            key: 'delete-group',
            label: t('training.ungroupExercises'),
            icon: <LinkBreakIcon />,
            onClick: deleteWorkoutGroup,
          }
        : null,
    [deleteWorkoutGroup, permissions.modifyWorkout, t],
  );
};
