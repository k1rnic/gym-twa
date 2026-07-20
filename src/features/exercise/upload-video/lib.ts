import { Api } from '@/shared/api';
import { notify } from '@/shared/lib/notification';
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
        notify.success(t('errors.videoUploaded'));
        revalidate();
      } catch (e) {
        notify.error(t('errors.videoUploadFailed'));
      }
    },
    [t, exerciseId],
  );
};
