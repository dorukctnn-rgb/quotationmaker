// Tests of the page and Get Pro click counter (run: npm test). No network: the script runs in a vm sandbox with a fake document,
// location, storage and fetch exactly as browsers get it (public/count.js), and the app is started on a free local port.
// 1. The script: the kind-of-site classifier, the one-word note in session storage, the view and click notes (and only those), the
//    places it must stay silent (other hosts, automation, a page not yet shown), and that nothing it does can break a page.
// 2. The notes it sends are accepted by the Worker's own note check (counter-worker/core.js), unchanged.
// 3. The pages: the pages that carry the search traffic (content/counter-skip.json) have no trace of the counter, every other
//    page loads it once, the 404 page does not, and the privacy page says what the counter does.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const SCRIPT = fs.readFileSync(path.join(ROOT, 'public', 'count.js'), 'utf8');
const HOST = 'www.getquotationmaker.com';
const URL_E = 'https://qm-counter.railer-iot.workers.dev/e';
const PRO = 'https://dorukctn.gumroad.com/l/cjogv';

// A fake Storage (mode 'ok'), one whose methods throw, or one that throws when it is even looked at (blocked site data).
function load({ referrer = '', search = '', host = HOST, pathname = '/quote-template-plumber', session = {}, mode = 'ok', prerendering = false, visibility = 'visible',
  webdriver = false, net = 'fetch' } = {}) {
  const writes = [], calls = [], listeners = {};
  const clock = { t: 1000000 };
  let cookieReads = 0;
  const m = new Map(Object.entries(session));
  const ctx = {
    URLSearchParams, Blob, JSON, Date: { now: () => clock.t },
    location: { hostname: host, search, pathname },
    navigator: { webdriver },
    document: {
      referrer, prerendering, visibilityState: visibility,
      get cookie() { cookieReads++; return ''; },
      addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    },
  };
  ctx.window = ctx;
  if (mode === 'ok') ctx.sessionStorage = { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { writes.push([k, String(v)]); m.set(k, String(v)); } };
  else if (mode === 'methods-throw') ctx.sessionStorage = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('QuotaExceededError'); } };
  else Object.defineProperty(ctx, 'sessionStorage', { get() { throw new Error('SecurityError'); } });
  if (net === 'fetch') ctx.fetch = (url, init) => { calls.push({ url, init }); return Promise.resolve({ ok: true }); };
  else if (net === 'fetch-throws') ctx.fetch = () => { throw new Error('offline'); };
  else if (net === 'fetch-rejects') ctx.fetch = () => Promise.reject(new Error('offline'));
  else if (net === 'beacon') ctx.navigator.sendBeacon = (url, blob) => { calls.push({ url, blob, beacon: true }); return true; };
  vm.createContext(ctx);
  vm.runInContext(SCRIPT, ctx);
  return {
    api: ctx.window.QMCount, ctx, writes, calls, clock, cookieReads: () => cookieReads, store: m,
    fire(type, evt) { for (const fn of listeners[type] || []) fn(Object.assign({ type }, evt)); },
    notes: () => calls.map(c => JSON.parse(c.init ? c.init.body : '')),
  };
}
// a fake <a>, and the landmark it sits in ({tagName, id}) or a data-pro-place
function link(href, { box = null, named = '' } = {}) {
  const a = { href, closest: sel => (sel === 'a[href]' ? a : sel === '[data-pro-place]' ? (named ? { getAttribute: () => named } : null) : box) };
  return a;
}
const clickOn = (r, el, type = 'click', button = 0) => r.fire(type, { target: el, button });

// ---------------------------------------------------------------- 1. the script
const REFERRERS = [
  ['', 'direct'],
  ['https://www.google.com/', 'google'], ['https://www.google.co.uk/', 'google'], ['https://www.google.com.au/', 'google'], ['https://www.google.co.za/', 'google'],
  ['android-app://com.google.android.googlequicksearchbox/', 'google'],
  ['https://gemini.google.com/app', 'ai-assistant'], ['https://docs.google.com/document/d/x', 'referral'], ['https://google.com.evil.example/', 'referral'],
  ['https://www.bing.com/', 'bing'], ['https://duckduckgo.com/', 'other-search'], ['https://yandex.ru/', 'other-search'], ['https://search.brave.com/', 'other-search'],
  ['https://chatgpt.com/', 'ai-assistant'], ['https://www.perplexity.ai/', 'ai-assistant'], ['https://claude.ai/', 'ai-assistant'], ['https://copilot.microsoft.com/', 'ai-assistant'],
  ['https://www.pinterest.com/', 'pinterest'], ['https://www.pinterest.co.uk/', 'pinterest'], ['https://pin.it/abc', 'pinterest'],
  ['https://www.reddit.com/r/smallbusiness/', 'social'], ['https://l.facebook.com/l.php?u=x', 'social'], ['https://t.co/abc', 'social'], ['https://www.linkedin.com/', 'social'],
  ['https://user:pw@reddit.com/', 'social'], ['android-app://com.reddit.frontpage/', 'social'],
  ['https://www.etsy.com/listing/1', 'referral'], ['https://getinvoicemaker.com/', 'referral'], ['https://peakappsstudio.com/tools/', 'referral'], ['http://example.org/page', 'referral'],
  ['android-app://com.google.android.gm/', 'referral'],
  // this site and Gumroad are not a source: no word
  ['https://www.getquotationmaker.com/quote-template-plumber', ''], ['https://getquotationmaker.com/', ''], ['https://dorukctn.gumroad.com/l/cjogv', ''], ['https://gumroad.com/', ''],
  // nothing readable
  ['not a url', ''], ['ftp://files.example/', ''], ['android-app://', ''],
];
test('the classifier sorts a referrer into one of eight words, no word for this site and Gumroad, direct for none', () => {
  const r = load();
  for (const [ref, want] of REFERRERS) assert.strictEqual(r.api.classify(ref, HOST), want, JSON.stringify(ref));
});
test('a tag on the landing address names the kind of site and wins over the referrer; tags for this site or Gumroad do not count', () => {
  const r = load();
  const tag = q => r.api.fromTags(q, HOST);
  assert.strictEqual(tag('?utm_source=chatgpt.com'), 'ai-assistant');
  assert.strictEqual(tag('?utm_source=chatgpt'), 'ai-assistant');
  assert.strictEqual(tag('?ref=reddit'), 'social');
  assert.strictEqual(tag('?source=fb_ads'), 'social');
  assert.strictEqual(tag('?utm_source=newsletter'), 'referral');
  assert.strictEqual(tag('?utm_source=google'), 'google');
  assert.strictEqual(tag('?utm_source=https://www.bing.com/'), 'bing');
  assert.strictEqual(tag('?utm_source=getquotationmaker.com'), '');
  assert.strictEqual(tag('?utm_source=gumroad'), '');
  assert.strictEqual(tag('?utm_source=direct'), 'direct');
  assert.strictEqual(tag('?other=1'), '');
  assert.strictEqual(tag(''), '');
  assert.strictEqual(tag('?utm_source=chatgpt.com&ref=reddit'), 'ai-assistant', 'utm_source first, then ref, then source');
  const viaTag = load({ search: '?utm_source=chatgpt.com', referrer: 'https://www.bing.com/' });
  assert.strictEqual(viaTag.notes()[0].s, 'ai-assistant');
});

test('a page load sends one view note with the page address, no place and the word, and keeps only the word in session storage', () => {
  const r = load({ referrer: 'https://www.google.com/', search: '?email=a@b.c&q=x', pathname: '/Quote-Template-Plumber' });
  assert.strictEqual(r.calls.length, 1);
  const c = r.calls[0];
  assert.strictEqual(c.url, URL_E);
  assert.strictEqual(c.init.method, 'POST');
  assert.strictEqual(c.init.credentials, 'omit');
  assert.strictEqual(c.init.keepalive, true);
  assert.strictEqual(c.init.headers['Content-Type'], 'text/plain;charset=UTF-8');
  assert.deepStrictEqual(JSON.parse(c.init.body), { e: 'view', t: 'quotationmaker', p: '/quote-template-plumber', w: '', s: 'google' });
  assert.deepStrictEqual(r.writes, [['qm-visit', 'google']]);
  assert.strictEqual(r.cookieReads(), 0, 'no cookie is read or written');
});
test('a visit with no referrer is direct and the word is kept; the next page of the tab, opened from this site, says the same word', () => {
  const first = load();
  assert.strictEqual(first.notes()[0].s, 'direct');
  assert.deepStrictEqual(first.writes, [['qm-visit', 'direct']]);
  const next = load({ referrer: 'https://www.getquotationmaker.com/quote-template-plumber', session: { 'qm-visit': 'google' }, pathname: '/blog' });
  assert.strictEqual(next.notes()[0].s, 'google', 'the word of the visit, not of the previous page');
  assert.deepStrictEqual(next.writes, [], 'the word is written once');
});
test('a visit that began on a page that does not count has no word: the note is sent with an empty word, nothing is kept', () => {
  const r = load({ referrer: 'https://www.getquotationmaker.com/quote-template-painter' });
  assert.strictEqual(r.notes()[0].s, '');
  assert.deepStrictEqual(r.writes, []);
});
test('a word in session storage that is not one of the eight is ignored', () => {
  const r = load({ session: { 'qm-visit': 'someone@example.com' }, referrer: 'https://www.bing.com/' });
  assert.strictEqual(r.notes()[0].s, 'bing');
});

test('a landing from another site starts a new visit with its own word; a landing with no referrer keeps the tab\'s word', () => {
  const fresh = load({ session: { 'qm-visit': 'direct' }, referrer: 'https://www.bing.com/' });
  assert.strictEqual(fresh.notes()[0].s, 'bing');
  assert.deepStrictEqual(fresh.writes, [['qm-visit', 'bing']]);
  const tagged = load({ session: { 'qm-visit': 'direct' }, search: '?utm_source=chatgpt.com' });
  assert.strictEqual(tagged.notes()[0].s, 'ai-assistant');
  assert.deepStrictEqual(tagged.writes, [['qm-visit', 'ai-assistant']]);
  const same = load({ session: { 'qm-visit': 'google' } });
  assert.strictEqual(same.notes()[0].s, 'google');
  assert.deepStrictEqual(same.writes, []);
});

test('a followed Get Pro link sends one click note with the part of the page it was in and the visit\'s word', () => {
  const r = load({ referrer: 'https://www.bing.com/' });
  clickOn(r, link(PRO, { box: { tagName: 'NAV', id: '' } }));
  clickOn(r, link(PRO + '?x=1#top', { box: { tagName: 'SECTION', id: 'Pricing' } }), 'click');
  r.clock.t += 5000;
  clickOn(r, link(PRO, { named: 'hero-cta' }));
  r.clock.t += 5000;
  clickOn(r, link(PRO));
  assert.deepStrictEqual(r.notes().slice(1).map(n => [n.e, n.p, n.w, n.s]), [
    ['click', '/quote-template-plumber', 'nav', 'bing'],
    ['click', '/quote-template-plumber', 'section#pricing', 'bing'],
    ['click', '/quote-template-plumber', 'hero-cta', 'bing'],
    ['click', '/quote-template-plumber', 'page', 'bing'],
  ]);
});
test('a middle click counts, other buttons do not, the same link twice in two seconds counts once, other links never count', () => {
  const r = load();
  const a = link(PRO, { box: { tagName: 'FOOTER', id: '' } });
  clickOn(r, a, 'auxclick', 1);
  clickOn(r, a, 'auxclick', 2);
  clickOn(r, a, 'click');            // within two seconds of the middle click
  assert.strictEqual(r.notes().filter(n => n.e === 'click').length, 1);
  r.clock.t += 2500;
  clickOn(r, a, 'click');
  assert.strictEqual(r.notes().filter(n => n.e === 'click').length, 2);
  for (const href of ['https://www.getquotationmaker.com/activate', 'https://other.gumroad.com/l/x', 'http://dorukctn.gumroad.com/l/cjogv', 'https://dorukctn.gumroad.com.evil.example/l/cjogv', 'https://dorukctn.gumroad.com/library', 'mailto:info@peakappsstudio.com']) {
    clickOn(r, link(href)); r.clock.t += 5000;
  }
  clickOn(r, { closest: () => null });   // a click that is not on a link
  clickOn(r, null);
  assert.strictEqual(r.notes().filter(n => n.e === 'click').length, 2, 'only Get Pro links on the store count');
});
test('a note is only ever one of the five short fields, with no ? or # in the page address', () => {
  const r = load({ search: '?utm_source=x', pathname: '/blog/vat-on-quotes-explained' });
  clickOn(r, link(PRO + '?utm_source=whatever#frag'));
  for (const n of r.notes()) {
    assert.deepStrictEqual(Object.keys(n), ['e', 't', 'p', 'w', 's']);
    assert.ok(!/[?#]/.test(n.p), n.p);
    for (const k of Object.keys(n)) assert.ok(n[k].length <= 40, k);
  }
  const odd = load({ pathname: '/Ünïcode page' });
  assert.strictEqual(odd.notes()[0].p, '', 'an address that is not plain letters, digits and - _ . / is sent empty');
});

test('nothing is sent from another host, from a browser under automation, or from a page that is only prerendered or hidden until it is shown', () => {
  for (const host of ['localhost', '127.0.0.1', 'evil.example', 'www.getquotationmaker.com.evil.example', 'notgetquotationmaker.com', 'peakappsstudio.com']) {
    const r = load({ host });
    clickOn(r, link(PRO));
    assert.strictEqual(r.calls.length, 0, host);
  }
  for (const host of ['getquotationmaker.com', 'www.getquotationmaker.com']) assert.strictEqual(load({ host }).calls.length, 1, host);
  const bot = load({ webdriver: true });
  clickOn(bot, link(PRO));
  assert.strictEqual(bot.calls.length, 0, 'automation');
  const pre = load({ prerendering: true });
  assert.strictEqual(pre.calls.length, 0, 'prerendering');
  assert.deepStrictEqual(pre.writes, [], 'and no word is kept yet');
  pre.ctx.document.prerendering = false; pre.fire('prerenderingchange');
  assert.strictEqual(pre.calls.length, 1, 'counted when the visitor opens it');
  pre.fire('prerenderingchange'); pre.fire('visibilitychange');
  assert.strictEqual(pre.calls.length, 1, 'once');
  const hidden = load({ visibility: 'hidden' });
  assert.strictEqual(hidden.calls.length, 0, 'a tab opened behind the current one');
  hidden.ctx.document.visibilityState = 'visible'; hidden.fire('visibilitychange');
  assert.strictEqual(hidden.calls.length, 1);
  hidden.fire('visibilitychange');
  assert.strictEqual(hidden.calls.length, 1, 'once');
});

test('blocked storage, a failing send or a browser without fetch never throws, and the page loads as usual', () => {
  for (const mode of ['methods-throw', 'access-throws']) {
    const r = load({ mode, referrer: 'https://www.google.com/' });
    assert.strictEqual(r.notes()[0].s, 'google', mode);
    assert.doesNotThrow(() => clickOn(r, link(PRO)), mode);
  }
  for (const net of ['fetch-throws', 'fetch-rejects']) {
    const r = load({ net });
    assert.doesNotThrow(() => clickOn(r, link(PRO)), net);
  }
  const b = load({ net: 'beacon' });
  assert.strictEqual(b.calls.length, 1, 'sendBeacon when there is no fetch');
  assert.strictEqual(b.calls[0].url, URL_E);
  assert.strictEqual(load({ net: 'none' }).calls.length, 0);
  const odd = load();
  assert.doesNotThrow(() => odd.fire('click', { target: { closest() { throw new Error('boom'); } } }));
});
test('the script reads no cookie and uses no storage but this tab\'s session storage', () => {
  const code = SCRIPT.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.ok(!/document\.cookie|localStorage|indexedDB|XMLHttpRequest|WebSocket|Image\(/.test(code));
  assert.strictEqual((code.match(/sessionStorage/g) || []).length, 2, 'one read and one write');
  const r = load({ referrer: 'https://www.google.com/' });
  clickOn(r, link(PRO));
  assert.strictEqual(r.cookieReads(), 0);
});

// ---------------------------------------------------------------- 2. the Worker accepts what the script sends
test('the Worker\'s own note check accepts every note the script sends, unchanged', async () => {
  const { cleanNote } = await import('../counter-worker/core.js');
  const r = load({ referrer: 'https://www.pinterest.com/' });
  clickOn(r, link(PRO, { box: { tagName: 'SECTION', id: 'pricing' } }));
  const direct = load({ referrer: 'https://www.getquotationmaker.com/x' });
  const all = [...r.notes(), ...direct.notes()];
  assert.strictEqual(all.length, 3);
  for (const n of all) assert.deepStrictEqual(cleanNote(n), n, JSON.stringify(n));
});
test('the script, the Worker and its deploy file point at each other', () => {
  const r = load();
  assert.strictEqual(r.api.COUNT_URL, URL_E);
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'counter-worker', 'wrangler.jsonc'), 'utf8').replace(/^\s*\/\/.*$/gm, ''));
  assert.strictEqual(new URL(URL_E).hostname.split('.')[0], cfg.name);
  assert.ok(cfg.vars.ALLOWED_ORIGINS.split(',').includes('https://' + HOST));
});

// ---------------------------------------------------------------- 3. the pages
const counter = require('../lib/counter');
let server, base;
test.before(async () => {
  const app = require('../server');
  await new Promise(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
  base = 'http://127.0.0.1:' + server.address().port;
});
test.after(() => new Promise(resolve => server.close(resolve)));
const get = async p => { const r = await fetch(base + p, { redirect: 'manual' }); return { status: r.status, type: r.headers.get('content-type') || '', body: await r.text() }; };
const TRACE = /count\.js|qm-counter|workers\.dev/;
const TAG = /<script src="\/count\.js\?v=\d+" defer><\/script>/g;
const sitemapPaths = async () => [...(await get('/sitemap.xml')).body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace('https://www.getquotationmaker.com', '') || '/');

test('which pages count: every page but the skipped ones, however the address is typed', () => {
  assert.strictEqual(counter.isCounted('/quote-template-plumber'), true);
  assert.strictEqual(counter.isCounted('/privacy'), true);
  assert.strictEqual(counter.isCounted('/blog'), true, 'the guides index is not a skipped page');
  for (const p of ['/', '/quote-template-painter', '/Quote-Template-Painter/', '/blog/vat-on-quotes-explained?utm_source=x', '/BLOG/quote-acceptance-rate-tips/', '/quote-acceptance-template#top']) assert.strictEqual(counter.isCounted(p), false, p);
  assert.strictEqual(counter.SKIP_PATHS.length, 10);
});
const TRAFFIC = process.env.TRAFFIC_PAGES || path.join(os.homedir(), 'peak-durum', 'traffic-pages.json');
test('the skip list is the QuotationMaker part of the traffic pages list (when this machine has it)', { skip: !fs.existsSync(TRAFFIC) && 'peak-durum/traffic-pages.json is not on this machine' }, () => {
  const j = JSON.parse(fs.readFileSync(TRAFFIC, 'utf8'));
  const want = j.pages.filter(p => p.site === 'quotationmaker').map(p => counter.key(new URL(p.page).pathname)).sort();
  assert.deepStrictEqual([...counter.SKIP_PATHS].sort(), want);
});
test('the pages that carry the search traffic have no trace of the counter', async () => {
  for (const p of counter.SKIP_PATHS) {
    const r = await get(p);
    assert.strictEqual(r.status, 200, p);
    assert.ok(!TRACE.test(r.body), p + ' has no counter script or address');
    assert.ok(r.body.includes('<link rel="stylesheet" href="/site.css?v=20261009b">\n') || r.body.includes('<link rel="stylesheet" href="/site.css?v=20261009b">\r\n'), p + ' head is as it was');
  }
  for (const p of ['/quote-template-painter/', '/QUOTE-TEMPLATE-PAINTER', '/?utm_source=chatgpt.com', '/blog/quote-acceptance-rate-tips?x=1']) assert.ok(!TRACE.test((await get(p)).body), p);
});
test('every other page loads the counter once, in the head, and the 404 page does not', async () => {
  const skipped = new Set(counter.SKIP_PATHS);
  const paths = (await sitemapPaths()).concat(['/activate']).filter(p => !skipped.has(counter.key(p)));
  assert.ok(paths.length > 25);
  for (const p of paths) {
    const r = await get(p);
    assert.strictEqual(r.status, 200, p);
    assert.strictEqual((r.body.match(TAG) || []).length, 1, p + ' loads the counter once');
    assert.ok(r.body.indexOf('/count.js') < r.body.indexOf('</head>'), p + ' in the head');
  }
  const nf = await get('/no-such-page');
  assert.strictEqual(nf.status, 404);
  assert.ok(!TRACE.test(nf.body));
});
test('the script is served from the site, and the privacy page says what the counter does', async () => {
  const js = await get('/count.js?v=20261029');
  assert.strictEqual(js.status, 200);
  assert.match(js.type, /javascript/);
  assert.strictEqual(js.body.replace(/\r\n/g, '\n'), SCRIPT.replace(/\r\n/g, '\n'));
  const pr = (await get('/privacy')).body;
  assert.match(pr, /Visit and Get Pro click counts/);
  assert.match(pr, /no cookies and nothing that identifies you/);
  assert.match(pr, /Cloudflare/);
  assert.match(pr, /session storage/);
  assert.match(pr, /kept for up to 400 days/);
  assert.ok(!/no analytics/i.test(pr), 'the old "no analytics" line is gone');
  const sm = (await get('/sitemap.xml')).body;
  assert.match(sm, /<loc>https:\/\/www\.getquotationmaker\.com\/privacy<\/loc><lastmod>2026-10-29<\/lastmod>/);
  assert.match(sm, /<loc>https:\/\/www\.getquotationmaker\.com\/terms<\/loc><lastmod>2026-10-11<\/lastmod>/, 'the terms did not change');
});
