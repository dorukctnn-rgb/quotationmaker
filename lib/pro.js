// Pro access is tied to a Gumroad licence key. The key is kept in an httpOnly cookie and
// checked against Gumroad's licence API (no secret needed); results are cached per instance.
const PRODUCT_ID = process.env.GUMROAD_PRODUCT_ID || 'wl-7qEsQC2WfF5p2bJ89Rg==';
const COOKIE = 'qm_license';
const OK_TTL = 6 * 60 * 60 * 1000;
const BAD_TTL = 10 * 60 * 1000;
const cache = new Map();

const KEY_FORMAT = /^[A-Za-z0-9-]{8,64}$/;

async function verifyLicense(rawKey, { increment = false } = {}) {
  const key = String(rawKey || '').trim().toUpperCase();
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
        ? { ok: false, reason: 'revoked', message: 'This purchase has been refunded or cancelled, so Pro is no longer active.' }
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
