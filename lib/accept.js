// Quote acceptance links (Pro): the site's side of the Worker qm-accept (accept-worker/).
//
// The browser only ever talks to this site. The site checks that the sender has Pro (res.locals.isPro: the same check as every other
// Pro feature, see lib/pro.js), turns the Pro key in the qm_license cookie into an anonymous code that is only good for counting links
// per purchase (an HMAC with the shared secret: the key itself never leaves this server) and asks the Worker, which trusts only a
// caller that knows the shared secret.
//
//   QM_ACCEPT_SECRET   the secret shared with the Worker (ACCEPT_SITE_SECRET there), at least 32 characters. Without it the feature
//                      is off: creating a link answers 503 and every other page is unaffected.
//   QM_ACCEPT_WORKER   the Worker's address (default below), for tests and a second environment.
const crypto = require('crypto');
const pro = require('./pro');
const paddle = require('./paddle');

const DEFAULT_WORKER = 'https://qm-accept.railer-iot.workers.dev';
const PADDLE_KEY = new RegExp(paddle.KEY_FORMAT.source, 'i');
const ID_RE = /^[a-z2-7]{26}$/;

const secret = () => String(process.env.QM_ACCEPT_SECRET || '');
const worker = () => String(process.env.QM_ACCEPT_WORKER || DEFAULT_WORKER).replace(/\/+$/, '');
const enabled = () => secret().length >= 32;

// The code for one purchase: the same key always gives the same code, whatever the case it was typed in (verifyLicense in lib/pro.js
// lower-cases a Paddle key and upper-cases a Gumroad key), and the code cannot be turned back into the key.
function entitlement(req) {
  const raw = String((req.cookies && req.cookies[pro.COOKIE]) || '').trim();
  if (!raw) return '';
  const key = PADDLE_KEY.test(raw) ? raw.toLowerCase() : raw.toUpperCase();
  return crypto.createHmac('sha256', secret()).update('qm-accept-entitlement:' + key).digest('hex').slice(0, 32);
}

// One call to the Worker: { status, body, retryAfter }. A network error or a timeout throws.
async function call(path, body) {
  const r = await fetch(worker() + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + secret() },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  const j = await r.json().catch(() => ({}));
  return { status: r.status, body: j && typeof j === 'object' ? j : {}, retryAfter: Number(r.headers.get('retry-after')) || 0 };
}

// Link crawlers and mail scanners open a link without anyone reading it: they do not count as "viewed".
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|curl|wget|python-requests|node-fetch|undici|safelinks|proofpoint|mimecast|barracuda|go-http-client|okhttp|java\//i;

module.exports = { enabled, entitlement, call, ID_RE, BOT };
