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
