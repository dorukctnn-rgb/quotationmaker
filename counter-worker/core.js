// The counting rules of the QuotationMaker counter (the Worker "qm-counter"). No cookies, no personal data, no IP address: the
// only thing ever stored is a daily total for one combination of
//   e  what happened   view (a page opened) or click (a Get Pro link was followed)
//   t  the site        quotationmaker (and "selftest", the read script's own test note)
//   p  the page        the address path only, never a query or a #
//   w  where           which part of the page the button was in (empty for a view)
//   s  the kind of site that sent the visitor: one of eight words, or empty when it is not known; never an address
// These are the counting rules of the Pro-click counter of Peak Apps Tools (peak-tools funnel-worker/core.js) with a shorter event
// list, a fixed list of sites and its own table name; the rest is the same, so a fix to one can be carried to the other.
//
// CounterCore runs inside one Durable Object (SQLite) in production and on node:sqlite in the tests.
// exec(sql, ...params) returns an array of row objects; txn(fn) runs fn atomically and returns its result.

export const EVENTS = ['view', 'click'];
export const SITES = ['quotationmaker', 'selftest']; // "selftest" is the read script's own test note, kept apart from the real counts
export const SOURCES = ['google', 'bing', 'other-search', 'ai-assistant', 'pinterest', 'social', 'referral', 'direct'];
export const MAX_BODY = 600;          // bytes of one note
export const MAX_ROWS_PER_DAY = 3000; // distinct combinations a day; more are counted as "overflow" and nothing else
export const KEEP_DAYS = 400;         // daily totals are deleted after this many days

const PATH_RE = /^\/[a-z0-9\/._-]{0,119}$/;
const PLACE_RE = /^[a-z0-9][a-z0-9#._-]{0,39}$/;

// One note from a browser (JSON text or an object) -> the clean record, or null when it is not a note. A path, place or source
// that is not in the allowed shape is stored as '' (the note still counts); a site or event that is not is refused.
export function cleanNote(raw) {
  let j = raw;
  if (typeof raw === 'string') {
    if (raw.length > MAX_BODY) return null;
    try { j = JSON.parse(raw); } catch (e) { return null; }
  }
  if (!j || typeof j !== 'object' || Array.isArray(j)) return null;
  const str = v => (typeof v === 'string' ? v.trim().toLowerCase() : '');
  const e = str(j.e), t = str(j.t);
  if (!EVENTS.includes(e) || !SITES.includes(t)) return null;
  const p = str(j.p), w = str(j.w), s = str(j.s);
  return { e, t, p: PATH_RE.test(p) ? p : '', w: PLACE_RE.test(w) ? w : '', s: SOURCES.includes(s) ? s : '' };
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS counts (
     day TEXT NOT NULL, e TEXT NOT NULL, t TEXT NOT NULL, p TEXT NOT NULL, w TEXT NOT NULL, s TEXT NOT NULL, n INTEGER NOT NULL,
     PRIMARY KEY (day, e, t, p, w, s))`
];
const DAY_MS = 24 * 60 * 60 * 1000;
const dayOf = ms => new Date(ms).toISOString().slice(0, 10);

export class CounterCore {
  constructor(exec, txn, now = () => Date.now()) {
    this.exec = exec;
    this.txn = txn;
    this.now = now;
    for (const s of SCHEMA) exec(s);
  }

  // Adds one to today's total (UTC day) for the note. Returns true when counted, false when the day's room for new
  // combinations is used up (then only the "overflow" total grows).
  note(rec, maxRows = MAX_ROWS_PER_DAY) {
    return this.txn(() => {
      const day = dayOf(this.now());
      const key = [day, rec.e, rec.t, rec.p, rec.w, rec.s];
      const known = this.exec('SELECT n FROM counts WHERE day = ? AND e = ? AND t = ? AND p = ? AND w = ? AND s = ?', ...key)[0];
      let at = key;
      let counted = true;
      if (!known && Number(this.exec('SELECT COUNT(*) AS c FROM counts WHERE day = ?', day)[0].c) >= maxRows) { at = [day, 'overflow', '', '', '', '']; counted = false; }
      this.exec('INSERT INTO counts (day, e, t, p, w, s, n) VALUES (?, ?, ?, ?, ?, ?, 1) ON CONFLICT(day, e, t, p, w, s) DO UPDATE SET n = n + 1', ...at);
      return counted;
    });
  }

  // Totals for the last `days` UTC days including today, grouped by the chosen columns (day, e, t, p, w, s; default all).
  rows({ days = 30, by = ['day', 'e', 't', 'p', 'w', 's'] } = {}) {
    const cols = ['day', 'e', 't', 'p', 'w', 's'].filter(c => by.includes(c));
    const from = dayOf(this.now() - (Math.max(1, Math.min(KEEP_DAYS, Math.floor(days))) - 1) * DAY_MS);
    // the column names come from the fixed list above, never from the caller
    const select = cols.length ? cols.join(', ') + ', ' : '';
    const group = cols.length ? ' GROUP BY ' + cols.join(', ') + ' ORDER BY ' + cols.join(', ') : '';
    return this.exec(`SELECT ${select}SUM(n) AS n FROM counts WHERE day >= ?${group}`, from).map(r => ({ ...r, n: Number(r.n) }));
  }

  purge() {
    this.exec('DELETE FROM counts WHERE day < ?', dayOf(this.now() - KEEP_DAYS * DAY_MS));
    return true;
  }
}
