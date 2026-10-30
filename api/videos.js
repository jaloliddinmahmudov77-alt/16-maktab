// Vercel function: serves the channel's newest videos, so new uploads appear on the site automatically.
const CHANNEL_ID = 'UCImV167vVlo8muFITCOQ1YA';
const LIMIT = 9;

const decode = (s) =>
  s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

function shortDescription(raw) {
  const lines = decode(raw).split('\n').map((l) => l.trim());
  const line =
    lines.map((l) => l.replace(/^[^\p{L}\d“"«]+/u, '')).find((l) => /^Joriy yilning/i.test(l)) ||
    lines.find((l) => l.length > 40) ||
    '';
  return line.length > 220 ? line.slice(0, 217).replace(/\s+\S*$/, '') + '…' : line;
}

export function parseFeed(xml) {
  return xml
    .split('<entry>')
    .slice(1, LIMIT + 1)
    .map((entry) => {
      const id = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)[1];
      return {
        id: 'yt-' + id,
        title: decode(entry.match(/<title>(.*?)<\/title>/)[1]),
        videoUrl: `https://www.youtube.com/embed/${id}`,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        duration: '',
        date: entry.match(/<published>(.{10})/)[1],
        description: shortDescription(
          (entry.match(/<media:description>([\s\S]*?)<\/media:description>/) || [])[1] || ''
        ),
      };
    });
}

export async function fetchChannelVideos() {
  const feed = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
  if (!feed.ok) throw new Error('feed ' + feed.status);
  const videos = parseFeed(await feed.text());
  if (videos.length === 0) throw new Error("feed bo'sh");
  return videos;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Faqat GET' });
  try {
    const videos = await fetchChannelVideos();
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    return res.status(200).json(videos);
  } catch (err) {
    // A non-OK response makes the app keep its bundled video list
    console.error('YouTube feed error:', err);
    return res.status(502).json({ error: 'YouTube lentasi ochilmadi' });
  }
}
