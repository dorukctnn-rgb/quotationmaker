// Which pages are left exactly as they are (Doruk's rule of 15 Oct 2026: the pages that carry the search traffic).
// A page is frozen when it is on the counter's skip list (content/counter-skip.json), on the traffic list as of 16 Nov 2026
// (content/frozen-pages.json) or has a box of its own (content/lead-cta.js, a decision about that one page).
// Whatever is shared between pages and was not asked for on a frozen page (the extra footer links, the longer trade list on a
// country page) is left out of it: server.js sets res.locals.moreLinks from isFrozen(), and the templates read that.
const SKIP = require('../content/counter-skip.json');
const FROZEN = require('../content/frozen-pages.json');
const { LEAD_CTA } = require('../content/lead-cta');

const key = p => {
  const s = String(p || '/').split(/[?#]/)[0].toLowerCase().replace(/\/+$/, '');
  return s || '/';
};
const frozen = new Set([...SKIP.paths, ...(SKIP.measured || []), ...FROZEN.paths, ...Object.keys(LEAD_CTA)].map(key));

const isFrozen = p => frozen.has(key(p));

module.exports = { isFrozen, FROZEN_PATHS: [...frozen].sort() };
