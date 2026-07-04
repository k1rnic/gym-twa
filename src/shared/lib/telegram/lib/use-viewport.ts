import { useTheme } from '@/shared/lib/theme';
import { viewport } from '@tma.js/sdk-react';
import { useMemo } from 'react';

export const useViewport = () => {
  const { token } = useTheme();

  return useMemo(
    () => ({
      topSafeArea: viewport.isFullscreen()
        ? viewport.safeAreaInsetTop() + token.paddingXL
        : 0,
      bottomSafeArea: viewport.isFullscreen()
        ? viewport.safeAreaInsetBottom() + token.paddingSM
        : token.paddingSM,
    }),
    [],
  );
};
