import { exerciseModel } from '@/entities/exercise';
import { Api } from '@/shared/api-v2';
import { useEffect, useState } from 'react';

export const useExercises = (masterId: number) => {
  const [data, setData] = useState<exerciseModel.Exercise[]>([]);

  useEffect(() => {
    Api.exercise.getListOfExercise(masterId).then(setData);
  }, [masterId]);

  return data;
};
