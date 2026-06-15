import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const SUPABASE_URL = 'https://sbzkzisukdglwgbompay.supabase.co';
const SUPABASE_KEY = 'sb_publishable_hVy7e7K0Ld8SJxa-HnO0_A_HzZFKpbP';
const HEAD = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

const h = (type, props, ...children) => ({ type, props: { ...(props || {}), children: children.flat() } });
const photoUrl = (p) => `${SUPABASE_URL}/storage/v1/object/public/portraits/${p}`;

export default async function handler(req) {
  let name = 'The Throne';
  let message = 'Pay more than the ruler to seize the throne.';
  let photo = null;

  try {
    const token = new URL(req.url).searchParams.get('reign');
    // Always read the live throne; if the shared token IS the current reign, we get its photo too.
    const curR = await fetch(`${SUPABASE_URL}/rest/v1/throne_current?id=eq.1&select=display_name,message,message_status,photo_path,photo_status,reign_token`, { headers: HEAD });
    const cur = (await curR.json())[0] || null;

    if (token && (!cur || cur.reign_token !== token)) {
      // an older, archived reign — name + message only
      const r = await fetch(`${SUPABASE_URL}/rest/v1/reign_card?token=eq.${encodeURIComponent(token)}&select=name,message&limit=1`, { headers: HEAD });
      const row = (await r.json())[0];
      if (row) { name = row.name || name; if (row.message) message = row.message; }
    } else if (cur) {
      name = cur.display_name || name;
      if (cur.message_status === 'approved' && cur.message) message = cur.message;
      if (cur.photo_status === 'approved' && cur.photo_path) photo = photoUrl(cur.photo_path);
    }
  } catch (_) { /* defaults */ }

  return new ImageResponse(
    h('div', {
      style: {
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: '#080709',
        backgroundImage: 'radial-gradient(1100px 620px at 50% -6%, rgba(216,178,94,0.26), transparent 62%), radial-gradient(700px 500px at 50% 120%, rgba(216,178,94,0.10), transparent 60%)',
        color: '#efe9da', padding: '60px', textAlign: 'center', position: 'relative',
      },
    },
      h('div', { style: { position: 'absolute', top: 44, fontSize: 24, letterSpacing: 16, color: '#d8b25e', display: 'flex' } }, 'THRONE OF THE INTERNET'),
      photo
        ? h('div', { style: { display: 'flex', width: 200, height: 200, borderRadius: 100, marginTop: 30, boxShadow: '0 0 0 6px rgba(216,178,94,0.25)', border: '5px solid #e7c570', overflow: 'hidden' } },
            h('img', { src: photo, width: 200, height: 200, style: { width: 200, height: 200, objectFit: 'cover' } }))
        : h('div', { style: { fontSize: 130, marginTop: 16, display: 'flex' } }, '\u{1F451}'),
      h('div', { style: { fontSize: 70, fontWeight: 800, color: '#f4d68f', marginTop: 22, display: 'flex', textAlign: 'center', maxWidth: 1040, lineHeight: 1.05 } }, `${name} rules the internet`),
      message ? h('div', { style: { fontSize: 33, fontStyle: 'italic', color: '#d3ccba', marginTop: 16, maxWidth: 980, display: 'flex' } }, `\u201C${message}\u201D`) : h('div', {}, ''),
      h('div', { style: { position: 'absolute', bottom: 42, fontSize: 22, letterSpacing: 5, color: '#9a937f', display: 'flex' } }, 'PAY MORE \u00B7 DETHRONE THEM \u00B7 TAKE THE CROWN'),
    ),
    { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=15, s-maxage=15' } },
  );
}
