// Headless browser test of the download choice, the Pro tag on a logo, the counter notes and the checkout hand-off
// (not part of npm test: it needs playwright-core and Microsoft Edge).
//   PLAYWRIGHT_CORE=C:/path/to/node_modules/playwright-core node test/e2e-conversion.cjs      (or: npm run e2e)
//   SHOTS=C:/folder  also saves screenshots there
// The app runs on a free local port and the browser is told that www.getquotationmaker.com is this machine, so the page runs on the
// real host name. Everything that would leave this machine is answered here: the counter's Worker (nothing is counted for real), the
// Pro checkout's Worker and Paddle.js (a stand-in that only records that the checkout was asked to open: nobody ever pays), Gumroad.
// Any other request outside this machine is refused and reported. Runs at 1440x900 and 390x844.
// It checks, for each size, that:
//  1. free path: Download quote PDF opens the choice (a real dialog, labelled, focus kept inside, the two options side by side or
//     stacked, thumbnails of the quote both ways); "Download free PDF" downloads a PDF at once and a next-step panel with one Pro link
//     follows; Escape closes the choice without a download and the next press downloads at once with only the slim bar, no dialog;
//  2. the notes sent to the counter: paywall_shown, pdf_download and the rest, five fields each, no cookie, nothing else leaves;
//  3. Pro path: the Get Pro button of the choice asks the checkout to open (the existing pay code), the quote survives the reload that
//     follows a payment, and the invoice message counts as an offer too;
//  4. logo: the live preview marks it with a Pro tag and the line "Your logo goes on the PDF with Pro", the Pro thumbnail shows it
//     and the free one does not; the tag goes when the logo does;
//  5. a Pro visitor never sees the choice, the bar or the panel; a page left out of the counter shows the choice and sends nothing;
//  6. no horizontal scroll: the page, the choice, the bar and the panel stay inside the screen.
const path = require('node:path');
const fs = require('node:fs');
const zlib = require('node:zlib');
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');

const WORKER = 'qm-counter.railer-iot.workers.dev';
const PAY = 'peak-pay.railer-iot.workers.dev';
const HOST = 'www.getquotationmaker.com';
const SHOTS = process.env.SHOTS || '';
let failed = 0;
const ok = (cond, msg) => { console.log((cond ? 'PASS ' : 'FAIL ') + msg); if (!cond) failed++; };

// a plain PNG (no library): w x h pixels of one colour
function png(w, h, [r, g, b]) {
  const crcT = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = buf => { let c = 0xffffffff; for (const x of buf) c = crcT[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  const row = Buffer.concat([Buffer.from([0]), Buffer.from(Array.from({ length: w }, () => [r, g, b]).flat())]);
  const raw = Buffer.concat(Array.from({ length: h }, () => row));
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
// the stand-in for Paddle.js: records what the checkout was asked to do, shows nothing, takes no payment
const PADDLE_STUB = `window.Paddle = { Environment: { set: function () {} }, Initialize: function (o) { window.__paddleInit = o; },
  Checkout: { open: function (o) { window.__paddleOpen = o; }, close: function () {} } };`;

(async () => {
  const app = require(path.join(__dirname, '..', 'server'));
  const server = await new Promise(r => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
  const port = server.address().port;
  const url = p => `http://${HOST}:${port}${p}`;
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: [`--host-resolver-rules=MAP ${HOST} 127.0.0.1, MAP getquotationmaker.com 127.0.0.1`] });

  // a new context. human: hides navigator.webdriver (the counter script stays silent under automation). pro: the page is told the visitor is Pro.
  async function context({ viewport, pro = false } = {}) {
    const ctx = await browser.newContext({ viewport, acceptDownloads: true });
    const seen = { counter: [], pay: [], paddle: 0, gumroad: [], other: [], errors: [], posts: [] };
    await ctx.addInitScript(() => Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }));
    // pro: the page is told the visitor is Pro (the tool reads window.QT_CONFIG once; the server is not asked, as it is not part of this test)
    if (pro) await ctx.addInitScript(() => {
      Object.defineProperty(window, 'QT_CONFIG', { configurable: true, get() { return undefined; }, set(v) { v.isPro = true; Object.defineProperty(window, 'QT_CONFIG', { value: v, writable: true, configurable: true }); } });
    });
    await ctx.route('**/*', async route => {
      const r = route.request(), u = new URL(r.url());
      if (u.hostname === WORKER) {
        seen.counter.push({ method: r.method(), body: r.postData(), headers: r.headers() });
        return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': r.headers().origin || '*', vary: 'Origin' }, body: '' });
      }
      if (u.hostname === PAY) {
        seen.pay.push(r.method() + ' ' + u.pathname);
        if (u.pathname === '/v1/config') return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ environment: 'sandbox', token: 'test_token_not_real', name: 'QuotationMaker Pro', prices: { lifetime: 'pri_test_lifetime' } }) });
        return route.fulfill({ status: 404, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{}' });
      }
      if (u.hostname === 'cdn.paddle.com') { seen.paddle++; return route.fulfill({ status: 200, contentType: 'application/javascript', body: PADDLE_STUB }); }
      if (u.hostname === 'dorukctn.gumroad.com') { seen.gumroad.push(r.url()); return route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Gumroad stand-in</title>' }); }
      if (u.hostname === HOST || u.hostname === 'getquotationmaker.com') {
        if (r.method() === 'POST' && u.pathname === '/generate-pdf') seen.posts.push(u.pathname);
        return route.continue();
      }
      seen.other.push(r.url());
      return route.abort();
    });
    ctx.on('page', p => { p.on('pageerror', e => seen.errors.push(String(e))); });
    return { ctx, seen };
  }
  const notes = seen => seen.counter.filter(c => c.method === 'POST').map(c => JSON.parse(c.body));
  const evs = seen => notes(seen).map(n => n.e + (n.w ? ':' + n.w : ''));
  const settle = (p, ms = 350) => p.waitForTimeout(ms);
  const hscroll = p => p.evaluate(() => ({ doc: document.documentElement.scrollWidth - document.documentElement.clientWidth, body: document.body.scrollWidth - document.documentElement.clientWidth }));
  const withinScreen = async (p, sel, vw, vh) => {
    const b = await p.locator(sel).first().boundingBox();
    return !!b && b.x >= -0.5 && b.y >= -0.5 && b.x + b.width <= vw + 0.5 && b.y + b.height <= vh + 0.5;
  };
  // every descendant stays inside the box of its dialog (nothing pokes out sideways)
  const contained = (p, sel) => p.evaluate(s => { const box = document.querySelector(s); if (!box) return false; const r0 = box.getBoundingClientRect();
    return box.scrollWidth <= box.clientWidth + 1 && [...box.querySelectorAll('*')].every(el => { const r = el.getBoundingClientRect(); return r.width === 0 || (r.left >= r0.left - 1 && r.right <= r0.right + 1); }); }, sel);
  async function fill(page, { logo = false } = {}) {
    await page.fill('#qtFromName', 'Harper Fencing Ltd');
    await page.fill('#qtToName', 'Test Client');
    await page.fill('.qt-desc', 'Replace 12 m of garden fence');
    await page.fill('.qt-rate', '95');
    if (logo) await page.setInputFiles('#qtLogo', { name: 'logo.png', mimeType: 'image/png', buffer: png(120, 40, [15, 76, 129]) });
    await settle(page, 200);
  }
  const shot = (page, name) => SHOTS ? page.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: false }) : Promise.resolve();
  const pdfOk = async dl => { const f = await dl.path(); const b = fs.readFileSync(f); return b.slice(0, 5).toString() === '%PDF-' && b.length > 1500; };

  for (const [label, viewport] of [['1440x900', { width: 1440, height: 900 }], ['390x844', { width: 390, height: 844 }]]) {
    console.log('\n== ' + label);
    const { width: VW, height: VH } = viewport;

    // ---------------------------------------------------------------- 1. the free path
    {
      const { ctx, seen } = await context({ viewport });
      const page = await ctx.newPage();
      await page.goto(url('/quote-template-plumber'), { referer: 'https://www.google.com/' });
      await page.waitForSelector('#qtPdfBtn');
      await fill(page);
      ok((await page.locator('dialog.qm-dlg').count()) === 0, 'free path: no dialog before the button is pressed');
      let downloaded = 0;
      page.on('download', () => downloaded++);
      await page.click('#qtPdfBtn');
      const dlg = page.locator('dialog.qm-dlg');
      await dlg.waitFor({ state: 'visible' });
      ok(await dlg.evaluate(d => d.open && d.matches(':modal')), 'free path: the choice is a modal dialog');
      const labelId = await dlg.getAttribute('aria-labelledby'), descId = await dlg.getAttribute('aria-describedby');
      ok(!!labelId && (await page.locator('#' + labelId).innerText()).length > 3 && !!descId && (await page.locator('#' + descId).innerText()).length > 3, 'free path: the dialog is labelled and described');
      ok((await page.locator('dialog.qm-dlg h3').allInnerTexts()).join('|') === 'Free PDF|Pro PDF', 'free path: two options, Free PDF and Pro PDF');
      ok((await page.locator('dialog.qm-dlg .qm-opt-pro').innerText()).includes('$9 once') && (await page.locator('dialog.qm-dlg').innerText()).includes('Invoice PDF from the same quote in one click'), 'free path: the Pro option says $9 once and names the invoice');
      ok((await page.locator('dialog.qm-dlg .qm-thumb iframe').count()) === 2, 'free path: a thumbnail of the quote for each option');
      const boxes = await page.locator('dialog.qm-dlg .qm-opt').evaluateAll(els => els.map(e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }));
      ok(VW > 600 ? Math.abs(boxes[0].y - boxes[1].y) < 2 && boxes[0].x < boxes[1].x : boxes[0].y < boxes[1].y, 'free path: the options sit side by side on a wide screen and stack on a phone');
      ok(await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('data-qm') === 'free'), 'free path: focus starts on the free download button');
      for (let i = 0; i < 3; i++) await page.keyboard.press('Tab');
      ok(await page.evaluate(() => !!(document.activeElement && document.activeElement.closest('dialog.qm-dlg'))), 'free path: Tab stays inside the dialog');
      ok(await page.evaluate(() => { document.querySelector('#qtFromName').focus(); return !!document.activeElement.closest('dialog.qm-dlg'); }), 'free path: the page behind cannot take focus while the dialog is open');
      ok(await withinScreen(page, 'dialog.qm-dlg', VW, VH), 'free path: the dialog is inside the screen');
      ok(await contained(page, 'dialog.qm-dlg'), 'free path: nothing in the dialog pokes out sideways');
      const hs = await hscroll(page);
      ok(hs.doc <= 0 && hs.body <= 0, 'free path: no horizontal scroll with the dialog open: ' + JSON.stringify(hs));
      const frames = await page.locator('dialog.qm-dlg .qm-thumb iframe').evaluateAll(fs_ => fs_.map(f => f.srcdoc));
      ok(frames[0].includes('Made with GetQuotationMaker.com') && !frames[1].includes('Made with GetQuotationMaker.com'), 'free path: the free thumbnail has the Made with line, the Pro one does not');
      ok(frames[0].includes('Harper Fencing Ltd') && frames[1].includes('Replace 12 m of garden fence'), 'free path: the thumbnails are their quote');
      // the thumbnails really drew the quote (read from inside the sandboxed frames)
      const drawn = [];
      for (let i = 0; i < 2; i++) {
        const fr = await (await page.locator('dialog.qm-dlg .qm-thumb iframe').nth(i).elementHandle()).contentFrame();
        await fr.waitForSelector('.ttl');
        drawn.push({ title: await fr.locator('.ttl').innerText(), line: await fr.locator('.wm').count(), logo: await fr.locator('.logo, .lph').count() });
      }
      ok(drawn[0].title === 'QUOTATION' && drawn[0].line === 1 && drawn[0].logo === 0 && drawn[1].title === 'QUOTATION' && drawn[1].line === 0 && drawn[1].logo === 1, 'free path: both thumbnails drew: free has the line and no logo, Pro has no line and a logo place: ' + JSON.stringify(drawn));
      await settle(page, 300);
      await shot(page, `after-dialog-${label}`);
      await page.keyboard.press('Escape');
      await dlg.waitFor({ state: 'detached' });
      await settle(page, 600);
      ok(downloaded === 0, 'free path: Escape closes the choice and downloads nothing');
      ok(await page.evaluate(() => document.activeElement && document.activeElement.id === 'qtPdfBtn'), 'free path: focus goes back to the Download button');
      // the next press downloads at once, with only the slim bar
      const [dl2] = await Promise.all([page.waitForEvent('download'), page.click('#qtPdfBtn')]);
      ok(await pdfOk(dl2), 'free path: the second press downloads a PDF at once: ' + dl2.suggestedFilename());
      await page.waitForSelector('#qmBar:not([hidden])');
      ok((await page.locator('dialog.qm-dlg').count()) === 0, 'free path: the second press shows no dialog');
      ok(await page.locator('#qmAfter').count() === 0 || await page.locator('#qmAfter').isHidden(), 'free path: the second press shows no panel, only the bar');
      ok(await withinScreen(page, '#qmBar', VW, VH), 'free path: the bar is inside the screen');
      const barLinks = await page.locator('#qmBar a').count();
      ok(barLinks === 1 && /Get Pro/.test(await page.locator('#qmBar a').innerText()), 'free path: the bar has one Get Pro link');
      const hs2 = await hscroll(page);
      ok(hs2.doc <= 0 && hs2.body <= 0, 'free path: no horizontal scroll with the bar: ' + JSON.stringify(hs2));
      await shot(page, `after-bar-${label}`);
      // the bar goes with one press, and stays gone for the session
      await page.click('#qmBar .qm-x');
      ok(await page.locator('#qmBar').isHidden(), 'free path: the bar can be dismissed');
      const [dl3] = await Promise.all([page.waitForEvent('download'), page.click('#qtPdfBtn')]);
      await settle(page, 300);
      ok((await pdfOk(dl3)) && await page.locator('#qmBar').isHidden(), 'free path: after dismissing, later downloads are free of the bar for the session');
      const e = evs(seen);
      ok(JSON.stringify(e) === JSON.stringify(['view', 'paywall_shown:dialog', 'pdf_download:free', 'paywall_shown:bar', 'pdf_download:free']), 'notes: view, dialog, download, bar, download, in order: ' + JSON.stringify(e));
      ok(notes(seen).every(n => JSON.stringify(Object.keys(n)) === '["e","t","p","w","s"]' && n.t === 'quotationmaker' && n.p === '/quote-template-plumber' && n.s === 'google'), 'notes: five fields each, the page and the kind of site, nothing else');
      ok(!JSON.stringify(notes(seen)).includes('Harper') && !JSON.stringify(notes(seen)).includes('Test Client'), 'notes: nothing the visitor typed');
      ok(seen.counter.filter(c => c.method === 'POST').every(c => !c.headers.cookie) && (await ctx.cookies()).length === 0, 'notes: no cookie anywhere');
      ok(seen.other.length === 0, 'nothing else left the browser: ' + JSON.stringify(seen.other));
      ok(seen.errors.length === 0, 'no script error on the page: ' + JSON.stringify(seen.errors));
      await ctx.close();
    }
    // the free button of the dialog, and the panel after it
    {
      const { ctx, seen } = await context({ viewport });
      const page = await ctx.newPage();
      await page.goto(url('/quote-template-plumber'), { referer: 'https://www.google.com/' });
      await fill(page);
      await page.click('#qtPdfBtn');
      await page.locator('dialog.qm-dlg').waitFor({ state: 'visible' });
      const t0 = Date.now();
      const [dl] = await Promise.all([page.waitForEvent('download'), page.click('dialog.qm-dlg [data-qm="free"]')]);
      ok(await pdfOk(dl), 'free button: one press on "Download free PDF" downloads a PDF (' + (Date.now() - t0) + ' ms): ' + dl.suggestedFilename());
      await page.locator('#qmAfter').waitFor({ state: 'visible' });
      ok((await page.locator('dialog.qm-dlg').count()) === 0, 'free button: the dialog is gone');
      ok(/Quote downloaded/.test(await page.locator('#qtMsg').innerText()), 'free button: "Quote downloaded" is said');
      ok((await page.locator('#qmAfter a').count()) === 1 && /invoice/i.test(await page.locator('#qmAfter').innerText()) && /Get Pro/.test(await page.locator('#qmAfter a').innerText()), 'free button: the panel names one next step, the invoice, with one Get Pro button');
      ok(await withinScreen(page, '#qmAfter', VW, 100000) && await contained(page, '#qmAfter'), 'free button: the panel fits the width');
      const hs = await hscroll(page);
      ok(hs.doc <= 0 && hs.body <= 0, 'free button: no horizontal scroll with the panel: ' + JSON.stringify(hs));
      await page.locator('#qmAfter').scrollIntoViewIfNeeded();
      await shot(page, `after-panel-${label}`);
      // a second press: the panel goes, the bar comes
      const [dl2] = await Promise.all([page.waitForEvent('download'), page.click('#qtPdfBtn')]);
      await page.waitForSelector('#qmBar:not([hidden])');
      ok(await pdfOk(dl2) && await page.locator('#qmAfter').isHidden() && (await page.locator('dialog.qm-dlg').count()) === 0, 'free button: a later press downloads at once; the bar replaces the panel');
      ok(JSON.stringify(evs(seen)) === JSON.stringify(['view', 'paywall_shown:dialog', 'pdf_download:free', 'paywall_shown:after', 'pdf_download:free', 'paywall_shown:bar']), 'notes: the choice, the download, the panel, then the bar: ' + JSON.stringify(evs(seen)));
      // a new tab of the same browser starts a new session: the choice is shown again; a reload of this tab does not show it again
      await page.reload();
      await fill(page);
      const [dl3] = await Promise.all([page.waitForEvent('download'), page.click('#qtPdfBtn')]);
      ok((await pdfOk(dl3)) && (await page.locator('dialog.qm-dlg').count()) === 0, 'once per session: a reload of the same tab does not bring the dialog back');
      await ctx.close();
    }

    // ---------------------------------------------------------------- 3. the Pro path (stops at the checkout: nobody pays)
    {
      const { ctx, seen } = await context({ viewport });
      const page = await ctx.newPage();
      await page.goto(url('/quote-template-plumber'), { referer: 'https://www.bing.com/' });
      await fill(page, { logo: true });
      let downloaded = 0;
      page.on('download', () => downloaded++);
      await page.click('#qtPdfBtn');
      await page.locator('dialog.qm-dlg').waitFor({ state: 'visible' });
      const pro = page.locator('dialog.qm-dlg a.qm-btn-pro');
      ok(/Get Pro, \$9 once/.test(await pro.innerText()) && /gumroad\.com\/l\//.test(await pro.getAttribute('href')) && (await pro.getAttribute('data-buy-pro')) !== null, 'pro path: the Pro button is the site\'s Get Pro link, so the existing pay code takes it');
      const frames = await page.locator('dialog.qm-dlg .qm-thumb iframe').evaluateAll(fs_ => fs_.map(f => f.srcdoc));
      ok(!frames[0].includes('data:image/png') && frames[1].includes('data:image/png'), 'pro path: with a logo, the Pro thumbnail has it and the free one does not');
      await pro.click();
      const sheet = page.locator('dialog.pp-sheet');
      await sheet.waitFor({ state: 'visible', timeout: 8000 });
      ok(await sheet.evaluate(d => d.open), 'pro path: the Paddle checkout panel opens');
      ok((await page.locator('dialog.qm-dlg').count()) === 0, 'pro path: the choice closed, one dialog at a time');
      const asked = await page.evaluate(() => ({ init: !!window.__paddleInit, open: window.__paddleOpen && window.__paddleOpen.items, env: window.__paddleOpen && window.__paddleOpen.customData && window.__paddleOpen.customData.product }));
      ok(asked.init && asked.open && asked.open[0].priceId === 'pri_test_lifetime' && asked.env === 'quotationmaker', 'pro path: the checkout was asked for the QuotationMaker Pro price: ' + JSON.stringify(asked));
      ok(seen.gumroad.length === 0 && downloaded === 0, 'pro path: no Gumroad page, no PDF');
      ok(evs(seen).includes('paywall_pro_click:dialog') && evs(seen).includes('click:dialog'), 'notes: the Pro press is counted as an offer press and as a Get Pro click: ' + JSON.stringify(evs(seen)));
      await shot(page, `after-checkout-${label}`);
      // stop here: close the panel (nothing was paid), then the reload a payment causes keeps the quote
      await page.click('dialog.pp-sheet [data-pp-close]');
      await page.reload();
      await page.waitForSelector('#qtPdfBtn');
      await settle(page, 300);
      ok((await page.inputValue('#qtToName')) === 'Test Client' && (await page.inputValue('.qt-desc')) === 'Replace 12 m of garden fence' && (await page.inputValue('.qt-rate')) === '95', 'pro path: after the reload the quote is back');
      ok(/Your quote is back/.test(await page.locator('#qtMsg').innerText()), 'pro path: the page says so');
      ok(await page.locator('#qmLogoNote').isVisible() && (await page.frameLocator('#qtFrame').locator('.logo').count()) === 1, 'pro path: and so is the logo');
      await page.reload();
      await settle(page, 300);
      ok((await page.inputValue('#qtToName')) === '', 'pro path: the kept quote is used once');
      ok(seen.other.length === 0 && seen.errors.length === 0, 'pro path: nothing else left the browser, no script error: ' + JSON.stringify(seen.other.concat(seen.errors)));
      await ctx.close();
    }
    // a Pro visitor: no choice, no bar, no panel; the download is a pro download
    {
      const { ctx, seen } = await context({ viewport, pro: true });
      const page = await ctx.newPage();
      await page.goto(url('/quote-template-plumber'));
      await fill(page, { logo: true });
      ok((await page.frameLocator('#qtFrame').locator('.pt').count()) === 0 && (await page.frameLocator('#qtFrame').locator('.pn').count()) === 0 && await page.locator('#qmLogoNote').isHidden(), 'pro visitor: no Pro tag on the logo');
      const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#qtPdfBtn')]);
      await settle(page, 300);
      ok(await pdfOk(dl) && (await page.locator('dialog.qm-dlg').count()) === 0 && (await page.locator('#qmBar').count()) === 0 && (await page.locator('#qmAfter').count()) === 0, 'pro visitor: the first press downloads at once, with no choice, bar or panel');
      ok(JSON.stringify(evs(seen)) === JSON.stringify(['view', 'logo_upload:pro', 'pdf_download:pro']), 'pro visitor: notes view, logo_upload pro, pdf_download pro: ' + JSON.stringify(evs(seen)));
      await ctx.close();
    }
    {
      // after a payment the page reloads as a Pro page: the draft kept before it is back, and says so
      const { ctx } = await context({ viewport });
      const page = await ctx.newPage();
      await page.goto(url('/quote-template-plumber'));
      await fill(page, { logo: true });
      await page.click('#qtPdfBtn');
      await page.locator('dialog.qm-dlg a.qm-btn-pro').click();
      await page.locator('dialog.pp-sheet').waitFor({ state: 'visible', timeout: 8000 });
      const draft = await page.evaluate(() => sessionStorage.getItem('qm-draft'));
      await ctx.close();
      const { ctx: pctx } = await context({ viewport, pro: true });
      const p2 = await pctx.newPage();
      await p2.goto(url('/quote-template-plumber'));
      await p2.evaluate(d => sessionStorage.setItem('qm-draft', d), draft);
      await p2.reload();
      await p2.waitForSelector('#qtPdfBtn');
      await settle(p2, 300);
      ok((await p2.inputValue('#qtToName')) === 'Test Client' && /Pro is on\. Your quote is back as you left it: download it now with your logo and without the footer line\./.test(await p2.locator('#qtMsg').innerText()), 'after payment: the Pro page puts the quote back and says Pro is on');
      await pctx.close();
    }

    // the invoice message is an offer too
    {
      const { ctx, seen } = await context({ viewport });
      const page = await ctx.newPage();
      await page.goto(url('/quote-template-plumber'));
      await fill(page);
      await page.click('#qtInvBtn');
      await page.locator('#qtMsg a[data-qm-pro="invoice"]').waitFor({ state: 'visible' });
      ok(evs(seen).includes('paywall_shown:invoice'), 'invoice: the Pro message is counted as an offer shown');
      await page.click('#qtMsg a[data-qm-pro="invoice"]');
      await page.locator('dialog.pp-sheet').waitFor({ state: 'visible', timeout: 8000 });
      ok(evs(seen).includes('paywall_pro_click:invoice'), 'invoice: and its Get Pro press too: ' + JSON.stringify(evs(seen)));
      await ctx.close();
    }

    // ---------------------------------------------------------------- 4. the logo
    {
      const { ctx, seen } = await context({ viewport });
      const page = await ctx.newPage();
      await page.goto(url('/free-quote-generator-uk'), { referer: 'https://www.google.com/' });
      await fill(page);
      const frame = page.frameLocator('#qtFrame');
      ok((await frame.locator('.pt').count()) === 0 && await page.locator('#qmLogoNote').isHidden(), 'logo: no tag before a logo is chosen');
      await page.setInputFiles('#qtLogo', { name: 'logo.png', mimeType: 'image/png', buffer: png(120, 40, [15, 76, 129]) });
      await frame.locator('.pt').waitFor({ state: 'visible' });
      ok((await frame.locator('.pt').innerText()) === 'PRO' && (await frame.locator('.pn').innerText()) === 'Your logo goes on the PDF with Pro', 'logo: the preview marks the logo with a Pro tag and the line "Your logo goes on the PDF with Pro"');
      ok((await frame.locator('img.logo').count()) === 1, 'logo: the logo is in the preview');
      ok(/Your logo goes on the PDF with Pro/.test(await page.locator('#qmLogoNote').innerText()) && (await page.locator('#qmLogoNote a').count()) === 1, 'logo: the form says it too, with one Get Pro link');
      ok(evs(seen).includes('logo_upload:free'), 'logo: the upload is counted');
      await page.locator('#qtFrame').scrollIntoViewIfNeeded();
      await shot(page, `after-logo-${label}`);
      const hs = await hscroll(page);
      ok(hs.doc <= 0 && hs.body <= 0, 'logo: no horizontal scroll with the tag: ' + JSON.stringify(hs));
      await page.setInputFiles('#qtLogo', []);
      await settle(page, 300);
      ok((await frame.locator('.pt').count()) === 0 && await page.locator('#qmLogoNote').isHidden(), 'logo: the tag and the line go when the logo does');
      ok(seen.errors.length === 0 && seen.other.length === 0, 'logo: no error, nothing else left the browser');
      await ctx.close();
    }

    // ---------------------------------------------------------------- 5. a page left out of the counter
    {
      const { ctx, seen } = await context({ viewport });
      const page = await ctx.newPage();
      await page.goto(url('/'), { referer: 'https://www.google.com/' });
      await page.waitForSelector('#qtPdfBtn');
      await fill(page);
      await page.click('#qtPdfBtn');
      await page.locator('dialog.qm-dlg').waitFor({ state: 'visible' });
      const [dl] = await Promise.all([page.waitForEvent('download'), page.click('dialog.qm-dlg [data-qm="free"]')]);
      ok(await pdfOk(dl) && (await page.locator('#qmAfter').isVisible()), 'home page: the choice, the free download and the panel work on a page left out of the counter');
      ok(seen.counter.length === 0 && (await page.evaluate(() => typeof window.QMCount)) === 'undefined', 'home page: and nothing is sent to the counter: it is not loaded there');
      const hs = await hscroll(page);
      ok(hs.doc <= 0 && hs.body <= 0, 'home page: no horizontal scroll: ' + JSON.stringify(hs));
      await ctx.close();
    }
    // every page that embeds the tool has no horizontal scroll with the new pieces in place
    {
      const { ctx } = await context({ viewport });
      const page = await ctx.newPage();
      for (const p of ['/quote-template-carpentry', '/free-quote-generator-germany', '/how-to-write-a-roofing-quote']) {
        await page.goto(url(p));
        await page.waitForSelector('#qtPdfBtn');
        const hs = await hscroll(page);
        ok(hs.doc <= 0 && hs.body <= 0, p + ': no horizontal scroll: ' + JSON.stringify(hs));
      }
      await ctx.close();
    }
  }

  await browser.close();
  await new Promise(r => server.close(r));
  console.log(failed ? `\n${failed} check(s) FAILED` : '\nall checks passed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
