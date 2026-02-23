import { isFullscreen } from '@telegram-apps/sdk-react';

export const useViewport = () => {
  const topBarOffset = isFullscreen() ? 96 : 0;

  return { topBarOffset };
};
