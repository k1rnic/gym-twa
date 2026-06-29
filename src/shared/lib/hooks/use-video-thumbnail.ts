import { getVideoThumb } from '@/shared/lib/video';
import { useCallback, useRef } from 'react';

type ThumbnailMap = Record<string, string | null>;

type Result = {
  url: string;
  thumb?: string | null;
  error?: string | null;
};

export function useVideoThumbnail(): (url: string) => Promise<Result> {
  const cache = useRef<ThumbnailMap>({});

  return useCallback(async (url: string) => {
    if (cache.current[url] !== undefined) {
      return { url, thumb: cache.current[url], error: null };
    }

    try {
      const thumb = await getVideoThumb(url);

      if (thumb) return { url, thumb, error: null };

      return { url, thumb: null, error: 'Unsupported format' };
    } catch {
      cache.current[url] = null;
      return { url, thumb: null, error: 'Failed to load' };
    }
  }, []);
}
