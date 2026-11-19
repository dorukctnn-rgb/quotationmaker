// Run: node --test accept-worker/test/accept.test.mjs
// The storage rules of the acceptance links (core.js) on node:sqlite, the Worker's addresses (handler.js) with the core standing in for
// the Durable Object, and the e-mail sender (mail.js) with a stand-in for Forward Email. Nothing real is called.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { AcceptCore, newId, cleanSnapshot, totalsOf, ID_RE, KEEP_MS, DAY, MAX_SNAPSHOT_BYTES, MAX_LINKS_PER_DAY } from '../core.js';
import { forwardEmailSender, acceptedMail } from '../mail.js';
import { handle } from '../handler.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const START = Date.parse('2026-11-19T12:00:00Z');
const ENT = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
const ENT2 = '0f9e8d7c6b5a49382716f5e4d3c2b1a0';
const SECRET = 's'.repeat(64);
const SELLER = 'seller@harper.example';

function makeCore({ mail = null, limits = {}, start = START, random } = {}) {
  const db = new DatabaseSync(':memory:');
  const exec = (q, ...p) => { const st = db.prepare(q); return /^\s*SELECT/i.test(q) ? st.all(...p) : (st.run(...p), []); };
  const txn = fn => { db.exec('BEGIN'); try { const r = fn(); db.exec('COMMIT'); return r; } catch (e) { db.exec('ROLLBACK'); throw e; } };
  const clock = { t: start };
  const core = new AcceptCore(exec, txn, { now: () => clock.t, mail, limits, random, siteUrl: 'https://www.getquotationmaker.com' });
  return { core, clock, db };
}
const quote = (o = {}) => ({
  fromName: 'Harper Fencing Ltd', fromEmail: 'hello@harper.example', fromAddress: '12 High Street\nLeeds LS1 4AB',
  toName: 'Test Client', toEmail: 'client@example.com', toAddress: 'Site address',
  quoteNumber: 'Q-014', quoteDate: '2026-11-19', validUntil: '2026-12-19',
  notes: 'Deposit 30%. Balance on completion.', items: [{ desc: 'Replace 12 m of garden fence', qty: 12, rate: 95 }, { desc: 'Gate', qty: 1, rate: 240 }],
  currency: 'GBP', taxRate: 20, taxLabel: 'VAT', discount: 10, discountType: 'percent', color: '#0f4c81', logo: '', ...o,
});
const png = n => 'data:image/png;base64,' + 'A'.repeat(n);
const make = (core, o = {}) => core.create({ entitlement: ENT, snapshot: quote(), ...o });
const sender = (result = 'sent') => { const sent = []; return { sent, send: async m => { sent.push(m); if (result === 'throw') throw new Error('network'); return result; } }; };
const notifyOf = (db, id) => db.prepare('SELECT notify FROM links WHERE id = ?').get(id).notify;

// ---- codes
test('a code is 26 characters of a-z and 2-7 made from all 16 random bytes, and a thousand of them are all different', () => {
  const seen = new Set();
  for (let i = 0; i < 1000; i++) { const id = newId(); assert.match(id, ID_RE); seen.add(id); }
  assert.equal(seen.size, 1000);
  const a = Uint8Array.from({ length: 16 }, (_, i) => i), b = Uint8Array.from(a); b[15] ^= 1;
  assert.notEqual(newId(() => a), newId(() => b), 'the last byte counts');
  const c = Uint8Array.from(a); c[0] ^= 1;
  assert.notEqual(newId(() => a), newId(() => c), 'the first byte counts');
  assert.equal(newId(() => new Uint8Array(16)), 'a'.repeat(26));
});

// ---- create
test('create keeps a snapshot, gives a client code and a different status code, and the link lives 90 days', () => {
  const { core } = makeCore();
  const r = make(core);
  assert.match(r.id, ID_RE); assert.match(r.st, ID_RE);
  assert.notEqual(r.id, r.st);
  assert.equal(r.expires, START + 90 * DAY);
  assert.equal(KEEP_MS, 90 * DAY);
  const v = core.view(r.id);
  assert.equal(v.state, 'sent');
  assert.equal(v.quote.quoteNumber, 'Q-014');
  assert.equal(v.quote.items.length, 2);
  assert.equal(v.expires, r.expires);
});
test('the snapshot keeps only the fields the PDF uses; anything else sent along is dropped', () => {
  const { core } = makeCore();
  const r = make(core, { snapshot: { ...quote(), ip: '203.0.113.9', userAgent: 'x', password: 'hunter2' } });
  const s = core.view(r.id).quote;
  assert.deepEqual(Object.keys(s).sort(), Object.keys(cleanSnapshot(quote())).sort());
  assert.equal(JSON.stringify(s).includes('203.0.113.9'), false);
  assert.equal(JSON.stringify(s).includes('hunter2'), false);
});
test('nothing about the client or the sender\'s device has a column: no IP address, no user agent, no cookie', () => {
  const { db } = makeCore();
  const cols = db.prepare('PRAGMA table_info(links)').all().map(c => c.name);
  assert.deepEqual(cols, ['id', 'st', 'ent', 'created', 'expires', 'snapshot', 'size', 'first_view', 'accepted', 'a_name', 'a_note', 'notify']);
  for (const t of db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all()) {
    for (const c of db.prepare(`PRAGMA table_info(${t.name})`).all()) assert.doesNotMatch(c.name, /(^|_)(ip|ua|agent|cookie|device|addr|address|host|country)($|_)/i, t.name + '.' + c.name);
  }
});
test('a missing or malformed entitlement or snapshot is refused before anything is stored (a free visitor has none)', () => {
  const { core, db } = makeCore();
  for (const ent of [undefined, null, '', 'x', ENT.toUpperCase(), ENT + '0', '../../etc/passwd']) assert.deepEqual(core.create({ entitlement: ent, snapshot: quote() }), { error: 'bad_request' }, String(ent));
  for (const snap of [undefined, null, 'x', 7, [], [quote()]]) assert.deepEqual(core.create({ entitlement: ENT, snapshot: snap }), { error: 'bad_request' }, String(snap));
  assert.equal(db.prepare('SELECT COUNT(*) AS c FROM links').get().c, 0);
});
test('the totals are worked out the way the PDF works them out', () => {
  const s = cleanSnapshot(quote());
  const t = totalsOf(s);
  const r2 = n => Math.round(n * 100) / 100;
  assert.equal(r2(t.sub), 1380); assert.equal(r2(t.disc), 138); assert.equal(r2(t.tax), 248.4); assert.equal(r2(t.total), 1490.4);
  const { core } = makeCore();
  const r = make(core);
  assert.equal(r2(core.status([r.st]).items[0].quote.total), 1490.4);
});

// ---- view
test('opening the link counts as viewed only when the site says so (a crawler or a preview does not), and the first time stays', () => {
  const { core, clock } = makeCore();
  const r = make(core);
  assert.equal(core.view(r.id).state, 'sent');
  assert.equal(core.view(r.id, { mark: false }).state, 'sent');
  clock.t += 5 * 60 * 1000;
  const first = core.view(r.id, { mark: true });
  assert.equal(first.state, 'viewed'); assert.equal(first.firstView, START + 5 * 60 * 1000);
  clock.t += DAY;
  assert.equal(core.view(r.id, { mark: true }).firstView, START + 5 * 60 * 1000, 'the first time stays');
  assert.equal(core.status([r.st]).items[0].state, 'viewed');
});
test('an unknown or malformed code finds nothing; the client code and the status code are not interchangeable', () => {
  const { core } = makeCore();
  const r = make(core);
  for (const bad of ['', 'x', 'A'.repeat(26), 'a'.repeat(25), 'a'.repeat(27), '../x', "a'; DROP TABLE links;--", newId()]) assert.deepEqual(core.view(bad), { error: 'not_found' }, bad);
  assert.deepEqual(core.view(r.st), { error: 'not_found' }, 'the status code does not open the client page');
  assert.equal(core.status([r.id]).items[0].state, 'gone', 'the client code does not show the status');
  assert.deepEqual(core.status(['x', null, 7, {}]).items, [{ state: 'gone' }, { state: 'gone' }, { state: 'gone' }, { state: 'gone' }]);
});

// ---- accept
test('accept records the typed name, the note and the time (UTC) and nothing else', async () => {
  const { core, clock, db } = makeCore();
  const r = make(core);
  clock.t += 3 * 3600 * 1000;
  const a = await core.accept(r.id, { name: '  Jordan   Avery ', note: 'Start after the 3rd please.', confirm: true });
  assert.equal(a.ok, true); assert.equal(a.already, false);
  assert.deepEqual(a.accepted, { at: START + 3 * 3600 * 1000, name: 'Jordan Avery', note: 'Start after the 3rd please.' });
  const row = db.prepare('SELECT * FROM links WHERE id = ?').get(r.id);
  assert.equal(row.accepted, START + 3 * 3600 * 1000); assert.equal(row.a_name, 'Jordan Avery');
  const s = core.status([r.st]).items[0];
  assert.equal(s.state, 'accepted'); assert.deepEqual(s.accepted, a.accepted);
  assert.equal(core.view(r.id).state, 'accepted');
  assert.equal(core.view(r.id).firstView, START + 3 * 3600 * 1000, 'an acceptance counts as viewed');
});
test('accept needs the confirmation and a real name; the note is optional and capped', async () => {
  const { core } = makeCore();
  const r = make(core);
  assert.deepEqual(await core.accept(r.id, { name: 'Jordan Avery', confirm: false }), { error: 'confirm' });
  assert.deepEqual(await core.accept(r.id, { name: 'Jordan Avery' }), { error: 'confirm' });
  assert.deepEqual(await core.accept(r.id, { name: 'Jordan Avery', confirm: 'true' }), { error: 'confirm' }, 'only a real yes');
  for (const name of ['', ' ', 'J', '12345', '!!!', 'x'.repeat(101), undefined, null, 7, {}]) assert.deepEqual(await core.accept(r.id, { name, confirm: true }), { error: 'name' }, String(name));
  assert.equal(core.view(r.id).state, 'sent', 'nothing was recorded');
  const long = await core.accept(r.id, { name: 'Zoë Ñandú-Øverland', note: 'n'.repeat(5000), confirm: true });
  assert.equal(long.ok, true); assert.equal(long.accepted.name, 'Zoë Ñandú-Øverland'); assert.equal(long.accepted.note.length, 1000);
  const c2 = makeCore();
  const r2 = make(c2.core);
  assert.equal((await c2.core.accept(r2.id, { name: 'Jo Li', confirm: true })).accepted.note, '', 'the note is optional');
});
test('a second press gives back the first acceptance and changes nothing', async () => {
  const { core, clock } = makeCore();
  const r = make(core);
  await core.accept(r.id, { name: 'First Person', note: 'one', confirm: true });
  clock.t += 3600 * 1000;
  const again = await core.accept(r.id, { name: 'Second Person', note: 'two', confirm: true });
  assert.equal(again.already, true);
  assert.equal(again.accepted.name, 'First Person'); assert.equal(again.accepted.note, 'one'); assert.equal(again.accepted.at, START);
  assert.equal(core.status([r.st]).items[0].accepted.name, 'First Person');
});
test('an acceptance after the valid-until date is flagged for the sender', async () => {
  const { core, clock } = makeCore();
  const a = make(core, { snapshot: quote({ validUntil: '2026-11-25' }) });
  const b = make(core, { snapshot: quote({ validUntil: '2026-11-25' }) });
  const c = make(core, { snapshot: quote({ validUntil: '' }) });
  await core.accept(a.id, { name: 'On Time', confirm: true });
  clock.t = Date.parse('2026-11-26T09:00:00Z');
  await core.accept(b.id, { name: 'Too Late', confirm: true });
  await core.accept(c.id, { name: 'No Date', confirm: true });
  assert.equal(core.status([a.st]).items[0].late, false);
  assert.equal(core.status([b.st]).items[0].late, true);
  assert.equal(core.status([c.st]).items[0].late, false);
});

// ---- expiry
test('after 90 days the link is gone: it cannot be opened or accepted, the status says gone, and the next purge deletes everything it held', async () => {
  const { core, clock, db } = makeCore();
  const a = make(core), b = make(core);
  await core.accept(b.id, { name: 'Will Be Deleted', note: 'a note', confirm: true });
  clock.t = START + 90 * DAY - 1;
  assert.equal(core.view(a.id).state, 'sent', 'one millisecond before the end it still opens');
  clock.t = START + 90 * DAY;
  assert.deepEqual(core.view(a.id), { error: 'expired' });
  assert.deepEqual(await core.accept(a.id, { name: 'Late Client', confirm: true }), { error: 'expired' });
  assert.deepEqual(core.status([a.st, b.st]).items, [{ state: 'gone' }, { state: 'gone' }]);
  core.purge();
  assert.equal(db.prepare('SELECT COUNT(*) AS c FROM links').get().c, 0);
  assert.deepEqual(core.view(a.id), { error: 'not_found' });
});
test('purge keeps links that have not expired', () => {
  const { core, clock } = makeCore();
  const a = make(core);
  clock.t += 89 * DAY;
  const b = make(core);
  clock.t += 2 * DAY;
  core.purge();
  assert.deepEqual(core.view(a.id), { error: 'not_found' });
  assert.equal(core.view(b.id).state, 'sent');
});

// ---- limits
test('one purchase can make 30 links in any 24 hours, the 31st is refused with the time to wait, and another purchase is not affected', () => {
  const { core, clock } = makeCore();
  assert.equal(MAX_LINKS_PER_DAY, 30);
  for (let i = 0; i < 30; i++) { assert.ok(make(core).id, 'link ' + (i + 1)); clock.t += 60 * 1000; }
  const no = make(core);
  assert.equal(no.error, 'rate_limited');
  assert.equal(no.retryAfter, Math.ceil((START + DAY - clock.t) / 1000), 'until the oldest link is 24 hours old');
  assert.ok(make(core, { entitlement: ENT2 }).id, 'another entitlement');
  clock.t = START + DAY + 1;
  assert.ok(make(core).id, 'the window moves: the first link is more than 24 hours old');
  assert.equal(make(core).error, 'rate_limited', 'but only one place was free');
});
test('a refused or failed attempt does not use up the day', () => {
  const { core } = makeCore();
  const huge = quote({ notes: 'x'.repeat(5000), items: Array.from({ length: 200 }, () => ({ desc: 'd'.repeat(1000), qty: 1, rate: 1 })) });
  for (let i = 0; i < 40; i++) assert.equal(make(core, { snapshot: huge }).error, 'too_large');
  for (let i = 0; i < 40; i++) assert.equal(core.create({ entitlement: 'nope', snapshot: quote() }).error, 'bad_request');
  assert.ok(make(core).id);
});
test('everyone together is stopped at the daily and the stored-size limits', () => {
  const day = makeCore({ limits: { perDayAll: 3 } });
  for (let i = 0; i < 3; i++) assert.ok(make(day.core, { entitlement: String(i).repeat(32) }).id);
  assert.equal(make(day.core, { entitlement: '9'.repeat(32) }).error, 'busy');
  const one = JSON.stringify(cleanSnapshot(quote())).length;
  const big = makeCore({ limits: { storedBytes: Math.round(one * 1.5) } });
  assert.ok(make(big.core).id);
  assert.equal(make(big.core, { entitlement: ENT2 }).error, 'busy', 'a second snapshot does not fit in one and a half snapshots of room');
  big.clock.t += 91 * DAY; big.core.purge();
  assert.ok(make(big.core).id, 'room again after the purge');
});

// ---- size cap
test('the snapshot is capped at 200 KB with the logo included: just under goes in, just over is refused', () => {
  assert.equal(MAX_SNAPSHOT_BYTES, 200000);
  const { core } = makeCore();
  const head = 'data:image/png;base64,'.length;
  const base = JSON.stringify(cleanSnapshot(quote())).length;
  const ok = make(core, { snapshot: quote({ logo: png(MAX_SNAPSHOT_BYTES - base - head - 20) }) });
  assert.ok(ok.id, 'a logo that brings the snapshot to about 199.9 KB');
  assert.equal(core.view(ok.id).quote.logo.startsWith('data:image/png;base64,'), true, 'the logo is kept');
  const over = make(core, { snapshot: quote({ logo: png(MAX_SNAPSHOT_BYTES - base - head + 10) }) });
  assert.equal(over.error, 'too_large'); assert.equal(over.max, 200000); assert.ok(over.size > 200000);
  const text = make(core, { snapshot: quote({ notes: 'é'.repeat(5000), items: Array.from({ length: 200 }, () => ({ desc: 'é'.repeat(1000), qty: 1, rate: 1 })) }) });
  assert.equal(text.error, 'too_large', 'bytes are counted, not characters');
});
test('a logo that is not a PNG or JPEG data address is dropped, not stored', () => {
  const { core } = makeCore();
  for (const logo of ['javascript:alert(1)', 'data:text/html;base64,PHNjcmlwdD4=', 'data:image/svg+xml;base64,PHN2Zz4=', 'https://evil.example/x.png', 'data:image/png;base64,AAAA"onerror="x', 'data:image/png;base64,AA AA', 7, {}]) {
    const r = make(core, { snapshot: quote({ logo }) });
    assert.equal(core.view(r.id).quote.logo, '', String(logo).slice(0, 40));
  }
  assert.equal(core.view(make(core, { snapshot: quote({ logo: 'data:image/jpeg;base64,/9j/4AAQ' }) }).id).quote.logo, 'data:image/jpeg;base64,/9j/4AAQ');
});

// ---- text and escaping
test('what is typed is kept as plain text: HTML stays as it was typed, control and direction-changing characters are removed', async () => {
  const { core } = makeCore();
  const evil = '<script>alert(1)</script><img src=x onerror=alert(2)>';
  const r = make(core, { snapshot: quote({ fromName: evil, toName: 'A\u0000B‮CD⁦E', notes: 'line 1\r\nline 2\u0007', quoteNumber: evil, items: [{ desc: evil, qty: 1, rate: 1 }], color: 'red;background:url(x)', currency: '<b>' }) });
  const s = core.view(r.id).quote;
  assert.equal(s.fromName, evil.slice(0, 150));
  assert.equal(s.toName, 'ABCDE');
  assert.equal(s.notes, 'line 1\nline 2');
  assert.equal(s.color, '#0f4c81'); assert.equal(s.currency, 'USD');
  const a = await core.accept(r.id, { name: 'Pat <b>Lee</b>', note: '<script>x</script>\u0000\nok', confirm: true });
  assert.equal(a.accepted.name, 'Pat <b>Lee</b>'); assert.equal(a.accepted.note, '<script>x</script>\nok');
});
test('the Worker only ever answers JSON or one line of plain text, never HTML, and sets no cookie', async () => {
  const { core } = makeCore();
  const env = { ACCEPT_SITE_SECRET: SECRET };
  const call = (p, body) => handle(new Request('https://qm-accept.example' + p, { method: 'POST', headers: { authorization: 'Bearer ' + SECRET }, body: JSON.stringify(body) }), env, { stub: core });
  const made = await (await call('/v1/create', { entitlement: ENT, snapshot: quote({ fromName: '<script>alert(1)</script>' }) })).json();
  const rs = [await call('/v1/view', { id: made.id }), await call('/v1/status', { codes: [made.st] }), await call('/v1/view', { id: 'x' }),
    await handle(new Request('https://qm-accept.example/'), env, { stub: core }), await handle(new Request('https://qm-accept.example/nope'), env, { stub: core })];
  for (const r of rs) {
    assert.match(r.headers.get('content-type'), /^(application\/json|text\/plain)/);
    assert.equal(r.headers.get('set-cookie'), null);
  }
  for (const r of rs.slice(0, 3)) { assert.equal(r.headers.get('x-content-type-options'), 'nosniff'); assert.equal(r.headers.get('cache-control'), 'no-store'); }
});

// ---- mail
test('the acceptance e-mail: sent once, to the typed address, with fixed text that holds no name and no note, and the address is deleted after', async () => {
  const mail = sender();
  const { core, db } = makeCore({ mail });
  const r = make(core, { notify: SELLER });
  assert.equal(notifyOf(db, r.id), SELLER);
  const a = await core.accept(r.id, { name: 'Jordan Avery', note: 'Call me on 07700 900123 or visit spam.example', confirm: true });
  assert.equal(a.mail, 'sent');
  assert.equal(mail.sent.length, 1);
  const m = mail.sent[0];
  assert.equal(m.to, SELLER); assert.equal(m.subject, 'Quote Q-014 was accepted');
  assert.ok(m.text.includes('https://www.getquotationmaker.com/quote-status#' + r.st));
  assert.equal(/Jordan|Avery|07700|spam\.example/.test(m.subject + m.text), false, 'what the client typed stays out of the e-mail');
  assert.equal(notifyOf(db, r.id), null, 'the address is deleted');
  const again = await core.accept(r.id, { name: 'Someone Else', confirm: true });
  assert.equal(again.already, true); assert.equal(mail.sent.length, 1, 'no second e-mail');
});
test('without an address, without a sender or with a refused or failing send, the acceptance is still recorded', async () => {
  const none = sender(); const a = makeCore({ mail: none });
  const r1 = make(a.core);
  assert.equal((await a.core.accept(r1.id, { name: 'No Address', confirm: true })).mail, 'none'); assert.equal(none.sent.length, 0);
  const off = makeCore({ mail: null });
  const r2 = make(off.core, { notify: SELLER });
  assert.equal((await off.core.accept(r2.id, { name: 'No Sender', confirm: true })).mail, 'off');
  assert.equal(notifyOf(off.db, r2.id), null);
  for (const result of ['refused', 'unreachable', 'throw']) {
    const c = makeCore({ mail: sender(result) });
    const r = make(c.core, { notify: SELLER });
    const out = await c.core.accept(r.id, { name: 'Mail Down', confirm: true });
    assert.equal(out.ok, true); assert.equal(out.mail, 'failed', result);
    assert.equal(c.core.status([r.st]).items[0].state, 'accepted');
    assert.equal(notifyOf(c.db, r.id), null, 'deleted even when the send failed');
  }
});
test('a notification address that is not an e-mail address is ignored, and the day has an e-mail limit', async () => {
  const mail = sender();
  const { core, db } = makeCore({ mail, limits: { mailsPerDay: 2 } });
  for (const bad of ['', 'not an address', 'a@b', 'a b@c.example', 'x@y.example\nBcc: z@z.example', '<x@y.example>', 'x@y.example,z@z.example', 'a@' + 'b'.repeat(200) + '.com', undefined, 7]) {
    const r = make(core, { notify: bad });
    assert.equal(notifyOf(db, r.id), null, String(bad).slice(0, 30));
  }
  const ids = [1, 2, 3].map(() => make(core, { entitlement: ENT2, notify: SELLER }).id);
  const out = [await core.accept(ids[0], { name: 'One One', confirm: true }), await core.accept(ids[1], { name: 'Two Two', confirm: true }), await core.accept(ids[2], { name: 'Three Three', confirm: true })];
  assert.deepEqual(out.map(x => x.mail), ['sent', 'sent', 'limit']);
  assert.equal(mail.sent.length, 2);
});
test('the e-mail text is fixed: the quote number is the only typed part and is cleaned first', () => {
  const m = acceptedMail({ number: 'Q-014 <script>\r\nBcc: x@y.z', statusUrl: 'https://www.getquotationmaker.com/quote-status#abc' });
  assert.doesNotMatch(m.subject, /[<>\r\n@:]/);
  assert.equal(/[<>]/.test(m.text), false);
  assert.equal(acceptedMail({ number: '', statusUrl: 'u' }).subject, 'Your quote was accepted');
});
test('the sender posts to Forward Email with the alias credentials, tries twice on a slow answer and never throws', async () => {
  const calls = [];
  const fetchImpl = answers => async (url, init) => { calls.push({ url, init }); const a = answers.shift(); if (a === 'throw') throw new Error('timeout'); return new Response('{}', { status: a }); };
  const send = answers => forwardEmailSender({ token: 'alias@sender.test:pw', from: 'Sender <alias@sender.test>', fetchImpl: fetchImpl(answers), pauseMs: 0 });
  const m = { to: 'a@b.example', subject: 's', text: 't' };
  assert.equal(await send([200]).send(m), 'sent');
  const c = calls[0];
  assert.equal(c.url, 'https://api.forwardemail.net/v1/emails');
  assert.equal(c.init.headers.Authorization, 'Basic ' + btoa('alias@sender.test:pw'));
  assert.deepEqual(JSON.parse(c.init.body), { from: 'Sender <alias@sender.test>', to: 'a@b.example', subject: 's', text: 't' });
  calls.length = 0;
  assert.equal(await send(['throw', 200]).send(m), 'sent'); assert.equal(calls.length, 2);
  assert.equal(await send([400]).send(m), 'refused');
  assert.equal(await send([503, 503]).send(m), 'unreachable');
});

// ---- the Worker's addresses
function world(env = { ACCEPT_SITE_SECRET: SECRET }, o = {}) {
  const w = makeCore(o);
  const call = (p, body, { method = 'POST', auth = 'Bearer ' + SECRET, raw } = {}) => handle(new Request('https://qm-accept.example' + p, {
    method, headers: auth ? { authorization: auth } : {}, ...(method === 'POST' || method === 'PUT' ? { body: raw !== undefined ? raw : JSON.stringify(body) } : {}) }), env, { stub: w.core });
  return { ...w, call };
}
test('every address needs the shared secret: without it, with a wrong one, or while none is set, nothing is read or done', async () => {
  const { call, db } = world();
  for (const auth of [null, '', 'Bearer ', 'Bearer wrong', 'Bearer ' + SECRET.slice(0, -1), 'Bearer ' + SECRET + 'x', SECRET.toUpperCase()]) {
    for (const p of ['/v1/create', '/v1/view', '/v1/accept', '/v1/status']) assert.equal((await call(p, { entitlement: ENT, snapshot: quote() }, { auth })).status, 401, p + ' ' + auth);
  }
  assert.equal(db.prepare('SELECT COUNT(*) AS c FROM links').get().c, 0);
  for (const env of [{}, { ACCEPT_SITE_SECRET: '' }]) assert.equal((await world(env).call('/v1/create', {})).status, 503);
  assert.equal((await world({ ACCEPT_SITE_SECRET: 'short' }).call('/v1/create', {}, { auth: 'Bearer short' })).status, 401, 'a short secret is never accepted');
});
test('a free visitor cannot make a link: the site sends no entitlement for them, so there is nothing to store', async () => {
  const { call, db } = world();
  for (const b of [{ snapshot: quote() }, { entitlement: '', snapshot: quote() }, { entitlement: 'free', snapshot: quote() }]) {
    const r = await call('/v1/create', b);
    assert.equal(r.status, 400); assert.deepEqual(await r.json(), { error: 'bad_request' });
  }
  assert.equal(db.prepare('SELECT COUNT(*) AS c FROM links').get().c, 0);
});
test('create, view, accept and status over the wire, with the right statuses', async () => {
  const { call } = world();
  const c = await call('/v1/create', { entitlement: ENT, snapshot: quote(), notify: '' });
  assert.equal(c.status, 200);
  const { id, st, expires } = await c.json();
  assert.match(id, ID_RE); assert.ok(expires > Date.now() - 1);
  const v = await (await call('/v1/view', { id, mark: true })).json();
  assert.equal(v.state, 'viewed'); assert.equal(v.quote.toName, 'Test Client');
  assert.equal((await call('/v1/accept', { id, name: 'Jordan Avery', confirm: false })).status, 400);
  assert.equal((await call('/v1/accept', { id, name: 'J', confirm: true })).status, 400);
  const a = await call('/v1/accept', { id, name: 'Jordan Avery', note: 'ok', confirm: true });
  assert.equal(a.status, 200); assert.equal((await a.json()).accepted.name, 'Jordan Avery');
  const s = await (await call('/v1/status', { codes: [st] })).json();
  assert.equal(s.items[0].state, 'accepted'); assert.equal(s.items[0].quote.number, 'Q-014');
  assert.equal((await call('/v1/view', { id: 'a'.repeat(26) })).status, 404);
  assert.equal((await call('/v1/accept', { id: 'a'.repeat(26), name: 'Jordan Avery', confirm: true })).status, 404);
});
test('an expired link answers 410 and the limits answer 429 with Retry-After and 413 for a snapshot that is too big', async () => {
  const { call, clock } = world(undefined, { start: Date.now() });
  const made = await (await call('/v1/create', { entitlement: ENT, snapshot: quote() })).json();
  clock.t += 91 * DAY;
  assert.equal((await call('/v1/view', { id: made.id })).status, 410);
  assert.equal((await call('/v1/accept', { id: made.id, name: 'Late Client', confirm: true })).status, 410);
  const w = world();
  for (let i = 0; i < 30; i++) assert.equal((await w.call('/v1/create', { entitlement: ENT, snapshot: quote() })).status, 200);
  const limited = await w.call('/v1/create', { entitlement: ENT, snapshot: quote() });
  assert.equal(limited.status, 429); assert.ok(Number(limited.headers.get('retry-after')) > 0);
  const base = JSON.stringify(cleanSnapshot(quote())).length;
  const big = await world().call('/v1/create', { entitlement: ENT, snapshot: quote({ logo: png(MAX_SNAPSHOT_BYTES - base) }) });
  assert.equal(big.status, 413); assert.equal((await big.json()).error, 'too_large');
});
test('requests that are not what the site sends are refused: wrong method, body too large, not JSON, unknown address', async () => {
  const { call } = world();
  assert.equal((await call('/v1/create', null, { method: 'GET' })).status, 405);
  assert.equal((await call('/v1/view', null, { method: 'PUT', raw: '{}' })).status, 405);
  assert.equal((await call('/v1/view', { id: 'x'.repeat(9000) })).status, 413, 'a small address takes a small body');
  assert.equal((await call('/v1/create', { entitlement: ENT, snapshot: { notes: 'x'.repeat(280000) } })).status, 413);
  assert.equal((await call('/v1/create', null, { raw: 'not json' })).status, 400);
  assert.equal((await call('/v1/create', null, { raw: '[1]' })).status, 400);
  assert.equal((await call('/v1/create', null, { raw: 'null' })).status, 400);
  assert.equal((await call('/v1/elsewhere', {})).status, 404);
  const root = await handle(new Request('https://qm-accept.example/'), { ACCEPT_SITE_SECRET: SECRET }, { stub: null });
  assert.equal(root.status, 200); assert.match(await root.text(), /qm-accept/);
  assert.equal((await handle(new Request('https://qm-accept.example/admin'), {}, { stub: null })).status, 404);
});

// ---- the deployment file
test('wrangler.jsonc: one SQLite Durable Object, no request logs, no KV or D1, and the deploy steps say Worker first and never print the secret', () => {
  const src = fs.readFileSync(path.join(HERE, '..', 'wrangler.jsonc'), 'utf8');
  const cfg = JSON.parse(src.split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n'));
  assert.equal(cfg.name, 'qm-accept');
  assert.deepEqual(cfg.durable_objects.bindings, [{ name: 'ACCEPT', class_name: 'Accept' }]);
  assert.deepEqual(cfg.migrations, [{ tag: 'v1', new_sqlite_classes: ['Accept'] }]);
  assert.equal(cfg.observability.enabled, false);
  assert.equal(cfg.kv_namespaces, undefined); assert.equal(cfg.d1_databases, undefined);
  assert.match(src, /NOT DEPLOYED/); assert.match(src, /THIS Worker first, then the site/);
  assert.doesNotMatch(src, /console\.log|echo /);
});
test('the Durable Object class named in wrangler.jsonc is the one index.js exports', () => {
  const idx = fs.readFileSync(path.join(HERE, '..', 'index.js'), 'utf8');
  assert.match(idx, /export class Accept extends DurableObject/);
  assert.match(idx, /env\.ACCEPT\.get\(env\.ACCEPT\.idFromName\('main'\)\)/);
});

test('a field that is an object or an array is nothing, not the text "[object Object]"', () => {
  const { core } = makeCore();
  const r = make(core, { snapshot: quote({ fromName: { a: 1 }, toName: ['x', 'y'], notes: {}, quoteNumber: [], items: [{ desc: {}, qty: 'abc', rate: [5] }], taxLabel: {} }) });
  const s = core.view(r.id).quote;
  assert.equal(s.fromName, ''); assert.equal(s.toName, ''); assert.equal(s.notes, '');
  assert.equal(s.quoteNumber, 'Q-001', 'the usual fallback'); assert.equal(s.taxLabel, 'Tax');
  assert.deepEqual(s.items, [{ desc: '', qty: 0, rate: 5 }]);
  assert.equal(JSON.stringify(s).includes('[object'), false);
});
