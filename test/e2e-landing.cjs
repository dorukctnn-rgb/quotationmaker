// Headless browser test of the box on the five top guide pages and of the new footer links
// (not part of npm test: it needs playwright-core and Microsoft Edge).
//   PLAYWRIGHT_CORE=C:/path/to/node_modules/playwright-core node test/e2e-landing.cjs      (or: npm run e2e:landing)
//   SHOTS=C:/folder  also saves screenshots there
// The app runs on a free local port and the browser is told that www.getquotationmaker.com is this machine, so the page runs on the
// real host name. The counter's Worker is answered here (nothing is counted for real), Gumroad and the Pro checkout are not reached,
// and any other request outside this machine is refused and reported. Runs at 1440x900 and 390x844.
// It checks, for each size, that:
//  1. each of the five pages shows one box under its intro, inside the screen, compact, with no horizontal scroll;
//  2. its button opens the example that fits: in the UK quote maker with the preset loaded, or in place on the revised quotation page
//     (the address does not change);
//  3. the pages now measured (the three that were left out of the counter, and the two that already were counted) send one view note,
//     five fields, no cookie; a page that is still left out sends nothing and has no box;
//  4. the footer of a page that is not left as it was lists the countries (inside the screen, no horizontal scroll); a frozen page has none.
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');

const WORKER = 'qm-counter.railer-iot.workers.dev';
const HOST = 'www.getquotationmaker.com';
const SHOTS = process.env.SHOTS || '';
let failed = 0;
const ok = (cond, msg) => { console.log((cond ? 'PASS ' : 'FAIL ') + msg); if (!cond) failed++; };

const PAGES = [
  ['vat', '/blog/vat-on-quotes-explained', { goes: '/free-quote-generator-uk', preset: 'tradesman-uk', notes: /VAT at 20%/, tax: '20' }],
  ['acceptance', '/quote-acceptance-template', { goes: '/free-quote-generator-uk', preset: 'acceptance', notes: /ACCEPTANCE/ }],
  ['revised', '/revised-quotation', { goes: null, preset: 'revision-v2', notes: /replaces quotation Q-2026-118/, number: 'Q-2026-118 rev. 2' }],
  ['confirmation', '/quotation-confirmation', { goes: '/free-quote-generator-uk', preset: 'tradesman-uk', notes: /ACCEPTANCE/ }],
  ['ratetips', '/blog/quote-acceptance-rate-tips', { goes: '/free-quote-generator-uk', preset: 'tradesman-uk', notes: /valid for 30 days/ }],
];

(async () => {
  const app = require(path.join(__dirname, '..', 'server'));
  const server = await new Promise(r => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
  const port = server.address().port;
  const url = p => `http://${HOST}:${port}${p}`;
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: [`--host-resolver-rules=MAP ${HOST} 127.0.0.1, MAP getquotationmaker.com 127.0.0.1`] });

  async function context(viewport) {
    const ctx = await browser.newContext({ viewport });
    const seen = { counter: [], other: [], errors: [] };
    await ctx.addInitScript(() => Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }));
    await ctx.route('**/*', route => {
      const r = route.request(), u = new URL(r.url());
      if (u.hostname === WORKER) { seen.counter.push({ method: r.method(), body: r.postData(), headers: r.headers() }); return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': r.headers().origin || '*', vary: 'Origin' }, body: '' }); }
      if (u.hostname === HOST || u.hostname === 'getquotationmaker.com') return route.continue();
      seen.other.push(r.url());
      return route.abort();
    });
    ctx.on('page', p => p.on('pageerror', e => seen.errors.push(String(e))));
    return { ctx, seen };
  }
  const notes = seen => seen.counter.filter(c => c.method === 'POST').map(c => JSON.parse(c.body));
  const hscroll = p => p.evaluate(() => ({ doc: document.documentElement.scrollWidth - document.documentElement.clientWidth, body: document.body.scrollWidth - document.documentElement.clientWidth }));
  const shot = (page, name, opts = {}) => SHOTS ? page.screenshot({ path: path.join(SHOTS, name + '.png'), ...opts }) : Promise.resolve();

  for (const [label, viewport] of [['1440x900', { width: 1440, height: 900 }], ['390x844', { width: 390, height: 844 }]]) {
    console.log('\n== ' + label);
    const { width: VW } = viewport;

    for (const [name, p, want] of PAGES) {
      // 1 and 3: the box and the view note
      {
        const { ctx, seen } = await context(viewport);
        const page = await ctx.newPage();
        await page.goto(url(p), { referer: 'https://www.google.com/' });
        const box = page.locator('aside.lead-cta');
        await box.waitFor({ state: 'visible' });
        ok((await box.count()) === 1, `${p}: one box`);
        const b = await box.boundingBox();
        ok(b.x >= 0 && b.x + b.width <= VW + 0.5, `${p}: the box is inside the screen (${Math.round(b.x)}..${Math.round(b.x + b.width)} of ${VW})`);
        ok(b.height < (VW > 600 ? 130 : 330), `${p}: the box is compact (${Math.round(b.height)} px high)`);
        ok(await page.evaluate(() => { const bx = document.querySelector('aside.lead-cta'); return !!bx.nextElementSibling && (document.querySelector('h1').compareDocumentPosition(bx) & 4) !== 0 && !bx.closest('header'); }), `${p}: under the H1, in the article column, with the page's own text after it`);
        const hs = await hscroll(page);
        ok(hs.doc <= 0 && hs.body <= 0, `${p}: no horizontal scroll: ${JSON.stringify(hs)}`);
        ok(await page.evaluate(() => document.querySelector('aside.lead-cta .btn').getBoundingClientRect().height >= 40), `${p}: the button is a comfortable target`);
        const ns = notes(seen);
        ok(ns.length === 1 && ns[0].e === 'view' && ns[0].p === p && ns[0].s === 'google' && JSON.stringify(Object.keys(ns[0])) === '["e","t","p","w","s"]', `${p}: one view note, five fields: ${JSON.stringify(ns)}`);
        ok(seen.counter.every(c => !c.headers.cookie) && (await ctx.cookies()).length === 0, `${p}: no cookie`);
        ok(seen.other.length === 0 && seen.errors.length === 0, `${p}: nothing else left the browser, no script error`);
        await page.evaluate(() => window.scrollTo(0, Math.max(0, document.querySelector('aside.lead-cta').getBoundingClientRect().top + window.scrollY - 180)));
        await shot(page, `after-landing-${name}-${label}`);
        await ctx.close();
      }
      // 2: the button
      {
        const { ctx, seen } = await context(viewport);
        const page = await ctx.newPage();
        await page.goto(url(p));
        const before = page.url();
        await page.click('aside.lead-cta .btn');
        if (want.goes) {
          await page.waitForURL(u => new URL(u).pathname === want.goes, { timeout: 10000 });
          ok(new URL(page.url()).searchParams.get('preset') === want.preset, `${p}: the button goes to ${want.goes} with preset ${want.preset}`);
        } else {
          await page.waitForTimeout(500);
          ok(page.url().split('#')[0] === before.split('#')[0] || new URL(page.url()).pathname === p, `${p}: the button keeps the visitor on the page`);
        }
        await page.waitForSelector('#qtPresetStatus:not([hidden])', { timeout: 10000 });
        ok(/^Loaded: /.test(await page.locator('#qtPresetStatus').innerText()), `${p}: the example is loaded: ${await page.locator('#qtPresetStatus').innerText()}`);
        const notesText = await page.inputValue('#qtNotes');
        ok(want.notes.test(notesText), `${p}: its terms are in the box`);
        if (want.number) ok((await page.inputValue('#qtNumber')) === want.number, `${p}: quote number ${want.number}`);
        if (want.tax) ok((await page.inputValue('#qtTaxRate')) === want.tax && (await page.inputValue('#qtTaxLabel')) === 'VAT', `${p}: VAT at ${want.tax}%`);
        if (want.preset !== 'acceptance') ok((await page.locator('#qtItems .qt-ir').count()) >= 3, `${p}: the example's lines are there`);
        await page.waitForFunction(() => document.querySelector('#qtTool').getBoundingClientRect().top < window.innerHeight, null, { timeout: 5000 }).catch(() => null);
        ok(await page.locator('#qtTool').evaluate(el => el.getBoundingClientRect().top < window.innerHeight), `${p}: the quote maker is on screen`);
        const hs = await hscroll(page);
        ok(hs.doc <= 0 && hs.body <= 0, `${p}: no horizontal scroll after the button: ${JSON.stringify(hs)}`);
        ok(seen.other.length === 0 && seen.errors.length === 0, `${p}: no error, nothing else left the browser`);
        await ctx.close();
      }
    }

    // pages still left out of the counter: no box, no note, as before
    {
      const { ctx, seen } = await context(viewport);
      const page = await ctx.newPage();
      for (const p of ['/', '/quote-template-contractor', '/how-to-send-a-quote-to-a-client', '/blog']) {
        await page.goto(url(p), { referer: 'https://www.google.com/' });
        await page.waitForTimeout(300);
        ok((await page.locator('aside.lead-cta').count()) === 0 && (await page.locator('nav.fcountries').count()) === 0, `${p}: no box and no extra footer links`);
      }
      ok(seen.counter.length === 1 && notes(seen)[0].p === '/blog', 'frozen pages send nothing; only /blog (not on the skip list) sent its view note: ' + JSON.stringify(notes(seen)));
      await ctx.close();
    }

    // the footer links
    {
      const { ctx } = await context(viewport);
      const page = await ctx.newPage();
      for (const p of ['/quote-template-plumber', '/free-quote-generator-germany', '/how-to-write-a-roofing-quote', '/privacy']) {
        await page.goto(url(p));
        const nav = page.locator('nav.fcountries');
        await nav.scrollIntoViewIfNeeded();
        ok((await nav.locator('a').count()) >= 10, `${p}: the footer lists the countries (${await nav.locator('a').count()} links)`);
        const b = await nav.boundingBox();
        ok(b.x >= 0 && b.x + b.width <= VW + 0.5, `${p}: the country group is inside the screen`);
        const hs = await hscroll(page);
        ok(hs.doc <= 0 && hs.body <= 0, `${p}: no horizontal scroll with the footer group: ${JSON.stringify(hs)}`);
      }
      await page.goto(url('/quote-template-plumber'));
      await page.locator('footer.site-footer').scrollIntoViewIfNeeded();
      await shot(page, `after-footer-${label}`);
      // a country link works
      await page.click('nav.fcountries a[href="/free-quote-generator-canada"]');
      await page.waitForURL(u => new URL(u).pathname === '/free-quote-generator-canada');
      ok(/Canada/i.test(await page.title()), 'a footer country link opens that country\'s quote maker');
      await ctx.close();
    }
  }

  await browser.close();
  await new Promise(r => server.close(r));
  console.log(failed ? `\n${failed} check(s) FAILED` : '\nall checks passed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
