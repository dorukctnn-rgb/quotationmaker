// The Worker "qm-counter": the page and Get Pro click counter of https://www.getquotationmaker.com.
//
//   POST /e        one note from a page (text/plain or JSON, see core.js). Answers 204 and never anything else about it.
//   GET  /r        the totals, for the read script only: Authorization: Bearer <COUNTER_ADMIN_KEY>. ?days=30&by=day,e,p,s
//   GET  /         one line saying what this is
//
// What it never does: set a cookie, read or store an IP address, a user agent, a time of day or anything that tells one
// visitor from another. A note is counted into a daily total and dropped. Requests whose Origin is not one of the site's own
// addresses are refused, and requests from crawlers are answered but not counted.
import { cleanNote, MAX_BODY } from './core.js';

const DEFAULT_ORIGINS = 'https://www.getquotationmaker.com,https://getquotationmaker.com';
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|curl|wget|python-requests|node-fetch|undici/i;
const BY = ['day', 'e', 't', 'p', 'w', 's'];

const stubOf = env => env.COUNTER.get(env.COUNTER.idFromName('main'));
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
const allowedOrigins = env => String(env.ALLOWED_ORIGINS || DEFAULT_ORIGINS).split(',').map(s => s.trim()).filter(Boolean);

async function sha256(s) { return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))); }
async function authorized(request, env) {
  if (!env.COUNTER_ADMIN_KEY) return false;
  const got = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const a = await sha256(got), b = await sha256(String(env.COUNTER_ADMIN_KEY));
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function handle(request, env) {
  const url = new URL(request.url);
  if (url.pathname === '/e') {
    const origin = request.headers.get('origin') || '';
    if (!allowedOrigins(env).includes(origin)) return new Response(null, { status: 403 });
    const cors = { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'content-type', 'Access-Control-Max-Age': '86400' } });
    if (request.method !== 'POST') return new Response(null, { status: 405, headers: { ...cors, Allow: 'POST, OPTIONS' } });
    if (BOT.test(request.headers.get('user-agent') || '')) return new Response(null, { status: 204, headers: cors });
    if (Number(request.headers.get('content-length') || 0) > MAX_BODY) return new Response(null, { status: 413, headers: cors });
    const text = await request.text();
    if (text.length > MAX_BODY) return new Response(null, { status: 413, headers: cors });
    const rec = cleanNote(text);
    if (!rec) return new Response(null, { status: 400, headers: cors });
    try { await stubOf(env).note(rec); } catch (e) { console.error('[counter] could not count a note:', e && e.message); }
    return new Response(null, { status: 204, headers: cors });
  }
  if (url.pathname === '/r') {
    if (request.method !== 'GET') return json({ error: 'use GET' }, 405);
    // without the key set there is no read address at all
    if (!env.COUNTER_ADMIN_KEY) return json({ error: 'not found' }, 404);
    if (!(await authorized(request, env))) return json({ error: 'unauthorized' }, 401);
    const days = Math.max(1, Math.min(400, Number(url.searchParams.get('days')) || 30));
    const by = (url.searchParams.get('by') || BY.join(',')).split(',').filter(c => BY.includes(c));
    return json({ days, by, rows: await stubOf(env).rows({ days, by }) });
  }
  if (url.pathname === '/' && request.method === 'GET') {
    return new Response('qm-counter: daily totals of page opens and Get Pro clicks for getquotationmaker.com. No cookies, no personal data, no IP address kept.\n', { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
  }
  return new Response('not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
