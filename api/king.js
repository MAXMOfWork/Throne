export const config = { runtime: 'edge' };

const SITE = 'https://thropn.vercel.app';
const SUPABASE_URL = 'https://sbzkzisukdglwgbompay.supabase.co';
const SUPABASE_KEY = 'sb_publishable_hVy7e7K0Ld8SJxa-HnO0_A_HzZFKpbP';

const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export default async function handler(req) {
  const token = new URL(req.url).searchParams.get('id') || '';
  let name = 'A ruler';
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/reign_card?token=eq.${encodeURIComponent(token)}&select=name&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    );
    const rows = await r.json();
    if (rows && rows[0] && rows[0].name) name = rows[0].name;
  } catch (_) { /* default */ }

  const img = `${SITE}/api/og?reign=${encodeURIComponent(token)}`;
  const title = `${esc(name)} ruled the Throne of the Internet`;
  const desc = 'One soul rules the internet at a time. Pay more than them to take the throne.';

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:image" content="${img}" />
<meta property="og:url" content="${SITE}/k/${esc(token)}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${img}" />
<meta http-equiv="refresh" content="0; url=${SITE}/" />
<script>location.replace(${JSON.stringify(SITE + '/')});</script>
</head><body>Redirecting to the throne…</body></html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=30, s-maxage=30' } });
}
