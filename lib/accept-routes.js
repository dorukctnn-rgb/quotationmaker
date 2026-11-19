// The routes of the quote acceptance links (Pro): see lib/accept.js for how the site and the Worker qm-accept share the work.
//
//   POST /accept/create     Pro only. The quote -> a private link for the client and a status code for the sender.
//   POST /accept/status     { codes: [...] } -> the status of up to 20 links, for the sender's page and the quote tool.
//   GET  /quote-status      the sender's page (the status codes sit in this browser's local storage, or after the #)
//   GET  /q/:id             the client's page: the quote, a PDF link, and the form that accepts it
//   POST /q/:id/accept      the form
//   GET  /q/:id/pdf         the quote as a PDF, for the client
//
// The client's pages say noindex, never send a referrer, are never stored by a cache, load no script and no third-party address, and
// are not counted by the page counter (the link is in the address and must not reach it). Everything typed is written with EJS
// escaping (<%= %>); nothing is put into the page as markup.
const accept = require('./accept');
const pdf = require('./pdf');
const { present, when, day } = require('./accept-view');

const NO_INDEX = 'noindex, nofollow, noarchive';
// The client page loads no script at all, no font or image from another address, and cannot be framed.
const CLIENT_CSP = "default-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'";

const MSG = {
  pro: 'Sending a quote for online acceptance is part of Pro. Activate your licence key or get Pro to use it.',
  off: 'Online acceptance is not switched on yet. Please try again later.',
  down: 'Online acceptance is not available right now. Please try again in a minute.',
  empty: 'Add at least one line item before you send the quote.',
  big: 'This quote is too large to send online (the limit is about 200 KB, including the logo). Use a smaller logo or remove it, then try again.',
  crossSite: 'This request did not come from the quote maker.',
  name: 'Type your full name, at least two letters.',
  confirm: 'Tick the box to confirm that you accept this quote.',
  failed: 'Your acceptance could not be recorded just now and nothing was saved. Please try again in a minute.',
};

function privateHeaders(res) {
  res.set({ 'X-Robots-Tag': NO_INDEX, 'Referrer-Policy': 'no-referrer', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
}
function clientHeaders(res) {
  privateHeaders(res);
  res.set({ 'Content-Security-Policy': CLIENT_CSP, 'X-Frame-Options': 'DENY' });
}
// A request from another site's page (a form or a script there) is not one of ours.
function crossSite(req) {
  if (req.get('sec-fetch-site') === 'cross-site') return true;
  const o = req.get('origin');
  if (!o) return false;
  try { return new URL(o).host !== req.get('host'); } catch (e) { return true; }
}
const todayUtc = () => new Date().toISOString().slice(0, 10);
const asText = v => (typeof v === 'string' ? v : '');

module.exports = function mountAccept(app, { siteUrl }) {
  const gone = (res, kind) => {
    const status = { missing: 404, expired: 410, off: 503, down: 503 }[kind] || 404;
    clientHeaders(res);
    res.locals.countOn = false;
    res.status(status).render('accept-gone', { kind });
  };

  // The client's page for a link the Worker found. form: what was typed, kept when the form is sent back with a message.
  function show(res, id, view, { error = '', form = {}, status = 200 } = {}) {
    clientHeaders(res);
    res.locals.countOn = false;
    const q = present(view.quote);
    const acc = view.accepted ? { name: view.accepted.name, note: view.accepted.note, when: when(view.accepted.at) } : null;
    res.status(status).render('accept-quote', {
      id, q, acc, error, form,
      expires: day(new Date(view.expires).toISOString().slice(0, 10)),
      validPassed: !acc && !!q.validIso && q.validIso < todayUtc(),
    });
  }
  const viewOf = (id, mark) => accept.call('/v1/view', { id, mark });
  const kindOf = r => (r.status === 410 ? 'expired' : r.status === 404 ? 'missing' : 'down');

  // ---- the sender -------------------------------------------------------------------------------------------------------------
  app.post('/accept/create', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (crossSite(req)) return res.status(403).json({ error: MSG.crossSite });
    // the same Pro check as everywhere (lib/pro.js, through the request locals): a free visitor makes no link and the Worker is not asked
    if (!res.locals.isPro) return res.status(402).json({ error: MSG.pro });
    if (!accept.enabled()) return res.status(503).json({ error: MSG.off });
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const q = pdf.normalise(body.quote);
    if (!q.items.some(i => i.desc.trim() || i.rate)) return res.status(400).json({ error: MSG.empty });
    const ent = accept.entitlement(req);
    if (!ent) return res.status(402).json({ error: MSG.pro });
    try {
      const r = await accept.call('/v1/create', { entitlement: ent, snapshot: q, notify: asText(body.notify).trim().slice(0, 200) });
      if (r.status === 200 && r.body.id && r.body.st) {
        return res.json({ ok: true, clientUrl: siteUrl + '/q/' + r.body.id, statusToken: r.body.st, statusUrl: siteUrl + '/quote-status#' + r.body.st, expires: r.body.expires, quoteNumber: q.quoteNumber });
      }
      if (r.status === 413) return res.status(413).json({ error: MSG.big });
      if (r.status === 429) {
        const hours = Math.max(1, Math.ceil((r.retryAfter || 3600) / 3600));
        return res.status(429).json({ error: 'You have made 30 acceptance links in the last 24 hours, which is the limit. Try again in about ' + hours + (hours === 1 ? ' hour.' : ' hours.') });
      }
      if (r.status === 400) return res.status(400).json({ error: MSG.empty });
      console.error('[accept] the Worker answered', r.status, r.body && r.body.error);
      return res.status(503).json({ error: MSG.down });
    } catch (e) {
      console.error('[accept] the Worker could not be reached:', e && e.message);
      return res.status(503).json({ error: MSG.down });
    }
  });

  app.post('/accept/status', async (req, res) => {
    res.set({ 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' });
    if (!accept.enabled()) return res.status(503).json({ error: MSG.off });
    const raw = req.body && Array.isArray(req.body.codes) ? req.body.codes : [];
    const codes = raw.filter(c => typeof c === 'string' && accept.ID_RE.test(c)).slice(0, 20);
    if (!codes.length) return res.json({ items: [] });
    try {
      const r = await accept.call('/v1/status', { codes });
      if (r.status !== 200 || !Array.isArray(r.body.items)) return res.status(503).json({ error: MSG.down });
      return res.json({ items: r.body.items.map((it, i) => Object.assign({}, it, { st: codes[i] })) });
    } catch (e) {
      return res.status(503).json({ error: MSG.down });
    }
  });

  app.get('/quote-status', (req, res) => {
    privateHeaders(res);
    res.locals.countOn = false;
    res.render('quote-status', { enabled: accept.enabled() });
  });

  // ---- the client -------------------------------------------------------------------------------------------------------------
  app.get('/q/:id', async (req, res) => {
    const id = String(req.params.id || '').toLowerCase();
    if (!accept.ID_RE.test(id)) return gone(res, 'missing');
    if (!accept.enabled()) return gone(res, 'off');
    try {
      // a crawler, a link preview or a mail scanner opening the link does not count as "viewed"
      const mark = req.method === 'GET' && !accept.BOT.test(req.get('user-agent') || '');
      const r = await viewOf(id, mark);
      if (r.status === 200) return show(res, id, r.body);
      return gone(res, kindOf(r));
    } catch (e) {
      return gone(res, 'down');
    }
  });

  app.post('/q/:id/accept', async (req, res) => {
    const id = String(req.params.id || '').toLowerCase();
    if (!accept.ID_RE.test(id)) return gone(res, 'missing');
    if (!accept.enabled()) return gone(res, 'off');
    const b = req.body && typeof req.body === 'object' ? req.body : {};
    const form = { name: asText(b.name).slice(0, 300), note: asText(b.note).slice(0, 4000), confirm: b.confirm === true || /^(on|yes|1|true)$/i.test(asText(b.confirm)) };
    try {
      const r = await accept.call('/v1/accept', { id, name: form.name, note: form.note, confirm: form.confirm });
      if (r.status === 200) return res.redirect(303, '/q/' + id);
      if (r.status === 400) {
        const v = await viewOf(id, false);
        if (v.status === 200) return show(res, id, v.body, { error: r.body.error === 'confirm' ? MSG.confirm : MSG.name, form, status: 400 });
        return gone(res, kindOf(v));
      }
      if (r.status === 404 || r.status === 410) return gone(res, kindOf(r));
      throw new Error('the Worker answered ' + r.status);
    } catch (e) {
      console.error('[accept] could not record an acceptance:', e && e.message);
      try {
        const v = await viewOf(id, false);
        if (v.status === 200) return show(res, id, v.body, { error: MSG.failed, form, status: 503 });
      } catch (x) { /* fall through */ }
      return gone(res, 'down');
    }
  });

  app.get('/q/:id/pdf', async (req, res) => {
    const id = String(req.params.id || '').toLowerCase();
    if (!accept.ID_RE.test(id)) return gone(res, 'missing');
    if (!accept.enabled()) return gone(res, 'off');
    try {
      const r = await viewOf(id, false);
      if (r.status !== 200) return gone(res, kindOf(r));
      const d = pdf.normalise(r.body.quote);
      privateHeaders(res);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="' + ('quote-' + d.quoteNumber).replace(/[^a-z0-9-]/gi, '_') + '.pdf"');
      // the sender has Pro: no "Made with" line, and the logo is on the page (the same PDF the sender would have made)
      pdf.build(d, { isPro: true }, res);
    } catch (e) {
      console.error('[accept] PDF error:', e && e.message);
      if (!res.headersSent) gone(res, 'down');
    }
  });
};
