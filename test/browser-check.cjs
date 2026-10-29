// Headless browser check of the page and Get Pro click counter (not part of npm test: it needs playwright-core and Microsoft Edge).
//   PLAYWRIGHT_CORE=C:/path/to/node_modules/playwright-core node test/browser-check.cjs
// The app runs on a free local port and the browser is told that www.getquotationmaker.com is this machine, so the page runs on
// the real host name. Every request to the counter's Worker is answered here (nothing is counted for real) and recorded, every
// request to Gumroad is answered with a stand-in page, and any other request outside this machine is refused and reported.
// It checks that: a counted page sends its view note and a Get Pro click sends a click note (and nothing else leaves the browser,
// no cookie goes with it); a visit keeps its word across pages of the tab; the skipped pages send nothing and carry no script;
// automation sends nothing; and that with the counter's Worker unreachable the page and the Get Pro link work as before.
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');

const WORKER = 'qm-counter.railer-iot.workers.dev';
const HOST = 'www.getquotationmaker.com';
let failed = 0;
const ok = (cond, msg) => { console.log((cond ? 'PASS ' : 'FAIL ') + msg); if (!cond) failed++; };

(async () => {
  const app = require(path.join(__dirname, '..', 'server'));
  const server = await new Promise(r => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
  const port = server.address().port;
  const url = p => `http://${HOST}:${port}${p}`;
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: [`--host-resolver-rules=MAP ${HOST} 127.0.0.1, MAP getquotationmaker.com 127.0.0.1`] });

  // a new context: counter and Gumroad answered here; `human` hides navigator.webdriver (the script stays silent under automation)
  async function context({ human = true, workerDown = false, viewport = { width: 1280, height: 900 } } = {}) {
    const ctx = await browser.newContext({ viewport });
    const seen = { counter: [], gumroad: [], other: [], errors: [], consoleErrors: [] };
    if (human) await ctx.addInitScript(() => Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }));
    await ctx.route('**/*', route => {
      const r = route.request(), u = new URL(r.url());
      if (u.hostname === WORKER) {
        seen.counter.push({ method: r.method(), url: r.url(), headers: r.headers(), body: r.postData() });
        if (workerDown) return route.abort('internetdisconnected');
        return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': r.headers().origin || '*', vary: 'Origin' }, body: '' });
      }
      if (u.hostname === 'dorukctn.gumroad.com') { seen.gumroad.push(r.url()); return route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Gumroad stand-in</title>' }); }
      if (u.hostname === 'fonts.googleapis.com') return route.fulfill({ status: 200, contentType: 'text/css', body: '' });
      if (u.hostname === HOST || u.hostname === 'getquotationmaker.com') return route.continue();
      seen.other.push(r.url());
      return route.abort();
    });
    ctx.on('page', p => { p.on('pageerror', e => seen.errors.push(String(e))); p.on('console', m => { if (m.type() === 'error') seen.consoleErrors.push(m.text()); }); });
    return { ctx, seen };
  }
  const notes = seen => seen.counter.filter(c => c.method === 'POST').map(c => JSON.parse(c.body));
  const settle = p => p.waitForTimeout(400);

  // 1. a counted page, arriving from Google
  {
    const { ctx, seen } = await context();
    const page = await ctx.newPage();
    page.on('pageerror', e => seen.errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') seen.consoleErrors.push(m.text()); });
    await page.goto(url('/quote-template-plumber'), { referer: 'https://www.google.com/' });
    await settle(page);
    const n = notes(seen);
    ok(n.length === 1 && n[0].e === 'view' && n[0].t === 'quotationmaker' && n[0].p === '/quote-template-plumber' && n[0].w === '' && n[0].s === 'google', 'a counted page sends one view note from a Google visit: ' + JSON.stringify(n));
    const req = seen.counter[0];
    ok(req && req.method === 'POST' && /^text\/plain/.test(req.headers['content-type']) && !req.headers.cookie && !req.headers.authorization, 'the note is a plain POST with no cookie: ' + (req && JSON.stringify(Object.keys(req.headers).sort())));
    ok(seen.counter.length === 1, 'no preflight, one request to the Worker');
    ok((await ctx.cookies()).length === 0 && (await page.evaluate(() => document.cookie)) === '', 'no cookie exists after the page loads');
    ok(JSON.stringify(await page.evaluate(() => Object.keys(sessionStorage))) === '["qm-visit"]' && (await page.evaluate(() => sessionStorage.getItem('qm-visit'))) === 'google', 'session storage holds only the word');
    ok(!(await page.evaluate(() => Object.keys(localStorage).some(k => /qm-visit|count/i.test(k)))), 'the counter keeps nothing in local storage');
    ok(seen.other.length === 0, 'nothing leaves the browser except the Worker and Gumroad: ' + JSON.stringify(seen.other));
    ok(seen.errors.length === 0 && seen.consoleErrors.length === 0, 'no page or console errors: ' + JSON.stringify(seen.errors.concat(seen.consoleErrors)));
    ok(await page.evaluate(() => !!window.QT_CONFIG && !!document.getElementById('qtFrame')), 'the quote tool is on the page');
    ok(await page.evaluate(() => document.querySelectorAll('script[src*="count.js"]').length === 1), 'the script is on the page once');

    // 2. Get Pro in the nav opens Gumroad (new tab) and sends one click note
    const popup = ctx.waitForEvent('page');
    await page.click('.site-nav .btn-pro');
    const pop = await popup; await pop.waitForLoadState().catch(() => {});
    await settle(page);
    const c1 = notes(seen).filter(x => x.e === 'click');
    ok(c1.length === 1 && c1[0].w === 'nav' && c1[0].s === 'google' && c1[0].p === '/quote-template-plumber', 'the nav Get Pro click sends one click note: ' + JSON.stringify(c1));
    ok(seen.gumroad.length === 1 && seen.gumroad[0] === 'https://dorukctn.gumroad.com/l/cjogv', 'the link still goes to the plain Gumroad address: ' + seen.gumroad.join(' '));
    await pop.close();

    // 3. Get Pro in the tool's preview bar
    const bar = page.locator('.qt-probar a');
    if (await bar.count()) {
      const popup2 = ctx.waitForEvent('page');
      await page.waitForTimeout(2100);               // past the two-second repeat guard of the nav click
      await bar.first().click();
      const p2 = await popup2; await p2.waitForLoadState().catch(() => {});
      await settle(page);
      const c2 = notes(seen).filter(x => x.e === 'click');
      ok(c2.length === 2 && /^(section|form|main|aside)/.test(c2[1].w), 'the tool\'s Get Pro click sends a click note with its place: ' + JSON.stringify(c2[1]));
      await p2.close();
    } else ok(false, 'the tool\'s Get Pro bar was not found');

    // 4. an internal link keeps the visit's word
    await page.click('.site-footer a[href="/privacy"]');
    await page.waitForURL('**/privacy'); await settle(page);
    const n4 = notes(seen).filter(x => x.e === 'view');
    ok(n4.length === 2 && n4[1].p === '/privacy' && n4[1].s === 'google', 'the next page of the tab says the same word: ' + JSON.stringify(n4[1]));
    await ctx.close();
  }

  // 5. the skipped pages: no script, no note, a Get Pro click sends nothing
  for (const p of ['/', '/quote-template-contractor', '/blog/quote-acceptance-rate-tips']) {
    const { ctx, seen } = await context();
    const page = await ctx.newPage();
    await page.goto(url(p), { referer: 'https://www.google.com/' });
    await settle(page);
    ok(await page.evaluate(() => document.querySelectorAll('script[src*="count"]').length === 0 && !window.QMCount), `${p}: no counter script on the page`);
    const popup = ctx.waitForEvent('page');
    await page.click('.site-nav .btn-pro');
    const pop = await popup; await pop.waitForLoadState().catch(() => {}); await settle(page);
    ok(seen.counter.length === 0, `${p}: nothing sent to the Worker, even after a Get Pro click`);
    ok(seen.gumroad.length === 1 && seen.errors.length === 0 && seen.consoleErrors.length === 0 && seen.other.length === 0, `${p}: Get Pro still opens Gumroad, no errors`);
    await ctx.close();
  }

  // 6. direct, an AI assistant tag, and a visit that began on a skipped page
  {
    const { ctx, seen } = await context();
    const page = await ctx.newPage();
    await page.goto(url('/privacy'));
    await settle(page);
    await page.goto(url('/terms?utm_source=chatgpt.com'), { referer: 'https://www.bing.com/' });
    await settle(page);
    const n = notes(seen);
    ok(n.length === 2 && n[0].s === 'direct' && n[1].s === 'ai-assistant', 'direct, then a utm_source tag wins over the referrer: ' + JSON.stringify(n.map(x => x.s)));
    await ctx.close();
    const b = await context();
    const pg = await b.ctx.newPage();
    await pg.goto(url('/quote-template-painter'), { referer: 'https://www.google.com/' });      // skipped page
    await pg.click('.site-footer a[href="/privacy"]'); await pg.waitForURL('**/privacy'); await settle(pg);
    const nb = notes(b.seen);
    ok(nb.length === 1 && nb[0].p === '/privacy' && nb[0].s === '', 'a visit that began on a skipped page is sent with no word: ' + JSON.stringify(nb));
    await b.ctx.close();
  }

  // 7. automation: nothing is sent
  {
    const { ctx, seen } = await context({ human: false });
    const page = await ctx.newPage();
    await page.goto(url('/privacy'));
    await settle(page);
    ok(seen.counter.length === 0, 'a browser under automation sends nothing');
    await ctx.close();
  }

  // 8. the Worker is down: pages and the Get Pro link work as before
  {
    const { ctx, seen } = await context({ workerDown: true });
    const page = await ctx.newPage();
    page.on('pageerror', e => seen.errors.push(String(e)));
    await page.goto(url('/quote-template-plumber'));
    await settle(page);
    const popup = ctx.waitForEvent('page');
    await page.click('.site-nav .btn-pro');
    const pop = await popup; await pop.waitForLoadState().catch(() => {});
    ok(seen.counter.length >= 1, 'the page did try to send');
    ok(seen.gumroad.length === 1 && seen.errors.length === 0, 'with the Worker unreachable, no page error and the Get Pro link still opens Gumroad: ' + JSON.stringify(seen.errors));
    await ctx.close();
  }

  // 9. a phone: counted pages still fit
  {
    const { ctx, seen } = await context({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(url('/quote-template-plumber'), { referer: 'https://www.google.com/' });
    await settle(page);
    ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'no horizontal overflow at 390 px');
    ok(notes(seen).length === 1, 'one view note on a phone');
    await ctx.close();
  }

  await browser.close();
  server.close();
  console.log(failed ? `\n${failed} check(s) FAILED` : '\nall checks passed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
