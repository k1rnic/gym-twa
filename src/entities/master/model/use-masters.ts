import { Api, GymerMasterStatus, MasterProfile } from '@/shared/api';
import { useCallback, useEffect, useMemo, useState } from 'react';

const statusOrder: Record<GymerMasterStatus | 'none', number> = {
  [GymerMasterStatus.CurrentMaster]: 0,
  [GymerMasterStatus.AwaitedRequest]: 1,
  [GymerMasterStatus.AcceptsRequests]: 2,
  [GymerMasterStatus.RejectedRequest]: 3,
  none: 4,
};

const sortMasters = (list: MasterProfile[]) =>
  [...list].sort((a, b) => {
    const aStatus = a.status ?? 'none';
    const bStatus = b.status ?? 'none';
    return statusOrder[aStatus] - statusOrder[bStatus];
  });

export const useMasters = (gymerId?: number) => {
  const [masters, setMasters] = useState<MasterProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMasters = useCallback(async () => {
    if (!gymerId) return;
    setLoading(true);
    try {
      const data = await Api.user.getMastersProfiles({ gymer_id: gymerId });
      setMasters(sortMasters(data ?? []));
    } finally {
      setLoading(false);
    }
  }, [gymerId]);

  useEffect(() => {
    loadMasters();
  }, [loadMasters]);

  const updateMaster = useCallback(
    (masterId: number, patch: Partial<MasterProfile>) => {
      setMasters((prev) =>
        sortMasters(
          prev.map((m) => (m.master_id === masterId ? { ...m, ...patch } : m)),
        ),
      );
    },
    [],
  );

  return useMemo(
    () => ({
      masters,
      loading,
      refresh: loadMasters,
      updateMaster,
      setMasters: (next: MasterProfile[]) => setMasters(sortMasters(next)),
    }),
    [loadMasters, loading, masters, updateMaster],
  );
};
