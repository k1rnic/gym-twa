import { Api } from '@/shared/api';
import { message } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevalidator } from 'react-router';

export const useExerciseVideoPicker = (exerciseId: number) => {
  const { revalidate } = useRevalidator();
  const { t } = useTranslation();

  return useCallback(
    async (link: string) => {
      try {
        await Api.exercise.addExerciseLink(exerciseId, { link });
        message.success(t('errors.videoUploaded'));
        revalidate();
      } catch (e) {
        message.error(t('errors.videoUploadFailed'));
      }
    },
    [t, exerciseId],
  );
};
