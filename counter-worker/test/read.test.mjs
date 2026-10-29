// Run: node --test counter-worker/test/read.test.mjs
// The report: windows, the two readers on fixtures, the numbers and the text, and the command line against a local copy of the
// Worker (the selftest and the counter-only report). Nothing here reaches the real Worker or Gumroad.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { windowOf, readCounter, readSales, isSale, isQuotationMakerPro, classOf, buildReport, formatReport } from '../read-lib.mjs';
import { CounterCore, cleanNote } from '../core.js';
import { handle } from '../handler.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const run = promisify(execFile);
const NOW = Date.parse('2026-11-10T15:00:00Z');
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status });

test('a window of N days ends today and counts today as one of the N', () => {
  assert.deepEqual(windowOf(7, NOW), { days: 7, from: '2026-11-04', to: '2026-11-10' });
  assert.deepEqual(windowOf(1, NOW), { days: 1, from: '2026-11-10', to: '2026-11-10' });
  assert.deepEqual(windowOf(30, NOW), { days: 30, from: '2026-10-12', to: '2026-11-10' });
});

test('the eight words are sorted into organic, referral and direct; no word means not known', () => {
  for (const w of ['google', 'bing', 'other-search']) assert.equal(classOf(w), 'organic', w);
  for (const w of ['ai-assistant', 'pinterest', 'social', 'referral']) assert.equal(classOf(w), 'referral', w);
  assert.equal(classOf('direct'), 'direct');
  assert.equal(classOf(''), 'unknown');
  assert.equal(classOf(undefined), 'unknown');
});

test('the counter reader asks for the window with the key, and says plainly when the Worker is not there yet', async () => {
  const seen = [];
  const rows = await readCounter({ url: 'https://c.test/', key: 'k1', days: 7, by: ['e', 'p'], fetchFn: async (u, init) => { seen.push([u, init.headers.Authorization]); return json({ rows: [{ e: 'view', p: '/privacy', n: 2 }] }); } });
  assert.deepEqual(seen, [['https://c.test/r?days=7&by=e,p', 'Bearer k1']]);
  assert.deepEqual(rows, [{ e: 'view', p: '/privacy', n: 2 }]);
  await assert.rejects(readCounter({ url: 'https://c.test', key: 'k', days: 7, by: ['e'], fetchFn: async () => json({}, 404) }), /not deployed yet/);
  await assert.rejects(readCounter({ url: 'https://c.test', key: 'k', days: 7, by: ['e'], fetchFn: async () => json({}, 401) }), /refused the key/);
  await assert.rejects(readCounter({ url: 'https://c.test', key: 'k', days: 7, by: ['e'], fetchFn: async () => json({}, 500) }), /answered 500/);
});

const sale = (o) => ({ created_at: '2026-11-08T10:00:00Z', price: 900, product_name: 'QuotationMaker Pro', product_permalink: 'cjogv', refunded: false, chargedback: false,
  email: 'buyer@example.com', purchase_email: 'buyer@example.com', full_name: 'A Buyer', license_key: 'AAAA-BBBB', ip_country: 'GB', utm_source: 'google', ...o });

test('the Gumroad reader follows the pages, sends the token, and keeps only the fields the report needs (no e-mail, name or key)', async () => {
  const calls = [];
  const sales = await readSales({ token: 'tok', after: '2026-10-11', fetchFn: async (u, init) => {
    calls.push([u, init.headers.Authorization]);
    return u.includes('page_key=p2') ? json({ success: true, sales: [sale({ price: 0 })] }) : json({ success: true, sales: [sale(), sale({ refunded: true })], next_page_key: 'p2' });
  } });
  assert.equal(calls.length, 2);
  assert.match(calls[0][0], /after=2026-10-11/);
  assert.equal(calls[0][1], 'Bearer tok');
  assert.equal(sales.length, 3);
  assert.deepEqual(Object.keys(sales[0]).sort(), ['at', 'cents', 'permalink', 'product', 'refunded']);
  assert.ok(!JSON.stringify(sales).includes('buyer@example.com') && !JSON.stringify(sales).includes('AAAA-BBBB') && !JSON.stringify(sales).includes('A Buyer'));
  await assert.rejects(readSales({ token: 'x', after: '2026-10-11', fetchFn: async () => json({ success: false, message: 'bad token' }, 401) }), /Gumroad answered 401: bad token/);
});

test('a sale is a paid, not refunded purchase of QuotationMaker Pro: $0 test purchases, refunds and other products are not', () => {
  assert.equal(isSale({ cents: 900, refunded: false }), true);
  assert.equal(isSale({ cents: 0, refunded: false }), false);
  assert.equal(isSale({ cents: 900, refunded: true }), false);
  assert.equal(isQuotationMakerPro({ permalink: 'cjogv', product: 'x' }), true);
  assert.equal(isQuotationMakerPro({ permalink: 'zzz', product: 'Quotation Maker Pro' }), true);
  assert.equal(isQuotationMakerPro({ permalink: 'zzz', product: 'Chatbound Pro' }), false);
});

const WIN = windowOf(7, NOW);
const ROWS = [
  { e: 'view', t: 'quotationmaker', p: '/quote-template-plumber', w: '', s: 'google', n: 40 },
  { e: 'view', t: 'quotationmaker', p: '/quote-template-plumber', w: '', s: 'direct', n: 10 },
  { e: 'view', t: 'quotationmaker', p: '/quote-template-plumber', w: '', s: '', n: 5 },
  { e: 'click', t: 'quotationmaker', p: '/quote-template-plumber', w: 'nav', s: 'google', n: 3 },
  { e: 'click', t: 'quotationmaker', p: '/quote-template-plumber', w: 'section#tool', s: 'direct', n: 1 },
  { e: 'view', t: 'quotationmaker', p: '/privacy', w: '', s: 'social', n: 4 },
  { e: 'click', t: 'quotationmaker', p: '/blog', w: 'nav', s: '', n: 2 },
  { e: 'click', t: 'selftest', p: '/selftest', w: 'main', s: 'direct', n: 9 },
];
test('the report puts views, clicks and the split by kind of site side by side per page; test notes and other events are left out', () => {
  const rep = buildReport({ rows: ROWS, window: WIN });
  const by = Object.fromEntries(rep.pages.map((p) => [p.page, p]));
  assert.deepEqual([by['/quote-template-plumber'].views, by['/quote-template-plumber'].clicks], [55, 4]);
  assert.deepEqual(by['/quote-template-plumber'].view, { organic: 40, referral: 0, direct: 10, unknown: 5 });
  assert.deepEqual(by['/quote-template-plumber'].click, { organic: 3, referral: 0, direct: 1, unknown: 0 });
  assert.deepEqual(by['/quote-template-plumber'].byPlace, { nav: 3, 'section#tool': 1 });
  assert.deepEqual([by['/privacy'].views, by['/privacy'].clicks], [4, 0]);
  assert.deepEqual(by['/blog'].click, { organic: 0, referral: 0, direct: 0, unknown: 2 }, 'no word is not known');
  assert.equal(by['/selftest'], undefined);
  assert.deepEqual([rep.total.views, rep.total.clicks], [59, 6]);
  assert.equal(rep.pages[0].page, '/quote-template-plumber', 'most clicks first');
  assert.equal(rep.gumroad, null);
});

test('Gumroad sales in the window are counted for QuotationMaker Pro only; refunds, tests, other products and other days are left out', () => {
  const sales = [
    { at: '2026-11-08T10:00:00Z', cents: 900, refunded: false, permalink: 'cjogv', product: 'QuotationMaker Pro' },
    { at: '2026-11-08T12:00:00Z', cents: 900, refunded: true, permalink: 'cjogv', product: 'QuotationMaker Pro' },
    { at: '2026-11-09T12:00:00Z', cents: 0, refunded: false, permalink: 'cjogv', product: 'QuotationMaker Pro' },
    { at: '2026-11-09T13:00:00Z', cents: 800, refunded: false, permalink: 'abc', product: 'Chatbound Pro' },
    { at: '2026-11-03T23:59:59Z', cents: 900, refunded: false, permalink: 'cjogv', product: 'QuotationMaker Pro' },
    { at: '2026-11-10T09:00:00Z', cents: 900, refunded: false, permalink: 'cjogv', product: 'QuotationMaker Pro' },
  ];
  const rep = buildReport({ rows: [], sales, window: WIN });
  assert.deepEqual(rep.gumroad, { sales: 2, cents: 1800, days: ['2026-11-08', '2026-11-10'] });
});

test('the text report: one line per page with the rate and the places, the totals, the split by kind of site, and the sales line', () => {
  const rep = buildReport({ rows: ROWS, sales: [{ at: '2026-11-08T10:00:00Z', cents: 900, refunded: false, permalink: 'cjogv', product: 'QuotationMaker Pro' }], window: WIN });
  const text = formatReport(rep);
  assert.match(text, /^QuotationMaker counter, last 7 days \(2026-11-04 to 2026-11-10, UTC days, today included\)/);
  assert.match(text.split('\n').find((l) => l.startsWith('/quote-template-plumber')), /55\s+4\s+7\.3%\s+nav 3, section#tool 1$/);
  assert.match(text, /total\s+59\s+6\s+10\.2%/);
  assert.match(text, /organic\s+40 \/\s+3/);
  assert.match(text, /direct\s+10 \/\s+1/);
  assert.match(text, /unknown\s+5 \/\s+2\s+\(the visit began on a page that is not counted\)/);
  assert.match(text, /Gumroad: 1 QuotationMaker Pro sale in these days \(\$9\.00\), on 2026-11-08/);
  assert.ok(!/views\/clicks by kind of site/.test(text), 'the per-page split only on request');
  const more = formatReport(rep, { source: true, words: true });
  assert.match(more, /views\/clicks by kind of site: organic 40\/3, referral 0\/0, direct 10\/1, unknown 5\/0/);
  assert.match(more, /click words: google 3, \(unknown\) 2, direct 1/);
  // no clicks, no views: still a clean report
  assert.match(formatReport(buildReport({ rows: [], window: WIN })), /total\s+0\s+0\s+-/);
});

// ---- the command line, against a local copy of the Worker
function localWorker() {
  const db = new DatabaseSync(':memory:');
  const exec = (q, ...p) => { const st = db.prepare(q); return /^\s*SELECT/i.test(q) ? st.all(...p) : (st.run(...p), []); };
  const core = new CounterCore(exec, (fn) => { db.exec('BEGIN'); try { const r = fn(); db.exec('COMMIT'); return r; } catch (e) { db.exec('ROLLBACK'); throw e; } });
  const stub = new Proxy(core, { get: (t, k) => (typeof t[k] === 'function' ? (...a) => Promise.resolve(t[k](...a)) : t[k]) });
  const env = { COUNTER: { idFromName: () => 'm', get: () => stub }, COUNTER_ADMIN_KEY: 'cli-key' };
  const server = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const r = await handle(new Request(`http://${req.headers.host}${req.url}`, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) }), env);
    res.writeHead(r.status, Object.fromEntries(r.headers));
    res.end(Buffer.from(await r.arrayBuffer()));
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, core, url: `http://127.0.0.1:${server.address().port}` })));
}
const cli = (args, env) => run(process.execPath, [path.join(HERE, '..', 'read.mjs'), ...args], { env: { PATH: process.env.PATH, PEAK_SECRETS: path.join(HERE, 'no-secrets-here'), ...env } }).then((r) => ({ code: 0, ...r }), (e) => ({ code: e.code, stdout: e.stdout, stderr: e.stderr }));

test('read.mjs --selftest writes one test note and reads it back; the report prints the counter and says what is not counted', async () => {
  const w = await localWorker();
  try {
    // the local Worker is reached over http, so its origin check is satisfied by the selftest's own Origin header
    const self = await cli(['--selftest'], { COUNTER_URL: w.url, COUNTER_ADMIN_KEY: 'cli-key' });
    assert.equal(self.code, 0, self.stderr);
    assert.match(self.stdout, /answered 204.*\+1/);
    w.core.note(cleanNote({ e: 'view', t: 'quotationmaker', p: '/quote-template-plumber', w: '', s: 'bing' }));
    w.core.note(cleanNote({ e: 'click', t: 'quotationmaker', p: '/quote-template-plumber', w: 'nav', s: 'bing' }));
    const rep = await cli(['--no-gumroad', '--days', '7', '--source'], { COUNTER_URL: w.url, COUNTER_ADMIN_KEY: 'cli-key' });
    assert.equal(rep.code, 0, rep.stderr);
    assert.match(rep.stdout, /QuotationMaker counter, last 7 days/);
    assert.match(rep.stdout, /\/quote-template-plumber\s+1\s+1\s+100\.0%\s+nav 1/);
    assert.ok(!rep.stdout.includes('/selftest'), 'the test note is not in the report');
    assert.match(rep.stdout, /views\/clicks by kind of site: organic 1\/1/);
    assert.match(rep.stdout, /Not counted: 10 pages are left exactly as they were/);
    const one = await cli(['--no-gumroad', '--days', '7', '--page', '/privacy'], { COUNTER_URL: w.url, COUNTER_ADMIN_KEY: 'cli-key' });
    assert.match(one.stdout, /total\s+0\s+0/);
    const j = await cli(['--no-gumroad', '--days', '30', '--json'], { COUNTER_URL: w.url, COUNTER_ADMIN_KEY: 'cli-key' });
    assert.equal(JSON.parse(j.stdout).reports[0].window.days, 30);
    assert.equal(JSON.parse(j.stdout).reports[0].total.clicks, 1);
    const bad = await cli(['--no-gumroad'], { COUNTER_URL: w.url, COUNTER_ADMIN_KEY: 'wrong' });
    assert.equal(bad.code, 1);
    assert.match(bad.stdout + bad.stderr, /refused the key/);
    const none = await cli(['--no-gumroad'], { COUNTER_URL: w.url });
    assert.equal(none.code, 2);
    assert.match(none.stderr, /No counter key/);
    assert.ok(!(rep.stdout + rep.stderr + bad.stdout + bad.stderr).includes('cli-key'), 'the key is never printed');
  } finally { w.server.close(); }
});
