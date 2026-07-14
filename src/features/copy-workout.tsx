import { workoutModel } from '@/entities/workout';
import { Api } from '@/shared/api';
import { CopySimpleIcon } from '@phosphor-icons/react';
import { ItemType } from 'antd/es/menu/interface';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevalidator } from 'react-router';

export const useCopyWorkoutAction = (w: workoutModel.Workout, key: string) => {
  const { t } = useTranslation();

  const { revalidate } = useRevalidator();

  const copyWorkout = useCallback(async () => {
    try {
      await Api.taskGroup.copyTaskGroup(w.task_group_id);
      revalidate();
    } catch (e) {
      console.error(e);
    }
  }, [w.task_group_id]);

  return useMemo<ItemType>(
    () => ({
      key,
      label: t('common.duplicate'),
      icon: <CopySimpleIcon />,
      onClick: copyWorkout,
    }),
    [t, key, copyWorkout],
  );
};
