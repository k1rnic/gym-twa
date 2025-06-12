import { Api, ExerciseDescSimple } from '@/shared/api';
import { useEffect, useState } from 'react';

export const useExerciseDescriptions = (exId?: number) => {
  const [data, setData] = useState<ExerciseDescSimple[]>([]);

  useEffect(() => {
    if (exId !== undefined) {
      Api.exercise.getListOfExerciseDescription(exId).then(setData);
    }
  }, [exId]);

  return data;
};
