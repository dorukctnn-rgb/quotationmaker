// The pieces of the QuotationMaker counter report (read.mjs): totals from the counter, sales from Gumroad, put side by side per
// page. Pure functions plus two small readers that take their fetch as an argument, so the tests run on fixtures.
// Nothing here writes anywhere.

const DAY = 864e5;
export const dayOf = (ms) => new Date(ms).toISOString().slice(0, 10);
// the UTC days of a window of `days` days ending today, first and last as YYYY-MM-DD
export function windowOf(days, now = Date.now()) {
  return { days, from: dayOf(now - (days - 1) * DAY), to: dayOf(now) };
}

// The eight words a note can carry, sorted into the three classes of the review. A note with no word came from a page of this
// site that is not counted (the visit began there), so its source is not known.
export const CLASSES = ['organic', 'referral', 'direct', 'unknown'];
export const CLASS_OF = {
  google: 'organic', bing: 'organic', 'other-search': 'organic',
  'ai-assistant': 'referral', pinterest: 'referral', social: 'referral', referral: 'referral',
  direct: 'direct',
};
export const classOf = (word) => CLASS_OF[word] || 'unknown';

// ---------------------------------------------------------------- the counter (Worker "qm-counter")
export async function readCounter({ url, key, days, by, fetchFn = fetch }) {
  const r = await fetchFn(`${url.replace(/\/+$/, '')}/r?days=${days}&by=${by.join(',')}`, { headers: { Authorization: `Bearer ${key}` } });
  if (r.status === 404) throw new Error('the counter is not deployed yet (or has no key set): the Worker answered 404 on /r');
  if (r.status === 401) throw new Error('the counter refused the key (401): check COUNTER_ADMIN_KEY');
  if (!r.ok) throw new Error(`the counter answered ${r.status}`);
  const j = await r.json();
  return j.rows || [];
}

// ---------------------------------------------------------------- sales (Gumroad API, read only)
// GET /v2/sales for every page from `after` on. Only the fields the report needs are kept: no e-mail, no name, no key.
export async function readSales({ token, after, fetchFn = fetch, maxPages = 60 }) {
  const out = [];
  let pageKey = '';
  for (let i = 0; i < maxPages; i++) {
    const q = new URLSearchParams({ after });
    if (pageKey) q.set('page_key', pageKey);
    const r = await fetchFn(`https://api.gumroad.com/v2/sales?${q}`, { headers: { Authorization: `Bearer ${token}` } });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.success) throw new Error(`Gumroad answered ${r.status}${j.message ? `: ${String(j.message).slice(0, 80)}` : ''}`);
    for (const s of j.sales || []) {
      out.push({ at: String(s.created_at || ''), cents: Number(s.price) || 0, product: String(s.product_name || ''), permalink: String(s.product_permalink || ''), refunded: !!(s.refunded || s.chargedback) });
    }
    if (!j.next_page_key) break;
    pageKey = j.next_page_key;
  }
  return out;
}

// QuotationMaker Pro: the product behind the Get Pro links (dorukctn.gumroad.com/l/cjogv).
export const isQuotationMakerPro = (s) => s.permalink === 'cjogv' || /quotation\s*maker/i.test(s.product);
// A real sale: paid something, not refunded or charged back. Free test purchases ($0, our own test codes) are not sales.
export const isSale = (s) => s.cents > 0 && !s.refunded;

// ---------------------------------------------------------------- the report
// rows: counter rows [{e, p, w, s, n}] for one window (t is always quotationmaker; test notes, t "selftest", are left out);
// sales: readSales() output or null when Gumroad was not asked
export function buildReport({ rows, sales = null, window: win, skipped = [] }) {
  const pages = new Map();
  const blank = () => ({ views: 0, clicks: 0, byPlace: {}, byWord: {}, view: { organic: 0, referral: 0, direct: 0, unknown: 0 }, click: { organic: 0, referral: 0, direct: 0, unknown: 0 } });
  const get = (p) => { if (!pages.has(p)) pages.set(p, { page: p || '(unknown)', ...blank() }); return pages.get(p); };
  const total = blank();
  for (const r of rows) {
    if (r.t !== undefined && r.t !== 'quotationmaker') continue;
    if (r.e !== 'view' && r.e !== 'click') continue;
    const cls = classOf(r.s);
    const word = r.s || '(unknown)';
    for (const t of [get(r.p || ''), total]) {
      if (r.e === 'view') { t.views += r.n; t.view[cls] += r.n; }
      else {
        t.clicks += r.n; t.click[cls] += r.n;
        t.byPlace[r.w || '(unknown)'] = (t.byPlace[r.w || '(unknown)'] || 0) + r.n;
        t.byWord[word] = (t.byWord[word] || 0) + r.n;
      }
    }
  }
  const list = [...pages.values()].sort((a, b) => b.clicks - a.clicks || b.views - a.views || a.page.localeCompare(b.page));
  let gumroad = null;
  if (sales) {
    const mine = sales.filter((s) => isQuotationMakerPro(s) && isSale(s) && s.at.slice(0, 10) >= win.from && s.at.slice(0, 10) <= win.to);
    gumroad = { sales: mine.length, cents: mine.reduce((a, s) => a + s.cents, 0), days: [...new Set(mine.map((s) => s.at.slice(0, 10)))].sort() };
  }
  return { window: win, pages: list, total, gumroad, skipped };
}

const money = (c) => `$${(c / 100).toFixed(2)}`;
const pct = (a, b) => (b > 0 ? `${((a / b) * 100).toFixed(1)}%` : '-');
const pad = (s, n, right = false) => (right ? String(s).padStart(n) : String(s).padEnd(n));
const top = (obj, n = 4) => Object.entries(obj).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n).map(([k, v]) => `${k} ${v}`).join(', ');

export function formatReport(rep, { source = false, words = false } = {}) {
  const w = rep.window;
  const lines = [`QuotationMaker counter, last ${w.days} days (${w.from} to ${w.to}, UTC days, today included)`];
  const width = Math.max(10, ...rep.pages.map((p) => p.page.length)) + 2;
  lines.push(pad('page', width) + pad('views', 8, true) + pad('clicks', 8, true) + pad('click/view', 12, true) + '   where the clicks were');
  for (const p of rep.pages) {
    lines.push(pad(p.page, width) + pad(p.views, 8, true) + pad(p.clicks, 8, true) + pad(pct(p.clicks, p.views), 12, true) + '   ' + (p.clicks ? top(p.byPlace) : ''));
    if (source) {
      const cls = CLASSES.map((c) => `${c} ${p.view[c]}/${p.click[c]}`).join(', ');
      lines.push(pad('', width) + `   views/clicks by kind of site: ${cls}`);
      if (words && p.clicks) lines.push(pad('', width) + `   click words: ${top(p.byWord, 8)}`);
    }
  }
  const t = rep.total;
  lines.push(pad('total', width) + pad(t.views, 8, true) + pad(t.clicks, 8, true) + pad(pct(t.clicks, t.views), 12, true));
  lines.push('', 'By kind of site (views / Pro clicks):');
  for (const c of CLASSES) lines.push(`  ${pad(c, 9)}${pad(t.view[c], 8, true)} / ${pad(t.click[c], 5)}${c === 'unknown' ? '  (the visit began on a page that is not counted)' : ''}`);
  if (words && t.clicks) lines.push(`  Pro click words: ${top(t.byWord, 8)}`);
  if (rep.gumroad) lines.push('', `Gumroad: ${rep.gumroad.sales} QuotationMaker Pro sale${rep.gumroad.sales === 1 ? '' : 's'} in these days (${money(rep.gumroad.cents)})${rep.gumroad.days.length ? `, on ${rep.gumroad.days.join(', ')}` : ''}`);
  return lines.map((l) => l.trimEnd()).join('\n');
}
