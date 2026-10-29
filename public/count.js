/* The page and Get Pro click counter of GetQuotationMaker (the Worker "qm-counter", counter-worker/).
 *
 * Two things are counted, as daily totals, and nothing else: a page opening ("view") and a Get Pro link being followed ("click").
 * Each note is five short fields: the event, the site, the page's address path (never a ? or #), the part of the page the link
 * is in (a tag name and id such as "nav" or "section#pricing"; empty for a view) and one word for the kind of site that sent the
 * visitor: google, bing, other-search, ai-assistant, pinterest, social, referral or direct; empty when it is not known. It is a
 * plain POST with no cookie and no identifier, and the Worker adds one to a daily total without keeping an IP address or a user
 * agent. Nothing is sent from a browser under automation (navigator.webdriver), from any host but getquotationmaker.com, from a
 * page the browser only prerenders (until the visitor opens it) or from a tab that is not shown (until it is). A failed send is
 * ignored: the page and the Get Pro link work the same without it.
 *
 * The kind of site is worked out on the page the visitor lands on:
 *  1. A tag on the address (utm_source, then ref, then source; ChatGPT, for example, adds utm_source=chatgpt.com) wins over the
 *     referrer. A tag naming a site this file does not know counts as referral.
 *  2. Otherwise the host of document.referrer is sorted. This site and Gumroad are ignored; android-app://<package> referrers
 *     are sorted by app; no referrer at all counts as direct.
 *  3. Only the word is kept, never an address, in this tab's session storage (qm-visit: the word of the visit), so that a click
 *     three pages later still says where the visit began. A landing from another site starts a new visit and replaces the word;
 *     closing the tab deletes it. A page opened from another page of this site, with no word kept in the tab (the first page
 *     was one that does not count), is sent with no word.
 *
 * Which pages load this file is decided by the server (lib/counter.js): the pages listed in content/counter-skip.json do not.
 * This file is the classifier of peak-tools' pro-source.js (tested there) with the click counting of its Pro click counter.
 * Tests: test/counter.test.js
 */
(function () {
  'use strict';
  var COUNT_URL = 'https://qm-counter.railer-iot.workers.dev/e';
  var COUNT_HOST = /^(www\.)?getquotationmaker\.com$/;
  var SITE = 'quotationmaker';
  var VISIT = 'qm-visit';
  var PRO = /^https:\/\/dorukctn\.gumroad\.com\/l\/[A-Za-z0-9_-]+(?:[\/?#]|$)/;
  var WORDS = ['google', 'bing', 'other-search', 'ai-assistant', 'pinterest', 'social', 'referral', 'direct'];
  // Tested in this order against a host, so Gemini on google.com counts as an AI assistant.
  var SITES = [
    ['ai-assistant', /(^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|copilot\.microsoft\.com|gemini\.google\.com|claude\.ai|you\.com|phind\.com|chat\.deepseek\.com|grok\.com|meta\.ai|duck\.ai|chat\.mistral\.ai|poe\.com)$/],
    ['google', /^((www|m|images)\.)?google\.(com?\.)?[a-z]{2,3}$/],
    ['bing', /(^|\.)bing\.com$/],
    ['other-search', /(^|\.)(duckduckgo\.com|search\.yahoo\.(com|co\.jp)|yandex\.(com?\.)?[a-z]{2,3}|ya\.ru|ecosia\.org|search\.brave\.com|search\.naver\.com|search\.seznam\.cz|qwant\.com|startpage\.com)$/],
    ['other-search', /^((www|m)\.)?baidu\.com$/],
    ['pinterest', /(^|\.)(pinterest\.(com?\.)?[a-z]{2,3}|pin\.it)$/],
    ['social', /(^|\.)(reddit\.com|redd\.it|facebook\.com|fb\.com|instagram\.com|x\.com|t\.co|twitter\.com|youtube\.com|youtu\.be|tiktok\.com|threads\.net|threads\.com|linkedin\.com|lnkd\.in|quora\.com)$/]
  ];
  // Android apps send android-app://<package>/ as the referrer. Any other app counts as a referral.
  var APPS = {
    'com.google.android.googlequicksearchbox': 'google',
    'com.microsoft.bing': 'bing',
    'com.duckduckgo.mobile.android': 'other-search',
    'com.openai.chatgpt': 'ai-assistant',
    'ai.perplexity.app.android': 'ai-assistant',
    'com.anthropic.claude': 'ai-assistant',
    'com.google.android.apps.bard': 'ai-assistant',
    'com.microsoft.copilot': 'ai-assistant',
    'com.pinterest': 'pinterest',
    'com.reddit.frontpage': 'social',
    'com.facebook.katana': 'social',
    'com.facebook.lite': 'social',
    'com.instagram.android': 'social',
    'com.instagram.barcelona': 'social',
    'com.twitter.android': 'social',
    'com.zhiliaoapp.musically': 'social',
    'com.ss.android.ugc.trill': 'social',
    'com.google.android.youtube': 'social',
    'com.linkedin.android': 'social',
    'com.quora.android': 'social'
  };
  // Tag values that name a site rather than give its address: utm_source=chatgpt, ref=reddit, source=fb_ads.
  var NAMES = [
    ['ai-assistant', /^(chatgpt|openai|perplexity|copilot|gemini|bard|claude|deepseek|grok|metaai|mistral|lechat|poe|phind)$/],
    ['google', /^google$/],
    ['bing', /^bing$/],
    ['other-search', /^(duckduckgo|ddg|yahoo|yandex|ecosia|brave|baidu|naver|qwant|startpage|seznam)$/],
    ['pinterest', /^pinterest$/],
    ['social', /^(reddit|facebook|fb|instagram|ig|x|twitter|youtube|yt|tiktok|threads|linkedin|quora)$/]
  ];
  function own(map, k) { return Object.prototype.hasOwnProperty.call(map, k) ? map[k] : ''; }
  function isWord(v) { return WORDS.indexOf(v) > -1; }
  // this site (whatever host it is served from) and Gumroad
  function ours(host, ownHost) {
    return host === String(ownHost || '').toLowerCase() || /^(www\.)?getquotationmaker\.com$/.test(host) || /(^|\.)(gumroad\.com|gum\.co)$/.test(host);
  }
  function siteOf(host) {
    for (var i = 0; i < SITES.length; i++) if (SITES[i][1].test(host)) return SITES[i][0];
    return '';
  }

  // The kind of site a referrer belongs to. '' means "no word": this site, Gumroad, or nothing readable.
  function classify(referrer, ownHost) {
    if (!referrer) return 'direct';
    var m = /^([a-z][a-z0-9+.\-]*):\/\/(?:[^@\/?#]*@)?(\[[^\]]*\]|[^\/?#:]*)/i.exec(String(referrer));
    if (!m) return '';
    var scheme = m[1].toLowerCase(), host = m[2].toLowerCase().replace(/\.$/, '');
    if (scheme === 'android-app') return host ? (own(APPS, host) || 'referral') : '';
    if ((scheme !== 'http' && scheme !== 'https') || !host) return '';
    if (ours(host, ownHost)) return '';
    return siteOf(host) || 'referral';
  }

  // The kind of site one tag value names. '' when it names this site or Gumroad (then the referrer decides).
  function tagKind(value, ownHost) {
    var v = String(value).trim().toLowerCase();
    if (isWord(v)) return v;
    var m = /^(?:[a-z][a-z0-9+.\-]*:\/\/)?(?:[^@\/?#]*@)?([a-z0-9-]+(?:\.[a-z0-9-]+)+)\.?(?:[:\/?#]|$)/.exec(v);
    if (m) return ours(m[1], ownHost) ? '' : (siteOf(m[1]) || 'referral');
    var whole = v.replace(/[^a-z0-9]+/g, ''), head = v.split(/[^a-z0-9]+/)[0];
    if (/^(gumroad|quotationmaker|getquotationmaker)$/.test(whole)) return '';
    for (var i = 0; i < NAMES.length; i++) if (NAMES[i][1].test(whole) || NAMES[i][1].test(head)) return NAMES[i][0];
    return 'referral';
  }
  // The landing address's tag: utm_source, then ref, then source. '' when there is none to go by.
  function fromTags(search, ownHost) {
    var q = new URLSearchParams(search || '');
    var v = (q.get('utm_source') || '').trim() || (q.get('ref') || '').trim() || (q.get('source') || '').trim();
    return v ? tagKind(v, ownHost) : '';
  }

  function readVisit() {
    try { var v = window.sessionStorage.getItem(VISIT); return isWord(v) ? v : ''; } catch (e) { return ''; }
  }
  var here = '';
  try { here = fromTags(location.search, location.hostname) || classify(document.referrer, location.hostname); } catch (e) {}
  // A landing from another site (a referrer or a tag that names one) starts a new visit, with its own word. A landing with no
  // referrer, or from a page of this site, goes on with the word the tab already has.
  var fresh = here && here !== 'direct';
  var visit = fresh ? here : (readVisit() || here);
  function remember() {
    try { if (here && (fresh || !readVisit())) window.sessionStorage.setItem(VISIT, here); } catch (e) {}
  }

  function pagePath() {
    var p = '';
    try { p = String(location.pathname || '').toLowerCase(); } catch (e) {}
    return /^\/[a-z0-9\/._-]{0,119}$/.test(p) ? p : '';
  }
  // the part of the page a link sits in: the nearest data-pro-place, or the nearest landmark (tag and id)
  function place(el) {
    try {
      var named = el.closest('[data-pro-place]');
      var v = named ? String(named.getAttribute('data-pro-place') || '').toLowerCase() : '';
      if (/^[a-z0-9][a-z0-9#._-]{0,39}$/.test(v)) return v;
      var box = el.closest('header,nav,footer,aside,section,form,main');
      if (!box) return 'page';
      var id = String(box.id || '').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 24);
      return String(box.tagName).toLowerCase() + (id ? '#' + id : '');
    } catch (e) { return 'page'; }
  }
  function count(event, where) {
    try {
      if (!COUNT_HOST.test(location.hostname) || (typeof navigator !== 'undefined' && navigator.webdriver)) return;
      var body = JSON.stringify({ e: event, t: SITE, p: pagePath(), w: where || '', s: visit });
      if (typeof fetch === 'function') {
        var sent = fetch(COUNT_URL, { method: 'POST', body: body, headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, keepalive: true, credentials: 'omit', mode: 'cors' });
        if (sent && sent.catch) sent.catch(function () {});
      } else if (navigator.sendBeacon) {
        navigator.sendBeacon(COUNT_URL, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
      }
    } catch (e) {}
  }

  var lastLink = null, lastAt = 0;
  // a Get Pro link followed: click, tap, keyboard or middle click (one count per link per two seconds)
  function followed(e) {
    try {
      if (e.type === 'auxclick' && e.button !== 1) return;
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a || !PRO.test(a.href)) return;
      var now = Date.now();
      if (a === lastLink && now - lastAt < 2000) return;
      lastLink = a; lastAt = now;
      count('click', place(a));
    } catch (err) {}
  }
  if (document.addEventListener) {
    document.addEventListener('click', followed, true);
    document.addEventListener('auxclick', followed, true);
  }

  // One view per page load, once the page is really being looked at: a page Chrome prerenders in the background, or a tab opened
  // behind the current one, is counted when the visitor gets to it.
  function viewed() {
    var done = false;
    function go() {
      if (done || document.prerendering || document.visibilityState === 'hidden') return;
      done = true;
      remember();
      count('view', '');
    }
    go();
    if (!done && document.addEventListener) {
      document.addEventListener('prerenderingchange', go);
      document.addEventListener('visibilitychange', go);
    }
  }
  try { viewed(); } catch (e) {}

  window.QMCount = { classify: classify, fromTags: fromTags, place: place, COUNT_URL: COUNT_URL };
})();
