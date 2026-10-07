// Builds the quote (or, for Pro, invoice) PDF with PDFKit.
const PDFDocument = require('pdfkit');
const path = require('path');
const { BY_CODE, formatMoney } = require('./currencies');

const FONT_REGULAR = path.join(__dirname, '..', 'fonts', 'NotoSans-Regular.ttf');
const FONT_BOLD = path.join(__dirname, '..', 'fonts', 'NotoSans-Bold.ttf');
// Characters the built-in Helvetica (WinAnsi) can print. Anything else switches the
// whole document to Noto Sans so names, addresses and symbols such as the rupee sign render.
const WIN_ANSI = /^[\u0000-ÿ€‘’‚“”„–—•…™ŒœŠšŸŽžƒˆ˜†‡‰‹›]*$/;

const str = (v, max) => String(v == null ? '' : v).replace(/\r\n?/g, '\n').slice(0, max || 300);
const num = v => { const n = parseFloat(v); return isFinite(n) ? n : 0; };
const dateText = v => /^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? new Date(v + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : str(v, 40);

function normalise(body) {
  let d = body || {};
  if (typeof d.quoteData === 'string') { try { d = JSON.parse(d.quoteData); } catch (e) { d = {}; } }
  const items = (Array.isArray(d.items) ? d.items : []).slice(0, 200).map(i => ({
    desc: str(i && i.desc, 1000), qty: num(i && i.qty), rate: num(i && i.rate)
  }));
  const currency = BY_CODE[d.currency] ? d.currency : 'USD';
  return {
    docType: d.docType === 'invoice' ? 'invoice' : 'quote',
    fromName: str(d.fromName, 150), fromEmail: str(d.fromEmail, 150), fromAddress: str(d.fromAddress, 400),
    toName: str(d.toName, 150), toEmail: str(d.toEmail, 150), toAddress: str(d.toAddress, 400),
    quoteNumber: str(d.quoteNumber, 40) || 'Q-001', quoteDate: str(d.quoteDate, 20), validUntil: str(d.validUntil, 20),
    invoiceNumber: str(d.invoiceNumber, 40) || 'INV-001', invoiceDate: str(d.invoiceDate, 20), dueDate: str(d.dueDate, 20),
    notes: str(d.notes, 5000), items, currency,
    taxRate: Math.max(0, Math.min(100, num(d.taxRate))), taxLabel: str(d.taxLabel, 30) || 'Tax',
    discount: Math.max(0, num(d.discount)), discountType: d.discountType === 'percent' ? 'percent' : 'fixed',
    color: /^#[0-9a-f]{6}$/i.test(d.color || '') ? d.color : '#0f4c81',
    logo: typeof d.logo === 'string' ? d.logo : ''
  };
}

function build(d, { isPro }, out) {
  const money = n => formatMoney(n, d.currency);
  const subtotal = d.items.reduce((s, i) => s + i.qty * i.rate, 0);
  const discAmt = d.discountType === 'percent' ? subtotal * (d.discount / 100) : d.discount;
  const afterDisc = subtotal - discAmt;
  const taxAmt = afterDisc * (d.taxRate / 100);
  const total = afterDisc + taxAmt;
  const isInvoice = d.docType === 'invoice';

  const allText = [d.fromName, d.fromEmail, d.fromAddress, d.toName, d.toEmail, d.toAddress, d.notes, d.taxLabel,
    d.quoteNumber, d.invoiceNumber, BY_CODE[d.currency].symbol].concat(d.items.map(i => i.desc)).join(' ');
  const unicode = !WIN_ANSI.test(allText);

  const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true, info: {
    Title: (isInvoice ? 'Invoice ' + d.invoiceNumber : 'Quotation ' + d.quoteNumber), Creator: 'GetQuotationMaker.com' } });
  if (unicode) { doc.registerFont('R', FONT_REGULAR); doc.registerFont('B', FONT_BOLD); }
  const R = unicode ? 'R' : 'Helvetica';
  const B = unicode ? 'B' : 'Helvetica-Bold';
  doc.pipe(out);

  const L = 50, W = 495, RIGHT = L + W;
  const bottom = () => doc.page.height - 70;
  const color = d.color;

  doc.rect(L, 45, W, 3).fill(color);
  let top = 60;
  const logo = isPro && d.logo.match(/^data:image\/(png|jpe?g);base64,([A-Za-z0-9+/=]+)$/);
  if (logo) {
    try { doc.image(Buffer.from(logo[2], 'base64'), L, top, { fit: [150, 44] }); top += 52; } catch (e) { /* ignore broken image */ }
  }
  doc.font(B).fontSize(24).fillColor(color).text(isInvoice ? 'INVOICE' : 'QUOTATION', L, top, { width: 260, lineBreak: false });
  doc.font(R).fontSize(10).fillColor('#6b7280').text('#' + (isInvoice ? d.invoiceNumber : d.quoteNumber), L, top + 30, { width: 260 });
  if (isInvoice) doc.text('Ref. quotation #' + d.quoteNumber, L, top + 44, { width: 260 });

  // Sender block, right aligned
  let ry = 60;
  doc.font(B).fontSize(12).fillColor('#111827').text(d.fromName, 300, ry, { width: 245, align: 'right' });
  ry = doc.y + 2;
  doc.font(R).fontSize(9).fillColor('#4b5563');
  if (d.fromEmail) { doc.text(d.fromEmail, 300, ry, { width: 245, align: 'right' }); ry = doc.y; }
  if (d.fromAddress) { doc.text(d.fromAddress, 300, ry, { width: 245, align: 'right' }); ry = doc.y; }

  let y = Math.max(top + (isInvoice ? 64 : 52), ry + 14);
  doc.rect(L, y, W, 1).fill('#e5e7eb');
  y += 14;

  // Client and dates
  const yStart = y;
  doc.font(B).fontSize(8).fillColor('#8b95a5').text(isInvoice ? 'BILL TO' : 'PREPARED FOR', L, y, { characterSpacing: 0.5 });
  doc.font(B).fontSize(11).fillColor('#111827').text(d.toName, L, y + 13, { width: 270 });
  doc.font(R).fontSize(9).fillColor('#4b5563');
  let ly = doc.y;
  if (d.toEmail) { doc.text(d.toEmail, L, ly, { width: 270 }); ly = doc.y; }
  if (d.toAddress) { doc.text(d.toAddress, L, ly, { width: 270 }); ly = doc.y; }

  const dateRows = isInvoice
    ? [['INVOICE DATE', dateText(d.invoiceDate)], ['DUE DATE', dateText(d.dueDate)]]
    : [['QUOTE DATE', dateText(d.quoteDate)]].concat(d.validUntil ? [['VALID UNTIL', dateText(d.validUntil)]] : []);
  let dy = yStart;
  dateRows.forEach(([label, value], idx) => {
    doc.font(B).fontSize(8).fillColor('#8b95a5').text(label, 360, dy, { width: 185, align: 'right', characterSpacing: 0.5 });
    const accent = idx === 1 && !isInvoice;
    doc.font(accent ? B : R).fontSize(11).fillColor(accent ? '#b42318' : '#111827').text(value || '-', 360, dy + 12, { width: 185, align: 'right' });
    dy += 34;
  });
  y = Math.max(ly, dy) + 18;

  // Items table
  const cols = { desc: L + 10, qty: 330, rate: 380, amt: 460 };
  const header = () => {
    doc.rect(L, y, W, 22).fill(color);
    doc.font(B).fontSize(8).fillColor('#ffffff')
      .text('DESCRIPTION', cols.desc, y + 7, { characterSpacing: 0.5 })
      .text('QTY', cols.qty, y + 7, { width: 40, align: 'right' })
      .text('RATE', cols.rate, y + 7, { width: 72, align: 'right' })
      .text('AMOUNT', cols.amt, y + 7, { width: 75, align: 'right' });
    y += 28;
  };
  header();
  d.items.forEach((item, idx) => {
    doc.font(R).fontSize(10);
    const h = Math.max(14, doc.heightOfString(item.desc || ' ', { width: 255 }));
    if (y + h + 8 > bottom()) { doc.addPage(); y = 50; header(); }
    if (idx % 2 === 0) doc.rect(L, y - 4, W, h + 8).fill('#f8fafc');
    doc.fillColor('#111827').font(R).fontSize(10).text(item.desc, cols.desc, y, { width: 255 });
    doc.text(String(Math.round(item.qty * 1000) / 1000), cols.qty, y, { width: 40, align: 'right' });
    doc.text(money(item.rate), cols.rate, y, { width: 72, align: 'right' });
    doc.font(B).text(money(item.qty * item.rate), cols.amt, y, { width: 75, align: 'right' });
    y += h + 8;
  });

  // Totals
  const totalsHeight = 30 + (discAmt > 0 ? 18 : 0) + (d.taxRate > 0 ? 18 : 0) + 40;
  if (y + totalsHeight > bottom()) { doc.addPage(); y = 50; }
  y += 6;
  doc.rect(L, y, W, 1).fill('#e5e7eb');
  y += 12;
  const tline = (label, value, colour) => {
    doc.font(R).fontSize(10).fillColor('#4b5563').text(label, 300, y, { width: 150, align: 'right' });
    doc.fillColor(colour || '#111827').text(value, cols.amt - 20, y, { width: 95, align: 'right' });
    y += 18;
  };
  tline('Subtotal', money(subtotal));
  if (discAmt > 0) tline('Discount' + (d.discountType === 'percent' ? ' (' + d.discount + '%)' : ''), '-' + money(discAmt), '#b42318');
  if (d.taxRate > 0) tline(d.taxLabel + ' (' + d.taxRate + '%)', money(taxAmt));
  doc.rect(330, y, 215, 2).fill(color);
  y += 8;
  doc.font(B).fontSize(13).fillColor('#111827').text(isInvoice ? 'AMOUNT DUE' : 'TOTAL', 300, y, { width: 150, align: 'right' });
  doc.fillColor(color).text(money(total), cols.amt - 40, y, { width: 115, align: 'right' });
  y += 34;

  // Notes and terms
  if (d.notes) {
    doc.font(R).fontSize(9.5);
    const nh = doc.heightOfString(d.notes, { width: 470 }) + 18;
    if (y + Math.min(nh, 120) > bottom()) { doc.addPage(); y = 50; }
    doc.font(B).fontSize(8).fillColor('#8b95a5').text(isInvoice ? 'NOTES & PAYMENT DETAILS' : 'NOTES & TERMS', 62, y, { characterSpacing: 0.5 });
    const ny = y;
    const pageRef = doc.page;
    doc.font(R).fontSize(9.5).fillColor('#374151').text(d.notes, 62, y + 13, { width: 470 });
    if (doc.page === pageRef) doc.rect(L, ny, 3, doc.y - ny).fill(color);
    y = doc.y + 16;
  }

  if (!isInvoice && d.validUntil) {
    if (y + 26 > bottom()) { doc.addPage(); y = 50; }
    doc.rect(L, y, W, 24).fill('#fef3f2');
    doc.font(R).fontSize(9).fillColor('#b42318').text('This quotation is valid until ' + dateText(d.validUntil) + '. Prices may change after this date.', L + 10, y + 8, { width: W - 20 });
    y += 30;
  }

  if (!isPro) {
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.page.margins.bottom = 0; // let the footer sit below the content area without adding a page
      doc.font(R).fontSize(8).fillColor('#9ca3af').text('Made with GetQuotationMaker.com', L, doc.page.height - 40, { width: W, align: 'center', lineBreak: false });
    }
  }
  doc.end();
}

module.exports = { normalise, build };
