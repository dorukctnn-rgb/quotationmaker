/* GetQuotationMaker quote tool: live preview, presets and PDF download.
   Used by every page that embeds views/partials/tool.ejs.
   The Pro offers around the download are built here, not in the page: a choice dialog the first time a free visitor presses Download
   in a session, then a slim bar; a next-step panel after a free download; a Pro tag on an uploaded logo. Nothing blocks or delays the
   free PDF. The pages' HTML does not change with this file. The notes for the counter go through QMCount.track (public/count.js),
   which is not loaded on the pages left out of the counter (content/counter-skip.json), so there they are silent. */
(function () {
  'use strict';
  var CFG = window.QT_CONFIG || {};
  var PRESETS = CFG.presets || {};
  var IS_PRO = !!CFG.isPro;
  var color = '#0f4c81';
  var logoData = '';
  var $ = function (id) { return document.getElementById(id); };
  var PRO_LINK = CFG.gumroadLink || '#';
  var GUM = /^https:\/\/[a-z0-9-]+\.gumroad\.com\/l\//i;
  var SEEN = 'qm-dl-seen', BARS = 'qm-bars', BAR_OFF = 'qm-bar-off', DRAFT = 'qm-draft';
  var DRAFT_TTL = 3 * 60 * 60 * 1000;
  var memo = {};

  // Session storage with a fallback in memory, for browsers that block it. Only small words are kept, never the quote
  // (the draft below is the one exception and is written on its own).
  function sget(k) { try { var v = window.sessionStorage.getItem(k); return v == null ? (memo[k] || null) : v; } catch (e) { return memo[k] || null; } }
  function sset(k, v) { memo[k] = v; try { window.sessionStorage.setItem(k, v); } catch (e) {} }
  // One note for the counter: pdf_download (free or pro), logo_upload (free or pro), paywall_shown and paywall_pro_click (which offer).
  function track(event, where) { try { if (window.QMCount && window.QMCount.track) window.QMCount.track(event, where); } catch (e) {} }
  function proLink(cls, surface, label) {
    return '<a' + (cls ? ' class="' + cls + '"' : '') + ' href="' + esc(PRO_LINK) + '" target="_blank" rel="noopener" data-buy-pro data-qm-pro="' + surface + '" data-pro-place="' + surface + '">' + label + '</a>';
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function nl2br(s) { return esc(s).replace(/\r?\n/g, '<br>'); }
  function num(v) { var n = parseFloat(v); return isFinite(n) ? n : 0; }
  function money(n) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function curParts() {
    var v = ($('qtCurrency') && $('qtCurrency').value) || 'USD|$';
    var p = v.split('|');
    return { code: p[0], sym: p[1] || '' };
  }
  function fmt(n) {
    var c = curParts();
    var s = c.sym;
    var spaced = s.length > 1 && /[A-Za-zł]$/.test(s) ? s + ' ' : s;
    return (n < 0 ? '-' : '') + spaced + money(Math.abs(n));
  }
  function niceDate(v) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v || '')) return v || '';
    var d = new Date(v + 'T12:00:00Z');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  }
  function dateAdd(days) {
    var d = new Date(Date.now() + days * 864e5);
    return d.toISOString().slice(0, 10);
  }

  // ---- line items ----
  function itemRow(desc, qty, rate) {
    var row = document.createElement('div');
    row.className = 'qt-ir';
    row.innerHTML =
      '<input type="text" class="qt-desc" aria-label="Description" placeholder="Description of work or item">' +
      '<label class="qt-cell" data-l="Qty"><input type="number" class="qt-qty" aria-label="Quantity" min="0" step="any" inputmode="decimal"></label>' +
      '<label class="qt-cell" data-l="Rate"><input type="number" class="qt-rate" aria-label="Rate" min="0" step="any" inputmode="decimal"></label>' +
      '<div class="qt-lt" data-l="Amount" aria-label="Line amount"></div>' +
      '<button type="button" class="qt-del" title="Remove line" aria-label="Remove line">&times;</button>';
    row.querySelector('.qt-desc').value = desc || '';
    row.querySelector('.qt-qty').value = qty == null ? 1 : qty;
    row.querySelector('.qt-rate').value = rate == null ? 0 : rate;
    return row;
  }
  function addItem(desc, qty, rate, silent) {
    $('qtItems').appendChild(itemRow(desc, qty, rate));
    if (!silent) up();
  }
  function getItems() {
    var out = [];
    document.querySelectorAll('#qtItems .qt-ir').forEach(function (row) {
      var desc = row.querySelector('.qt-desc').value;
      var qty = num(row.querySelector('.qt-qty').value);
      var rate = num(row.querySelector('.qt-rate').value);
      row.querySelector('.qt-lt').textContent = fmt(qty * rate);
      out.push({ desc: desc, qty: qty, rate: rate });
    });
    return out;
  }

  function totals(items) {
    var sub = items.reduce(function (a, i) { return a + i.qty * i.rate; }, 0);
    var tr = num($('qtTaxRate').value);
    var tl = $('qtTaxLabel').value || 'Tax';
    var disc = num($('qtDiscount').value);
    var discType = $('qtDiscountType').value;
    var discAmt = discType === 'percent' ? sub * (disc / 100) : disc;
    var after = sub - discAmt;
    var ta = after * (tr / 100);
    return { sub: sub, tr: tr, tl: tl, disc: disc, discType: discType, discAmt: discAmt, ta: ta, tot: after + ta };
  }

  function collect() {
    var items = getItems();
    var t = totals(items);
    var c = curParts();
    return {
      fromName: $('qtFromName').value, fromEmail: $('qtFromEmail').value, fromAddress: $('qtFromAddress').value,
      toName: $('qtToName').value, toEmail: $('qtToEmail').value, toAddress: $('qtToAddress').value,
      quoteNumber: $('qtNumber').value, quoteDate: $('qtDate').value, validUntil: $('qtValid').value,
      notes: $('qtNotes').value, items: items, t: t, color: color, currency: c.code, symbol: c.sym, logo: logoData
    };
  }

  function renderTotals(d) {
    var t = d.t;
    $('qtSub').textContent = fmt(t.sub);
    $('qtTot').textContent = fmt(t.tot);
    $('qtDiscRow').style.display = t.discAmt > 0 ? 'flex' : 'none';
    $('qtDiscLabel').textContent = 'Discount' + (t.discType === 'percent' ? ' (' + t.disc + '%)' : '');
    $('qtDiscAmt').textContent = '-' + fmt(t.discAmt);
    $('qtTaxRow').style.display = t.tr > 0 ? 'flex' : 'none';
    $('qtTaxName').textContent = t.tl + ' (' + t.tr + '%)';
    $('qtTaxAmt').textContent = fmt(t.ta);
  }

  // mode: none = the live preview; 'free' or 'pro' = a small picture of the PDF that way, for the download choice (the Made with line sits at
  // the foot of the page and is outlined, the logo is outlined, so that the difference shows when the picture is small).
  function previewHTML(d, mode) {
    var thumb = mode === 'free' || mode === 'pro';
    var c = /^#[0-9a-f]{6}$/i.test(d.color) ? d.color : '#0f4c81';
    var t = d.t;
    var rows = d.items.map(function (i) {
      return '<tr><td class="d">' + nl2br(i.desc) + '</td><td class="n">' + esc(i.qty) + '</td><td class="n">' + esc(fmt(i.rate)) +
        '</td><td class="n b">' + esc(fmt(i.qty * i.rate)) + '</td></tr>';
    }).join('');
    var logo = '';
    if (mode !== 'free') {
      if (/^data:image\/(png|jpe?g);base64,/.test(d.logo)) {
        logo = '<img src="' + d.logo + '" alt="" class="logo' + (mode === 'pro' ? ' hl' : '') + '">';
        // a free visitor's logo is marked in the live preview: it is in the preview, and goes on the PDF with Pro
        if (!mode && !IS_PRO) logo = '<div class="lg">' + logo + '<span class="pt">PRO</span></div><div class="pn">Your logo goes on the PDF with Pro</div>';
      } else if (mode === 'pro') logo = '<div class="lph">Your logo</div>';
    }
    var wm = mode === 'pro' ? false : (mode === 'free' ? true : !IS_PRO);
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
      'body{font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;margin:0;padding:18px;font-size:12px}*{box-sizing:border-box}' +
      '.hd{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:16px;padding-bottom:12px;border-bottom:3px solid ' + c + '}' +
      '.ttl{font-size:20px;font-weight:800;color:' + c + ';letter-spacing:.5px}.mut{color:#666;font-size:10px}.lab{font-size:9px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px}' +
      '.logo{display:block;max-height:40px;max-width:130px;margin-bottom:8px}.r{text-align:right}.two{display:flex;justify-content:space-between;gap:12px;margin-bottom:14px}' +
      'table{width:100%;border-collapse:collapse;margin-bottom:12px}th{background:' + c + ';color:#fff;font-size:9px;letter-spacing:.5px;padding:7px 6px;text-align:left}th.n{text-align:right}' +
      'td{padding:7px 6px;border-bottom:1px solid #eee;font-size:11px;vertical-align:top}td.n{text-align:right;white-space:nowrap;color:#555}td.b{font-weight:700;color:#111}' +
      '.tots{margin-left:auto;min-width:200px;max-width:260px}.tr{display:flex;justify-content:space-between;padding:3px 0;font-size:11px;color:#555}.gr{font-size:14px;font-weight:800;color:#111;border-top:2px solid ' + c + ';padding-top:7px;margin-top:3px}' +
      '.notes{background:#f7f7f8;border-left:3px solid ' + c + ';padding:8px 11px;margin-top:12px;font-size:11px;color:#444;line-height:1.55}.valid{color:#b42318;font-weight:700}' +
      '.wm{text-align:center;margin-top:18px;padding-top:9px;border-top:1px solid #eee;font-size:9px;color:#aaa}' +
      '.lg{display:flex;align-items:center;gap:6px;margin-bottom:5px}.lg .logo{margin-bottom:0}' +
      '.pt{font-size:8px;font-weight:700;letter-spacing:.6px;color:#0f4c81;background:#e8f0f8;border:1px solid #c3d9f0;border-radius:3px;padding:2px 5px}' +
      '.pn{display:inline-block;font-size:9px;color:#0f4c81;background:#f2f7fc;border:1px dashed #9ec1e6;border-radius:4px;padding:3px 6px;margin-bottom:8px}' +
      '.lph{display:inline-block;border:1px dashed #9ec1e6;color:#6b94bd;font-size:10px;padding:10px 16px;border-radius:4px;margin-bottom:8px}' +
      (thumb ? 'html,body{height:100%}body{position:relative;overflow:hidden}.wm{position:absolute;left:18px;right:18px;bottom:14px;margin:0;outline:3px solid #d97706;outline-offset:4px;border-top:0}.logo.hl,.lph{outline:3px solid #0f4c81;outline-offset:3px}' : '') +
      '</style></head><body>' +
      '<div class="hd"><div>' + logo + '<div class="ttl">QUOTATION</div><div class="mut">#' + esc(d.quoteNumber || 'Q-001') + '</div></div>' +
      '<div class="r"><div style="font-weight:700;font-size:13px">' + esc(d.fromName) + '</div><div class="mut">' + esc(d.fromEmail) + '</div><div class="mut">' + nl2br(d.fromAddress) + '</div></div></div>' +
      '<div class="two"><div><div class="lab">Prepared for</div><div style="font-weight:700">' + esc(d.toName) + '</div><div class="mut">' + esc(d.toEmail) + '</div><div class="mut">' + nl2br(d.toAddress) + '</div></div>' +
      '<div class="r"><div class="lab">Quote date</div><div style="font-weight:700;margin-bottom:6px">' + esc(niceDate(d.quoteDate)) + '</div>' +
      (d.validUntil ? '<div class="lab">Valid until</div><div class="valid">' + esc(niceDate(d.validUntil)) + '</div>' : '') + '</div></div>' +
      '<table><thead><tr><th>DESCRIPTION</th><th class="n">QTY</th><th class="n">RATE</th><th class="n">AMOUNT</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<div class="tots"><div class="tr"><span>Subtotal</span><span>' + esc(fmt(t.sub)) + '</span></div>' +
      (t.discAmt > 0 ? '<div class="tr" style="color:#b42318"><span>Discount' + (t.discType === 'percent' ? ' (' + esc(t.disc) + '%)' : '') + '</span><span>-' + esc(fmt(t.discAmt)) + '</span></div>' : '') +
      (t.tr > 0 ? '<div class="tr"><span>' + esc(t.tl) + ' (' + esc(t.tr) + '%)</span><span>' + esc(fmt(t.ta)) + '</span></div>' : '') +
      '<div class="tr gr"><span>Total</span><span style="color:' + c + '">' + esc(fmt(t.tot)) + '</span></div></div>' +
      (d.notes ? '<div class="notes"><div class="lab">Notes &amp; terms</div>' + nl2br(d.notes) + '</div>' : '') +
      (wm ? '<div class="wm">Made with GetQuotationMaker.com</div>' : '') +
      '</body></html>';
  }

  var SAVED = ['qtFromName', 'qtFromEmail', 'qtFromAddress'];
  function saveSender() { try { SAVED.forEach(function (id) { localStorage.setItem('gqm_' + id, $(id).value); }); } catch (e) {} }
  function restoreSender() {
    try { SAVED.forEach(function (id) { var v = localStorage.getItem('gqm_' + id); if (v && !$(id).value) $(id).value = v; }); } catch (e) {}
  }

  var timer = null;
  function up() {
    var d = collect();
    renderTotals(d);
    saveSender();
    clearTimeout(timer);
    timer = setTimeout(function () { $('qtFrame').srcdoc = previewHTML(d); }, 60);
  }

  function setCurrency(code) {
    var sel = $('qtCurrency');
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value.split('|')[0] === code) { sel.selectedIndex = i; return; }
    }
  }

  function loadPreset(key, opts) {
    var p = PRESETS[key];
    if (!p) return false;
    if (p.currency) setCurrency(p.currency);
    if (p.taxRate != null) $('qtTaxRate').value = p.taxRate;
    if (p.taxLabel) $('qtTaxLabel').value = p.taxLabel;
    if (p.validDays) $('qtValid').value = dateAdd(p.validDays);
    if (p.notes != null) $('qtNotes').value = p.notes;
    if (p.number) $('qtNumber').value = p.number;
    if (p.items && p.items.length) {
      $('qtItems').innerHTML = '';
      p.items.forEach(function (i) { addItem(i[0], i[1], i[2], true); });
    }
    $('qtDiscount').value = '';
    up();
    var status = $('qtPresetStatus');
    if (status && p.label) { status.textContent = 'Loaded: ' + p.label + '. Edit any field, then download.'; status.hidden = false; }
    if (!(opts && opts.noScroll)) {
      var tool = $('qtTool');
      if (tool) tool.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return true;
  }

  function setBusy(btn, busy, label) {
    btn.disabled = busy;
    if (busy) { btn.dataset.label = btn.innerHTML; btn.textContent = label; }
    else if (btn.dataset.label) btn.innerHTML = btn.dataset.label;
  }

  // ---- what follows a free download ----
  function hideOffers() {
    var a = $('qmAfter'); if (a) a.hidden = true;
    var b = $('qmBar'); if (b) b.hidden = true;
  }
  // after the choice dialog: one next step that Pro really provides (the invoice), once
  function showAfter() {
    var el = $('qmAfter');
    if (!el) {
      el = document.createElement('div');
      el.id = 'qmAfter'; el.className = 'qm-after'; el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Next step'); el.setAttribute('data-pro-place', 'after');
      el.innerHTML = '<p><strong>Next step:</strong> when the client says yes and the job is done, Pro turns this same quote into an invoice in one click.</p>' +
        proLink('qm-after-buy', 'after', 'Get Pro, $9 once') + '<button type="button" class="qm-x" data-qm="dismiss-after" aria-label="Dismiss">&times;</button>';
      $('qtMsg').insertAdjacentElement('afterend', el);
    }
    el.hidden = false;
    track('paywall_shown', 'after');
  }
  // later free downloads: a slim bar, dismissed for the session with one press, three at most
  function showBar() {
    var n = parseInt(sget(BARS) || '0', 10) || 0;
    if (sget(BAR_OFF) === '1' || n >= 3) return;
    sset(BARS, String(n + 1));
    var el = $('qmBar');
    if (!el) {
      el = document.createElement('div');
      el.id = 'qmBar'; el.className = 'qm-bar'; el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Pro'); el.setAttribute('data-pro-place', 'bar');
      el.innerHTML = '<p><strong>Free PDF downloaded.</strong> <span class="qm-bar-long">Pro adds your logo, drops the footer line and turns any quote into an invoice. $9 once.</span><span class="qm-bar-short">Pro adds your logo and invoices. $9 once.</span></p>' +
        proLink('qm-bar-buy', 'bar', 'Get Pro') + '<button type="button" class="qm-x" data-qm="dismiss-bar" aria-label="Dismiss">&times;</button>';
      document.body.appendChild(el);
    }
    el.hidden = false;
    clearTimeout(showBar.t);
    showBar.t = setTimeout(function () { el.hidden = true; }, 15000);
    track('paywall_shown', 'bar');
  }

  // ---- the choice dialog: first free download of a session ----
  var dlg = null;
  function canDialog() {
    try { return typeof HTMLDialogElement === 'function' && typeof document.createElement('dialog').showModal === 'function'; } catch (e) { return false; }
  }
  function thumbFrame(d, mode) {
    return '<iframe sandbox tabindex="-1" aria-hidden="true" title="" srcdoc="' + esc(previewHTML(d, mode)) + '"></iframe>';
  }
  function dialogHTML(d) {
    var hasLogo = /^data:image\/(png|jpe?g);base64,/.test(d.logo);
    return '<div class="qm-dlg-in">' +
      '<h2 id="qmDlgT">Choose your PDF</h2>' +
      '<p class="qm-dlg-sub" id="qmDlgS">Both are made from the quote you just built. The free one needs no signup.</p>' +
      '<div class="qm-dlg-grid">' +
        '<section class="qm-opt" aria-labelledby="qmOptF">' +
          '<div class="qm-thumb">' + thumbFrame(d, 'free') + '</div>' +
          '<div class="qm-opt-b"><div class="qm-opt-h"><h3 id="qmOptF">Free PDF</h3><span>No signup</span></div>' +
          '<ul><li>A small &ldquo;Made with GetQuotationMaker.com&rdquo; line at the bottom</li><li>No logo</li></ul>' +
          '<button type="button" class="qm-btn qm-btn-free" data-qm="free" autofocus>Download free PDF</button></div>' +
        '</section>' +
        '<section class="qm-opt qm-opt-pro" aria-labelledby="qmOptP">' +
          '<div class="qm-thumb">' + thumbFrame(d, 'pro') + '</div>' +
          '<div class="qm-opt-b"><div class="qm-opt-h"><h3 id="qmOptP">Pro PDF</h3><span>$9 once</span></div>' +
          '<ul><li>' + (hasLogo ? 'Your logo at the top, as in the preview' : 'Your logo at the top (add it in the form)') + '</li><li>No &ldquo;Made with&rdquo; line</li><li>Invoice PDF from the same quote in one click</li></ul>' +
          proLink('qm-btn qm-btn-pro', 'dialog', 'Get Pro, $9 once') + '</div>' +
        '</section>' +
      '</div>' +
      '<p class="qm-dlg-foot">Pro is one payment, not a subscription, with a <a href="/refund" target="_blank" rel="noopener">14-day refund</a>. Free stays free, as often as you like.</p>' +
      '<button type="button" class="qm-dlg-x" data-qm="close" aria-label="Close">&times;</button>' +
    '</div>';
  }
  function openChoice() {
    var el = document.createElement('dialog');
    el.className = 'qm-dlg';
    el.setAttribute('aria-labelledby', 'qmDlgT');
    el.setAttribute('aria-describedby', 'qmDlgS');
    el.setAttribute('data-pro-place', 'dialog');
    el.innerHTML = dialogHTML(collect());
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      if (e.target === el) { el.close(); return; }                 // the backdrop
      var b = e.target.closest ? e.target.closest('[data-qm]') : null;
      if (b) {
        var k = b.getAttribute('data-qm');
        el.close();
        if (k === 'free') download('quote', { panel: true });
      } else if (e.target.closest && e.target.closest('[data-qm-pro]')) el.close();   // the Pro link goes on to the checkout
    });
    el.addEventListener('close', function () { el.remove(); if (dlg === el) dlg = null; });
    dlg = el;
    el.showModal();
    var f = el.querySelector('[data-qm="free"]');
    if (f) f.focus();
    sset(SEEN, '1');
    track('paywall_shown', 'dialog');
  }
  // The Download quote PDF button: a free visitor sees the choice once per session; every other press downloads at once.
  function onPdfClick() {
    if (!IS_PRO && sget(SEEN) !== '1') {
      if (canDialog()) {
        try { openChoice(); return; } catch (e) { if (dlg) { try { dlg.remove(); } catch (x) {} dlg = null; } }
      }
      sset(SEEN, '1');
      return download('quote', { panel: true });
    }
    return download('quote');
  }

  // ---- the quote survives the checkout: paying reloads the page, so a quote with something in it is kept for the reload ----
  function hasContent() {
    return !!(logoData || $('qtFromName').value || $('qtToName').value || $('qtNotes').value || getItems().some(function (i) { return i.desc || i.rate; }));
  }
  function saveDraft() {
    try {
      if (!hasContent()) return;
      var f = {};
      document.querySelectorAll('#qtTool input[id], #qtTool select[id], #qtTool textarea[id]').forEach(function (el) { if (el.type !== 'file') f[el.id] = el.value; });
      var base = { v: 1, t: Date.now(), path: location.pathname, f: f, color: color, items: getItems().map(function (i) { return [i.desc, i.qty, i.rate]; }) };
      try { window.sessionStorage.setItem(DRAFT, JSON.stringify(Object.assign({ logo: logoData }, base))); }
      catch (e) { window.sessionStorage.setItem(DRAFT, JSON.stringify(base)); }
    } catch (e) {}
  }
  function restoreDraft() {
    var raw = null;
    try { raw = window.sessionStorage.getItem(DRAFT); window.sessionStorage.removeItem(DRAFT); } catch (e) {}
    if (!raw) return false;
    try {
      var d = JSON.parse(raw);
      if (!d || d.v !== 1 || d.path !== location.pathname || Date.now() - d.t > DRAFT_TTL) return false;
      Object.keys(d.f || {}).forEach(function (id) { var el = $(id); if (el && el.type !== 'file' && typeof d.f[id] === 'string') el.value = d.f[id]; });
      if (Array.isArray(d.items) && d.items.length) {
        $('qtItems').innerHTML = '';
        d.items.forEach(function (i) { addItem(String(i[0]), i[1], i[2], true); });
      }
      if (/^#[0-9a-f]{6}$/i.test(d.color || '')) {
        color = d.color;
        document.querySelectorAll('.qt-cdot').forEach(function (x) { var on = x.dataset.c === color; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      }
      if (typeof d.logo === 'string' && /^data:image\/(png|jpe?g);base64,/.test(d.logo)) logoData = d.logo;
      return true;
    } catch (e) { return false; }
  }

  // The line under the logo field once a free visitor has chosen a logo (the preview carries the Pro tag itself)
  function logoNote() {
    var box = $('qmLogoNote');
    if (!box) return;
    if (IS_PRO || !logoData) { box.hidden = true; box.innerHTML = ''; return; }
    box.innerHTML = '<span class="qt-chip">PRO</span>Your logo goes on the PDF with Pro. ' + proLink('', 'logo', 'Get Pro, $9 once');
    box.hidden = false;
  }

  async function download(docType, opts) {
    opts = opts || {};
    var btn = docType === 'invoice' ? $('qtInvBtn') : $('qtPdfBtn');
    var msg = $('qtMsg');
    msg.hidden = true;
    hideOffers();
    if (docType === 'invoice' && !IS_PRO) {
      msg.innerHTML = 'Turning a quote into a matching invoice is a Pro feature ($9 one-time). ' + proLink('', 'invoice', 'Get Pro') + ' or <a href="/activate">activate your licence key</a>.';
      msg.className = 'qt-msg qt-msg-info'; msg.hidden = false;
      track('paywall_shown', 'invoice');
      return;
    }
    var d = collect();
    var payload = {
      docType: docType, fromName: d.fromName, fromEmail: d.fromEmail, fromAddress: d.fromAddress,
      toName: d.toName, toEmail: d.toEmail, toAddress: d.toAddress, quoteNumber: d.quoteNumber,
      quoteDate: d.quoteDate, validUntil: d.validUntil, notes: d.notes, items: d.items,
      taxRate: d.t.tr, taxLabel: d.t.tl, discount: d.t.disc, discountType: d.t.discType,
      color: d.color, currency: d.currency, symbol: d.symbol, logo: d.logo
    };
    if (docType === 'invoice') {
      payload.invoiceNumber = $('qtInvNumber').value;
      payload.invoiceDate = $('qtInvDate').value;
      payload.dueDate = $('qtInvDue').value;
    }
    setBusy(btn, true, 'Generating PDF...');
    try {
      var res = await fetch('/generate-pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) {
        var j = {}; try { j = await res.json(); } catch (e) {}
        throw new Error(j.error || 'The PDF could not be created. Please try again.');
      }
      var blob = await res.blob();
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      var base = (docType === 'invoice' ? (payload.invoiceNumber || 'invoice') : (d.quoteNumber || 'quote')).replace(/[^a-z0-9-_]+/gi, '_');
      a.href = url; a.download = (docType === 'invoice' ? 'invoice-' : 'quote-') + base + '.pdf';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      msg.innerHTML = docType === 'invoice'
        ? 'Invoice downloaded.'
        : 'Quote downloaded. Need the covering email? <a href="/how-to-send-a-quote-to-a-client#templates">Copy a ready-to-send quote email</a>.';
      msg.className = 'qt-msg qt-msg-ok'; msg.hidden = false;
      track('pdf_download', IS_PRO ? 'pro' : 'free');
      if (docType === 'quote' && !IS_PRO) { if (opts.panel) showAfter(); else showBar(); }
    } catch (e) {
      msg.textContent = e.message; msg.className = 'qt-msg qt-msg-err'; msg.hidden = false;
    } finally {
      setBusy(btn, false);
    }
  }

  function loadLogo(inp) {
    var f = inp.files && inp.files[0];
    if (!f) { logoData = ''; up(); logoNote(); return; }
    if (!/^image\/(png|jpeg)$/.test(f.type)) { alert('Please choose a PNG or JPG image.'); inp.value = ''; return; }
    if (f.size > 500000) { alert('Please choose an image under 500 KB.'); inp.value = ''; return; }
    var r = new FileReader();
    r.onload = function (e) { logoData = e.target.result; up(); logoNote(); track('logo_upload', IS_PRO ? 'pro' : 'free'); };
    r.readAsDataURL(f);
  }

  function init() {
    if (!$('qtTool')) return;
    $('qtDate').value = dateAdd(0);
    $('qtValid').value = dateAdd(30);
    if ($('qtInvDate')) { $('qtInvDate').value = dateAdd(0); $('qtInvDue').value = dateAdd(14); }
    if (CFG.currency) setCurrency(CFG.currency);
    if (CFG.taxRate != null) $('qtTaxRate').value = CFG.taxRate;
    if (CFG.taxLabel) $('qtTaxLabel').value = CFG.taxLabel;
    addItem('', 1, 0, true);
    restoreSender();
    var hint = $('qtLogo') && $('qtLogo').parentNode.querySelector('.qt-hint');
    if (hint) {
      var note = document.createElement('div');
      note.id = 'qmLogoNote'; note.className = 'qm-logo-note'; note.setAttribute('role', 'status'); note.hidden = true;
      hint.insertAdjacentElement('afterend', note);
    }

    var tool = $('qtTool');
    tool.addEventListener('input', function (e) {
      if (e.target.id === 'qtNumber' && $('qtInvNumber') && !$('qtInvNumber').dataset.touched) {
        $('qtInvNumber').value = e.target.value.replace(/^Q(UOTE)?[-\s]?/i, 'INV-') || 'INV-001';
      }
      if (e.target.id === 'qtInvNumber') e.target.dataset.touched = '1';
      up();
    });
    tool.addEventListener('change', function (e) { if (e.target.id === 'qtLogo') loadLogo(e.target); else up(); });
    tool.addEventListener('click', function (e) {
      var t = e.target.closest('button, .qt-cdot');
      if (!t) return;
      if (t.classList.contains('qt-del')) {
        var row = t.closest('.qt-ir');
        if (document.querySelectorAll('#qtItems .qt-ir').length > 1) row.remove();
        else { row.querySelector('.qt-desc').value = ''; row.querySelector('.qt-rate').value = 0; }
        up();
      } else if (t.id === 'qtAdd') { addItem('', 1, 0); var last = document.querySelector('#qtItems .qt-ir:last-child .qt-desc'); if (last) last.focus(); }
      else if (t.classList.contains('qt-cdot')) {
        document.querySelectorAll('.qt-cdot').forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
        t.classList.add('on'); t.setAttribute('aria-pressed', 'true'); color = t.dataset.c; up();
      }
      else if (t.id === 'qtPdfBtn') onPdfClick();
      else if (t.id === 'qtInvBtn') download('invoice');
    });
    // A Get Pro link pressed anywhere on the page: count it when it is one of the offers above, and keep the quote for the reload
    // that follows a payment (the page turns Pro on by reloading).
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var surface = a.getAttribute('data-qm-pro');
      if (surface) track('paywall_pro_click', surface);
      if (surface || a.hasAttribute('data-buy-pro') || GUM.test(a.href)) saveDraft();
    }, true);
    document.addEventListener('click', function (e) {
      var x = e.target && e.target.closest ? e.target.closest('[data-qm^="dismiss"]') : null;
      if (!x) return;
      if (x.getAttribute('data-qm') === 'dismiss-bar') { sset(BAR_OFF, '1'); var b0 = $('qmBar'); if (b0) b0.hidden = true; }
      else { var a0 = $('qmAfter'); if (a0) a0.hidden = true; }
    });
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-preset]');
      if (b && PRESETS[b.getAttribute('data-preset')]) { e.preventDefault(); loadPreset(b.getAttribute('data-preset')); }
    });
    $('qtInvNumber') && ($('qtInvNumber').value = ($('qtNumber').value || 'Q-001').replace(/^Q(UOTE)?[-\s]?/i, 'INV-'));

    var params = new URLSearchParams(location.search);
    var pk = params.get('preset') || CFG.defaultPreset;
    if (restoreDraft()) {
      up(); logoNote();
      var m = $('qtMsg');
      m.textContent = IS_PRO ? 'Pro is on. Your quote is back as you left it: download it now' + (logoData ? ' with your logo' : '') + ' and without the footer line.' : 'Your quote is back as you left it.';
      m.className = 'qt-msg qt-msg-ok'; m.hidden = false;
    }
    else if (pk && PRESETS[pk]) loadPreset(pk, { noScroll: !params.get('preset') });
    else up();
  }

  window.QT = { loadPreset: loadPreset };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

// Copy buttons for template blocks on guide pages.
document.addEventListener('click', function (e) {
  var b = e.target.closest('.copy-btn');
  if (!b) return;
  var box = document.getElementById(b.getAttribute('data-copy'));
  if (!box) return;
  var text = box.innerText.replace(/\n{3,}/g, '\n\n').trim();
  var done = function () { var o = b.textContent; b.textContent = 'Copied'; b.classList.add('copied'); setTimeout(function () { b.textContent = o; b.classList.remove('copied'); }, 1600); };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, function () { fallback(); });
  else fallback();
  function fallback() {
    var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (err) {} ta.remove();
  }
});
