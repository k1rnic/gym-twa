import { Api, UrlPath } from '@/shared/api';
import { notify } from '@/shared/lib/notification';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevalidator } from 'react-router';

export const useDeleteExerciseResource = (exerciseId: number) => {
  const { revalidate } = useRevalidator();
  const { t } = useTranslation();

  return useCallback(
    async (res: UrlPath) => {
      try {
        await Api.exercise.deleteExerciseImage(res.url_path_id);
        revalidate();
      } catch (e) {
        notify.error(t('errors.imageDeleteFailed'));
      }
    },
    [t, exerciseId],
  );
};
