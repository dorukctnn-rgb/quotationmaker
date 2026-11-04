// Tests of the Paddle checkout (run: npm test). No network: the Worker peak-pay is a fake fetch, the app runs on a free local port.
// 1. lib/pro.js takes a Paddle Pro key: checked with the Worker (POST /v1/status, our Origin), kept in lower case, cached like a
//    Gumroad key; 404/409/410 are a no; a network error, a 5xx or a 429 keeps a key verified before and never unlocks a new one.
// 2. /activate-pro takes a Paddle key like a Gumroad key and keeps it in the qm_license cookie.
// 3. The switch (lib/paddle.js): off, no rendered page mentions peak-pay or paddle (beyond the resellers line the terms and
//    refund pages already had); on (QM_PADDLE=1, tests only), the pages load qm-pay.js, the Activate Pro page offers the e-mail
//    box above the key box, and the words next to the Get Pro buttons name Paddle.com as the seller of record.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const paddle = require('../lib/paddle');
const pro = require('../lib/pro');
const app = require('../server');

const KEY = 'pp-t-' + 'a1b2c3d4e5f6g7h8i9j0k1l2m3' + '-' + '0123456789abcdef01234567';
const keyN = n => 'pp-t-' + String(n).padStart(26, 'k') + '-' + '0123456789abcdef01234567';
const realFetch = globalThis.fetch;
const calls = [];
let answer = () => ({ status: 200, body: { ok: true, plan: 'lifetime' } });

// The Worker (and Gumroad) answer from `answer`; every other address (the app under test) is the real fetch.
globalThis.fetch = async (url, init = {}) => {
  const u = String(url);
  if (u.startsWith(paddle.WORKER) || u.startsWith('https://api.gumroad.com/')) {
    calls.push({ url: u, init });
    const a = answer(u, init);
    if (a === 'throw') throw new TypeError('fetch failed');
    return new Response(JSON.stringify(a.body || {}), { status: a.status, headers: { 'Content-Type': 'application/json' } });
  }
  return realFetch(url, init);
};
test.after(() => { globalThis.fetch = realFetch; });

let server, base;
test.before(async () => {
  await new Promise(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
  base = 'http://127.0.0.1:' + server.address().port;
});
test.after(() => new Promise(resolve => server.close(resolve)));
const get = async (p, headers) => { const r = await realFetch(base + p, { redirect: 'manual', headers }); return { status: r.status, body: await r.text() }; };

// -- 1. lib/pro.js ---------------------------------------------------------------------------------------------------------------
test('a Paddle key is checked with peak-pay, with our Origin, and kept in lower case', async () => {
  calls.length = 0;
  answer = () => ({ status: 200, body: { ok: true, plan: 'lifetime' } });
  const r = await pro.verifyLicense(KEY.toUpperCase());
  assert.deepStrictEqual(r, { ok: true, key: KEY });
  assert.strictEqual(calls.length, 1);
  assert.strictEqual(calls[0].url, paddle.WORKER + '/v1/status');
  assert.strictEqual(calls[0].init.method, 'POST');
  assert.strictEqual(calls[0].init.headers.Origin, 'https://www.getquotationmaker.com');
  assert.deepStrictEqual(JSON.parse(calls[0].init.body), { key: KEY, product: 'quotationmaker' });
  // cached for the next page, like a Gumroad key
  assert.strictEqual((await pro.verifyLicense(KEY)).ok, true);
  assert.strictEqual(calls.length, 1, 'answered from the cache');
  // an activation checks again
  await pro.verifyLicense(KEY, { increment: true });
  assert.strictEqual(calls.length, 2, 'activation asks again');
});

test('a Paddle key the Worker refuses is a no: 404 unknown, 409 another product, 410 refunded', async () => {
  for (const [n, status, reason] of [[1, 404, 'invalid'], [2, 409, 'invalid'], [3, 410, 'revoked']]) {
    answer = () => ({ status, body: { error: 'x' } });
    const r = await pro.verifyLicense(keyN(n));
    assert.strictEqual(r.ok, false, String(status));
    assert.strictEqual(r.reason, reason, String(status));
    assert.ok(r.message && !/gumroad/i.test(r.message), 'the message does not send a Paddle buyer to Gumroad');
  }
});

test('Peak down: a new key is never unlocked, a key verified before keeps working, an explicit no still locks it out', async (t) => {
  // a new key while the Worker fails or cannot be reached
  for (const [n, a] of [[10, { status: 503 }], [11, { status: 502 }], [12, { status: 429 }], [13, 'throw'], [14, { status: 200, body: {} }], [15, { status: 403 }]]) {
    answer = () => a;
    const r = await pro.verifyLicense(keyN(n));
    assert.strictEqual(r.ok, false, JSON.stringify(a));
    assert.strictEqual(r.reason, 'network', JSON.stringify(a));
  }
  // a key verified before, then the cache runs out while the Worker is down
  let now = Date.now();
  t.mock.method(Date, 'now', () => now);
  const k = keyN(20);
  answer = () => ({ status: 200, body: { ok: true, plan: 'lifetime' } });
  assert.strictEqual((await pro.verifyLicense(k)).ok, true);
  now += 7 * 60 * 60 * 1000;
  for (const a of [{ status: 503 }, { status: 429 }, 'throw']) {
    answer = () => a;
    assert.strictEqual((await pro.verifyLicense(k)).ok, true, 'kept through ' + JSON.stringify(a));
    assert.strictEqual((await pro.verifyLicense(k, { increment: true })).ok, true, 'activation kept through ' + JSON.stringify(a));
  }
  // and is refunded: the next check locks it out
  answer = () => ({ status: 410, body: { error: 'refunded' } });
  const gone = await pro.verifyLicense(k, { increment: true });
  assert.strictEqual(gone.ok, false);
  assert.strictEqual(gone.reason, 'revoked');
  answer = () => ({ status: 503 });
  now += 11 * 60 * 1000;
  assert.strictEqual((await pro.verifyLicense(k)).ok, false, 'a refunded key is not brought back by an outage');
});

test('Gumroad keys work as before (upper case, Gumroad API); a cut Paddle key never reaches either service', async () => {
  calls.length = 0;
  answer = (u) => (u.startsWith('https://api.gumroad.com/') ? { status: 200, body: { success: true, purchase: {} } } : { status: 500 });
  const r = await pro.verifyLicense('abcd1234-ef567890-12ab34cd-56ef78ab');
  assert.deepStrictEqual(r, { ok: true, key: 'ABCD1234-EF567890-12AB34CD-56EF78AB' });
  assert.strictEqual(calls[0].url, 'https://api.gumroad.com/v2/licenses/verify');
  calls.length = 0;
  const cut = await pro.verifyLicense(KEY.slice(0, -3));
  assert.strictEqual(cut.reason, 'format');
  assert.strictEqual(calls.length, 0);
});

// -- 2. /activate-pro ------------------------------------------------------------------------------------------------------------
test('/activate-pro takes a Paddle key, keeps it in lower case in the cookie, and the next page is Pro', async () => {
  answer = () => ({ status: 200, body: { ok: true, plan: 'lifetime' } });
  const k = keyN(30);
  const r = await realFetch(base + '/activate-pro', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Forwarded-Proto': 'https' }, body: JSON.stringify({ license_key: k.toUpperCase() }) });
  assert.strictEqual(r.status, 200);
  assert.deepStrictEqual(await r.json(), { success: true });
  const cookie = r.headers.getSetCookie().find(c => c.startsWith(pro.COOKIE + '='));
  assert.ok(cookie, 'cookie set');
  assert.ok(cookie.startsWith(pro.COOKIE + '=' + k + ';'), 'the key is kept in lower case');
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  const page = await get('/activate', { Cookie: pro.COOKIE + '=' + k });
  assert.match(page.body, /<h1>Pro is active<\/h1>/);
  // refused and down
  answer = () => ({ status: 404, body: { error: 'not_found' } });
  const no = await realFetch(base + '/activate-pro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ license_key: keyN(31) }) });
  assert.strictEqual(no.status, 400);
  answer = () => ({ status: 503 });
  const down = await realFetch(base + '/activate-pro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ license_key: keyN(32) }) });
  assert.strictEqual(down.status, 503);
  assert.ok(!down.headers.getSetCookie().some(c => c.startsWith(pro.COOKIE + '=')), 'no cookie while the Worker is down');
});

// -- 3. the switch ---------------------------------------------------------------------------------------------------------------
async function allPages() {
  const { body } = await get('/sitemap.xml');
  const paths = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace('https://www.getquotationmaker.com', '') || '/');
  return paths.concat(['/activate', '/robots.txt', '/sitemap.xml', '/google-verification', '/no-such-page']);
}
// the terms and the refund page already named both resellers before this change
const RESELLERS = /Paddle\.com and Gumroad/g;

test('switch off: no rendered page mentions peak-pay or paddle', { skip: paddle.PADDLE_CHECKOUT && 'the switch is on' }, async () => {
  delete process.env.QM_PADDLE;
  assert.strictEqual(paddle.enabled(), false);
  const paths = await allPages();
  assert.ok(paths.length > 40);
  assert.strictEqual((await realFetch(base + '/')).headers.get('content-security-policy'), null, 'no policy header, as before');
  for (const p of paths) {
    const { body } = await get(p);
    assert.ok(!/peak-pay|qm-pay|peakpay/i.test(body), p + ' mentions peak-pay');
    assert.ok(!/paddle/i.test(body.replace(RESELLERS, '')), p + ' mentions paddle');
  }
});

test('switch on (tests only): Get Pro opens Paddle, the e-mail box sits above the key box, the words name Paddle.com', async () => {
  process.env.QM_PADDLE = '1';
  try {
    assert.strictEqual(paddle.enabled(), true);
    const paths = await allPages();
    for (const p of paths.filter(x => !/\.(txt|xml)$|google-verification/.test(x))) {
      const { body } = await get(p);
      assert.strictEqual((body.match(/<script src="\/qm-pay\.js\?v=\d+" data-pro="0" defer><\/script>/g) || []).length, 1, p + ' loads qm-pay.js once');
      for (const m of body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) assert.doesNotThrow(() => JSON.parse(m[1]), p + ' JSON-LD parses');
      assert.ok(!/\bAI\b/.test(body.replace(/<script[\s\S]*?<\/script>/g, '')), p + ' says AI');
    }
    const home = (await get('/')).body;
    assert.match(home, /One-time payment\. Paddle\.com is the seller of record/);
    assert.match(home, /It turns on in this browser right after you pay\./);
    assert.match(home, /Paddle\.com is the seller of record, and Pro turns on in your browser right after you pay\./, 'FAQ answer');
    assert.ok(!/Gumroad emails you a licence key|once on Gumroad|via Gumroad|through Gumroad/.test(home), 'no Gumroad sale words on the home page');
    assert.match(home, /"url":"https:\/\/www\.getquotationmaker\.com\/#pricing"/);
    const act = (await get('/activate')).body;
    const restore = act.indexOf('id="ppRestore"'), keyBox = act.indexOf('id="actForm"');
    assert.ok(restore > 0 && keyBox > restore, 'the e-mail box comes before the key box');
    assert.match(act, /Bought Pro already\?<\/strong> We can e-mail your Pro link/);
    assert.match(act, /Bought Pro on Gumroad\? Paste the licence key/);
    assert.match(act, /Paddle\.com is the seller of record, and Pro turns on right after you pay\./);
    assert.ok(!act.includes('Checking with Gumroad'), 'the key check names no service');
    // Paddle's script may load, its partner's tracking script may not
    const csp = (await realFetch(base + '/')).headers.get('content-security-policy') || '';
    assert.match(csp, /script-src 'self' 'unsafe-inline' https:\/\/cdn\.paddle\.com/);
    assert.ok(!/profitwell/.test(csp));
    // the files the pages load are there
    for (const f of ['/qm-pay.js', '/assets/peak-pay.js', '/assets/peak-pay.css']) assert.strictEqual((await get(f)).status, 200, f);
  } finally {
    delete process.env.QM_PADDLE;
  }
});

test('the switch is one constant, and QM_PADDLE never turns it on in production', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'lib', 'paddle.js'), 'utf8');
  assert.strictEqual((src.match(/^const PADDLE_CHECKOUT = (true|false);$/gm) || []).length, 1);
  if (paddle.PADDLE_CHECKOUT) return;
  process.env.QM_PADDLE = '1';
  process.env.VERCEL_ENV = 'production';
  try { assert.strictEqual(paddle.enabled(), false); } finally { delete process.env.QM_PADDLE; delete process.env.VERCEL_ENV; }
});

test('the browser files: peak-pay.js is the peak-tools copy with only the refund address changed; qm-pay.js sends keys to /activate-pro', () => {
  const pp = fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'peak-pay.js'), 'utf8');
  assert.match(pp, /var WORKER = 'https:\/\/peak-pay\.railer-iot\.workers\.dev';/);
  assert.match(pp, /var REFUND = '\/refund';/);
  const qm = fs.readFileSync(path.join(__dirname, '..', 'public', 'qm-pay.js'), 'utf8');
  assert.match(qm, /product: PRODUCT, lang: 'en', page: location\.origin \+ '\/'/);
  assert.match(qm, /fetch\('\/activate-pro'/);
  assert.match(qm, /history\.replaceState/);
  assert.match(qm, /P\.restore\(email, PRODUCT, 'en', location\.origin \+ '\/'\)/);
});
