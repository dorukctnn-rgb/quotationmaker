// Pages published through the SEO agent (seo-ajani, adapter qm-pages). The agent writes only content/seo-pages.json;
// this module reads it, checks every entry and hands the pages to server.js.
//   view "how-to":     a new guide, drawn with views/how-to.ejs (same fields as the HOW_TO_PAGES entries).
//   view "profession": a rebuilt trade page, drawn with views/profession.ejs. For a trade that already has a page only
//                      the fields in TRADE_FIELDS replace its own; slug, label and name stay, since the other trade
//                      pages list it by label.
const { pages = [] } = require('./seo-pages.json');

const TRADE_FIELDS = ['title', 'desc', 'h1', 'lead', 'badge', 'heroCta', 'presetButtons', 'guide', 'faq', 'updated', 'published', 'presets'];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

function check(p, i) {
  const where = 'content/seo-pages.json, entry ' + i + (p && p.slug ? ' (' + p.slug + ')' : '');
  const fail = msg => { throw new Error(where + ': ' + msg); };
  if (!p || typeof p !== 'object') fail('not an object');
  if (!['how-to', 'profession'].includes(p.view)) fail('view must be "how-to" or "profession"');
  if (!SLUG.test(p.slug || '')) fail('slug must be lowercase words joined by hyphens');
  for (const k of ['title', 'desc', 'h1']) if (typeof p[k] !== 'string' || !p[k].trim()) fail(k + ' missing');
  if (!DAY.test(p.updated || '')) fail('updated must be YYYY-MM-DD');
  if (p.view === 'how-to' && typeof p.content !== 'string') fail('content (HTML) missing');
  if (p.view === 'profession' && typeof p.guide !== 'string') fail('guide (HTML) missing');
  if (p.faq !== undefined && !(Array.isArray(p.faq) && p.faq.every(f => f && typeof f.q === 'string' && typeof f.a === 'string'))) fail('faq must be [{ q, a }]');
  if (p.presets !== undefined) {
    for (const [key, pr] of Object.entries(p.presets)) {
      if (!SLUG.test(key)) fail('preset key ' + key);
      if (!pr || !Array.isArray(pr.items) || !pr.items.length) fail('preset ' + key + ' has no items');
      if (!pr.items.every(it => Array.isArray(it) && it.length === 3 && typeof it[0] === 'string' && Number.isFinite(it[1]) && Number.isFinite(it[2]))) fail('preset ' + key + ': items are [description, quantity, price]');
    }
  }
  return p;
}

const SEO_PAGES = pages.map(check);
const seen = new Set();
SEO_PAGES.forEach(p => {
  if (seen.has(p.slug)) throw new Error('content/seo-pages.json: slug ' + p.slug + ' appears twice');
  seen.add(p.slug);
});

module.exports = { SEO_PAGES, TRADE_FIELDS };
