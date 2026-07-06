import { exerciseModel } from '@/entities/exercise';
import { Api } from '@/shared/api';
import { useEffect, useState } from 'react';

export const useExercises = (masterId: number) => {
  const [data, setData] = useState<exerciseModel.Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Api.exercise
      .getListOfExercise(masterId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [masterId]);

  return { data, loading } as const;
};
