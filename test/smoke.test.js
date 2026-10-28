// Smoke test of every page in the sitemap (run: npm test). No network: the app is started on a free local port.
// Every page answers 200, has one H1, a canonical to its own address on the live host and JSON-LD that parses.
// Pages published through the SEO agent (content/seo-pages.json) must be in the sitemap.
const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');
const { SEO_PAGES } = require('../content/seo-pages');

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
  return { status: r.status, body: await r.text() };
};

test('sitemap lists every page once, including the SEO agent pages', async () => {
  const { status, body } = await get('/sitemap.xml');
  assert.strictEqual(status, 200);
  const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.ok(locs.length > 20, 'sitemap has pages');
  assert.strictEqual(new Set(locs).size, locs.length, 'no page twice');
  for (const p of SEO_PAGES) assert.ok(locs.includes(SITE + '/' + p.slug), p.slug + ' is in the sitemap');
});

test('every sitemap page renders with one H1, its own canonical and valid JSON-LD', async () => {
  const { body } = await get('/sitemap.xml');
  const paths = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(SITE, '') || '/');
  for (const path of paths) {
    const r = await get(path);
    assert.strictEqual(r.status, 200, path + ' answers 200');
    assert.strictEqual((r.body.match(/<h1[\s>]/g) || []).length, 1, path + ' has one H1');
    const canon = (r.body.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    assert.strictEqual(canon, SITE + (path === '/' ? '/' : path), path + ' canonical');
    for (const m of r.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      assert.doesNotThrow(() => JSON.parse(m[1]), path + ' JSON-LD parses');
    }
  }
});

test('SEO agent pages carry their title, description and FAQ', async () => {
  for (const p of SEO_PAGES) {
    const r = await get('/' + p.slug);
    assert.strictEqual(r.status, 200, p.slug);
    assert.ok(r.body.includes('<title>' + p.title.replace(/&/g, '&amp;') + '</title>'), p.slug + ' title');
    for (const f of p.faq || []) assert.ok(r.body.includes(f.q.replace(/&/g, '&amp;').replace(/'/g, '&#39;')) || r.body.includes(f.q), p.slug + ' FAQ question shown');
  }
});

// 27 Oct 2026 click-through fixes (Search Console, 28 days): the acceptance, confirmation and revision pages
// keep a title of 60 characters or less and a description of 155 or less, and the acceptance-rate article
// sends "confirm a quotation" readers to the confirmation guide and "email a quote" readers to the email guide.
test('acceptance, revision and confirmation pages: search-result lengths and cross links', async () => {
  const pages = {
    '/blog/quote-acceptance-rate-tips': 'Quote Acceptance: Wording to Copy and 9 Ways to Win More',
    '/quote-acceptance-template': 'Quote Acceptance Wording: 9 Templates to Accept a Quotation',
    '/revised-quotation': 'Revised Quotation: Meaning, Format and Email Templates'
  };
  for (const [path, title] of Object.entries(pages)) {
    const { body } = await get(path);
    assert.ok(body.includes('<title>' + title + '</title>'), path + ' title');
    assert.ok(title.length <= 60, path + ' title length');
    const desc = (body.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
    assert.ok(desc.length >= 70 && desc.length <= 155, path + ' description length ' + desc.length);
  }
  const post = (await get('/blog/quote-acceptance-rate-tips')).body;
  assert.ok(post.includes('href="/quotation-confirmation"'), 'article links to the confirmation guide');
  assert.ok(post.includes('href="/how-to-send-a-quote-to-a-client"'), 'article links to the email guide');
});

// 28 Oct 2026 Search Console tour: the web design page was rebuilt around the queries it is shown for ("web design quote
// template", "web development quote template", "website quote sample") and carries three one-click example quotes;
// the professional-quote guide answers "how to provide a quote for services" and "how to set up a quote template".
test('web design page and professional-quote guide: titles, examples and answers', async () => {
  const wd = await get('/quote-template-web-designer');
  const title = 'Web Design and Development Quote Template (Free PDF)';
  assert.ok(wd.body.includes('<title>' + title + '</title>') && title.length <= 60, 'web design title');
  const desc = (wd.body.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  assert.ok(desc.length >= 70 && desc.length <= 155, 'web design description length ' + desc.length);
  for (const key of ['web-designer', 'web-development', 'web-maintenance']) {
    assert.ok(wd.body.includes('data-preset="' + key + '"'), 'preset button ' + key);
    assert.ok(wd.body.includes('"' + key + '":{'), 'preset ' + key + ' is loaded into the tool');
  }
  assert.ok(wd.body.includes('web development quote'), 'web development wording is on the page');
  const pro = await get('/blog/how-to-write-a-professional-quote');
  for (const q of ['How do I provide a quote for services?', 'How do I set up a quote template?']) assert.ok(pro.body.includes(q), q);
  assert.ok(pro.body.includes('href="/quote-template-web-designer"'), 'guide links to the web design template');
});
