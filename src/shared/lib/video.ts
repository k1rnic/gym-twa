export const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'mov', 'm4v', 'm3u8'];

export const isYoutube = (url: string) => /youtube\.com|youtu\.be/.test(url);

export const getYoutubeThumb = (url: string) => {
  if (!isYoutube(url)) return null;

  const yt =
    url.match(/youtube\.com.*v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/)!;

  return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
};

export const isVimeo = (url: string) => /vimeo\.com/.test(url);

export const getVimeoThumb = async (url: string) => {
  if (!isVimeo(url)) return null;

  const res = await fetch(
    `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
  );

  if (!res.ok) throw new Error('Vimeo request failed');

  const data: { thumbnail_url: string } = await res.json();

  return data.thumbnail_url ?? '';
};

function captureFrame(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
    };

    const fail = (e?: unknown) => {
      console.error('Failed to generate video thumbnail', e);
      cleanup();
      resolve(null);
    };

    video.addEventListener(
      'loadeddata',

      () => {
        try {
          const time =
            Number.isFinite(video.duration) && video.duration > 1
              ? Math.min(video.duration / 2, 1)
              : 0;

          video.currentTime = time;
        } catch (e) {
          fail(e);
        }
      },

      { once: true },
    );

    video.addEventListener(
      'seeked',

      () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            return fail();
          }

          ctx.drawImage(video, 0, 0);
          const image = canvas.toDataURL('image/png');
          cleanup();
          resolve(image);
        } catch (e) {
          fail(e);
        }
      },

      { once: true },
    );

    video.addEventListener('error', fail, { once: true });
    video.src = url;
    video.load();
  });
}

export const isDirectVideo = (url: string) =>
  VIDEO_EXTENSIONS.some((ext) => url.toLowerCase().includes(`.${ext}`));

export const getDirectVideoThumb = async (url: string) => {
  if (!isDirectVideo(url)) return null;

  return await captureFrame(url);
};

export const isVideoUrl = (url: string) => {
  return isYoutube(url) || isVimeo(url) || isDirectVideo(url);
};

export const getVideoThumb = async (url: string) => {
  return (
    (await getYoutubeThumb(url)) ||
    (await getVimeoThumb(url)) ||
    (await getDirectVideoThumb(url))
  );
};
