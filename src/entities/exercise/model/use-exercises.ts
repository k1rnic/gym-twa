import { Api, Exercise } from '@/shared/api';
import { useEffect, useState } from 'react';

export const useExercises = (masterId: number) => {
  const [data, setData] = useState<Exercise[]>([]);

  useEffect(() => {
    Api.exercise.getListOfExercise(masterId).then(setData);
  }, [masterId]);

  return data;
};
