import { Api } from '@/shared/api';
import { notify } from '@/shared/lib/notification';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevalidator } from 'react-router';

export const useDeleteExerciseVideo = (exerciseId: number) => {
  const { revalidate } = useRevalidator();
  const { t } = useTranslation();

  return useCallback(
    async (pathId: number) => {
      try {
        await Api.exercise.deleteExerciseImage(pathId);
        notify.success(t('errors.videoDeleted'));
        revalidate();
      } catch (e) {
        notify.error(t('errors.videoDeleteFailed'));
      }
    },
    [t, exerciseId],
  );
};
