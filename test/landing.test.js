// Tests of the landing pages' box and of the internal links (run: npm test). No network: the app is started on a free local port.
// 1. The five top guide pages each carry one box under the intro, with a link to a real example, and nothing else on them changed:
//    taking the box out of the page leaves exactly what the page was without it (title, description, canonical, H1, headings, text, structured data).
// 2. Pages that carry the search traffic (lib/frozen.js) get no extra footer links and no longer trade list; every other page does.
// 3. Every trade page and every country page is linked from the home page's template section, and each country page is linked
//    from the footer of every page that is not left as it was.
const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');
const { LEAD_CTA } = require('../content/lead-cta');
const { PRESETS } = require('../content/presets');
const { COUNTRIES } = require('../content/countries');
const { isFrozen, FROZEN_PATHS } = require('../lib/frozen');
const counter = require('../lib/counter');

const SITE = 'https://www.getquotationmaker.com';
let server, base;
test.before(async () => { await new Promise(r => { server = app.listen(0, '127.0.0.1', r); }); base = 'http://127.0.0.1:' + server.address().port; });
test.after(() => new Promise(r => server.close(r)));
const get = async p => { const r = await fetch(base + p, { redirect: 'manual' }); return { status: r.status, body: await r.text() }; };
const sitemapPaths = async () => [...(await get('/sitemap.xml')).body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(SITE, '') || '/');
// the box as the page prints it: its own stylesheet link, the aside, and the blank line the template leaves after it
const BOX = /  <link rel="stylesheet" href="\/lead-cta\.css\?v=\d+">\r?\n<aside class="lead-cta"[\s\S]*?<\/aside>\r?\n\r?\n/;
const hrefs = html => [...html.matchAll(/<a [^>]*href="([^"#?]+)/g)].map(m => m[1]);

// ---------------------------------------------------------------- 1. the box
test('the five top guide pages have one box each, and no other page has one', async () => {
  assert.deepStrictEqual(Object.keys(LEAD_CTA).sort(), ['/blog/quote-acceptance-rate-tips', '/blog/vat-on-quotes-explained', '/quotation-confirmation', '/quote-acceptance-template', '/revised-quotation']);
  for (const p of await sitemapPaths()) {
    const body = (await get(p)).body;
    const n = (body.match(/class="lead-cta"/g) || []).length;
    assert.strictEqual(n, LEAD_CTA[p] ? 1 : 0, p);
  }
});

test('the box sits under the intro (after the short answer, before the contents list or the article) and its button goes to a real example', async () => {
  const ukPresets = Object.assign({}, PRESETS, COUNTRIES.find(c => c.slug === 'uk').presets);
  for (const [p, cta] of Object.entries(LEAD_CTA)) {
    const body = (await get(p)).body;
    const at = body.indexOf('class="lead-cta"');
    const answer = body.indexOf('class="answer prose"');
    const toc = body.indexOf('class="toc"');
    const article = body.indexOf('<article class="prose">');
    const firstAfter = [toc, article].filter(i => i > -1).sort((a, b) => a - b)[0];
    assert.ok(at > body.indexOf('</h1>'), p + ': after the H1');
    if (answer > -1) assert.ok(at > answer, p + ': after the short answer');
    assert.ok(firstAfter === undefined || at < firstAfter, p + ': before the contents list or the article');
    assert.ok(cta.text.length > 40 && cta.text.length < 260 && cta.title.length < 60, p + ': compact copy');
    // the example exists: the UK quote maker's own presets, or the page's own (the revised quotation page keeps its examples in place)
    if (cta.inPage) {
      assert.ok(body.includes('id="qtTool"') && body.includes('"' + cta.example + '":'), p + ': the page has the quote maker and the example');
      assert.ok(new RegExp('<a class="btn" href="' + cta.href.replace(/[?]/g, '\\?') + '" data-preset="' + cta.example + '">').test(body), p + ': the button loads it in place');
    } else {
      assert.ok(ukPresets[cta.example], p + ': ' + cta.example + ' is a preset of the UK quote maker');
      assert.ok(cta.href.startsWith('/free-quote-generator-uk?preset=' + cta.example + '#'), p);
      const uk = (await get('/free-quote-generator-uk')).body;
      assert.ok(uk.includes('"' + cta.example + '":'), p + ': the UK page carries the example');
    }
  }
});

test('taking the box out leaves each page as it was: title, description, canonical, H1, headings, text, structured data and address are untouched', async () => {
  for (const p of Object.keys(LEAD_CTA)) {
    const withBox = (await get(p)).body;
    const saved = LEAD_CTA[p];
    delete LEAD_CTA[p];
    let without;
    try { without = (await get(p)).body; } finally { LEAD_CTA[p] = saved; }
    assert.ok(BOX.test(withBox) && !BOX.test(without), p + ': the box is the only thing the setting adds');
    assert.strictEqual(withBox.replace(BOX, ''), without, p + ': only the box differs');
    for (const re of [/<title>[\s\S]*?<\/title>/, /<meta name="description"[^>]*>/, /<link rel="canonical"[^>]*>/, /<h1[\s\S]*?<\/h1>/]) assert.strictEqual((withBox.match(re) || [])[0], (without.match(re) || [])[0], p + ' ' + re);
    assert.deepStrictEqual(withBox.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/g), without.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/g), p + ': the same headings');
    assert.deepStrictEqual(withBox.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g), without.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g), p + ': the same structured data');
    assert.ok(!/<h[1-6]/.test(withBox.match(BOX)[0]), p + ': the box adds no heading');
  }
});

test('the three of the five that were left out of the counter now load it once, in the head; every page left out still has no trace of it', async () => {
  const TAG = /<script src="\/count\.js\?v=\d+" defer><\/script>/g;
  for (const p of ['/blog/vat-on-quotes-explained', '/quote-acceptance-template', '/blog/quote-acceptance-rate-tips', '/revised-quotation', '/quotation-confirmation']) {
    const r = await get(p);
    assert.strictEqual((r.body.match(TAG) || []).length, 1, p);
    assert.ok(r.body.indexOf('/count.js') < r.body.indexOf('</head>'), p + ': in the head');
    assert.strictEqual(counter.isCounted(p), true, p);
  }
  for (const p of counter.SKIP_PATHS) assert.ok(!/count\.js|lead-cta/.test((await get(p)).body), p + ': still no counter and no box');
  assert.ok(isFrozen('/blog/vat-on-quotes-explained') && isFrozen('/revised-quotation'), 'the five stay on the frozen list: only their box was decided');
});

// ---------------------------------------------------------------- 2. the frozen pages
test('a frozen page gets no footer country group and no longer trade list; every other page does', async () => {
  assert.ok(FROZEN_PATHS.length >= 26, 'the traffic list of 16 Nov 2026 and the skip list are in it');
  for (const p of ['/', '/blog', '/free-quote-generator-netherlands', '/quote-template-contractor', '/quote-template-cleaner', '/how-to-send-a-quote-to-a-client']) assert.ok(isFrozen(p), p + ' is frozen');
  const paths = await sitemapPaths();
  for (const p of paths) {
    const body = (await get(p)).body;
    const has = body.includes('class="flinks fcountries"');
    assert.strictEqual(has, !isFrozen(p), p + (isFrozen(p) ? ' is frozen: no extra footer links' : ' is not frozen: the footer lists the countries'));
  }
  // the group lists every country page but the page's own
  const uk = (await get('/quote-template-plumber')).body.match(/<nav class="flinks fcountries"[\s\S]*?<\/nav>/)[0];
  assert.deepStrictEqual(hrefs(uk).sort(), COUNTRIES.map(c => '/free-quote-generator-' + c.slug).sort());
  const own = (await get('/free-quote-generator-canada')).body.match(/<nav class="flinks fcountries"[\s\S]*?<\/nav>/)[0];
  assert.ok(!hrefs(own).includes('/free-quote-generator-canada') && hrefs(own).length === COUNTRIES.length - 1);
  // no page changed its title
  assert.match((await get('/free-quote-generator-canada')).body, /<title>[^<]*Canada[^<]*<\/title>/);
});

test('a country page lists every trade page, the carpentry and handyman pages included; the frozen Netherlands page keeps its ten', async () => {
  const trades = (await sitemapPaths()).filter(p => p.startsWith('/quote-template-'));
  assert.ok(trades.includes('/quote-template-carpentry') && trades.includes('/quote-template-handyman') && trades.length >= 20);
  for (const c of COUNTRIES) {
    const body = (await get('/free-quote-generator-' + c.slug)).body;
    const links = new Set(hrefs(body));
    if (isFrozen('/free-quote-generator-' + c.slug)) assert.ok(!links.has('/quote-template-carpentry'), c.slug + ' (frozen) is as it was');
    else for (const t of trades) assert.ok(links.has(t), c.slug + ' links ' + t);
  }
});

// ---------------------------------------------------------------- 3. the hub and the inbound links
test('the home page\'s template section links every trade page and every country page', async () => {
  const home = (await get('/')).body;
  const hub = home.slice(home.indexOf('id="templates"'), home.indexOf('class="invoice-cta"'));
  const links = new Set(hrefs(hub));
  const paths = await sitemapPaths();
  for (const p of paths.filter(x => x.startsWith('/quote-template-') || x.startsWith('/free-quote-generator-'))) assert.ok(links.has(p), 'the hub links ' + p);
  assert.ok(links.has('/quote-template-carpentry') && links.has('/quote-template-handyman'));
  assert.strictEqual([...links].filter(l => l.startsWith('/free-quote-generator-')).length, COUNTRIES.length);
});

test('every country page and the carpentry page are linked from many pages, not only from the home page', async () => {
  const paths = await sitemapPaths();
  const inbound = new Map();
  for (const p of paths) {
    for (const h of new Set(hrefs((await get(p)).body))) inbound.set(h, (inbound.get(h) || new Set()).add(p));
  }
  for (const c of COUNTRIES) assert.ok((inbound.get('/free-quote-generator-' + c.slug) || new Set()).size >= 20, c.slug + ' has links from ' + (inbound.get('/free-quote-generator-' + c.slug) || []).size + ' pages');
  assert.ok(inbound.get('/quote-template-carpentry').size >= 20, 'carpentry is linked from ' + inbound.get('/quote-template-carpentry').size + ' pages');
  // and the five boxes lead to the UK quote maker: it is linked from each of them
  for (const [p, cta] of Object.entries(LEAD_CTA)) if (!cta.inPage) assert.ok(inbound.get('/free-quote-generator-uk').has(p), p + ' links the UK quote maker');
});
