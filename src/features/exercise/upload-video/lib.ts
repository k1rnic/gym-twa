import { Api } from '@/shared/api';
import { message } from 'antd';
import { useCallback } from 'react';
import { useRevalidator } from 'react-router';

export const useExerciseVideoPicker = (exerciseId: number) => {
  const { revalidate } = useRevalidator();

  return useCallback(
    async (link: string) => {
      try {
        await Api.exercise.addExerciseLink(exerciseId, { link });
        message.success('Видео загружено');
        revalidate();
      } catch (e) {
        message.error('Не удалось загрузить видео');
      }
    },
    [exerciseId],
  );
};
