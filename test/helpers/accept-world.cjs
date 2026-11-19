// A stand-in, inside this process, for everything the acceptance feature talks to, so that the tests and the browser test run the site's real
// code, the Worker's real handler and core (on node:sqlite) and nothing that leaves this machine:
//   - the Worker qm-accept (accept-worker/handler.js + core.js) at QM_ACCEPT_WORKER
//   - the Pro key check of the Worker peak-pay (any Paddle key is a yes unless world.pro is changed)
//   - Forward Email (the acceptance e-mail is recorded in world.mails, nothing is sent)
// Any other address outside this machine is an error: a test that reaches for the internet fails.
const paddle = require('../../lib/paddle');

const SECRET = 'test-secret-'.padEnd(48, 'x');
const WORKER = 'https://qm-accept.test';

async function installWorld({ mail = true } = {}) {
  const { DatabaseSync } = require('node:sqlite');
  const { AcceptCore } = await import('../../accept-worker/core.js');
  const { forwardEmailSender } = await import('../../accept-worker/mail.js');
  const { handle } = await import('../../accept-worker/handler.js');

  process.env.QM_ACCEPT_SECRET = SECRET;
  process.env.QM_ACCEPT_WORKER = WORKER;
  const realFetch = globalThis.fetch;
  const world = { mails: [], worker: [], proChecks: 0, pro: 200, down: false, offset: 0, mailAnswer: 200, secret: SECRET, workerUrl: WORKER };
  const db = new DatabaseSync(':memory:');
  const exec = (q, ...p) => { const st = db.prepare(q); return /^\s*SELECT/i.test(q) ? st.all(...p) : (st.run(...p), []); };
  const txn = fn => { db.exec('BEGIN'); try { const r = fn(); db.exec('COMMIT'); return r; } catch (e) { db.exec('ROLLBACK'); throw e; } };
  const fakeFetch = async (url, init = {}) => {
    const u = String(url);
    if (u.startsWith(WORKER)) {
      world.worker.push({ path: new URL(u).pathname, headers: Object.fromEntries(new Headers(init.headers || {})), body: init.body });
      if (world.down) throw new TypeError('fetch failed');
      return handle(new Request(u, { method: init.method, headers: init.headers, body: init.body }), { ACCEPT_SITE_SECRET: SECRET }, { stub: world.core });
    }
    if (u.startsWith(paddle.WORKER)) {
      world.proChecks++;
      return new Response(JSON.stringify(world.pro === 200 ? { ok: true, plan: 'lifetime' } : {}), { status: world.pro, headers: { 'Content-Type': 'application/json' } });
    }
    if (u.startsWith('https://api.forwardemail.net/')) {
      world.mails.push(JSON.parse(init.body));
      return new Response('{}', { status: world.mailAnswer });
    }
    if (/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(u)) return realFetch(url, init);
    throw new Error('the test reached for an address outside this machine: ' + u);
  };
  globalThis.fetch = fakeFetch;
  const sender = mail ? forwardEmailSender({ token: 'alias@sender.test:pw', from: 'Sender <alias@sender.test>', fetchImpl: (...a) => globalThis.fetch(...a), pauseMs: 0 }) : null;
  world.db = db;
  world.core = new AcceptCore(exec, txn, { now: () => Date.now() + world.offset, mail: sender, siteUrl: 'https://www.getquotationmaker.com' });
  world.restore = () => { globalThis.fetch = realFetch; delete process.env.QM_ACCEPT_SECRET; delete process.env.QM_ACCEPT_WORKER; };
  return world;
}

// two Paddle-format Pro keys (the format lib/paddle.js expects); they only mean something to the stand-in above
const keyN = n => 'pp-t-' + String(n).padStart(26, 'k') + '-' + '0123456789abcdef01234567';

module.exports = { installWorld, keyN, SECRET, WORKER };
