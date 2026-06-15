export const config = { runtime: 'edge' };

const SUPABASE_URL = 'https://sbzkzisukdglwgbompay.supabase.co';
const SUPABASE_KEY = 'sb_publishable_hVy7e7K0Ld8SJxa-HnO0_A_HzZFKpbP';
const SITE = 'https://thropn.vercel.app';

const escapeHtml = (s) => String(s || '').replace(/[<>&"]/g, (m) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[m]));

export default async function handler() {
  let name = 'The Throne';
  let photo = null;
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/throne_current?id=eq.1&select=display_name,photo_path,photo_status`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    const row = (await r.json())[0];
    if (row) { name = row.display_name || name; if (row.photo_status === 'approved' && row.photo_path) photo = `${SUPABASE_URL}/storage/v1/object/public/portraits/${row.photo_path}`; }
  } catch (_) {}

  const avatar = photo
    ? `<img src="${photo}" alt="" style="width:38px;height:38px;border-radius:50%;object-fit:cover;border:2px solid #d8b25e;flex:0 0 auto">`
    : `<div style="font-size:26px;line-height:1;flex:0 0 auto">\u{1F451}</div>`;

  const html = `<!doctype html><html><head><meta charset="utf-8">
<meta http-equiv="refresh" content="30">
<style>
  html,body{margin:0;background:transparent;font-family:'Trebuchet MS',Georgia,serif}
  a.badge{display:flex;align-items:center;gap:12px;text-decoration:none;width:fit-content;max-width:360px;
    background:linear-gradient(180deg,rgba(20,17,12,.96),rgba(10,9,12,.96));border:1px solid #8a6d2a;border-radius:14px;
    padding:11px 16px;box-shadow:0 10px 30px -12px rgba(216,178,94,.6);color:#efe9da}
  .who{display:flex;flex-direction:column;line-height:1.15;min-width:0}
  .lbl{font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:#d8b25e;font-family:monospace}
  .nm{font-size:17px;font-weight:bold;color:#f4d68f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}
  .cta{margin-left:6px;flex:0 0 auto;background:linear-gradient(180deg,#f4d68f,#d8b25e);color:#1a1408;font-weight:bold;
    font-size:12px;padding:8px 12px;border-radius:9px;font-family:monospace;letter-spacing:.03em}
  .dot{width:7px;height:7px;border-radius:50%;background:#f4d68f;box-shadow:0 0 8px #f4d68f;display:inline-block;margin-right:5px;animation:p 1.8s infinite}
  @keyframes p{0%,100%{opacity:1}50%{opacity:.25}}
</style></head><body>
<a class="badge" href="${SITE}/?utm_source=badge" target="_blank" rel="noopener">
  ${avatar}
  <div class="who">
    <span class="lbl"><span class="dot"></span>Ruling the internet</span>
    <span class="nm">${escapeHtml(name)}</span>
  </div>
  <span class="cta">Dethrone \u2694\uFE0F</span>
</a>
</body></html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=20, s-maxage=20', 'X-Frame-Options': 'ALLOWALL', 'Content-Security-Policy': 'frame-ancestors *' } });
}
