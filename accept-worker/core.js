// The storage rules of the quote acceptance links of https://www.getquotationmaker.com (the Worker "qm-accept").
//
// A Pro user sends a quote for acceptance: the site (never the browser) asks this Worker to keep a snapshot of the quote and gets
// back two private codes of 128 random bits each: one for the client's link (read the quote, accept it) and one for the sender's
// status link. Nothing here knows who the sender is: the site hands over a code made from the Pro key with a secret of its own
// (an "entitlement"), only to count how many links one purchase made in a day. The Pro key itself never reaches this Worker.
//
// Kept per link, for 90 days and then deleted: the snapshot (what the PDF is made from, logo included, at most 200 KB), the times
// it was created, first opened and accepted, and what the client typed when accepting (a name and an optional note). The sender's
// notification address, when there is one, is kept until the acceptance e-mail has been tried and is then deleted. Never stored:
// an IP address, a user agent, a cookie or anything else about the client's device.
//
// AcceptCore runs inside one Durable Object (SQLite) in production and on node:sqlite in the tests.
// exec(sql, ...params) returns an array of row objects; txn(fn) runs fn atomically and returns its result.
import { acceptedMail, cleanNumber } from './mail.js';

export const DAY = 24 * 60 * 60 * 1000;
export const KEEP_MS = 90 * DAY;                    // a link lives 90 days from the moment it is made
export const MAX_SNAPSHOT_BYTES = 200 * 1000;       // the whole snapshot as JSON, logo data address included
export const MAX_LINKS_PER_DAY = 30;                // per entitlement, in any 24 hours
export const MAX_LINKS_PER_DAY_ALL = 500;           // everyone together, in any 24 hours: a stop if something is wrong
export const MAX_STORED_BYTES = 1000 * 1000 * 1000; // snapshots kept at one time (the Workers Free plan allows 5 GB)
export const MAX_MAILS_PER_DAY = 200;               // acceptance e-mails in one UTC day, everyone together
export const MAX_NAME = 100;
export const MAX_NOTE = 1000;
export const ID_RE = /^[a-z2-7]{26}$/;              // 16 random bytes in base32 (128 bits): a client code or a status code
const ENT_RE = /^[a-f0-9]{32}$/;
const EMAIL_RE = /^[^\s@<>",;:()\[\]\\]{1,64}@[^\s@<>",;:()\[\]\\]{1,190}\.[^\s@<>",;:()\[\]\\]{2,}$/;
const LOGO_RE = /^data:image\/(png|jpe?g);base64,[A-Za-z0-9+\/=]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DEFAULT_SITE = 'https://www.getquotationmaker.com';

const B32 = 'abcdefghijklmnopqrstuvwxyz234567';
const defaultRandom = n => crypto.getRandomValues(new Uint8Array(n));
// 16 random bytes -> 26 characters of a-z and 2-7
export function newId(random = defaultRandom) {
  const bytes = random(16);
  let bits = 0, val = 0, out = '';
  for (const x of bytes) {
    val = (val << 8) | x; bits += 8;
    while (bits >= 5) { out += B32[(val >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += B32[(val << (5 - bits)) & 31];
  return out;
}

// Control characters and the marks that reorder text on screen are removed from everything that is typed. Single-line fields lose
// line breaks and tabs too. (HTML is not touched here: this Worker never makes a page. The site writes it with escaping.)
const CTRL = new RegExp('[' + [[0, 8], [11, 12], [14, 31], [127, 159], [0x2028, 0x2029], [0x202A, 0x202E], [0x2066, 0x2069]].map(r => String.fromCharCode(r[0]) + '-' + String.fromCharCode(r[1])).join('') + ']', 'g');
export function text(v, max, multi = false) {
  // only a string or a plain number is text: an object or an array becomes nothing, not "[object Object]"
  let s = (typeof v === 'string' ? v : (typeof v === 'number' && Number.isFinite(v) ? String(v) : '')).replace(/\r\n?/g, '\n').replace(CTRL, '');
  if (!multi) s = s.replace(/[\n\t]/g, ' ');
  return s.slice(0, max);
}
const num = v => { const n = parseFloat(v); return Number.isFinite(n) ? Math.max(-1e12, Math.min(1e12, n)) : 0; };

// The same shape as the PDF's own data (lib/pdf.js normalise() on the site), cleaned again here. A logo that is not a PNG or JPEG
// data address is dropped.
export function cleanSnapshot(q) {
  if (!q || typeof q !== 'object' || Array.isArray(q)) return null;
  const items = (Array.isArray(q.items) ? q.items : []).slice(0, 200).map(i => ({ desc: text(i && i.desc, 1000, true), qty: num(i && i.qty), rate: num(i && i.rate) }));
  return {
    v: 1,
    fromName: text(q.fromName, 150), fromEmail: text(q.fromEmail, 150), fromAddress: text(q.fromAddress, 400, true),
    toName: text(q.toName, 150), toEmail: text(q.toEmail, 150), toAddress: text(q.toAddress, 400, true),
    quoteNumber: text(q.quoteNumber, 40) || 'Q-001', quoteDate: text(q.quoteDate, 20), validUntil: text(q.validUntil, 20),
    notes: text(q.notes, 5000, true), items,
    currency: /^[A-Z]{3}$/.test(q.currency) ? q.currency : 'USD',
    taxRate: Math.max(0, Math.min(100, num(q.taxRate))), taxLabel: text(q.taxLabel, 30) || 'Tax',
    discount: Math.max(0, num(q.discount)), discountType: q.discountType === 'percent' ? 'percent' : 'fixed',
    color: /^#[0-9a-f]{6}$/i.test(q.color || '') ? q.color : '#0f4c81',
    logo: typeof q.logo === 'string' && q.logo.length <= 400000 && LOGO_RE.test(q.logo) ? q.logo : '',
  };
}

// The totals, worked out the way the PDF works them out (lib/pdf.js).
export function totalsOf(s) {
  const sub = s.items.reduce((a, i) => a + i.qty * i.rate, 0);
  const disc = s.discountType === 'percent' ? sub * (s.discount / 100) : s.discount;
  const after = sub - disc;
  const tax = after * (s.taxRate / 100);
  return { sub, disc, tax, total: after + tax };
}

export function cleanEmail(v) {
  const s = text(v, 200).trim();
  return s.length <= 120 && EMAIL_RE.test(s) ? s : '';
}
export function cleanName(v) {
  const s = text(v, 400).replace(/\s+/g, ' ').trim();
  return s.length >= 2 && s.length <= MAX_NAME && /\p{L}/u.test(s) ? s : '';
}
export const cleanNote = v => text(v, MAX_NOTE * 4, true).replace(/\n{3,}/g, '\n\n').trim().slice(0, MAX_NOTE);

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS links (
     id TEXT PRIMARY KEY, st TEXT NOT NULL UNIQUE, ent TEXT NOT NULL,
     created INTEGER NOT NULL, expires INTEGER NOT NULL,
     snapshot TEXT NOT NULL, size INTEGER NOT NULL,
     first_view INTEGER, accepted INTEGER, a_name TEXT, a_note TEXT, notify TEXT)`,
  'CREATE INDEX IF NOT EXISTS links_ent ON links (ent, created)',
  'CREATE INDEX IF NOT EXISTS links_expires ON links (expires)',
  'CREATE TABLE IF NOT EXISTS mails (day TEXT PRIMARY KEY, n INTEGER NOT NULL)',
];
const dayOf = ms => new Date(ms).toISOString().slice(0, 10);

export class AcceptCore {
  // mail: { send({ to, subject, text }) -> 'sent' | 'refused' | 'unreachable' } or null (no e-mail is sent then)
  constructor(exec, txn, { now = () => Date.now(), random = defaultRandom, mail = null, siteUrl = DEFAULT_SITE, limits = {} } = {}) {
    this.exec = exec; this.txn = txn; this.now = now; this.random = random; this.mail = mail;
    this.siteUrl = String(siteUrl || DEFAULT_SITE).replace(/\/+$/, '');
    this.lim = { snapshotBytes: MAX_SNAPSHOT_BYTES, perDay: MAX_LINKS_PER_DAY, perDayAll: MAX_LINKS_PER_DAY_ALL, storedBytes: MAX_STORED_BYTES, mailsPerDay: MAX_MAILS_PER_DAY, ...limits };
    for (const s of SCHEMA) exec(s);
  }

  // -> { id, st, expires } | { error: 'bad_request' | 'too_large' | 'rate_limited' (retryAfter seconds) | 'busy' }
  create({ entitlement, snapshot, notify } = {}) {
    if (!ENT_RE.test(String(entitlement || ''))) return { error: 'bad_request' };
    const snap = cleanSnapshot(snapshot);
    if (!snap) return { error: 'bad_request' };
    const json = JSON.stringify(snap);
    const size = new TextEncoder().encode(json).length;
    if (size > this.lim.snapshotBytes) return { error: 'too_large', max: this.lim.snapshotBytes, size };
    const to = cleanEmail(notify);
    return this.txn(() => {
      const now = this.now();
      const mine = this.exec('SELECT COUNT(*) AS c, MIN(created) AS m FROM links WHERE ent = ? AND created > ?', entitlement, now - DAY)[0];
      if (Number(mine.c) >= this.lim.perDay) return { error: 'rate_limited', retryAfter: Math.max(1, Math.ceil((Number(mine.m) + DAY - now) / 1000)) };
      if (Number(this.exec('SELECT COUNT(*) AS c FROM links WHERE created > ?', now - DAY)[0].c) >= this.lim.perDayAll) return { error: 'busy' };
      if (Number(this.exec('SELECT COALESCE(SUM(size), 0) AS s FROM links')[0].s) + size > this.lim.storedBytes) return { error: 'busy' };
      let id, st;
      do { id = newId(this.random); } while (this.exec('SELECT 1 AS x FROM links WHERE id = ? OR st = ?', id, id)[0]);
      do { st = newId(this.random); } while (st === id || this.exec('SELECT 1 AS x FROM links WHERE id = ? OR st = ?', st, st)[0]);
      const expires = now + KEEP_MS;
      this.exec('INSERT INTO links (id, st, ent, created, expires, snapshot, size, notify) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        id, st, entitlement, now, expires, json, size, to || null);
      return { id, st, expires };
    });
  }

  row(col, code) {
    if (!ID_RE.test(String(code || ''))) return null;
    const r = this.exec(`SELECT * FROM links WHERE ${col === 'st' ? 'st' : 'id'} = ?`, code)[0];
    return r || null;
  }

  present(r, withQuote) {
    const snap = JSON.parse(r.snapshot);
    const accepted = r.accepted == null ? null : { at: Number(r.accepted), name: r.a_name || '', note: r.a_note || '' };
    const out = {
      state: accepted ? 'accepted' : (r.first_view == null ? 'sent' : 'viewed'),
      created: Number(r.created), expires: Number(r.expires),
      firstView: r.first_view == null ? null : Number(r.first_view),
      accepted,
      // accepted on a later day than the valid-until date the quote carries
      late: !!(accepted && DATE_RE.test(snap.validUntil) && dayOf(accepted.at) > snap.validUntil),
    };
    if (withQuote) out.quote = snap;
    else out.quote = { number: snap.quoteNumber, toName: snap.toName, currency: snap.currency, total: totalsOf(snap).total, validUntil: snap.validUntil };
    return out;
  }

  // The client opens the link. mark: this open counts as "viewed" (the site passes false for crawlers and previews).
  // -> the link's data with the quote | { error: 'not_found' | 'expired' }
  view(id, { mark = false } = {}) {
    return this.txn(() => {
      const r = this.row('id', id);
      if (!r) return { error: 'not_found' };
      if (Number(r.expires) <= this.now()) return { error: 'expired' };
      if (mark && r.first_view == null) { r.first_view = this.now(); this.exec('UPDATE links SET first_view = ? WHERE id = ?', r.first_view, id); }
      return this.present(r, true);
    });
  }

  // The sender's page: up to 20 status codes at once. A code that is unknown or expired comes back as state "gone".
  status(codes) {
    const list = (Array.isArray(codes) ? codes : []).slice(0, 20);
    return {
      items: list.map(c => {
        const r = this.row('st', c);
        if (!r || Number(r.expires) <= this.now()) return { state: 'gone' };
        return { st: c, ...this.present(r, false) };
      }),
    };
  }

  // The client accepts: a name they typed, a confirmation and an optional note. Recorded once; a second press gives back the first.
  // -> { ok, accepted, already, mail } | { error: 'not_found' | 'expired' | 'confirm' | 'name' }
  async accept(id, { name, note, confirm } = {}) {
    if (confirm !== true) return { error: 'confirm' };
    const who = cleanName(name);
    if (!who) return { error: 'name' };
    const said = cleanNote(note);
    const done = this.txn(() => {
      const r = this.row('id', id);
      if (!r) return { error: 'not_found' };
      if (Number(r.expires) <= this.now()) return { error: 'expired' };
      if (r.accepted != null) return { ok: true, already: true, accepted: { at: Number(r.accepted), name: r.a_name || '', note: r.a_note || '' } };
      const at = this.now();
      this.exec('UPDATE links SET accepted = ?, a_name = ?, a_note = ?, first_view = COALESCE(first_view, ?) WHERE id = ?', at, who, said, at, id);
      return { ok: true, already: false, accepted: { at, name: who, note: said }, notify: r.notify || '', st: r.st, number: JSON.parse(r.snapshot).quoteNumber };
    });
    if (done.error || done.already) return done;
    // the one e-mail, tried once, then the address is deleted whatever happened
    let mail = 'none';
    if (done.notify) {
      if (!this.mail) mail = 'off';
      else if (!this.mailRoom()) mail = 'limit';
      else {
        const m = acceptedMail({ number: done.number, statusUrl: this.siteUrl + '/quote-status#' + done.st });
        try { mail = (await this.mail.send({ to: done.notify, subject: m.subject, text: m.text })) === 'sent' ? 'sent' : 'failed'; } catch (e) { mail = 'failed'; }
      }
      this.exec('UPDATE links SET notify = NULL WHERE id = ?', id);
    }
    return { ok: true, already: false, accepted: done.accepted, mail };
  }

  // one more e-mail today? (counts it when there is room)
  mailRoom() {
    return this.txn(() => {
      const day = dayOf(this.now());
      const n = Number((this.exec('SELECT n FROM mails WHERE day = ?', day)[0] || { n: 0 }).n);
      if (n >= this.lim.mailsPerDay) return false;
      this.exec('INSERT INTO mails (day, n) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET n = n + 1', day);
      return true;
    });
  }

  // expired links (with what the client typed) and old mail counters are deleted
  purge() {
    const now = this.now();
    this.exec('DELETE FROM links WHERE expires <= ?', now);
    this.exec('DELETE FROM mails WHERE day < ?', dayOf(now - 3 * DAY));
    return true;
  }
}

export { cleanNumber };
