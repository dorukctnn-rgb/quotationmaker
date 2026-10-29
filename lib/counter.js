// Which pages load the page and Get Pro click counter (public/count.js; the Worker is counter-worker/).
// Every page except the ones in content/counter-skip.json (the pages that carry the site's search traffic, left exactly as they
// were) and the 404 page. A skipped page's HTML has no trace of the counter: partials/head.ejs prints nothing for it.
const SKIP = require('../content/counter-skip.json');

// the same address however it is typed: any case, with or without a closing slash, query and # left out
const key = p => {
  const s = String(p || '/').split(/[?#]/)[0].toLowerCase().replace(/\/+$/, '');
  return s || '/';
};
const skipped = new Set(SKIP.paths.map(key));

// the version of the counter script in its address, so that a change reaches visitors (it is not the site's ASSET_VERSION, which
// is printed on the skipped pages too and so must not change)
const COUNT_VERSION = '20261029';

const isCounted = p => !skipped.has(key(p));

module.exports = { isCounted, key, COUNT_VERSION, SKIP_PATHS: [...skipped] };
