import { Api } from '@/shared/api';
import { message } from 'antd';
import { useCallback } from 'react';
import { useRevalidator } from 'react-router';

export const useDeleteExerciseVideo = (exerciseId: number) => {
  const { revalidate } = useRevalidator();

  return useCallback(
    async (pathId: number) => {
      try {
        await Api.exercise.deleteExerciseImage(pathId);
        message.success('Видео удалено');
        revalidate();
      } catch (e) {
        message.error('Не удалось удалить видео');
      }
    },
    [exerciseId],
  );
};
