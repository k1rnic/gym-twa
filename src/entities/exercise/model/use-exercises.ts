import { exerciseModel } from '@/entities/exercise';
import { Api } from '@/shared/api';
import { useEffect, useState } from 'react';

export const useExercises = (masterId: number, enabled = true) => {
  const [data, setData] = useState<exerciseModel.Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    setLoading(true);

    Api.exercise
      .getListOfExercise(masterId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [masterId, enabled]);

  return { data, loading: enabled && loading } as const;
};
