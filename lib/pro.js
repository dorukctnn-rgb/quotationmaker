// Pro access is tied to a licence key kept in an httpOnly cookie, and results are cached per instance.
//  - A Gumroad licence key (four blocks of letters and numbers) is checked against Gumroad's licence API (no secret needed).
//  - A Paddle Pro key (pp-t-... or pp-s-..., lower case, from the Pro link we e-mail or from the checkout on the page) is checked
//    with the Worker peak-pay (lib/paddle.js), which asks Paddle whether the purchase is still paid and not refunded.
// Both follow one rule: an answer that says no locks the key out; when the service cannot be reached or fails (a 5xx), a key
// that was verified before keeps working and a new key is never unlocked.
const paddle = require('./paddle');

const PRODUCT_ID = process.env.GUMROAD_PRODUCT_ID || 'wl-7qEsQC2WfF5p2bJ89Rg==';
const COOKIE = 'qm_license';
const OK_TTL = 6 * 60 * 60 * 1000;
const BAD_TTL = 10 * 60 * 1000;
const cache = new Map();

const KEY_FORMAT = /^[A-Za-z0-9-]{8,64}$/;
const PADDLE_KEY = new RegExp(paddle.KEY_FORMAT.source, 'i');
const PADDLE_PREFIX = /^pp-[st]-/i;

const REVOKED = 'This purchase has been refunded or cancelled, so Pro is no longer active.';

async function verifyLicense(rawKey, { increment = false } = {}) {
  const raw = String(rawKey || '').trim();
  if (PADDLE_KEY.test(raw)) return verifyPaddleKey(raw.toLowerCase(), { fresh: increment });
  if (PADDLE_PREFIX.test(raw)) return { ok: false, reason: 'format', message: 'That Pro key is not complete. Open the Pro link from our e-mail again, or copy the whole key.' };
  const key = raw.toUpperCase();
  if (!KEY_FORMAT.test(key)) return { ok: false, reason: 'format', message: 'That does not look like a Gumroad licence key. It is four blocks of letters and numbers, for example ABCD1234-EF567890-12AB34CD-56EF78AB.' };
  const hit = cache.get(key);
  if (hit && hit.exp > Date.now() && !increment) return hit.res;

  let res;
  try {
    const body = new URLSearchParams({ product_id: PRODUCT_ID, license_key: key, increment_uses_count: increment ? 'true' : 'false' });
    const r = await fetch('https://api.gumroad.com/v2/licenses/verify', { method: 'POST', body, signal: AbortSignal.timeout(6000) });
    const j = await r.json().catch(() => ({}));
    if (r.status >= 500) throw new Error('gumroad ' + r.status);
    if (j && j.success === true && j.purchase) {
      const p = j.purchase;
      const revoked = p.refunded || p.chargebacked || (p.disputed && !p.dispute_won) || p.subscription_ended_at || p.subscription_cancelled_at || p.subscription_failed_at;
      res = revoked
        ? { ok: false, reason: 'revoked', message: REVOKED }
        : { ok: true, key };
    } else {
      res = { ok: false, reason: 'invalid', message: 'Gumroad does not recognise that licence key for QuotationMaker Pro. Copy it again from your Gumroad receipt.' };
    }
  } catch (e) {
    // Gumroad unreachable: keep a previously verified key working, never unlock a new one.
    if (hit && hit.res.ok) return hit.res;
    return { ok: false, reason: 'network', message: 'We could not reach Gumroad to check the key. Please try again in a minute.' };
  }
  cache.set(key, { res, exp: Date.now() + (res.ok ? OK_TTL : BAD_TTL) });
  return res;
}

// A Paddle Pro key, asked of the Worker: 200 { ok } is a yes; 404 (unknown key), 409 (a key of another product) and 410
// (refunded or ended) are a no; anything else (a network error, 5xx, 429, an answer we do not expect) means "cannot tell".
async function verifyPaddleKey(key, { fresh = false } = {}) {
  const hit = cache.get(key);
  if (hit && hit.exp > Date.now() && !fresh) return hit.res;

  let res;
  try {
    const r = await fetch(paddle.WORKER + '/v1/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: paddle.ORIGIN },
      body: JSON.stringify({ key, product: paddle.PRODUCT }),
      signal: AbortSignal.timeout(6000)
    });
    const j = await r.json().catch(() => ({}));
    if (r.status === 200 && j && j.ok === true) res = { ok: true, key };
    else if (r.status === 410) res = { ok: false, reason: 'revoked', message: REVOKED };
    else if (r.status === 404 || r.status === 409) res = { ok: false, reason: 'invalid', message: 'That Pro key is not one we know for QuotationMaker Pro. Open the Pro link from our e-mail again.' };
    else throw new Error('peak-pay ' + r.status);
  } catch (e) {
    // Paddle or the Worker unreachable: keep a previously verified key working, never unlock a new one.
    if (hit && hit.res.ok) return hit.res;
    return { ok: false, reason: 'network', message: 'We could not check your Pro key just now. Please try again in a minute.' };
  }
  cache.set(key, { res, exp: Date.now() + (res.ok ? OK_TTL : BAD_TTL) });
  return res;
}

async function isPro(req) {
  const key = req.cookies && req.cookies[COOKIE];
  if (!key) return false;
  const r = await verifyLicense(key);
  return r.ok;
}

function cookieOptions(req) {
  const secure = req.secure || req.headers['x-forwarded-proto'] === 'https';
  return { httpOnly: true, sameSite: 'lax', secure, path: '/', maxAge: 365 * 24 * 60 * 60 * 1000 };
}

module.exports = { COOKIE, verifyLicense, isPro, cookieOptions, PRODUCT_ID };
