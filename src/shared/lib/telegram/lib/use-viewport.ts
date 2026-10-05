import { useTheme } from '@/shared/lib/theme';
import { viewport } from '@tma.js/sdk-react';
import { useEffect, useState } from 'react';

type ViewportInsets = {
  topSafeArea: number;
  bottomSafeArea: number;
};

const readInsets = (
  paddingTop: number,
  paddingBottom: number,
): ViewportInsets => ({
  topSafeArea: viewport.isFullscreen()
    ? viewport.safeAreaInsetTop() + paddingTop
    : 0,
  bottomSafeArea: viewport.isFullscreen()
    ? viewport.safeAreaInsetBottom() + paddingBottom
    : paddingBottom,
});

export const useViewport = (): ViewportInsets => {
  const { token } = useTheme();
  const { paddingXL, paddingSM } = token;
  const [insets, setInsets] = useState<ViewportInsets>(() =>
    readInsets(paddingXL, paddingSM),
  );

  useEffect(() => {
    const update = () =>
      setInsets((current) => {
        const next = readInsets(paddingXL, paddingSM);

        return current.topSafeArea === next.topSafeArea &&
          current.bottomSafeArea === next.bottomSafeArea
          ? current
          : next;
      });

    const unsubs = [
      viewport.isFullscreen.sub(update),
      viewport.safeAreaInsets.sub(update),
    ];

    update();

    return () => unsubs.forEach((unsub) => unsub());
  }, [paddingXL, paddingSM]);

  return insets;
};
