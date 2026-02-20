import { Api, MastersGymer } from '@/shared/api';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useGymmers = (masterId?: number | null) => {
  const [gymmers, setGymmers] = useState<MastersGymer[]>([]);
  const [loading, setLoading] = useState(false);

  const loadGymmers = useCallback(async () => {
    if (!masterId) return;
    setLoading(true);
    try {
      await Api.user.getListOfMastersGymer(Number(masterId)).then(setGymmers);
    } finally {
      setLoading(false);
    }
  }, [masterId]);

  useEffect(() => {
    loadGymmers();
  }, [loadGymmers]);

  return useMemo(
    () => ({
      gymmers,
      loading,
      refresh: loadGymmers,
    }),
    [loadGymmers, loading, gymmers],
  );
};
