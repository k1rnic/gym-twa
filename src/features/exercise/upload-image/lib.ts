import { Api } from '@/shared/api';
import { useFilePicker } from '@/shared/lib/file';
import { message } from 'antd';
import { useCallback, useEffect } from 'react';
import { useRevalidator } from 'react-router';

export const useExerciseImagePicker = (exerciseId: number) => {
  const { revalidate } = useRevalidator();

  const [imageToUpload, openImagePicker, resetImageList] = useFilePicker({
    accept: 'image/*',
    multiple: false,
  });

  const uploadImage = useCallback(
    async (image: File) => {
      try {
        await Api.exercise.addExerciseImage(exerciseId, { image });
        message.success('Изображение загружено');
        revalidate();
      } catch (e) {
        message.error('Не удалось загрузить изображение');
      }
    },
    [exerciseId],
  );

  useEffect(() => {
    if (imageToUpload[0]) {
      uploadImage(imageToUpload[0]).then(() => resetImageList());
    }
  }, [imageToUpload, uploadImage]);

  return openImagePicker;
};
