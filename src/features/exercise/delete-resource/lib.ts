import { Api, UrlPath } from '@/shared/api';
import { message } from 'antd';
import { useCallback } from 'react';
import { useRevalidator } from 'react-router';

export const useDeleteExerciseResource = (exerciseId: number) => {
  const { revalidate } = useRevalidator();

  return useCallback(
    async (res: UrlPath) => {
      try {
        await Api.exercise.deleteExerciseImage(res.url_path_id);
        message.success('Изображение удалено');
        revalidate();
      } catch (e) {
        message.error('Не удалось удалить изображение');
      }
    },
    [exerciseId],
  );
};
