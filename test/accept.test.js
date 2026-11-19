// Tests of the quote acceptance links (run: npm test). No network: the Worker qm-accept (its real handler and core on node:sqlite), the
// Pro key check and Forward Email are stood in for inside this process (test/helpers/accept-world.cjs); the app runs on a free local port.
//  1. A free visitor cannot make a link: the site answers 402 and the Worker is never asked. A Pro visitor can; the Worker gets an
//     anonymous code and the shared secret, never the Pro key.
//  2. The limits reach the visitor in plain words (30 a day per purchase, about 200 KB, a Worker that is down or switched off).
//  3. The client's page: the quote, noindex, no referrer, no script, never cached, not counted; everything typed is escaped; "viewed" is
//     recorded for people and not for crawlers; the PDF; the form (name, confirmation, note), twice, wrongly, after 90 days.
//  4. The sender's side: the status call, the status page, the e-mail (once, nothing the client typed in it).
//  5. The privacy page says what is stored; the new pages are not in the sitemap; the pages that carry the search traffic do not
//     mention the feature in their HTML.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const app = require('../server');
const accept = require('../lib/accept');
const { installWorld, keyN, SECRET } = require('./helpers/accept-world.cjs');

const ROOT = path.join(__dirname, '..');
const KEY1 = keyN(1), KEY2 = keyN(2);
const ID = /^[a-z2-7]{26}$/;
const quote = (o = {}) => ({
  fromName: 'Harper Fencing Ltd', fromEmail: 'hello@harper.example', fromAddress: '12 High Street\nLeeds LS1 4AB',
  toName: 'Test Client', toEmail: 'client@example.com', toAddress: 'Site address',
  quoteNumber: 'Q-014', quoteDate: '2026-11-19', validUntil: '2099-12-19',
  notes: 'Deposit 30%.\nBalance on completion.', items: [{ desc: 'Replace 12 m of garden fence', qty: 12, rate: 95 }, { desc: 'Gate', qty: 1, rate: 240 }],
  currency: 'GBP', taxRate: 20, taxLabel: 'VAT', discount: 10, discountType: 'percent', color: '#0f4c81', logo: '', ...o,
});
const png = n => 'data:image/png;base64,' + 'A'.repeat(n);

let world, server, base;
test.before(async () => {
  world = await installWorld();
  await new Promise(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
  base = 'http://127.0.0.1:' + server.address().port;
});
test.after(async () => { await new Promise(resolve => server.close(resolve)); world.restore(); });

const call = (method, p, { body, key, headers = {}, form } = {}) => fetch(base + p, {
  method, redirect: 'manual',
  headers: { ...(key ? { Cookie: 'qm_license=' + key } : {}), ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(form ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}), ...headers },
  body: form ? new URLSearchParams(form).toString() : (body !== undefined ? JSON.stringify(body) : undefined),
});
const create = async (q = quote(), { key = KEY1, notify = '' } = {}) => {
  const r = await call('POST', '/accept/create', { key, body: { quote: q, notify } });
  return { r, j: await r.json() };
};
const codes = j => ({ id: j.clientUrl.split('/q/')[1], st: j.statusToken });
const page = async (p, o) => { const r = await call('GET', p, o); return { r, t: await r.text() }; };
const row = id => world.db.prepare('SELECT * FROM links WHERE id = ?').get(id);
const accepted = (id, form) => call('POST', '/q/' + id + '/accept', { form });

// ---- 1. who can make a link
test('a free visitor cannot make a link: 402, and the Worker is not asked', async () => {
  const before = world.worker.length;
  for (const key of ['', 'not-a-key', keyN(9) + 'x']) {
    const { r, j } = await create(quote(), { key });
    assert.strictEqual(r.status, 402, String(key));
    assert.match(j.error, /part of Pro/);
  }
  world.pro = 404;
  try { assert.strictEqual((await create(quote(), { key: keyN(7) })).r.status, 402, 'a key the Pro service does not know'); } finally { world.pro = 200; }
  assert.strictEqual(world.worker.length, before, 'no call to the Worker');
});
test('a Pro visitor gets a private link and a status link; the Worker is given an anonymous code and the secret, never the Pro key', async () => {
  const before = world.worker.length;
  const { r, j } = await create();
  assert.strictEqual(r.status, 200); assert.strictEqual(j.ok, true);
  const { id, st } = codes(j);
  assert.match(id, ID); assert.match(st, ID); assert.notStrictEqual(id, st);
  assert.strictEqual(j.clientUrl, 'https://www.getquotationmaker.com/q/' + id);
  assert.strictEqual(j.statusUrl, 'https://www.getquotationmaker.com/quote-status#' + st);
  assert.ok(j.expires > Date.now() + 89 * 864e5 && j.expires < Date.now() + 91 * 864e5, 'expires in 90 days');
  const calls = world.worker.slice(before);
  assert.strictEqual(calls.length, 1); assert.strictEqual(calls[0].path, '/v1/create');
  assert.strictEqual(calls[0].headers.authorization, 'Bearer ' + SECRET);
  assert.match(JSON.parse(calls[0].body).entitlement, /^[0-9a-f]{32}$/);
  for (const c of world.worker) assert.ok(!JSON.stringify(c).toLowerCase().includes(KEY1.toLowerCase()), 'the Pro key is in no call to the Worker');
  assert.ok(!JSON.stringify(row(id)).toLowerCase().includes(KEY1.toLowerCase()), 'nor in what is stored');
});
test('the anonymous code is the same for the same purchase (whatever the case) and different for another, and cannot be turned back into the key', async () => {
  const a = codes((await create(quote(), { key: KEY1 })).j), b = codes((await create(quote(), { key: KEY1.toUpperCase() })).j), c = codes((await create(quote(), { key: KEY2 })).j);
  assert.strictEqual(row(a.id).ent, row(b.id).ent);
  assert.notStrictEqual(row(a.id).ent, row(c.id).ent);
  assert.ok(!row(a.id).ent.includes(KEY1.slice(5, 15)));
  const req = key => ({ cookies: { qm_license: key } });
  assert.strictEqual(accept.entitlement(req(KEY1)), row(a.id).ent);
  assert.strictEqual(accept.entitlement({ cookies: {} }), '');
  const old = process.env.QM_ACCEPT_SECRET;
  process.env.QM_ACCEPT_SECRET = 'another-secret-'.padEnd(48, 'y');
  try { assert.notStrictEqual(accept.entitlement(req(KEY1)), row(a.id).ent, 'the secret is part of the code'); } finally { process.env.QM_ACCEPT_SECRET = old; }
});
test('a request from another site, or with nothing to send, is refused before the Worker is asked', async () => {
  const before = world.worker.length;
  const x = await call('POST', '/accept/create', { key: KEY1, body: { quote: quote() }, headers: { Origin: 'https://evil.example' } });
  assert.strictEqual(x.status, 403);
  const y = await call('POST', '/accept/create', { key: KEY1, body: { quote: quote() }, headers: { 'Sec-Fetch-Site': 'cross-site' } });
  assert.strictEqual(y.status, 403);
  const z = await call('POST', '/accept/create', { key: KEY1, body: { quote: quote({ items: [{ desc: '  ', qty: 1, rate: 0 }] }) } });
  assert.strictEqual(z.status, 400); assert.match((await z.json()).error, /at least one line item/);
  const w = await call('POST', '/accept/create', { key: KEY1, body: {} });
  assert.strictEqual(w.status, 400);
  assert.strictEqual(world.worker.length, before);
  const ok = await call('POST', '/accept/create', { key: KEY1, body: { quote: quote() }, headers: { Origin: base } });
  assert.strictEqual(ok.status, 200, 'the site\'s own origin is fine');
});

// ---- 2. the limits, in plain words
test('30 links a day per purchase: the 31st says so and another purchase is not affected', async () => {
  const k = keyN(30), other = keyN(31);
  for (let i = 0; i < 30; i++) assert.strictEqual((await create(quote(), { key: k })).r.status, 200, 'link ' + (i + 1));
  const { r, j } = await create(quote(), { key: k });
  assert.strictEqual(r.status, 429); assert.match(j.error, /30 acceptance links in the last 24 hours/); assert.match(j.error, /about \d+ hours?\./);
  assert.strictEqual((await create(quote(), { key: other })).r.status, 200);
});
test('a quote over 200 KB (the logo is the usual cause) is refused with a message that says what to do', async () => {
  const { r, j } = await create(quote({ logo: png(210000) }), { key: keyN(40) });
  assert.strictEqual(r.status, 413); assert.match(j.error, /about 200 KB/); assert.match(j.error, /smaller logo/);
  assert.strictEqual((await create(quote({ logo: png(150000) }), { key: keyN(40) })).r.status, 200, 'a logo that fits');
});
test('with the Worker down or the feature switched off, the answer is plain and nothing else breaks', async () => {
  world.down = true;
  try {
    const { r, j } = await create(quote(), { key: keyN(41) });
    assert.strictEqual(r.status, 503); assert.match(j.error, /not available right now/);
    const s = await call('POST', '/accept/status', { body: { codes: ['a'.repeat(26)] } });
    assert.strictEqual(s.status, 503);
  } finally { world.down = false; }
  const { j } = await create(quote(), { key: keyN(42) });
  const { id } = codes(j);
  const secret = process.env.QM_ACCEPT_SECRET;
  delete process.env.QM_ACCEPT_SECRET;
  try {
    const off = await create(quote(), { key: keyN(43) });
    assert.strictEqual(off.r.status, 503); assert.match(off.j.error, /not switched on/);
    const p = await page('/q/' + id);
    assert.strictEqual(p.r.status, 503); assert.match(p.t, /Not available right now/);
    assert.strictEqual((await call('GET', '/')).status, 200, 'the rest of the site is unaffected');
  } finally { process.env.QM_ACCEPT_SECRET = secret; }
});

// ---- 3. the client's page
test('the client\'s page shows the quote and is private: noindex, no referrer, never cached, no script, not counted', async () => {
  const { j } = await create(quote({ logo: 'data:image/png;base64,iVBORw0KGgo=' }));
  const { id, st } = codes(j);
  const { r, t } = await page('/q/' + id);
  assert.strictEqual(r.status, 200);
  assert.match(r.headers.get('x-robots-tag'), /noindex/); assert.match(r.headers.get('x-robots-tag'), /nofollow/);
  assert.strictEqual(r.headers.get('referrer-policy'), 'no-referrer');
  assert.match(r.headers.get('cache-control'), /no-store/);
  const csp = r.headers.get('content-security-policy');
  assert.match(csp, /default-src 'none'/); assert.doesNotMatch(csp, /script-src/); assert.match(csp, /frame-ancestors 'none'/);
  assert.match(t, /<meta name="robots" content="noindex, nofollow, noarchive">/);
  assert.match(t, /<meta name="referrer" content="no-referrer">/);
  assert.doesNotMatch(t, /<script/i, 'no script on the page'); assert.doesNotMatch(t, /count\.js/); assert.doesNotMatch(t, /<link rel="canonical"/);
  assert.doesNotMatch(t, /https?:\/\/(?!www\.getquotationmaker\.com)/, 'no address outside the site is loaded or linked');
  assert.ok(!t.includes(st), 'the status code is not on the client\'s page');
  for (const s of ['Quote Q-014 from Harper Fencing Ltd', 'Replace 12 m of garden fence', '£1,380.00', '£138.00', 'VAT (20%)', '£248.40', '£1,490.40', 'Valid until', 'Deposit 30%.', 'Test Client', 'href="/q/' + id + '/pdf"', 'src="data:image/png;base64,iVBORw0KGgo="']) assert.ok(t.includes(s), s);
  assert.match(t, /Accept the quote for £1,490\.40/);
  assert.match(t, /name="name"[^>]*required/); assert.match(t, /name="confirm"[^>]*required/);
  assert.ok(r.headers.get('set-cookie') === null);
});
test('everything typed is escaped on the page: no markup, no script, no style injection', async () => {
  const evil = '<script>alert(1)</script><img src=x onerror=alert(2)>"\'';
  const { j } = await create(quote({ fromName: evil, fromEmail: evil, fromAddress: evil, toName: evil, toEmail: evil, toAddress: evil, quoteNumber: evil, notes: evil, items: [{ desc: evil, qty: 1, rate: 5 }],
    taxLabel: evil, color: 'red;background:url(//evil.example/x)', currency: 'ZZ"><b>', logo: 'javascript:alert(1)' }), { key: keyN(50) });
  const { id } = codes(j);
  const { t } = await page('/q/' + id);
  assert.ok(!t.includes('<script>alert'), 'no raw script tag from the quote');
  assert.ok(!t.includes('<img src=x'), 'no raw image tag');
  assert.ok(!/onerror=alert/.test(t.replace(/&lt;img src=x onerror=alert\(2\)&gt;/g, '')), 'the attribute text only appears inside escaped text');
  assert.ok(t.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(!t.includes('evil.example'), 'a colour or currency cannot bring in a style or address');
  assert.ok(!t.includes('javascript:'), 'a logo that is not an image data address is dropped');
  const title = t.match(/<title>([^<]*)<\/title>/)[1];
  assert.ok(!title.includes('<') && title.includes('&lt;script&gt;'));
  // what the client types when accepting is escaped too, on the page and in the sender's data
  const f = await accepted(id, { name: 'Pat <b>Lee</b>', note: '<script>x()</script>"><i>', confirm: 'on' });
  assert.strictEqual(f.status, 303);
  const after = (await page('/q/' + id)).t;
  assert.ok(!after.includes('<b>Lee</b>') && !after.includes('<script>x()') && !after.includes('<i>'));
  assert.ok(after.includes('Pat &lt;b&gt;Lee&lt;/b&gt;') && after.includes('&lt;script&gt;x()&lt;/script&gt;'));
});
test('opening the link counts as "viewed" for a person and not for a crawler, a link preview or a HEAD request', async () => {
  const { j } = await create(quote(), { key: keyN(51) });
  const { id } = codes(j);
  const state = () => world.core.view(id).state;
  for (const ua of ['Googlebot/2.1', 'Slackbot-LinkExpanding 1.0', 'Mozilla/5.0 (compatible; bingbot/2.0)', 'curl/8.0', 'Microsoft Office SafeLinks Protection', 'WhatsApp link preview']) {
    assert.strictEqual((await call('GET', '/q/' + id, { headers: { 'User-Agent': ua } })).status, 200);
    assert.strictEqual(state(), 'sent', ua);
  }
  await call('HEAD', '/q/' + id, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' } });
  assert.strictEqual(state(), 'sent', 'HEAD');
  await call('GET', '/q/' + id + '/pdf', { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' } });
  assert.strictEqual(state(), 'sent', 'the PDF alone does not count');
  await call('GET', '/q/' + id, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) Chrome/120 Safari/537.36' } });
  assert.strictEqual(state(), 'viewed');
});
test('the client can download the quote as a PDF: a real PDF, an attachment, private headers', async () => {
  const { j } = await create(quote({ quoteNumber: 'Q 014/<x>' }), { key: keyN(52) });
  const { id } = codes(j);
  const r = await call('GET', '/q/' + id + '/pdf');
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.headers.get('content-type'), 'application/pdf');
  assert.match(r.headers.get('content-disposition'), /^attachment; filename="quote-Q_014__x_\.pdf"$/);
  assert.match(r.headers.get('cache-control'), /no-store/); assert.match(r.headers.get('x-robots-tag'), /noindex/);
  const b = Buffer.from(await r.arrayBuffer());
  assert.strictEqual(b.slice(0, 5).toString(), '%PDF-'); assert.ok(b.length > 1500);
  assert.strictEqual((await call('GET', '/q/' + 'a'.repeat(26) + '/pdf')).status, 404);
});
test('accepting: a name, the confirmation and a note are recorded; the page then says who accepted and when', async () => {
  const { j } = await create(quote(), { key: keyN(53) });
  const { id, st } = codes(j);
  const f = await accepted(id, { name: '  Jordan   Avery ', note: 'Start after the 3rd please.', confirm: 'on' });
  assert.strictEqual(f.status, 303); assert.strictEqual(f.headers.get('location'), '/q/' + id);
  const { t } = await page('/q/' + id);
  assert.match(t, /Quote accepted/); assert.match(t, /<strong>Jordan Avery<\/strong> accepted this quote on \d{1,2} [A-Z][a-z]{2} \d{4}, \d{2}:\d{2} UTC\./);
  assert.ok(t.includes('Start after the 3rd please.'));
  assert.doesNotMatch(t, /name="confirm"/, 'the form is gone');
  const r = row(id);
  assert.strictEqual(r.a_name, 'Jordan Avery'); assert.ok(Math.abs(r.accepted - Date.now()) < 10000, 'the time is now, in UTC milliseconds');
  const cols = Object.keys(r);
  assert.deepStrictEqual(cols.filter(c => /ip|agent|cookie/i.test(c)), [], 'no column for an IP address or a browser');
  const s = await (await call('POST', '/accept/status', { body: { codes: [st] } })).json();
  assert.strictEqual(s.items[0].state, 'accepted'); assert.strictEqual(s.items[0].accepted.name, 'Jordan Avery'); assert.strictEqual(s.items[0].st, st);
});
test('a second acceptance changes nothing; a form without the tick or with a bad name is sent back with a message and what was typed', async () => {
  const { j } = await create(quote(), { key: keyN(54) });
  const { id } = codes(j);
  const noTick = await accepted(id, { name: 'Jordan Avery', note: 'my "note" <b>', confirm: '' });
  assert.strictEqual(noTick.status, 400);
  const t1 = await noTick.text();
  assert.match(t1, /Tick the box to confirm/); assert.ok(t1.includes('value="Jordan Avery"')); assert.ok(t1.includes('my &#34;note&#34; &lt;b&gt;'));
  assert.strictEqual(world.core.view(id).state, 'sent', 'nothing was recorded');
  for (const name of ['', 'J', '1234']) {
    const bad = await accepted(id, { name, confirm: 'on' });
    assert.strictEqual(bad.status, 400); assert.match(await bad.text(), /Type your full name, at least two letters/);
  }
  assert.strictEqual((await accepted(id, { name: 'First Person', note: 'one', confirm: 'on' })).status, 303);
  assert.strictEqual((await accepted(id, { name: 'Second Person', note: 'two', confirm: 'on' })).status, 303);
  const t2 = (await page('/q/' + id)).t;
  assert.ok(t2.includes('First Person') && !t2.includes('Second Person'));
  assert.strictEqual(row(id).a_name, 'First Person');
});
test('after 90 days the link says it has expired, cannot be accepted, and the sender\'s status says gone', async () => {
  const { j } = await create(quote(), { key: keyN(55) });
  const { id, st } = codes(j);
  world.offset = 91 * 864e5;
  try {
    const p = await page('/q/' + id);
    assert.strictEqual(p.r.status, 410); assert.match(p.t, /This link has expired/); assert.match(p.r.headers.get('x-robots-tag'), /noindex/);
    assert.strictEqual((await accepted(id, { name: 'Late Client', confirm: 'on' })).status, 410);
    assert.strictEqual((await call('GET', '/q/' + id + '/pdf')).status, 410);
    const s = await (await call('POST', '/accept/status', { body: { codes: [st] } })).json();
    assert.strictEqual(s.items[0].state, 'gone');
  } finally { world.offset = 0; }
});
test('a code that is not one of ours, or that nobody made, gets a plain page and nothing is asked of the Worker for the first', async () => {
  const before = world.worker.length;
  for (const p of ['/q/x', '/q/' + 'A'.repeat(25) + '0', '/q/' + 'a'.repeat(27), '/q/..%2f..%2fetc', '/q/' + 'a'.repeat(26).replace(/a/, '1')]) {
    const r = await call('GET', p);
    assert.strictEqual(r.status, 404, p); assert.match(r.headers.get('x-robots-tag'), /noindex/); assert.match(await r.text(), /This link is not valid/);
  }
  assert.strictEqual(world.worker.length, before);
  const r = await call('GET', '/q/' + 'a'.repeat(26));
  assert.strictEqual(r.status, 404);
  assert.strictEqual((await call('POST', '/q/short/accept', { form: { name: 'Jordan Avery', confirm: 'on' } })).status, 404);
});

// ---- 4. the sender
test('the status call: up to 20 codes, bad ones dropped, each answer tied to its code', async () => {
  const made = [];
  for (let i = 0; i < 3; i++) made.push(codes((await create(quote({ quoteNumber: 'Q-0' + i }), { key: keyN(60) })).j));
  await call('GET', '/q/' + made[1].id, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' } });
  await accepted(made[2].id, { name: 'Pat Doe', confirm: 'on' });
  const r = await call('POST', '/accept/status', { body: { codes: [made[0].st, 'nope', made[1].st, 7, made[2].st, made[0].id] } });
  assert.strictEqual(r.status, 200);
  assert.match(r.headers.get('cache-control'), /no-store/);
  const j = await r.json();
  assert.deepStrictEqual(j.items.map(i => [i.st, i.state]), [[made[0].st, 'sent'], [made[1].st, 'viewed'], [made[2].st, 'accepted'], ['', 'gone']].slice(0, 3).concat([[made[0].id, 'gone']]));
  assert.strictEqual(j.items[0].quote.number, 'Q-00');
  assert.deepStrictEqual((await (await call('POST', '/accept/status', { body: { codes: [] } })).json()).items, []);
  assert.deepStrictEqual((await (await call('POST', '/accept/status', { body: {} })).json()).items, []);
  const many = await (await call('POST', '/accept/status', { body: { codes: Array.from({ length: 50 }, () => made[0].st) } })).json();
  assert.strictEqual(many.items.length, 20);
});
test('the status page is private and light: noindex, no referrer, no counter, its script and nothing from the quote', async () => {
  const { r, t } = await page('/quote-status');
  assert.strictEqual(r.status, 200);
  assert.match(r.headers.get('x-robots-tag'), /noindex/); assert.strictEqual(r.headers.get('referrer-policy'), 'no-referrer'); assert.match(r.headers.get('cache-control'), /no-store/);
  assert.match(t, /<meta name="robots" content="noindex, nofollow">/); assert.doesNotMatch(t, /<link rel="canonical"/);
  assert.doesNotMatch(t, /count\.js/); assert.match(t, /<script src="\/accept-status\.js\?v=\d+" defer>/);
  assert.match(t, /Check status now/);
});
test('the acceptance e-mail goes out once, to the address the sender typed, and holds nothing the client typed', async () => {
  world.mails.length = 0;
  const { j } = await create(quote(), { key: keyN(70), notify: 'seller@harper.example' });
  const { id, st } = codes(j);
  assert.strictEqual(world.mails.length, 0, 'nothing is sent when the link is made');
  await accepted(id, { name: 'Jordan Avery', note: 'Call me on 07700 900123, spam.example', confirm: 'on' });
  assert.strictEqual(world.mails.length, 1);
  const m = world.mails[0];
  assert.strictEqual(m.to, 'seller@harper.example'); assert.strictEqual(m.subject, 'Quote Q-014 was accepted');
  assert.ok(m.text.includes('https://www.getquotationmaker.com/quote-status#' + st));
  assert.ok(!/Jordan|Avery|07700|spam\.example/.test(m.subject + m.text));
  await accepted(id, { name: 'Another Person', confirm: 'on' });
  assert.strictEqual(world.mails.length, 1, 'a second press sends nothing');
  assert.strictEqual(world.db.prepare('SELECT notify FROM links WHERE id = ?').get(id).notify, null, 'the address is gone');
  // an address that is not an address is not stored, and a failing mail service does not stop the acceptance
  const bad = codes((await create(quote(), { key: keyN(71), notify: 'x@y.example\nBcc: z@z.example' })).j);
  assert.strictEqual(world.db.prepare('SELECT notify FROM links WHERE id = ?').get(bad.id).notify, null);
  world.mailAnswer = 500;
  try {
    const down = codes((await create(quote(), { key: keyN(72), notify: 'seller@harper.example' })).j);
    assert.strictEqual((await accepted(down.id, { name: 'Jordan Avery', confirm: 'on' })).status, 303);
    assert.strictEqual(world.core.view(down.id).state, 'accepted');
  } finally { world.mailAnswer = 200; }
});

// ---- 5. the rest of the site
test('the privacy page says what is stored, for how long, who can see it, and that no IP address is kept', async () => {
  const { t } = await page('/privacy');
  assert.match(t, /<h2 id="acceptance-links">/);
  const sec = t.slice(t.indexOf('id="acceptance-links"'), t.indexOf('<h2', t.indexOf('id="acceptance-links"') + 10));
  for (const s of ['90 days', 'logo', 'name', 'note', 'IP address', 'status link', 'Cloudflare', 'Forward Email', 'local storage', 'anyone who has the client link', 'deleted']) assert.ok(sec.toLowerCase().includes(s.toLowerCase()), 'the section mentions: ' + s);
  assert.match(t, /Last updated: 19 November 2026/);
});
test('the new pages are not in the sitemap, llms.txt or robots.txt, and the pages that carry the search traffic do not mention the feature', async () => {
  const sm = (await page('/sitemap.xml')).t + (await page('/llms.txt')).t + (await page('/robots.txt')).t;
  assert.doesNotMatch(sm, /\/q\/|quote-status|acceptance link/i);
  const FROZEN = [...require('../content/frozen-pages.json').paths, ...require('../content/counter-skip.json').paths];
  for (const p of FROZEN) {
    const { t } = await page(p);
    assert.doesNotMatch(t, /qm-accept|qtAccBtn|quote-status|accept\.css|Send for acceptance/, p);
  }
});
test('the counter already takes the new place word: paywall_shown and paywall_pro_click with "accept" pass both the Worker\'s note check and the browser\'s', async () => {
  const { cleanNote } = await import('../counter-worker/core.js');
  for (const e of ['paywall_shown', 'paywall_pro_click']) assert.deepStrictEqual(cleanNote({ e, t: 'quotationmaker', p: '/quote-template-plumber', w: 'accept', s: 'google' }), { e, t: 'quotationmaker', p: '/quote-template-plumber', w: 'accept', s: 'google' });
  assert.match('accept', /^[a-z0-9][a-z0-9#._-]{0,39}$/);
  const js = fs.readFileSync(path.join(ROOT, 'public', 'tool.js'), 'utf8');
  assert.match(js, /track\('paywall_shown', 'accept'\)/); assert.match(js, /proLink\('', 'accept', 'Get Pro'\)/);
  assert.ok(!/QMCount\.track\([^)]*'(link_created|accept_created)/.test(js), 'no event name the live counter does not know');
});
