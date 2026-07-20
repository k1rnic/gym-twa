import { Api } from '@/shared/api';
import { useFilePicker } from '@/shared/lib/file';
import { notify } from '@/shared/lib/notification';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevalidator } from 'react-router';

export const useExerciseImagePicker = (exerciseId: number) => {
  const { revalidate } = useRevalidator();
  const { t } = useTranslation();

  const [imageToUpload, openImagePicker, resetImageList] = useFilePicker({
    accept: 'image/*',
    multiple: false,
  });

  const uploadImage = useCallback(
    async (image: File) => {
      try {
        await Api.exercise.addExerciseImage(exerciseId, { image });
        notify.success(t('errors.imageUploaded'));
        revalidate();
      } catch (e) {
        notify.error(t('errors.imageUploadFailed'));
      }
    },
    [t, exerciseId],
  );

  useEffect(() => {
    if (imageToUpload[0]) {
      uploadImage(imageToUpload[0]).then(() => resetImageList());
    }
  }, [imageToUpload, uploadImage]);

  return openImagePicker;
};
