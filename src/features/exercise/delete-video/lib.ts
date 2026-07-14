import { Api } from '@/shared/api';
import { message } from 'antd';
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
        message.success(t('errors.videoDeleted'));
        revalidate();
      } catch (e) {
        message.error(t('errors.videoDeleteFailed'));
      }
    },
    [t, exerciseId],
  );
};
