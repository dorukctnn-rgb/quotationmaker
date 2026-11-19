/* The sender's page of quotes sent for acceptance (views/quote-status.ejs).
   The status codes sit in this browser's local storage (qm-accept:v1, written by public/tool.js when a link is made) or come after the #
   of a status link. They are sent to this site in the body of a POST, never in an address, so no log holds them. All text from the
   server is put into the page with textContent. Nothing refreshes by itself: the button asks. */
(function () {
  'use strict';
  var KEY = 'qm-accept:v1';
  var CODE = /^[a-z2-7]{26}$/;
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var $ = function (id) { return document.getElementById(id); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var items = [];

  function load() {
    try {
      var a = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(a) ? a.filter(function (i) { return i && typeof i.s === 'string' && CODE.test(i.s); }) : [];
    } catch (e) { return []; }
  }
  // only the codes and the titles are kept here: what the client typed is shown, never saved
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(items.slice(0, 30).map(function (i) { return { s: i.s, l: i.l, q: i.q, to: i.to, tot: i.tot, t: i.t, x: i.x }; })));
    } catch (e) {}
  }
  function utc(ms) {
    var d = new Date(Number(ms));
    if (!isFinite(d.getTime())) return '';
    return d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear() + ', ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ' UTC';
  }
  function money(total, cur) {
    try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).format(total); } catch (e) { return ''; }
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function msg(text) { var m = $('qsMsg'); m.textContent = text || ''; m.hidden = !text; }

  var LABEL = { sent: 'Sent', viewed: 'Opened', accepted: 'Accepted', gone: 'Expired' };
  function line(item) {
    var s = item.live;
    if (!s) return 'Not checked yet. Press Check status now.';
    if (s.state === 'gone') return 'This link has expired or was removed. Quotes are deleted 90 days after the link is made.';
    if (s.state === 'accepted') return 'Accepted by ' + s.accepted.name + ' on ' + utc(s.accepted.at) + '.';
    if (s.state === 'viewed') return 'Your client opened the quote on ' + utc(s.firstView) + ' and has not accepted it yet.';
    return 'Sent. Your client has not opened it yet.';
  }

  function render() {
    var box = $('qsList');
    box.textContent = '';
    $('qsEmpty').hidden = items.length > 0;
    $('qsCheck').hidden = items.length === 0;
    items.forEach(function (item) {
      var s = item.live, state = s ? s.state : 'sent';
      var card = el('article', 'qs-item is-' + (s ? state : 'unknown'));
      var head = el('div', 'qs-h');
      var t = el('div');
      t.appendChild(el('h2', '', 'Quote ' + (item.q || 'sent')));
      var sub = [item.to ? 'for ' + item.to : '', item.tot || ''].filter(Boolean).join(', ');
      if (sub) t.appendChild(el('p', 'qs-sub', sub));
      head.appendChild(t);
      if (s) head.appendChild(el('span', 'qs-badge', LABEL[state]));
      card.appendChild(head);
      card.appendChild(el('p', 'qs-st', line(item)));
      if (s && s.state === 'accepted' && s.accepted.note) card.appendChild(el('p', 'qs-note', s.accepted.note));
      if (s && s.late) card.appendChild(el('p', 'qs-late', 'Accepted after the valid-until date on the quote.'));
      var dl = el('dl', 'qs-dl');
      var row = function (k, v) { if (v) { dl.appendChild(el('dt', '', k)); dl.appendChild(el('dd', '', v)); } };
      row('Sent', s && s.created ? utc(s.created) : (item.t ? utc(item.t) : ''));
      row('Link expires', s && s.expires ? utc(s.expires) : (item.x ? utc(item.x) : ''));
      if (dl.childNodes.length) card.appendChild(dl);
      var act = el('div', 'qs-act');
      if (item.l) {
        var copy = el('button', '', 'Copy client link'); copy.type = 'button'; copy.setAttribute('data-act', 'copy'); copy.setAttribute('data-s', item.s);
        act.appendChild(copy);
        var open = el('a', '', 'Open client page'); open.href = item.l; open.target = '_blank'; open.rel = 'noopener noreferrer';
        act.appendChild(open);
      }
      var rm = el('button', '', 'Remove from this list'); rm.type = 'button'; rm.setAttribute('data-act', 'remove'); rm.setAttribute('data-s', item.s);
      act.appendChild(rm);
      card.appendChild(act);
      box.appendChild(card);
    });
  }

  // 20 codes at a time; what the server says about each is kept next to the item (and its title is remembered for the quote tool)
  function check() {
    if (!items.length) return Promise.resolve();
    var btn = $('qsCheck');
    btn.disabled = true; msg('');
    var chunks = [];
    for (var i = 0; i < items.length; i += 20) chunks.push(items.slice(i, i + 20));
    return Promise.all(chunks.map(function (part) {
      return fetch('/accept/status', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codes: part.map(function (p) { return p.s; }) }) })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error((j && j.error) || 'status'); return j; }); })
        .then(function (j) {
          (j.items || []).forEach(function (live) {
            var item = items.filter(function (x) { return x.s === live.st; })[0];
            if (!item) return;
            item.live = live;
            if (live.quote) {
              item.q = item.q || live.quote.number;
              item.to = item.to || live.quote.toName;
              item.tot = item.tot || money(live.quote.total, live.quote.currency);
            }
            if (live.created && !item.t) item.t = live.created;
            if (live.expires && !item.x) item.x = live.expires;
          });
        });
    })).then(function () {
      var d = new Date();
      $('qsWhen').textContent = 'Checked at ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ' your time.';
      save();
    }, function (e) {
      msg(/not switched on|not available/i.test(String(e && e.message)) ? String(e.message) : 'The status could not be checked just now. Please try again in a minute.');
    }).then(function () { btn.disabled = false; render(); });
  }

  // a status link opened on this device (in a new tab, or by changing the # of this page) joins the list; true when it was new
  function adopt() {
    var m = /^#([a-z2-7]{26})$/i.exec(location.hash || '');
    if (!m) return false;
    var code = m[1].toLowerCase();
    if (items.some(function (i) { return i.s === code; })) return false;
    items.unshift({ s: code });
    save();
    return true;
  }

  function init() {
    items = load();
    adopt();
    render();
    window.addEventListener('hashchange', function () { if (adopt()) { render(); check(); } });
    $('qsCheck').addEventListener('click', check);
    $('qsList').addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('button[data-act]') : null;
      if (!b) return;
      var s = b.getAttribute('data-s');
      if (b.getAttribute('data-act') === 'remove') {
        items = items.filter(function (i) { return i.s !== s; });
        save(); render();
      } else if (b.getAttribute('data-act') === 'copy') {
        var item = items.filter(function (i) { return i.s === s; })[0];
        if (!item || !item.l) return;
        var done = function () { var o = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = o; }, 1600); };
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(item.l).then(done, function () {});
        else { var ta = document.createElement('textarea'); ta.value = item.l; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (x) {} ta.remove(); }
      }
    });
    if (items.length) check();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
