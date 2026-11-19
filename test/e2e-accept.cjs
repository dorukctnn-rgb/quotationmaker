// Headless browser test of the quote acceptance link, start to finish (not part of npm test: it needs playwright-core and Microsoft Edge).
//   PLAYWRIGHT_CORE=C:/path/to/node_modules/playwright-core node test/e2e-accept.cjs      (or: npm run e2e:accept)
//   SHOTS=C:/folder  also saves a screenshot of every screen there
// The app runs on a free local port and the browser is told that www.getquotationmaker.com is this machine, so the pages run on the real
// host name. Everything that would leave this machine is answered here: the counter's Worker, the Pro checkout (Paddle.js and the pay
// Worker, a stand-in that only records that the checkout was asked to open: nobody ever pays), Gumroad. The acceptance Worker (its real
// handler and core on node:sqlite), the Pro key check and Forward Email are stood in for in this process (test/helpers/accept-world.cjs).
// Any other request outside this machine is refused and reported. Runs at 1440x900 and 390x844, one browser, closed at the end.
// For each size, with a free visitor, a Pro seller and the seller's client in separate browser contexts, it checks that:
//  1. a free visitor pressing Send for acceptance gets the Pro offer (counted as paywall_shown and paywall_pro_click, place "accept"), the
//     Get Pro link opens the checkout, and the server refuses the same request made by hand (402);
//  2. a Pro seller gets the send window (modal, labelled, focus inside, nothing pokes out), makes a link (a big logo is made smaller for
//     it), sees the link, the email button and the status, and the quote is saved on the server without the Pro key or an IP address;
//  3. the client opens the link and sees the quote, downloads the PDF, cannot send an empty form, accepts with a name, a tick and a note,
//     and sees who accepted and when; a wrong form is sent back with a message; an expired and an invalid link get plain pages; the page
//     has no script, says noindex and no referrer, and nothing typed becomes markup;
//  4. the seller sees the status change from sent to opened to accepted (in the send window and on the status page), a status link opened
//     on another device joins the list, and one email goes out on acceptance with nothing the client typed in it;
//  5. neither code is ever in an address that leaves the browser, the counter never sees the client's page, and no page has horizontal scroll.
const path = require('node:path');
const fs = require('node:fs');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const { installWorld, keyN } = require('./helpers/accept-world.cjs');

const WORKER = 'qm-counter.railer-iot.workers.dev';
const PAY = 'peak-pay.railer-iot.workers.dev';
const HOST = 'www.getquotationmaker.com';
const SHOTS = process.env.SHOTS || '';
let failed = 0;
const ok = (cond, msg) => { console.log((cond ? 'PASS ' : 'FAIL ') + msg); if (!cond) failed++; };

// a PNG of random pixels (no library): w x h, it does not compress, so a small picture is a big file
function noisePng(w, h) {
  const crcT = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = buf => { let c = 0xffffffff; for (const x of buf) c = crcT[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  const raw = Buffer.concat(Array.from({ length: h }, () => Buffer.concat([Buffer.from([0]), crypto.randomBytes(w * 3)])));
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
const PADDLE_STUB = `window.Paddle = { Environment: { set: function () {} }, Initialize: function (o) { window.__paddleInit = o; },
  Checkout: { open: function (o) { window.__paddleOpen = o; }, close: function () {} } };`;

(async () => {
  const world = await installWorld();
  const app = require(path.join(__dirname, '..', 'server'));
  const server = await new Promise(r => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
  const port = server.address().port;
  const url = p => `http://${HOST}:${port}${p}`;
  const local = u => url(new URL(u).pathname + new URL(u).hash);   // the live address of a link, on this machine
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: [`--host-resolver-rules=MAP ${HOST} 127.0.0.1, MAP getquotationmaker.com 127.0.0.1`] });
  const SELLER_KEY = keyN(101);

  async function context({ viewport, key = '' } = {}) {
    // an ordinary browser's user agent: the headless one says HeadlessChrome, which the site (rightly) does not count as a person opening a link
    const ctx = await browser.newContext({ viewport, acceptDownloads: true, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0' });
    const seen = { counter: [], pay: [], paddle: 0, other: [], errors: [], requests: [], scripts: 0 };
    await ctx.addInitScript(() => Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }));
    if (key) await ctx.addCookies([{ name: 'qm_license', value: key, url: `http://${HOST}:${port}` }]);
    await ctx.route('**/*', async route => {
      const r = route.request(), u = new URL(r.url());
      if (u.hostname === WORKER) {
        seen.counter.push({ method: r.method(), body: r.postData() });
        return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': r.headers().origin || '*', vary: 'Origin' }, body: '' });
      }
      if (u.hostname === PAY) {
        seen.pay.push(r.method() + ' ' + u.pathname);
        if (u.pathname === '/v1/config') return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ environment: 'sandbox', token: 'test_token_not_real', name: 'QuotationMaker Pro', prices: { lifetime: 'pri_test_lifetime' } }) });
        return route.fulfill({ status: 404, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{}' });
      }
      if (u.hostname === 'cdn.paddle.com') { seen.paddle++; return route.fulfill({ status: 200, contentType: 'application/javascript', body: PADDLE_STUB }); }
      if (u.hostname === HOST || u.hostname === 'getquotationmaker.com') { seen.requests.push({ url: r.url(), type: r.resourceType(), method: r.method(), body: r.postData() }); return route.continue(); }
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
  const noScroll = async (p, what) => { const hs = await hscroll(p); ok(hs.doc <= 0 && hs.body <= 0, what + ': no horizontal scroll: ' + JSON.stringify(hs)); };
  const withinScreen = async (p, sel, vw, vh) => { const b = await p.locator(sel).first().boundingBox(); return !!b && b.x >= -0.5 && b.y >= -0.5 && b.x + b.width <= vw + 0.5 && b.y + b.height <= vh + 0.5; };
  const contained = (p, sel) => p.evaluate(s => { const box = document.querySelector(s); if (!box) return false; const r0 = box.getBoundingClientRect();
    return box.scrollWidth <= box.clientWidth + 1 && [...box.querySelectorAll('*')].every(el => { const r = el.getBoundingClientRect(); return r.width === 0 || (r.left >= r0.left - 1 && r.right <= r0.right + 1); }); }, sel);
  const shot = (page, name, full = false) => SHOTS ? page.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: full }) : Promise.resolve();
  const pdfOk = async dl => { const b = fs.readFileSync(await dl.path()); return b.slice(0, 5).toString() === '%PDF-' && b.length > 1500; };
  async function fill(page, { logo = false } = {}) {
    await page.fill('#qtFromName', 'Harper Fencing Ltd');
    await page.fill('#qtFromEmail', 'hello@harper.example');
    await page.fill('#qtFromAddress', '12 High Street\nLeeds LS1 4AB');
    await page.fill('#qtToName', 'Test Client');
    await page.fill('#qtToEmail', 'client@example.com');
    await page.fill('#qtNumber', 'Q-014');
    await page.fill('.qt-desc', 'Replace 12 m of garden fence');
    await page.fill('.qt-rate', '95');
    await page.fill('#qtNotes', 'Deposit 30%. Balance on completion. Prices valid for 30 days.');
    if (logo) await page.setInputFiles('#qtLogo', { name: 'logo.png', mimeType: 'image/png', buffer: noisePng(260, 260) });
    await settle(page, 250);
  }
  const rows = () => world.db.prepare('SELECT * FROM links ORDER BY created').all();
  const idOf = u => new URL(u).pathname.split('/q/')[1];

  for (const [label, viewport] of [['1440x900', { width: 1440, height: 900 }], ['390x844', { width: 390, height: 844 }]]) {
    console.log('\n== ' + label);
    const { width: VW, height: VH } = viewport;
    world.db.exec('DELETE FROM links'); world.mails.length = 0; world.offset = 0;

    // ---------------------------------------------------------------- 1. a free visitor
    {
      const { ctx, seen } = await context({ viewport });
      const page = await ctx.newPage();
      await page.goto(url('/quote-template-plumber'), { referer: 'https://www.google.com/' });
      await page.waitForSelector('#qtPdfBtn');
      await fill(page);
      const btn = page.locator('#qtAccBtn');
      ok(await btn.isVisible() && /Send for acceptance/.test(await btn.innerText()) && /PRO/.test(await btn.innerText()), 'free: the Send for acceptance button is there with the Pro tag');
      const order = await page.evaluate(() => [...document.querySelectorAll('.qt-actions > *')].map(e => e.id));
      ok(order.join(',').startsWith('qtPdfBtn,qtInvBtn,qtAccBtn'), 'free: it sits under the PDF and invoice buttons: ' + order.join(','));
      ok(await page.locator('#qmAccNote').isHidden(), 'free: no "sent from this browser" line');
      await btn.click();
      const msg = page.locator('#qtMsg');
      await msg.waitFor({ state: 'visible' });
      const text = await msg.innerText();
      ok(/online acceptance is part of Pro/.test(text) && /\$9 one-time/.test(text) && (await msg.locator('a[data-qm-pro="accept"]').count()) === 1 && (await msg.locator('a[href="/activate"]').count()) === 1, 'free: the button shows the Pro offer with Get Pro and the way to activate a key: ' + text.slice(0, 90));
      ok((await page.locator('dialog.qm-acc').count()) === 0, 'free: no send window');
      ok(evs(seen).includes('paywall_shown:accept'), 'free: counted as paywall_shown with place accept: ' + JSON.stringify(evs(seen)));
      ok(await withinScreen(page, '#qtMsg', VW, 100000) && await contained(page, '.qt-actions'), 'free: the offer fits the width');
      await page.locator('.qt-actions').scrollIntoViewIfNeeded();
      await shot(page, `free-offer-${label}`);
      const status = await page.evaluate(async () => (await fetch('/accept/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quote: { items: [{ desc: 'x', qty: 1, rate: 1 }] } }) })).status);
      ok(status === 402, 'free: the same request made by hand is refused by the server: ' + status);
      ok(rows().length === 0, 'free: nothing was stored');
      await msg.locator('a[data-qm-pro="accept"]').click();
      const sheet = page.locator('dialog.pp-sheet');
      await sheet.waitFor({ state: 'visible', timeout: 8000 });
      const asked = await page.evaluate(() => ({ init: !!window.__paddleInit, open: window.__paddleOpen && window.__paddleOpen.items }));
      ok(asked.init && asked.open && asked.open[0].priceId === 'pri_test_lifetime', 'free: Get Pro opens the existing checkout for the QuotationMaker Pro price');
      ok(evs(seen).includes('paywall_pro_click:accept'), 'free: the press is counted as paywall_pro_click with place accept: ' + JSON.stringify(evs(seen)));
      await page.click('dialog.pp-sheet [data-pp-close]');
      await noScroll(page, 'free');
      ok(seen.errors.length === 0 && seen.other.length === 0, 'free: no error, nothing else left the browser: ' + JSON.stringify(seen.errors.concat(seen.other)));
      await ctx.close();
    }

    // ---------------------------------------------------------------- 2-4. the seller, the client, the seller again
    const seller = await context({ viewport, key: SELLER_KEY });
    const page = await seller.ctx.newPage();
    await page.goto(url('/quote-template-plumber'), { referer: 'https://www.google.com/' });
    await page.waitForSelector('#qtPdfBtn');
    ok(await page.evaluate(() => window.QT_CONFIG.isPro === true), 'seller: the server knows this browser is Pro');
    await fill(page, { logo: true });
    ok((await page.evaluate(() => document.querySelector('#qtLogo').files[0].size)) > 200000, 'seller: the logo is a big file, over 200 KB (the link has to make it smaller)');
    await page.locator('#qtAccBtn').click();
    const dlg = page.locator('dialog.qm-acc');
    await dlg.waitFor({ state: 'visible' });
    ok(await dlg.evaluate(d => d.open && d.matches(':modal')), 'seller: the send window is a modal dialog');
    const labelId = await dlg.getAttribute('aria-labelledby');
    ok(!!labelId && /Send for acceptance/.test(await page.locator('#' + labelId).innerText()), 'seller: the window is labelled');
    ok((await page.inputValue('#qmAccMail')) === 'hello@harper.example', 'seller: the email box is filled from the quote\'s own email');
    const facts = await dlg.locator('.qm-acc-facts li').allInnerTexts();
    ok(facts.length === 3 && /90 days/.test(facts[0]) && /only to your client/.test(facts[1]) && /No IP address/.test(facts[2]), 'seller: the window says what is kept, who can open it and what is recorded: ' + facts.join(' | ').slice(0, 120));
    ok(await page.evaluate(() => document.activeElement && document.activeElement.id === 'qmAccMail'), 'seller: focus starts in the email box');
    ok(await page.evaluate(() => { document.querySelector('#qtFromName').focus(); return !!document.activeElement.closest('dialog.qm-acc'); }), 'seller: the page behind cannot take focus');
    ok(await withinScreen(page, 'dialog.qm-acc', VW, VH) && await contained(page, 'dialog.qm-acc'), 'seller: the window is inside the screen and nothing pokes out');
    await noScroll(page, 'seller (window open)');
    await shot(page, `send-window-${label}`);
    // a wrong address is caught before anything is sent
    await page.fill('#qmAccMail', 'not an address');
    await page.click('#qmAccGo');
    ok(/does not look right/.test(await page.locator('#qmAccErr').innerText()) && rows().length === 0, 'seller: a wrong email address is caught, nothing is sent');
    await page.fill('#qmAccMail', 'seller@harper.example');
    await page.click('#qmAccGo');
    await page.locator('#qmAccDone').waitFor({ state: 'visible' });
    const link = await page.inputValue('#qmAccLink');
    ok(/^https:\/\/www\.getquotationmaker\.com\/q\/[a-z2-7]{26}$/.test(link), 'seller: the private link is 26 characters of 128 random bits: ' + link.replace(/[a-z2-7]{26}$/, '<code>'));
    const clientPath = new URL(link).pathname;
    const id = idOf(link);
    ok(/Status: sent\. Your client has not opened it yet\./.test(await page.locator('#qmAccState').innerText()), 'seller: the status starts at sent');
    const mailto = await page.getAttribute('#qmAccMailto', 'href');
    ok(mailto.startsWith('mailto:client@example.com?subject=') && decodeURIComponent(mailto).includes(link) && /Quote%20Q-014%20from%20Harper%20Fencing%20Ltd/.test(mailto), 'seller: the email button opens the mail app with the client\'s address, a subject and the link (not pressed here)');
    const st = (await page.getAttribute('a[href^="/quote-status#"]', 'href')).split('#')[1];
    ok(/^[a-z2-7]{26}$/.test(st) && st !== id, 'seller: the status link has its own code');
    ok(await withinScreen(page, 'dialog.qm-acc', VW, VH) && await contained(page, 'dialog.qm-acc'), 'seller: the link window is inside the screen');
    await noScroll(page, 'seller (link ready)');
    await shot(page, `link-ready-${label}`);
    ok(rows().length === 1, 'seller: one link is stored');
    const r1 = rows()[0];
    const stored = world.core.view(id).quote;
    ok(stored.logo.startsWith('data:image/') && stored.logo.length <= 120000, 'seller: the stored logo is a smaller picture (' + stored.logo.length + ' characters, the file was over 200 KB)');
    ok(r1.size <= 200000 && stored.items[0].desc === 'Replace 12 m of garden fence' && stored.toName === 'Test Client', 'seller: the snapshot is the quote, under 200 KB: ' + r1.size + ' bytes');
    ok(!JSON.stringify(r1).toLowerCase().includes(SELLER_KEY.toLowerCase()) && !/ip|agent|cookie/i.test(Object.keys(r1).join(',')), 'seller: what is stored holds no Pro key and has no IP address column');
    ok(r1.notify === 'seller@harper.example', 'seller: the notification address is held until the acceptance email');
    const local1 = await page.evaluate(() => JSON.parse(localStorage.getItem('qm-accept:v1')));
    ok(local1.length === 1 && local1[0].s === st && local1[0].l === link && local1[0].q === 'Q-014', 'seller: the status code and the link are kept in local storage');
    ok(!evs(seller.seen).includes('paywall_shown:accept'), 'seller: a Pro seller is not shown the offer');

    // the client opens the link
    const client = await context({ viewport });
    const cp = await client.ctx.newPage();
    cp.on('request', r => { if (r.resourceType() === 'script') client.seen.scripts++; });
    const resp = await cp.goto(url(clientPath));
    ok(resp.status() === 200, 'client: the link opens');
    const h = resp.headers();
    ok(/noindex/.test(h['x-robots-tag']) && h['referrer-policy'] === 'no-referrer' && /no-store/.test(h['cache-control']) && /default-src 'none'/.test(h['content-security-policy']), 'client: the page says noindex, no referrer, no store and loads nothing it does not need');
    ok((await cp.locator('meta[name=robots]').getAttribute('content')).includes('noindex') && (await cp.locator('meta[name=referrer]').getAttribute('content')) === 'no-referrer', 'client: and so do its meta tags');
    ok(/Quote Q-014 from Harper Fencing Ltd/.test(await cp.locator('h1').innerText()), 'client: the heading names the quote and who it is from');
    const ct = await cp.locator('.doc').innerText();
    ok(['Harper Fencing Ltd', 'Test Client', 'Replace 12 m of garden fence', 'Deposit 30%'].every(s => ct.includes(s)) && /\$95\.00/.test(ct), 'client: the quote is drawn: names, the line, the total and the terms: ' + ct.replace(/\s+/g, ' ').slice(0, 60));
    ok(await cp.locator('.doc-logo').isVisible() && (await cp.locator('.doc-logo').evaluate(i => i.naturalWidth)) > 0, 'client: the logo is shown');
    ok(client.seen.scripts === 0 && (await cp.evaluate(() => typeof window.QMCount)) === 'undefined' && (await cp.locator('script').count()) === 0, 'client: no script runs on the page and the counter is not loaded');
    ok(await withinScreen(cp, '.doc', VW + 1, 100000) && await contained(cp, '.doc'), 'client: the quote fits the width');
    await noScroll(cp, 'client');
    await shot(cp, `client-quote-${label}`, true);
    const [dl] = await Promise.all([cp.waitForEvent('download'), cp.locator('.top-a a', { hasText: 'Download the PDF' }).click()]);
    ok(await pdfOk(dl) && /^quote-Q-014\.pdf$/.test(dl.suggestedFilename()), 'client: the PDF downloads: ' + dl.suggestedFilename());
    ok(world.core.view(id).state === 'viewed', 'client: opening the link made it "viewed"');

    // the seller checks, in the window (manual) and, before that, on the status page
    await page.click('[data-qm="check"]');
    await page.waitForFunction(() => /opened on/.test(document.querySelector('#qmAccState').textContent));
    ok(/Status: opened on \d{1,2} [A-Z][a-z]{2} \d{4}, \d{2}:\d{2} UTC, not accepted yet\./.test(await page.locator('#qmAccState').innerText()), 'seller: "Check status" now says opened, with the time in UTC');
    await page.keyboard.press('Escape');
    await dlg.waitFor({ state: 'detached' });
    ok(await page.evaluate(() => document.activeElement && document.activeElement.id === 'qtAccBtn'), 'seller: closing the window gives focus back to the button');
    ok(/1 quote sent for acceptance from this browser\./.test(await page.locator('#qmAccNote').innerText()) && (await page.locator('#qmAccNote a').getAttribute('href')) === '/quote-status', 'seller: a line under the button says one quote was sent and links to the status page');

    // the client accepts: first with nothing, then properly
    const submit = cp.locator('form button[type=submit]');
    ok(/Accept the quote for/.test(await submit.innerText()), 'client: the button names the total');
    await submit.click();
    ok(cp.url() === url(clientPath) && await cp.evaluate(() => document.querySelector('#acc-name').validity.valueMissing), 'client: an empty form is not sent');
    await cp.fill('#acc-name', 'Jordan Avery');
    await submit.click();
    ok(cp.url() === url(clientPath) && await cp.evaluate(() => document.querySelector('input[name=confirm]').validity.valueMissing) && world.core.view(id).state === 'viewed', 'client: without the tick it is not sent either');
    await cp.fill('#acc-note', 'Please start after the 3rd. <b>Thanks</b>');
    await cp.check('input[name=confirm]');
    await shot(cp, `client-form-filled-${label}`, true);
    await Promise.all([cp.waitForNavigation(), submit.click()]);
    await cp.locator('.card.is-ok').waitFor();
    const acc = await cp.locator('.card.is-ok').innerText();
    ok(cp.url() === url(clientPath) && /Quote accepted/.test(acc) && /Jordan Avery accepted this quote on \d{1,2} [A-Z][a-z]{2} \d{4}, \d{2}:\d{2} UTC\./.test(acc) && acc.includes('Please start after the 3rd. <b>Thanks</b>'), 'client: the page says who accepted and when, and shows the note as text: ' + acc.replace(/\s+/g, ' ').slice(0, 110));
    ok((await cp.locator('.card.is-ok b').count()) === 0, 'client: the note\'s markup did not become markup');
    ok((await cp.locator('form').count()) === 0, 'client: the form is gone');
    await noScroll(cp, 'client (accepted)');
    await shot(cp, `client-accepted-${label}`, true);
    await cp.reload();
    ok(/Quote accepted/.test(await cp.locator('.card.is-ok').innerText()), 'client: a reload still shows the acceptance');
    const acceptedRow = rows()[0];
    ok(acceptedRow.a_name === 'Jordan Avery' && Math.abs(acceptedRow.accepted - Date.now()) < 120000 && acceptedRow.a_note.includes('Please start after the 3rd.'), 'client: the server holds the name, the note and the time (UTC) and nothing else about the client');
    ok(world.mails.length === 1 && world.mails[0].to === 'seller@harper.example' && world.mails[0].subject === 'Quote Q-014 was accepted' && world.mails[0].text.includes('/quote-status#' + st) && !/Jordan|Avery|3rd/.test(world.mails[0].text), 'seller: one email went to the typed address, with the status link and nothing the client typed');
    ok(world.db.prepare('SELECT notify FROM links WHERE id = ?').get(id).notify === null, 'seller: and the address was deleted after it');

    // the seller's status page
    const sp = await seller.ctx.newPage();
    await sp.goto(url('/quote-status'));
    await sp.locator('.qs-item').waitFor();
    await sp.locator('.qs-item.is-accepted').waitFor();
    const item = await sp.locator('.qs-item').innerText();
    ok(/Quote Q-014/.test(item) && /Accepted\b/.test(item) && /Accepted by Jordan Avery on \d{1,2} [A-Z][a-z]{2} \d{4}, \d{2}:\d{2} UTC\./.test(item) && item.includes('Please start after the 3rd. <b>Thanks</b>'), 'status page: the list shows the quote, accepted, by whom and when, and the note as text: ' + item.replace(/\s+/g, ' ').slice(0, 90));
    ok((await sp.locator('.qs-item b').count()) === 0, 'status page: nothing the client typed became markup');
    ok(await sp.locator('.qs-item a[href$="' + clientPath + '"]').count() === 1 && await sp.locator('.qs-item button[data-act="copy"]').count() === 1, 'status page: the client link can be opened and copied');
    await sp.click('#qsCheck');
    await sp.waitForFunction(() => /Checked at/.test(document.querySelector('#qsWhen').textContent));
    ok(true, 'status page: the manual "Check status now" button answers: ' + (await sp.locator('#qsWhen').innerText()));
    ok(await contained(sp, '.qs-item'), 'status page: the card fits');
    await noScroll(sp, 'status page');
    await shot(sp, `status-accepted-${label}`, true);
    const spHead = await (await sp.goto(url('/quote-status'))).allHeaders();
    ok(/noindex/.test(spHead['x-robots-tag']) && spHead['referrer-policy'] === 'no-referrer' && (await sp.locator('meta[name=robots]').getAttribute('content')).includes('noindex') && (await sp.evaluate(() => typeof window.QMCount)) === 'undefined', 'status page: noindex, no referrer, not counted');

    // a status link opened on another device (a browser with nothing saved) joins its list
    {
      const other = await context({ viewport });
      const op = await other.ctx.newPage();
      await op.goto(url('/quote-status'));
      await op.locator('#qsEmpty').waitFor({ state: 'visible' });
      ok(await op.locator('#qsCheck').isHidden() && /No sent quotes in this browser yet/.test(await op.locator('#qsEmpty').innerText()), 'status page: a browser with nothing saved says so');
      await noScroll(op, 'status page (empty)');
      await shot(op, `status-empty-${label}`);
      await op.goto(url('/quote-status#' + st));
      await op.locator('.qs-item.is-accepted').waitFor();
      ok(/Quote Q-014/.test(await op.locator('.qs-item').innerText()) && /Jordan Avery/.test(await op.locator('.qs-item').innerText()) && (await op.locator('.qs-item a[href*="/q/"]').count()) === 0, 'status page: a status link opened on another device shows the quote and who accepted (without a client link, which it does not have)');
      const kept = await op.evaluate(() => JSON.parse(localStorage.getItem('qm-accept:v1')));
      ok(kept.length === 1 && kept[0].s === st && !JSON.stringify(kept).includes('Jordan'), 'status page: it joins that browser\'s list, and what the client typed is not saved there');
      await other.ctx.close();
    }
    // a second tool page of the seller: the line under the button and the window's manual check show accepted
    await page.reload();
    await page.waitForSelector('#qtPdfBtn');
    ok(/1 quote sent/.test(await page.locator('#qmAccNote').innerText()), 'seller: after a reload the line under the button is still there');

    // ---- a quote full of markup, a wrong form, an expired link, an invalid one
    const evil = '<script>window.__xss=1</script><img src=x onerror="window.__xss=2">"\'';
    const made = await page.evaluate(async evil_ => {
      const q = { fromName: evil_, fromEmail: evil_, fromAddress: evil_, toName: evil_, toEmail: evil_, toAddress: evil_, quoteNumber: 'Q-<9>', notes: evil_, items: [{ desc: evil_, qty: 2, rate: 10 }], currency: 'USD', color: '#0f4c81' };
      const a = await (await fetch('/accept/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quote: q }) })).json();
      const b = await (await fetch('/accept/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quote: { ...q, fromName: 'Harper Fencing Ltd', toName: 'Test Client', toEmail: '', toAddress: '', fromEmail: '', fromAddress: '', notes: 'Second quote', quoteNumber: 'Q-015' } }) })).json();
      return { a: a.clientUrl, b: b.clientUrl };
    }, evil);
    ok(!!made.a && !!made.b, 'seller: two more links are made');
    {
      const ep = await client.ctx.newPage();
      ep.on('dialog', d => d.dismiss());
      await ep.goto(local(made.a));
      const t = await ep.content();
      ok((await ep.evaluate(() => window.__xss)) === undefined && (await ep.locator('.doc img[src="x"], .doc script').count()) === 0, 'client: a quote full of markup runs nothing and draws no element from it');
      ok(t.includes('&lt;script&gt;window.__xss=1&lt;/script&gt;') && !t.includes('<script>window.__xss'), 'client: the markup is on the page as text');
      await noScroll(ep, 'client (markup)');
      await ep.close();
    }
    {
      const ep = await client.ctx.newPage();
      await ep.goto(local(made.b));
      await ep.evaluate(() => { document.querySelector('form').noValidate = true; });
      await ep.fill('#acc-name', 'J');
      await ep.fill('#acc-note', 'my note <i>kept</i>');
      await ep.check('input[name=confirm]');
      await Promise.all([ep.waitForNavigation(), ep.locator('form button[type=submit]').click()]);
      const err = await ep.locator('.err').innerText();
      ok(/Type your full name, at least two letters/.test(err) && (await ep.inputValue('#acc-note')) === 'my note <i>kept</i>' && (await ep.inputValue('#acc-name')) === 'J', 'client: a wrong form is sent back with a message and what was typed');
      ok(world.core.view(idOf(made.b)).state === 'viewed', 'client: and nothing was recorded');
      await noScroll(ep, 'client (message)');
      await shot(ep, `client-message-${label}`, true);
      await ep.evaluate(() => { document.querySelector('form').noValidate = true; document.querySelector('#acc-name').value = 'Jordan Avery'; document.querySelector('input[name=confirm]').checked = false; });
      await Promise.all([ep.waitForNavigation(), ep.locator('form button[type=submit]').click()]);
      ok(/Tick the box to confirm/.test(await ep.locator('.err').innerText()), 'client: without the tick the message asks for it');
      await ep.close();
    }
    {
      const ep = await client.ctx.newPage();
      world.offset = 91 * 864e5;
      const r = await ep.goto(local(made.b));
      ok(r.status() === 410 && /This link has expired/.test(await ep.locator('main').innerText()) && /noindex/.test(r.headers()['x-robots-tag']), 'client: after 90 days the link says it has expired');
      await noScroll(ep, 'client (expired)');
      await shot(ep, `client-expired-${label}`);
      const sx = await sp.evaluate(async code => (await (await fetch('/accept/status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codes: [code] }) })).json()).items[0].state, st);
      ok(sx === 'gone', 'seller: and the status says gone');
      world.offset = 0;
      const r2 = await ep.goto(url('/q/' + 'a'.repeat(26)));
      ok(r2.status() === 404 && /This link is not valid/.test(await ep.locator('main').innerText()), 'client: a code nobody made gets a plain page');
      await noScroll(ep, 'client (invalid)');
      await shot(ep, `client-invalid-${label}`);
      await ep.close();
    }

    // ---- the codes never leave the browser in an address, and the counter never saw the client's page
    {
      const everything = [...seller.seen.requests, ...client.seen.requests];
      const leaked = everything.filter(r => r.url.includes(st));
      ok(leaked.length === 0, 'privacy: the status code is in no address the browser asked for (only in the body of a POST)');
      const counterBodies = [...seller.seen.counter, ...client.seen.counter].map(c => c.body || '');
      ok(counterBodies.every(b => !b.includes(id) && !b.includes(st) && !b.includes('/q/')), 'privacy: the counter never saw a link or the client\'s page');
      ok(client.seen.counter.length === 0, 'privacy: the client\'s browser sent nothing to the counter');
      ok(client.seen.other.length === 0 && seller.seen.other.length === 0 && client.seen.errors.length === 0 && seller.seen.errors.length === 0, 'no error, nothing else left the browser: ' + JSON.stringify([...client.seen.other, ...seller.seen.other, ...client.seen.errors, ...seller.seen.errors]));
    }
    await client.ctx.close();
    await seller.ctx.close();
  }

  await browser.close();
  await new Promise(r => server.close(r));
  world.restore();
  console.log(failed ? `\n${failed} check(s) FAILED` : '\nall checks passed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
