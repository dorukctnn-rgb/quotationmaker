// The Worker "qm-accept": storage for the quote acceptance links of https://www.getquotationmaker.com.
//
// Only the site's own server talks to this Worker, never a browser: every call is a POST with the shared secret
// (Authorization: Bearer <ACCEPT_SITE_SECRET>) and a JSON body. The site checks that the sender has Pro (the same check as every
// other Pro feature), turns the Pro key into an anonymous code with a secret of its own and passes only that code on.
//
//   POST /v1/create  { entitlement, snapshot, notify? }  -> { id, st, expires }   id = the client's code, st = the sender's status code
//   POST /v1/view    { id, mark? }                       -> the link's data with the quote (mark: count it as "viewed")
//   POST /v1/accept  { id, name, note?, confirm }        -> { ok, accepted, already?, mail }
//   POST /v1/status  { codes: [st, ...] }                -> { items: [...] } (up to 20)
//   GET  /                                               one line saying what this is
//
// No cookie is set, no IP address, user agent or time of day of any caller is read or kept, and nothing here answers with HTML.
import { MAX_SNAPSHOT_BYTES } from './core.js';

const SMALL = 8 * 1024;
const BIG = MAX_SNAPSHOT_BYTES + 64 * 1024; // a snapshot at its limit and the few fields around it
const STATUS = { bad_request: 400, confirm: 400, name: 400, not_found: 404, expired: 410, too_large: 413, rate_limited: 429, busy: 503 };

const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra },
});

async function sha256(s) { return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))); }
async function authorized(request, env) {
  const want = String(env.ACCEPT_SITE_SECRET || '');
  if (want.length < 32) return false;
  const got = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const a = await sha256(got), b = await sha256(want);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function readText(request, max) {
  if (Number(request.headers.get('content-length') || 0) > max) return null;
  const t = await request.text();
  return new TextEncoder().encode(t).length > max ? null : t;
}

// What a result becomes on the wire: an error word and its status, or the data.
function reply(r) {
  if (r && r.error) {
    const extra = r.error === 'rate_limited' ? { 'Retry-After': String(r.retryAfter || 60) } : {};
    return json(r, STATUS[r.error] || 400, extra);
  }
  return json(r);
}

/** stub: the Durable Object's methods (or an AcceptCore itself in the tests). */
export async function handle(request, env, { stub }) {
  const url = new URL(request.url);
  const path = url.pathname;
  if (path === '/' && request.method === 'GET') {
    return new Response('qm-accept: storage for quote acceptance links of getquotationmaker.com. Links expire after 90 days. No IP address is kept.\n', { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
  }
  if (!path.startsWith('/v1/')) return new Response('not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  if (request.method !== 'POST') return json({ error: 'use POST' }, 405, { Allow: 'POST' });
  // without the secret set there is nothing to talk to; with a wrong one, nothing is read or done
  if (!env.ACCEPT_SITE_SECRET) return json({ error: 'unavailable' }, 503);
  if (!(await authorized(request, env))) return json({ error: 'unauthorized' }, 401);

  const route = { '/v1/create': 'create', '/v1/view': 'view', '/v1/accept': 'accept', '/v1/status': 'status' }[path];
  if (!route) return json({ error: 'not_found' }, 404);
  const raw = await readText(request, route === 'create' ? BIG : SMALL);
  if (raw === null) return json({ error: 'too_large' }, 413);
  let b;
  try { b = JSON.parse(raw); } catch (e) { return json({ error: 'bad_request' }, 400); }
  if (!b || typeof b !== 'object' || Array.isArray(b)) return json({ error: 'bad_request' }, 400);

  if (route === 'create') return reply(await stub.create({ entitlement: b.entitlement, snapshot: b.snapshot, notify: b.notify }));
  if (route === 'view') return reply(await stub.view(String(b.id || ''), { mark: b.mark === true }));
  if (route === 'accept') return reply(await stub.accept(String(b.id || ''), { name: b.name, note: b.note, confirm: b.confirm === true }));
  return reply(await stub.status(b.codes));
}
