// What the client's page shows for a stored quote: the figures worked out the way lib/pdf.js works them out, money and dates as
// text. Everything returned is plain text or a number; the template escapes it (EJS <%= %>), nothing here makes markup.
const { formatMoney } = require('./currencies');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = n => String(n).padStart(2, '0');

// "19 Nov 2026, 14:32 UTC"
function when(ms) {
  const d = new Date(Number(ms));
  if (!Number.isFinite(d.getTime())) return '';
  return d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear() + ', ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ' UTC';
}
// "19 Dec 2026" from a stored YYYY-MM-DD (anything else is shown as typed)
function day(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v || ''));
  if (!m) return String(v || '');
  return Number(m[3]) + ' ' + MONTHS[Number(m[2]) - 1] + ' ' + m[1];
}

function present(s) {
  const money = n => formatMoney(n, s.currency);
  const sub = s.items.reduce((a, i) => a + i.qty * i.rate, 0);
  const disc = s.discountType === 'percent' ? sub * (s.discount / 100) : s.discount;
  const after = sub - disc;
  const tax = after * (s.taxRate / 100);
  const total = after + tax;
  const hasLogo = /^data:image\/(png|jpe?g);base64,[A-Za-z0-9+\/=]+$/.test(s.logo || '');
  return {
    number: s.quoteNumber,
    fromName: s.fromName, fromEmail: s.fromEmail, fromAddress: s.fromAddress,
    toName: s.toName, toEmail: s.toEmail, toAddress: s.toAddress,
    quoteDate: day(s.quoteDate), validUntil: day(s.validUntil), validIso: /^\d{4}-\d{2}-\d{2}$/.test(s.validUntil) ? s.validUntil : '',
    color: /^#[0-9a-f]{6}$/i.test(s.color) ? s.color : '#0f4c81',
    logo: hasLogo ? s.logo : '',
    notes: s.notes,
    rows: s.items.map(i => ({ desc: i.desc, qty: String(Math.round(i.qty * 1000) / 1000), rate: money(i.rate), amount: money(i.qty * i.rate) })),
    sub: money(sub),
    disc: disc > 0 ? { label: 'Discount' + (s.discountType === 'percent' ? ' (' + s.discount + '%)' : ''), amount: '-' + money(disc) } : null,
    tax: s.taxRate > 0 ? { label: s.taxLabel + ' (' + s.taxRate + '%)', amount: money(tax) } : null,
    total: money(total),
  };
}

module.exports = { present, when, day };
