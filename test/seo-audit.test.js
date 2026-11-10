// Tests for the 10 Nov 2026 technical SEO audit fixes (run: npm test). No network: the app is started on a free local port.
// llms.txt, self-hosted fonts, the ten rebuilt country pages and the rebuilt plumber, builder and IT support pages.
const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');
const { COUNTRIES } = require('../content/countries');
const { COUNTRY_PAGES } = require('../content/country-pages');
const { PLUMBER, BUILDER, IT_SUPPORT } = require('../content/trade-pages');
const { LABOUR_PAGES } = require('../content/labour-quotation');

const SITE = 'https://www.getquotationmaker.com';
let server;
let base;

test.before(async () => {
  await new Promise(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
  base = 'http://127.0.0.1:' + server.address().port;
});
test.after(() => new Promise(resolve => server.close(resolve)));

const get = async path => {
  const r = await fetch(base + path, { redirect: 'manual' });
  return { status: r.status, body: await r.text(), headers: r.headers };
};
const words = html => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const jsonld = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
const metaDesc = html => (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
const titleOf = html => (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';

// llms.txt is built from the same page lists as the sitemap, so every page the sitemap lists is in it once, on the live host.
test('llms.txt: plain text, llmstxt.org shape, every sitemap page linked once on the live host', async () => {
  const r = await get('/llms.txt');
  assert.strictEqual(r.status, 200);
  assert.match(r.headers.get('content-type') || '', /^text\/plain/);
  assert.match(r.body, /^# GetQuotationMaker\n\n> /, 'H1 and summary block come first');
  const links = [...r.body.matchAll(/^- \[[^\]]+\]\((https:\/\/[^)]+)\)/gm)].map(m => m[1]);
  assert.strictEqual(new Set(links).size, links.length, 'no page linked twice');
  for (const l of links) assert.ok(l === SITE + '/' || l.startsWith(SITE + '/'), 'link on the live host: ' + l);
  const sm = await get('/sitemap.xml');
  const locs = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  for (const loc of locs) assert.ok(links.includes(loc), loc + ' is in llms.txt');
  for (const s of ['## Tool', '## Quote templates by trade', '## Guides and wording to copy', '## Quote generators by country', '## Optional']) assert.ok(r.body.includes(s), s);
  assert.doesNotMatch(r.body, /[—–→]/, 'no dashes or arrows in plain text');
  assert.doesNotMatch(r.body, /\bAI\b/, 'no AI wording');
});

test('robots.txt allows crawling and names the sitemap', async () => {
  const { body } = await get('/robots.txt');
  assert.match(body, /User-agent: \*\nAllow: \//);
  assert.ok(body.includes('Sitemap: ' + SITE + '/sitemap.xml'));
});

// Fonts: no Google Fonts request, four WOFF2 files that answer with a one-year immutable cache.
test('fonts are served from the site: no Google Fonts, WOFF2 files cached for a year', async () => {
  const home = (await get('/')).body;
  assert.doesNotMatch(home, /fonts\.googleapis\.com|fonts\.gstatic\.com/, 'no Google Fonts request on the home page');
  assert.ok(home.includes('/fonts/'), 'the page references its own fonts');
  for (const f of ['sora-latin', 'sora-latin-ext', 'dm-sans-latin', 'dm-sans-latin-ext']) {
    const r = await fetch(base + '/fonts/' + f + '.woff2');
    assert.strictEqual(r.status, 200, f);
    assert.match(r.headers.get('cache-control') || '', /max-age=31536000/, f + ' cache');
    assert.match(r.headers.get('cache-control') || '', /immutable/, f + ' immutable');
    assert.ok((await r.arrayBuffer()).byteLength > 5000, f + ' is a real font file');
  }
  const css = await get('/assets/site.css').catch(() => ({ body: '' }));
  assert.doesNotMatch(css.body, /fonts\.googleapis\.com|fonts\.gstatic\.com/, 'site.css does not import Google Fonts');
});

// Country pages rebuilt on 10 Nov 2026: a worked example that loads into the tool, dated local rules with official links, and a
// FAQ that is also in the structured data. The Netherlands page is a protected traffic page and stays as it was.
const REBUILT = Object.keys(COUNTRY_PAGES);
test('ten country pages are rebuilt, and the Netherlands page has no new content', () => {
  assert.strictEqual(REBUILT.length, 10);
  assert.ok(!REBUILT.includes('netherlands'), 'Netherlands has no entry');
  for (const s of REBUILT) assert.ok(COUNTRIES.some(c => c.slug === s), s + ' is a country page');
  const nl = COUNTRIES.find(c => c.slug === 'netherlands');
  assert.ok(nl && !nl.local && !nl.faq && !nl.presets, 'the Netherlands entry is untouched');
});

test('country pages: real content, example in the tool, dated rules, official link, visible FAQ with markup', async () => {
  for (const slug of REBUILT) {
    const path = '/free-quote-generator-' + slug;
    const c = COUNTRIES.find(x => x.slug === slug);
    const { status, body } = await get(path);
    assert.strictEqual(status, 200, path);
    assert.ok(words(body) >= 900, path + ' has real content, words: ' + words(body));
    assert.ok(c.presetButtons && c.presetButtons.length, path + ' has an example button');
    for (const b of c.presetButtons) {
      assert.ok(body.includes('data-preset="' + b.key + '"'), path + ' button ' + b.key);
      assert.ok(body.includes('"' + b.key + '":{'), path + ' preset ' + b.key + ' is loaded into the tool');
    }
    assert.ok(body.includes('10 November 2026'), path + ' shows when the rules were checked');
    assert.ok(/<a href="https:\/\/[^"]+" rel="nofollow noopener" target="_blank">/.test(body), path + ' links to an official source');
    const ld = jsonld(body);
    const faq = ld.find(x => x['@type'] === 'FAQPage');
    assert.ok(faq && faq.mainEntity.length >= 3, path + ' FAQ is in the structured data');
    for (const q of faq.mainEntity) {
      const shown = q.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&#34;').replace(/'/g, '&#39;');
      assert.ok(body.includes('<summary>' + shown + '</summary>') || body.includes('<summary>' + q.name + '</summary>'), path + ' shows the question: ' + q.name.slice(0, 40));
    }
    assert.ok(ld.some(x => x['@type'] === 'BreadcrumbList'), path + ' breadcrumb');
    assert.ok(titleOf(body).length >= 30 && titleOf(body).length <= 65, path + ' title length ' + titleOf(body).length);
    assert.ok(metaDesc(body).length >= 70 && metaDesc(body).length <= 160, path + ' description length ' + metaDesc(body).length);
  }
  const nl = (await get('/free-quote-generator-netherlands')).body;
  assert.doesNotMatch(nl, /class="faq"/, 'Netherlands page has no new FAQ block');
});

test('country pages: example presets are in the country\'s own currency with line items and a tax rate', () => {
  for (const slug of REBUILT) {
    const c = COUNTRIES.find(x => x.slug === slug);
    const e = COUNTRY_PAGES[slug];
    assert.ok(Object.keys(e.presets).length >= 1, slug + ' has a preset');
    for (const p of Object.values(e.presets)) {
      assert.strictEqual(p.currency, c.currency, slug + ' preset currency');
      assert.ok(p.taxRate > 0, slug + ' preset tax rate');
      assert.ok(p.items.length >= 3, slug + ' example has line items');
      for (const it of p.items) assert.ok(it[1] > 0 && it[2] > 0, slug + ' item has quantity and price');
    }
  }
});

// Plumber, builder and IT support: trade text, one-click examples, Word and Excel files that download, FAQ markup, cross links.
const TRADES = { 'quote-template-plumber': PLUMBER, 'quote-template-builder': BUILDER, 'quote-template-it-support': IT_SUPPORT };
test('plumber, builder and IT support pages: trade content, examples, working downloads, FAQ, cross links', async () => {
  for (const [slug, def] of Object.entries(TRADES)) {
    const { status, body } = await get('/' + slug);
    assert.strictEqual(status, 200, slug);
    assert.ok(words(body) >= 900, slug + ' has real content, words: ' + words(body));
    assert.ok(body.includes('<title>' + def.title.replace(/&/g, '&amp;') + '</title>'), slug + ' title');
    assert.ok(def.title.length <= 60, slug + ' title length ' + def.title.length);
    assert.ok(def.desc.length >= 70 && def.desc.length <= 155, slug + ' description length ' + def.desc.length);
    const presets = [...body.matchAll(/data-preset="([^"]+)"/g)].map(m => m[1]);
    assert.ok(presets.length >= 1, slug + ' has an example button');
    for (const k of presets) assert.ok(body.includes('"' + k + '":{'), slug + ' preset ' + k + ' is loaded into the tool');
    for (const d of def.downloads) {
      for (const [href] of d.files) {
        const f = await fetch(base + href);
        assert.strictEqual(f.status, 200, href);
        assert.ok((await f.arrayBuffer()).byteLength > 4000, href + ' is a real file');
        assert.ok(body.includes('href="' + href + '"'), slug + ' links ' + href);
      }
    }
    for (const g of ['/quote-acceptance-template', '/quotation-confirmation', '/blog/quote-acceptance-rate-tips']) assert.ok(body.includes('href="' + g + '"'), slug + ' links ' + g);
    const ld = jsonld(body);
    assert.ok(ld.some(x => x['@type'] === 'FAQPage'), slug + ' FAQ markup');
    assert.ok(ld.some(x => x['@type'] === 'BreadcrumbList'), slug + ' breadcrumb');
  }
});

test('the three rebuilt trade pages are linked from the home page and listed in the sitemap with the 10 Nov date', async () => {
  const home = (await get('/')).body;
  const sm = (await get('/sitemap.xml')).body;
  for (const slug of Object.keys(TRADES)) {
    assert.ok(home.includes('href="/' + slug + '"'), slug + ' linked from the home page');
    const m = sm.match(new RegExp('<loc>' + SITE.replace(/\./g, '\\.') + '/' + slug + '</loc>\\s*<lastmod>([^<]+)</lastmod>'));
    assert.ok(m, slug + ' in the sitemap with lastmod');
    assert.strictEqual(m[1], '2026-11-10', slug + ' lastmod');
  }
});

// The protected pages keep their wording; only the acceptance-rate article got a new title (it names its own intent).
test('protected traffic pages: the home page title and the Netherlands page title are unchanged', async () => {
  const home = await get('/');
  assert.strictEqual(home.status, 200);
  assert.ok(/<title>[^<]*Quotation Maker[^<]*<\/title>/i.test(home.body), 'home title still names the tool');
  const nl = COUNTRIES.find(c => c.slug === 'netherlands');
  assert.ok(titleOf((await get('/free-quote-generator-netherlands')).body) === nl.title, 'Netherlands title is the original');
});

// /labour-quotation-format (10 Nov 2026): the labour-only topic that Copilot cited from the old contractor page. A new page, so the
// protected contractor page, the home page and the /blog list are not touched; it is linked from pages that are not protected.
test('labour quotation page: content, examples that load, working template files, FAQ markup, canonical', async () => {
  const def = LABOUR_PAGES[0];
  const { status, body } = await get('/' + def.slug);
  assert.strictEqual(status, 200);
  assert.ok(words(body) >= 1500, 'real content, words: ' + words(body));
  assert.ok(body.includes('<title>' + def.title + '</title>') && def.title.length <= 60, 'title length ' + def.title.length);
  assert.ok(def.desc.length >= 70 && def.desc.length <= 155, 'description length ' + def.desc.length);
  assert.ok(body.includes('<link rel="canonical" href="' + SITE + '/' + def.slug + '">'), 'self canonical');
  for (const b of def.presetButtons) {
    assert.ok(body.includes('data-preset="' + b.key + '"'), 'button ' + b.key);
    assert.ok(body.includes('"' + b.key + '":{'), 'preset ' + b.key + ' is loaded into the tool');
  }
  for (const href of ['/templates/labour-quotation-template.docx', '/templates/labour-quotation-template.xlsx']) {
    const f = await fetch(base + href);
    assert.strictEqual(f.status, 200, href);
    assert.ok((await f.arrayBuffer()).byteLength > 4000, href + ' is a real file');
    assert.ok(body.includes('href="' + href + '"'), 'page links ' + href);
  }
  assert.ok(body.includes('10 November 2026'), 'rules are dated');
  assert.ok(/<a href="https:\/\/www\.gov\.uk\/[^"]+" rel="nofollow noopener"/.test(body) && body.includes('tax.gov.ae') && body.includes('pib.gov.in'), 'official sources for the UK, the UAE and India');
  const ld = jsonld(body);
  const faq = ld.find(x => x['@type'] === 'FAQPage');
  assert.ok(faq && faq.mainEntity.length >= 5, 'FAQ markup');
  for (const q of faq.mainEntity) assert.ok(body.includes('<summary>' + q.name.replace(/'/g, '&#39;') + '</summary>') || body.includes('<summary>' + q.name + '</summary>'), 'FAQ shown: ' + q.name.slice(0, 40));
  const art = ld.find(x => x['@type'] === 'Article');
  assert.strictEqual(art.dateModified, '2026-11-10', 'dateModified matches the visible date');
  assert.ok(body.includes('Updated 10 November 2026'), 'visible updated date');
  assert.doesNotMatch(body, /AI/, 'no AI wording');
  const sm = (await get('/sitemap.xml')).body;
  assert.ok(sm.includes('<loc>' + SITE + '/' + def.slug + '</loc>'), 'in the sitemap');
  assert.ok((await get('/llms.txt')).body.includes(SITE + '/' + def.slug), 'in llms.txt');
});

test('labour quotation page is linked from the builder, plumber and three country pages, and the protected pages stay as they were', async () => {
  const slug = '/labour-quotation-format';
  for (const p of ['/quote-template-builder', '/quote-template-plumber', '/free-quote-generator-uk', '/free-quote-generator-uae', '/free-quote-generator-india']) {
    assert.ok((await get(p)).body.includes('href="' + slug + '"'), p + ' links the labour quotation page');
  }
  for (const p of ['/', '/blog', '/quote-template-contractor', '/free-quote-generator-netherlands']) {
    assert.ok(!(await get(p)).body.includes('href="' + slug + '"'), p + ' is protected and does not link it yet');
  }
});
