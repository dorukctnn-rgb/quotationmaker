#!/usr/bin/env node
// The page and Get Pro click report of getquotationmaker.com: for each page the views, the Get Pro clicks (with the part of the
// page they were in), the click rate, the split by kind of site (organic, referral, direct, not known), and the QuotationMaker Pro
// sales Gumroad shows for the same days. Last 7 and 30 UTC days. Read only: it writes nothing anywhere.
//
//   node counter-worker/read.mjs                    7 and 30 days
//   node counter-worker/read.mjs --days 14          one window (or several: --days 7,14,30)
//   node counter-worker/read.mjs --page /blog/x     only that page (its address path)
//   node counter-worker/read.mjs --source           under each page, views and clicks by kind of site; add --words for the eight words
//   node counter-worker/read.mjs --json             the same numbers as JSON
//   node counter-worker/read.mjs --no-gumroad       the counter only
//   node counter-worker/read.mjs --selftest         one test note into the counter (site "selftest") and read it back
//
// Keys (never printed): COUNTER_ADMIN_KEY or C:\Users\doruk\.claude\skills\store-deploy\secrets\qm-counter.json {"adminKey"};
// GUMROAD_TOKEN or ...\secrets\bodyarcade\gumroad-token.txt. COUNTER_URL overrides the Worker's address.
// What the numbers mean: a view is a page opening in a browser that ran the script (crawlers and ad blockers are not in it); a click
// is a Get Pro link followed, not a sale. Pages left as they were (content/counter-skip.json) are not counted at all, so their
// views and Pro clicks never show here; a sale from one of them shows under Gumroad with no click. "unknown" kind of site means the
// visit began on one of those pages. Sale and click days only line up roughly: nothing joins a click to a sale.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { windowOf, readCounter, readSales, buildReport, formatReport } from './read-lib.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SECRETS = process.env.PEAK_SECRETS || path.join(os.homedir(), '.claude', 'skills', 'store-deploy', 'secrets');
const URL_BASE = process.env.COUNTER_URL || 'https://qm-counter.railer-iot.workers.dev';
const arg = (name, def = '') => { const i = process.argv.indexOf(name); return i > -1 ? (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : '1') : def; };
const has = (name) => process.argv.includes(name);

function readKey() {
  if (process.env.COUNTER_ADMIN_KEY) return process.env.COUNTER_ADMIN_KEY.trim();
  try { return String(JSON.parse(fs.readFileSync(path.join(SECRETS, 'qm-counter.json'), 'utf8')).adminKey || '').trim(); } catch { return ''; }
}
function gumroadToken() {
  if (process.env.GUMROAD_TOKEN) return process.env.GUMROAD_TOKEN.trim();
  try { return fs.readFileSync(path.join(SECRETS, 'bodyarcade', 'gumroad-token.txt'), 'utf8').trim(); } catch { return ''; }
}
function skippedPages() {
  try { return JSON.parse(fs.readFileSync(path.join(HERE, '..', 'content', 'counter-skip.json'), 'utf8')).paths || []; } catch { return []; }
}

async function selftest(key) {
  const note = { e: 'click', t: 'selftest', p: '/selftest', w: 'main', s: 'direct' };
  const total = async () => (await readCounter({ url: URL_BASE, key, days: 1, by: ['t'] })).filter((r) => r.t === 'selftest').reduce((a, r) => a + r.n, 0);
  const before = await total();
  const r = await fetch(`${URL_BASE}/e`, { method: 'POST', headers: { Origin: 'https://www.getquotationmaker.com', 'Content-Type': 'text/plain;charset=UTF-8', 'User-Agent': 'Mozilla/5.0 (counter selftest)' }, body: JSON.stringify(note) });
  const after = await total();
  console.log(`POST /e answered ${r.status} (want 204); selftest total ${before} -> ${after} (want +1)`);
  process.exit(r.status === 204 && after === before + 1 ? 0 : 1);
}

async function main() {
  const key = readKey();
  if (!key) { console.error('No counter key: set COUNTER_ADMIN_KEY or put {"adminKey": "..."} in ' + path.join(SECRETS, 'qm-counter.json')); process.exit(2); }
  if (has('--selftest')) return selftest(key);
  const windows = (arg('--days', '7,30') || '7,30').split(',').map(Number).filter((n) => n >= 1 && n <= 400);
  if (!windows.length) { console.error('--days takes numbers from 1 to 400, such as 7,30'); process.exit(2); }
  const only = arg('--page', '').toLowerCase();
  const widest = Math.max(...windows);
  const notes = [];

  let sales = null;
  if (!has('--no-gumroad')) {
    const token = gumroadToken();
    if (!token) notes.push('Gumroad: no token (GUMROAD_TOKEN or the secrets file), so sales are not shown.');
    else {
      try { sales = await readSales({ token, after: windowOf(widest + 1).from }); }
      catch (e) { notes.push(`Gumroad: ${e.message}`); }
    }
  }
  const skipped = skippedPages();
  const reports = [];
  let counterFailed = false;
  for (const days of windows) {
    let rows = [];
    try { rows = await readCounter({ url: URL_BASE, key, days, by: ['e', 't', 'p', 'w', 's'] }); }
    catch (e) { counterFailed = true; notes.push(`Counter: ${e.message}`); }
    reports.push(buildReport({ rows: only ? rows.filter((r) => r.p === only) : rows, sales, window: windowOf(days), skipped }));
  }
  if (has('--json')) { console.log(JSON.stringify({ reports, notes }, null, 1)); if (counterFailed) process.exit(1); return; }
  if (!counterFailed) for (const rep of reports) console.log(formatReport(rep, { source: has('--source') || has('--words'), words: has('--words') }) + '\n');
  if (!counterFailed) notes.push(`Not counted: ${skipped.length} pages are left exactly as they were and never send a note (content/counter-skip.json): ${skipped.join(' ')}`);
  for (const n of [...new Set(notes)]) console.log(n);
  if (counterFailed) process.exit(1);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
