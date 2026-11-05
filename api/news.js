// Vercel function: turns the school's Instagram posts into news items.
// Needs the INSTAGRAM_TOKEN environment variable (Instagram API with Instagram Login).
// Without it the endpoint answers 503 and the site keeps its bundled news.
const LIMIT = 12;

function guessCategory(text) {
  const t = text.toLowerCase();
  if (/sport|futbol|musobaqa|estafeta|chempion/.test(t)) return 'Sport';
  if (/tanlov|olimpiada|g'olib|g‘olib|sovrin/.test(t)) return 'Tanlovlar';
  if (/e'lon|e’lon|diqqat|qabul/.test(t)) return "E'lonlar";
  if (/dars|seminar|ta'lim|ta’lim|trening|o'quv yili|o‘quv yili/.test(t)) return "Ta'lim";
  return 'Tadbirlar';
}

// First caption line without emojis/hashtags becomes the title
function cleanLine(line) {
  return line
    .replace(/#[^\s#]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s.,!?:;'"“”‘’«»()\-–—%№]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function postToNews(post) {
  const caption = (post.caption || '').trim();
  const lines = caption.split('\n').map((l) => l.trim()).filter(Boolean);
  const titleIndex = lines.findIndex((l) => cleanLine(l).length >= 8);
  const rawTitle = titleIndex >= 0 ? cleanLine(lines[titleIndex]) : "Maktabimiz hayotidan";
  const title = rawTitle.length > 110 ? rawTitle.slice(0, 107).replace(/\s+\S*$/, '') + '…' : rawTitle;
  const body = lines.filter((_, i) => i !== titleIndex).join('\n') || caption;
  const flat = body.replace(/\s+/g, ' ').trim();
  return {
    id: 'ig-' + post.id,
    title,
    category: guessCategory(caption),
    date: (post.timestamp || '').slice(0, 10),
    summary: flat.length > 180 ? flat.slice(0, 177).replace(/\s+\S*$/, '') + '…' : flat,
    content: body,
    image: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
    views: 0,
    link: post.permalink,
  };
}

export async function fetchInstagramNews(token) {
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const res = await fetch(
    `https://graph.instagram.com/me/media?fields=${fields}&limit=${LIMIT}&access_token=${encodeURIComponent(token)}`
  );
  if (!res.ok) throw new Error('instagram ' + res.status + ' ' + (await res.text()).slice(0, 200));
  const { data } = await res.json();
  const news = (data || []).map(postToNews).filter((n) => n.image);
  if (news.length === 0) throw new Error("instagram: post yo'q");
  return news;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Faqat GET' });
  const token = process.env.INSTAGRAM_TOKEN;
  if (!token) return res.status(503).json({ error: 'INSTAGRAM_TOKEN sozlanmagan' });
  try {
    const news = await fetchInstagramNews(token);
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    return res.status(200).json(news);
  } catch (err) {
    console.error('Instagram error:', err);
    return res.status(502).json({ error: 'Instagram postlari olinmadi' });
  }
}
