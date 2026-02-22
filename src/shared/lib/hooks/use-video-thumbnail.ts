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
      // YouTube
      const yt =
        url.match(/youtube\.com.*v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);

      if (yt) {
        const thumb = `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
        cache.current[url] = thumb;
        return { url, thumb, error: null };
      }

      // Vimeo
      if (url.includes('vimeo.com')) {
        const res = await fetch(
          `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
        );

        if (!res.ok) throw new Error('Vimeo request failed');

        const data: { thumbnail_url: string } = await res.json();
        cache.current[url] = data.thumbnail_url;
        return { url, thumb: data.thumbnail_url, error: null };
      }

      // direct video
      if (/\.(mp4|webm|ogg)$/i.test(url)) {
        const thumb = await captureFrame(url);
        cache.current[url] = thumb;
        return { url, thumb, error: null };
      }

      return { url, thumb: null, error: 'Unsupported format' };
    } catch {
      cache.current[url] = null;
      return { url, thumb: null, error: 'Failed to load' };
    }
  }, []);
}

function captureFrame(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    video.addEventListener('loadedmetadata', () => {
      try {
        video.currentTime = video.duration / 2;
      } catch {
        resolve(null);
      }
    });

    video.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);

        ctx.drawImage(video, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch {
        resolve(null);
      }
    });

    video.addEventListener('error', () => resolve(null));
  });
}
