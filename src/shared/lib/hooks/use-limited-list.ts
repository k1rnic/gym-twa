import { useMemo } from 'react';

export function useLimitedList<T>(list: T[], limit: number) {
  return useMemo(() => {
    const visible = list.slice(0, limit);
    const hidden = list.slice(limit);
    const hiddenCount = hidden.length;

    return {
      visible,
      hidden,
      hiddenCount,
      hasHidden: hiddenCount > 0,
    };
  }, [list, limit]);
}
