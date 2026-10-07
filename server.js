const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const { PROFESSION_GUIDES, HOWTO_CONTENT, BLOG_CONTENT, REDIRECTS } = require('./content');
const { GUIDE_PAGES } = require('./content/guides');
const { PROFESSION_EXTRAS, SHORT_GUIDES } = require('./content/trades');
const { PRESETS } = require('./content/presets');
const { COUNTRIES, COUNTRY_FACTS_CHECKED } = require('./content/countries');
const { CURRENCIES } = require('./lib/currencies');
const pdf = require('./lib/pdf');
const pro = require('./lib/pro');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');

const SITE_URL = process.env.SITE_URL || 'https://www.getquotationmaker.com';
const GUMROAD_LINK = process.env.GUMROAD_LINK || 'https://dorukctn.gumroad.com/l/cjogv';
const ASSET_VERSION = '20261007';
const UPDATED = '2026-10-07';
const PREVIOUS_UPDATE = '2026-09-24';

// -- Redirects (old URLs merged into stronger pages) ------------------------
Object.entries(REDIRECTS).forEach(([from, to]) => app.get(from, (req, res) => res.redirect(301, to)));

app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cookieParser());

// -- Data ---------------------------------------------------------------------
const PROFESSIONS = [
  { slug: 'contractor', label: 'Contractors & tradesmen', name: 'Contractor' },
  { slug: 'painter', label: 'Painters & decorators', name: 'Painting' },
  { slug: 'mechanic', label: 'Auto repair & mechanics', name: 'Auto Repair' },
  { slug: 'plumber', label: 'Plumbers', name: 'Plumber', intro: 'Quote plumbing jobs with the call-out fee, labour, parts and any VAT on separate lines, plus a guarantee and validity date.' },
  { slug: 'electrician', label: 'Electricians', name: 'Electrician', intro: 'Quote electrical work point by point, with testing and certification, making good and exclusions spelled out.' },
  { slug: 'builder', label: 'Builders', name: 'Builder', intro: 'Quote building and extension work by stage, with provisional sums, exclusions and a stage payment schedule.' },
  { slug: 'consultant', label: 'Consultants', name: 'Consulting', intro: 'Quote consulting work by deliverable, with day rates or fixed fees, expenses, assumptions and payment terms.',
    title: 'Consulting Quote Template & Sample Quotation (Free PDF)' },
  { slug: 'web-designer', label: 'Web designers', name: 'Web Design', intro: 'Quote web projects by milestone: discovery, design rounds, development, content and launch, with exclusions and ongoing costs.' },
  { slug: 'photographer', label: 'Photographers', name: 'Photography', intro: 'Quote shoots with coverage hours, editing, deliverables, licence terms, travel and the booking fee.' },
  { slug: 'graphic-designer', label: 'Graphic designers', name: 'Graphic Design', intro: 'Quote design projects with deliverables, concepts, revision rounds, file formats and usage rights.' },
  { slug: 'landscaper', label: 'Landscapers', name: 'Landscaping', intro: 'Quote landscaping with materials by quantity, labour, machinery, waste removal and aftercare.' },
  { slug: 'cleaner', label: 'Cleaning services', name: 'Cleaning', intro: 'Quote one-off and regular cleans by the hour, per visit or per area, with frequency, supplies and cancellation terms.' },
  { slug: 'hvac', label: 'HVAC technicians', name: 'HVAC', intro: 'Quote HVAC installs and repairs with equipment model and capacity, installation, permits, warranties and maintenance options.' },
  { slug: 'flooring', label: 'Flooring installers', name: 'Flooring', intro: 'Quote flooring by measured area, with materials, underlay, subfloor preparation, finishing and uplift of the old floor.' },
  { slug: 'it-support', label: 'IT support', name: 'IT Support', intro: 'Quote IT setup, migrations and monthly support per user or device, with licences and support hours stated.' },
  { slug: 'architect', label: 'Architects', name: 'Architecture', intro: 'Quote architectural fees stage by stage, with deliverables, revision rounds and third-party fees excluded.' },
  { slug: 'wedding-planner', label: 'Wedding planners', name: 'Wedding Planning', intro: 'Quote wedding planning packages with meetings, supplier management, on-the-day staff and a retainer schedule.' },
  { slug: 'personal-trainer', label: 'Personal trainers', name: 'Personal Training', intro: 'Quote training blocks with session length, assessments, programmes, rescheduling policy and payment.' }
];
const PRESET_FOR = { contractor: 'tradesman-uk', painter: 'painting-interior-uk', mechanic: 'auto-brakes' };
PROFESSIONS.forEach(p => {
  const extra = PROFESSION_EXTRAS[p.slug];
  Object.assign(p, extra || {});
  p.path = '/quote-template-' + p.slug;
  if (!extra) {
    p.h1 = p.name + ' quote template';
    p.title = p.title || p.name + ' Quote Template (Free PDF, No Signup)';
    p.desc = 'Free ' + p.name.toLowerCase() + ' quote template: fill it in online with a ready-made example, add tax and terms, and download a professional PDF. No signup.';
    p.lead = p.intro + ' Load the example below, change the details and download a PDF.';
    p.guide = (PROFESSION_GUIDES[p.slug] || '') + (SHORT_GUIDES[p.slug] || '');
    p.presetButtons = PRESETS[p.slug] ? [{ key: p.slug, label: 'Example ' + p.name.toLowerCase() + ' quote' }] : [];
    p.heroCta = PRESETS[p.slug] ? { preset: p.slug, label: 'Load an example ' + p.name.toLowerCase() + ' quote' } : null;
    p.updated = UPDATED;
  }
});

const BLOG_POSTS = [
  { slug: 'quote-acceptance-rate-tips', title: 'Quote Acceptance Rate: 9 Ways to Get More Quotes Accepted', h1: 'How to improve your quote acceptance rate', desc: 'How to work out your quote acceptance rate, and nine practical ways to get more quotes accepted: speed, specific line items, options, validity dates and follow-ups.', date: '2026-03-14', updated: UPDATED, category: 'Tips' },
  { slug: 'how-to-write-a-professional-quote', title: 'How to Write a Professional Quote: Step-by-Step Guide', desc: 'How to write a professional quote that wins work: start with the client’s problem, itemise, list exclusions, show tax, add terms and make accepting easy.', date: '2026-01-10', category: 'Guide' },
  { slug: 'quote-vs-invoice-difference', title: 'Quote vs Invoice: What Is the Difference?', desc: 'A quote is an offer sent before the work; an invoice asks for payment after it. How they differ, quote vs estimate vs proposal, and moving from one to the other.', date: '2026-01-18', category: 'Guide' },
  { slug: 'how-to-price-a-job-quote', title: 'How to Price a Job Quote: Materials, Labour, Overheads, Profit', desc: 'Price a job quote from four parts: materials, labour, overheads and profit, with a worked example you can follow.', date: '2026-01-26', category: 'Pricing' },
  { slug: 'what-is-a-quotation-in-business', title: 'What Is a Quotation in Business? Definition, Types, Examples', desc: 'What a business quotation is, what it contains, the main types (fixed price, itemised, estimate, tender) and when it becomes binding.', date: '2026-02-03', category: 'Guide' },
  { slug: 'how-to-follow-up-on-a-quote', title: 'How to Follow Up on a Quote Without Being Pushy', desc: 'When to follow up on a quote, scripts for each follow-up, and what not to do. Includes wording for before and after the quote expires.', date: '2026-02-27', category: 'Tips' },
  { slug: 'vat-on-quotes-explained', title: 'VAT on Quotes: Do You Charge VAT and How to Show It', desc: 'When to add VAT to a quote, how to show it, quoting consumers versus businesses, and the UK VAT rate and registration threshold.', date: '2026-03-06', category: 'Tax' }
];
BLOG_POSTS.forEach(p => {
  p.content = BLOG_CONTENT[p.slug] || '';
  p.h1 = p.h1 || p.title;
  p.updated = p.updated || PREVIOUS_UPDATE;
  const words = p.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  p.readTime = Math.max(2, Math.round(words / 220)) + ' min read';
});

const HOW_TO_PAGES = [
  { slug: 'how-to-write-a-roofing-quote', title: 'How to Write a Roofing Quote (Example & Free Template)', h1: 'How to write a roofing quote', desc: 'What to include in a roofing quote, how to price materials, labour and scaffolding, what to exclude, and an example roofing quote to load into a free quote maker.', preset: 'roofing-uk', updated: UPDATED },
  { slug: 'how-to-convert-a-quote-to-an-invoice', title: 'How to Convert a Quote to an Invoice', h1: 'How to convert a quote to an invoice', desc: 'Turn an accepted quote into a matching invoice: same line items, agreed variations, deposits deducted, a new invoice number and a due date.', updated: UPDATED }
];
HOW_TO_PAGES.forEach(p => { p.content = HOWTO_CONTENT[p.slug] || ''; });

// Pages and their last meaningful update, for the sitemap.
function sitemapEntries() {
  const e = [{ loc: '/', lastmod: UPDATED }, { loc: '/blog', lastmod: UPDATED }];
  PROFESSIONS.forEach(p => e.push({ loc: p.path, lastmod: UPDATED }));
  GUIDE_PAGES.forEach(p => e.push({ loc: '/' + p.slug, lastmod: p.updated }));
  COUNTRIES.forEach(c => e.push({ loc: '/free-quote-generator-' + c.slug, lastmod: UPDATED }));
  HOW_TO_PAGES.forEach(p => e.push({ loc: '/' + p.slug, lastmod: p.updated }));
  BLOG_POSTS.forEach(p => e.push({ loc: '/blog/' + p.slug, lastmod: p.updated }));
  return e;
}

// -- Request locals ---------------------------------------------------------------
app.use(async (req, res, next) => {
  try { res.locals.isPro = await pro.isPro(req); } catch (e) { res.locals.isPro = false; }
  Object.assign(res.locals, { siteUrl: SITE_URL, gumroadLink: GUMROAD_LINK, assetVersion: ASSET_VERSION });
  next();
});

function toolConfig(res, extra) {
  return Object.assign({ isPro: res.locals.isPro, gumroadLink: GUMROAD_LINK, currencies: CURRENCIES, presets: PRESETS, assetVersion: ASSET_VERSION }, extra || {});
}

const POPULAR_GUIDES = [
  ['/how-to-send-a-quote-to-a-client', 'How to send a quote to a client (email templates)'],
  ['/quote-acceptance-template', 'Quote acceptance wording'],
  ['/how-to-write-a-roofing-quote', 'How to write a roofing quote'],
  ['/blog/how-to-price-a-job-quote', 'How to price a job quote'],
  ['/blog/how-to-write-a-professional-quote', 'How to write a professional quote'],
  ['/blog/quote-vs-invoice-difference', 'Quote vs invoice'],
  ['/blog/vat-on-quotes-explained', 'VAT on quotes']
];

// -- Pages ------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.render('index', { professions: PROFESSIONS, countries: COUNTRIES, guides: POPULAR_GUIDES, tool: toolConfig(res, { presetButtons: [
    { key: 'tradesman-uk', label: 'Tradesman (UK)' }, { key: 'contractor-us', label: 'Contractor' }, { key: 'painting-interior-uk', label: 'Painting' },
    { key: 'auto-brakes', label: 'Auto repair' }, { key: 'web-designer', label: 'Web design' }, { key: 'consultant', label: 'Consulting' }] }) });
});

PROFESSIONS.forEach(p => {
  app.get(p.path, (req, res) => {
    res.render('profession', { profession: p, professions: PROFESSIONS, tool: toolConfig(res, { presetButtons: p.presetButtons }) });
  });
});

COUNTRIES.forEach(c => {
  app.get('/free-quote-generator-' + c.slug, (req, res) => {
    res.render('country', { country: c, countries: COUNTRIES, professions: PROFESSIONS, factsChecked: COUNTRY_FACTS_CHECKED,
      tool: toolConfig(res, { currency: c.currency, taxRate: c.taxRate, taxLabel: c.tax }) });
  });
});

GUIDE_PAGES.forEach(page => {
  app.get('/' + page.slug, (req, res) => res.render('guide', { page }));
});

app.get('/blog', (req, res) => {
  res.render('blog-index', { posts: BLOG_POSTS, howTo: HOW_TO_PAGES, guides: GUIDE_PAGES });
});

BLOG_POSTS.forEach(post => {
  app.get('/blog/' + post.slug, (req, res) => {
    res.render('blog-post', { post, relatedPosts: BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3) });
  });
});

HOW_TO_PAGES.forEach(page => {
  app.get('/' + page.slug, (req, res) => {
    res.render('how-to', { page, professions: PROFESSIONS, tool: page.preset ? toolConfig(res, { presetButtons: [{ key: page.preset, label: 'Example roofing quote' }] }) : null });
  });
});

app.get('/activate', (req, res) => res.render('activate', { productId: pro.PRODUCT_ID }));

// -- PDF ----------------------------------------------------------------------------
app.post('/generate-pdf', (req, res) => {
  try {
    const d = pdf.normalise(req.body);
    const isPro = res.locals.isPro;
    if (d.docType === 'invoice' && !isPro) {
      return res.status(402).json({ error: 'Creating an invoice from a quote is part of Pro. Activate your licence key to use it.' });
    }
    const base = (d.docType === 'invoice' ? 'invoice-' + d.invoiceNumber : 'quote-' + d.quoteNumber).replace(/[^a-z0-9-]/gi, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="' + base + '.pdf"');
    res.setHeader('Cache-Control', 'no-store');
    pdf.build(d, { isPro }, res);
  } catch (err) {
    console.error('PDF error:', err);
    if (!res.headersSent) res.status(500).json({ error: 'The PDF could not be created. Please try again.' });
  }
});

// -- Pro activation (Gumroad licence key) -----------------------------------------
app.post('/activate-pro', async (req, res) => {
  const key = (req.body && (req.body.license_key || req.body.licenseKey)) || '';
  const result = await pro.verifyLicense(key, { increment: true });
  if (!result.ok) return res.status(result.reason === 'network' ? 503 : 400).json({ success: false, message: result.message });
  res.cookie(pro.COOKIE, result.key, pro.cookieOptions(req));
  res.clearCookie('pro');
  res.json({ success: true });
});

app.post('/deactivate-pro', (req, res) => {
  res.clearCookie(pro.COOKIE, { path: '/' });
  res.clearCookie('pro');
  res.json({ success: true });
});

// Gumroad pings used to unlock Pro by email without any proof of purchase. They are now ignored;
// access comes only from a licence key that Gumroad confirms.
app.post('/gumroad-webhook', (req, res) => res.sendStatus(200));

// -- SEO ------------------------------------------------------------------------------
app.get('/sitemap.xml', (req, res) => {
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    sitemapEntries().map(u => '  <url><loc>' + SITE_URL + u.loc + '</loc><lastmod>' + u.lastmod + '</lastmod></url>').join('\n') + '\n</urlset>\n';
  res.set('Content-Type', 'application/xml').send(xml);
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /activate\n\nSitemap: ' + SITE_URL + '/sitemap.xml\n');
});

app.get('/google-verification', (req, res) => { res.type('text/html'); res.send('google-site-verification: SRbRrdv1CAaGtpC67I5g5htAbMp2LmyqfylqDAKWvK0'); });

app.use((req, res) => {
  res.status(404).render('not-found', { professions: PROFESSIONS });
});

const PORT = process.env.PORT || 10000;
if (require.main === module) app.listen(PORT, '0.0.0.0', () => console.log('QuotationMaker running on ' + PORT));
module.exports = app;
