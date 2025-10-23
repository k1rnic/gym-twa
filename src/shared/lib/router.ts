import { useMemo } from 'react';
import { useMatch, useResolvedPath } from 'react-router';

export const useMatchExact = () => {
  const path = useResolvedPath('');
  const match = useMatch({ path: path.pathname, end: true });
  return useMemo(() => !!match?.pathname, [match?.pathname]);
};
