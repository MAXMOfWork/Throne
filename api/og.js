import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const SUPABASE_URL = 'https://sbzkzisukdglwgbompay.supabase.co';
const SUPABASE_KEY = 'sb_publishable_hVy7e7K0Ld8SJxa-HnO0_A_HzZFKpbP';

// hyperscript helper so we don't need JSX transpilation in a static project
const h = (type, props, ...children) => ({ type, props: { ...(props || {}), children: children.flat() } });

export default async function handler() {
  let name = 'The Throne';
  let message = 'Pay more than the ruler to seize the throne.';
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/throne_current?id=eq.1&select=display_name,message,message_status`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    );
    const rows = await r.json();
    if (rows && rows[0]) {
      name = rows[0].display_name || name;
      if (rows[0].message_status === 'approved' && rows[0].message) message = rows[0].message;
    }
  } catch (_) { /* fall back to defaults */ }

  return new ImageResponse(
    h('div', {
      style: {
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: '#0a0a0c',
        backgroundImage: 'radial-gradient(1200px 600px at 50% -8%, rgba(216,178,94,0.20), transparent 60%)',
        color: '#ece6d6', padding: '64px', textAlign: 'center',
      },
    },
      h('div', { style: { fontSize: 26, letterSpacing: 14, color: '#d8b25e', display: 'flex' } }, 'THRONE OF THE INTERNET'),
      h('div', { style: { fontSize: 110, marginTop: 4, display: 'flex' } }, '\u{1F451}'),
      h('div', { style: { fontSize: 72, fontWeight: 800, color: '#f0d089', marginTop: 4, display: 'flex' } }, `${name} rules the internet`),
      h('div', { style: { fontSize: 34, fontStyle: 'italic', color: '#cfc8b6', marginTop: 16, maxWidth: 1000, display: 'flex' } }, `\u201C${message}\u201D`),
      h('div', { style: { fontSize: 22, letterSpacing: 6, color: '#8a8576', marginTop: 34, display: 'flex' } }, 'PAY MORE \u00B7 DETHRONE THEM \u00B7 TAKE THE CROWN'),
    ),
    { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=20, s-maxage=20' } },
  );
}
