// Returns the youtube.com watch URL for any YouTube link (embed, watch, youtu.be, shorts), or null
export function getYouTubeWatchUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?(?:.*&)?v=|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? `https://www.youtube.com/watch?v=${match[1]}` : null;
}

// YouTube videos open on YouTube in a new tab; other videos (e.g. MP4) use the in-site player
export function openVideo<T extends { videoUrl: string }>(video: T, openInSite: (video: T) => void) {
  const watchUrl = getYouTubeWatchUrl(video.videoUrl);
  if (watchUrl) {
    window.open(watchUrl, '_blank', 'noopener,noreferrer');
  } else {
    openInSite(video);
  }
}
