// Run: node --test counter-worker/test/counter.test.mjs
// The counting rules (core.js) on node:sqlite and the Worker's addresses (handler.js) with a stand-in for the Durable Object.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { CounterCore, cleanNote, MAX_ROWS_PER_DAY, KEEP_DAYS } from '../core.js';
import { handle } from '../handler.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DAY = 864e5;
function makeCore(start = Date.parse('2026-11-10T12:00:00Z')) {
  const db = new DatabaseSync(':memory:');
  const exec = (q, ...p) => { const st = db.prepare(q); return /^\s*SELECT/i.test(q) ? st.all(...p) : (st.run(...p), []); };
  const txn = fn => { db.exec('BEGIN'); try { const r = fn(); db.exec('COMMIT'); return r; } catch (e) { db.exec('ROLLBACK'); throw e; } };
  const clock = { t: start };
  const core = new CounterCore(exec, txn, () => clock.t);
  return { core, clock, db };
}
const note = (o = {}) => cleanNote({ e: 'click', t: 'quotationmaker', p: '/quote-template-plumber', w: 'nav', s: 'google', ...o });

// ---- cleanNote
test('a note keeps only the five allowed fields, lowercased, and refuses what is not a note', () => {
  assert.deepEqual(note(), { e: 'click', t: 'quotationmaker', p: '/quote-template-plumber', w: 'nav', s: 'google' });
  assert.deepEqual(cleanNote(JSON.stringify({ e: 'VIEW', t: 'QuotationMaker', p: '/Blog/X', w: '', s: 'Pinterest', email: 'a@b.c', ip: '1.2.3.4' })), { e: 'view', t: 'quotationmaker', p: '/blog/x', w: '', s: 'pinterest' });
  for (const bad of [null, 'x', '[]', '1', '{"e":"click"}', '{"t":"quotationmaker"}', '{"e":"purchase","t":"quotationmaker"}', '{"e":"gate","t":"quotationmaker"}',
    '{"e":"click","t":"other-site"}', '{"e":"click","t":"../etc"}', JSON.stringify({ e: 'click', t: 'quotationmaker', pad: 'x'.repeat(700) })]) {
    assert.equal(cleanNote(bad), null, String(bad).slice(0, 60));
  }
});
test('an address with a query or #, a free-text place or an unknown kind of site is dropped, not stored', () => {
  assert.equal(note({ p: '/blog/x?email=a@b.c' }).p, '');
  assert.equal(note({ p: '/blog/x#top' }).p, '');
  assert.equal(note({ p: 'https://www.getquotationmaker.com/x' }).p, '');
  assert.equal(note({ p: '/' + 'a'.repeat(130) }).p, '');
  assert.equal(note({ w: 'Buy Pro for $9 now!' }).w, '');
  assert.equal(note({ s: 'https://evil.example/' }).s, '');
  assert.equal(note({ s: 'someone@example.com' }).s, '');
  assert.equal(note({ s: '' }).s, '', 'no word is allowed: the source is not known');
  assert.equal(note({ p: '/quote-template-plumber' }).p, '/quote-template-plumber');
});

// ---- counting
test('every note adds one to the day\'s total for its combination, and different combinations stay apart', () => {
  const { core } = makeCore();
  for (let i = 0; i < 3; i++) core.note(note());
  core.note(note({ s: 'bing' }));
  core.note(note({ e: 'view', w: '' }));
  core.note(note({ p: '/privacy' }));
  assert.equal(core.rows({ days: 7 }).length, 4);
  assert.equal(core.rows({ days: 7 }).find(r => r.e === 'click' && r.p === '/quote-template-plumber' && r.s === 'google').n, 3);
  assert.deepEqual(core.rows({ days: 7, by: ['e'] }), [{ e: 'click', n: 5 }, { e: 'view', n: 1 }]);
  assert.deepEqual(core.rows({ days: 7, by: [] }), [{ n: 6 }]);
});
test('totals are per UTC day; the last N days include today and nothing older', () => {
  const { core, clock } = makeCore();
  core.note(note());                       // 10 Nov
  clock.t += DAY; core.note(note());       // 11 Nov
  clock.t += DAY; core.note(note()); core.note(note()); // 12 Nov
  assert.deepEqual(core.rows({ days: 1, by: ['day'] }), [{ day: '2026-11-12', n: 2 }]);
  assert.deepEqual(core.rows({ days: 2, by: ['day'] }), [{ day: '2026-11-11', n: 1 }, { day: '2026-11-12', n: 2 }]);
  assert.equal(core.rows({ days: 30, by: [] })[0].n, 4);
  clock.t = Date.parse('2026-11-12T23:59:59Z'); core.note(note());
  assert.equal(core.rows({ days: 1, by: [] })[0].n, 3, 'still the same UTC day at 23:59:59');
  clock.t = Date.parse('2026-11-13T00:00:00Z'); core.note(note());
  assert.deepEqual(core.rows({ days: 1, by: ['day'] }), [{ day: '2026-11-13', n: 1 }]);
});
test('a flood of new combinations cannot grow the table past the day\'s room; counted ones keep counting', () => {
  const { core, db } = makeCore();
  assert.equal(core.note(note({ p: '/known' }), 10), true);
  for (let i = 0; i < 20; i++) core.note(note({ p: '/p' + i }), 10);
  assert.equal(db.prepare('SELECT COUNT(*) AS c FROM counts').get().c, 11, '10 combinations and one overflow row');
  assert.equal(core.note(note({ p: '/known' }), 10), true, 'a known combination still counts');
  assert.equal(core.note(note({ p: '/brand-new' }), 10), false);
  assert.ok(core.rows({ days: 1, by: ['e'] }).find(r => r.e === 'overflow').n >= 11);
  assert.ok(MAX_ROWS_PER_DAY >= 1000);
});
test('daily totals older than the keep period are deleted, newer ones stay', () => {
  const { core, clock, db } = makeCore();
  core.note(note());
  clock.t += (KEEP_DAYS + 1) * DAY;
  core.note(note());
  core.purge();
  assert.deepEqual(db.prepare('SELECT day FROM counts').all().map(r => r.day), ['2027-12-16']);
});
test('the table holds only counts: no column that could carry an address, an agent or a time of day', () => {
  const { db } = makeCore();
  assert.deepEqual(db.prepare('PRAGMA table_info(counts)').all().map(c => c.name), ['day', 'e', 't', 'p', 'w', 's', 'n']);
});

// ---- the Worker's addresses
function makeEnv(extra = {}) {
  const { core } = makeCore(Date.now());
  const stub = new Proxy(core, { get: (t, k) => (typeof t[k] === 'function' ? (...a) => Promise.resolve(t[k](...a)) : t[k]) });
  return { env: { COUNTER: { idFromName: () => 'main', get: () => stub }, COUNTER_ADMIN_KEY: 'k-test', ...extra }, core };
}
const ORIGIN = 'https://www.getquotationmaker.com';
const post = (env, body, headers = {}) => handle(new Request('https://c.test/e', { method: 'POST', headers: { Origin: ORIGIN, 'Content-Type': 'text/plain;charset=UTF-8', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) Chrome/130 Safari/537.36', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) }), env);
const total = core => (core.rows({ days: 1, by: [] })[0] || {}).n || 0;

test('POST /e from a QuotationMaker page counts the note, answers 204 with the origin allowed and no cookie', async () => {
  const { env, core } = makeEnv();
  const r = await post(env, { e: 'click', t: 'quotationmaker', p: '/quote-template-plumber', w: 'nav', s: 'google' });
  assert.equal(r.status, 204);
  assert.equal(r.headers.get('access-control-allow-origin'), ORIGIN);
  assert.equal(r.headers.get('set-cookie'), null);
  assert.equal(r.headers.get('access-control-allow-credentials'), null);
  assert.deepEqual(core.rows({ days: 1, by: ['e', 't', 'w', 's'] }), [{ e: 'click', t: 'quotationmaker', w: 'nav', s: 'google', n: 1 }]);
  assert.equal((await post(env, { e: 'view', t: 'quotationmaker', p: '/privacy' }, { Origin: 'https://getquotationmaker.com' })).status, 204);
  assert.equal(total(core), 2);
});
test('POST /e from any other origin, with no origin, with a bad note or with a crawler\'s agent is not counted', async () => {
  const { env, core } = makeEnv();
  const note1 = { e: 'click', t: 'quotationmaker' };
  assert.equal((await post(env, note1, { Origin: 'https://evil.example' })).status, 403);
  assert.equal((await post(env, note1, { Origin: 'https://peakappsstudio.com' })).status, 403, 'the studio site is not this counter\'s');
  assert.equal((await post(env, note1, { Origin: 'https://www.getquotationmaker.com.evil.example' })).status, 403);
  assert.equal((await post(env, note1, { Origin: 'http://www.getquotationmaker.com' })).status, 403, 'plain http is not the site');
  assert.equal((await handle(new Request('https://c.test/e', { method: 'POST', body: JSON.stringify(note1) }), env)).status, 403);
  assert.equal((await post(env, '{"e":"purchase","t":"quotationmaker"}')).status, 400);
  assert.equal((await post(env, 'not json')).status, 400);
  assert.equal((await post(env, 'x'.repeat(700))).status, 413);
  assert.equal((await post(env, note1, { 'User-Agent': 'Googlebot/2.1' })).status, 204);
  assert.equal((await post(env, note1, { 'User-Agent': 'HeadlessChrome/130' })).status, 204);
  assert.equal(total(core), 0, 'none of them counted');
});
test('the preflight answers for the site\'s origins only, and /e takes no GET', async () => {
  const { env } = makeEnv();
  const ok = await handle(new Request('https://c.test/e', { method: 'OPTIONS', headers: { Origin: ORIGIN } }), env);
  assert.equal(ok.status, 204);
  assert.match(ok.headers.get('access-control-allow-methods'), /POST/);
  assert.equal((await handle(new Request('https://c.test/e', { method: 'OPTIONS', headers: { Origin: 'https://x.example' } }), env)).status, 403);
  assert.equal((await handle(new Request('https://c.test/e', { headers: { Origin: ORIGIN } }), env)).status, 405);
});
test('a counting failure inside the object still answers 204 (the visitor never sees an error)', async () => {
  const { env } = makeEnv();
  env.COUNTER = { idFromName: () => 'main', get: () => ({ note: async () => { throw new Error('storage down'); } }) };
  const log = console.error; console.error = () => {};
  try { assert.equal((await post(env, { e: 'click', t: 'quotationmaker' })).status, 204); } finally { console.error = log; }
});
test('GET /r needs the key, answers the totals as JSON and does not exist without a key set', async () => {
  const { env, core } = makeEnv();
  core.note(note()); core.note(note({ e: 'view', w: '' }));
  const get = (p, key) => handle(new Request('https://c.test' + p, { headers: key ? { Authorization: 'Bearer ' + key } : {} }), env);
  assert.equal((await get('/r')).status, 401);
  assert.equal((await get('/r', 'wrong')).status, 401);
  const r = await get('/r?days=7&by=e,t', 'k-test');
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('cache-control'), 'no-store');
  assert.deepEqual((await r.json()).rows, [{ e: 'click', t: 'quotationmaker', n: 1 }, { e: 'view', t: 'quotationmaker', n: 1 }]);
  // a column name that is not on the list is ignored, never put into the query
  assert.deepEqual((await (await get('/r?by=e;DROP TABLE counts', 'k-test')).json()).by, []);
  assert.equal(total(core), 2);
  const none = makeEnv({ COUNTER_ADMIN_KEY: undefined });
  assert.equal((await handle(new Request('https://c.test/r', { headers: { Authorization: 'Bearer ' } }), none.env)).status, 404);
});
test('the root says what this is; any other address is 404', async () => {
  const { env } = makeEnv();
  const root = await handle(new Request('https://c.test/'), env);
  assert.equal(root.status, 200);
  assert.match(await root.text(), /No cookies, no personal data, no IP address kept/);
  for (const p of ['/x', '/e/', '/admin', '/r/x']) assert.equal((await handle(new Request('https://c.test' + p), env)).status, 404, p);
});

// ---- the deploy file and the handler agree
test('wrangler.jsonc names the Worker, the Durable Object and the two site origins the handler allows', () => {
  const text = fs.readFileSync(path.join(HERE, '..', 'wrangler.jsonc'), 'utf8');
  const cfg = JSON.parse(text.replace(/^\s*\/\/.*$/gm, ''));
  assert.equal(cfg.name, 'qm-counter');
  assert.equal(cfg.observability.enabled, false, 'no request logs');
  assert.deepEqual(cfg.durable_objects.bindings, [{ name: 'COUNTER', class_name: 'Counter' }]);
  assert.deepEqual(cfg.migrations, [{ tag: 'v1', new_sqlite_classes: ['Counter'] }]);
  assert.equal(cfg.vars.ALLOWED_ORIGINS, 'https://www.getquotationmaker.com,https://getquotationmaker.com');
  assert.match(fs.readFileSync(path.join(HERE, '..', 'handler.js'), 'utf8'), /DEFAULT_ORIGINS = 'https:\/\/www\.getquotationmaker\.com,https:\/\/getquotationmaker\.com'/);
});
