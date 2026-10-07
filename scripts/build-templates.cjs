// Builds the free downloadable quote templates in public/templates/ (Word and Excel).
// PDFs are exported from the Word files (see scripts/docx-to-pdf.ps1).
// Usage: npm i --no-save docx@9 exceljs@4  &&  node scripts/build-templates.cjs
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType,
  BorderStyle, ShadingType, Footer, PageNumber, VerticalAlign, TableLayoutType, TableBorders
} = require('docx');
const ExcelJS = require('exceljs');

const OUT = path.join(__dirname, '..', 'public', 'templates');
fs.mkdirSync(OUT, { recursive: true });

const NAVY = '0F4C81', GREY = '6B7280', LINE = 'D1D5DB', PALE = 'F3F6FA';
const PAGE_W = 11906, MARGIN = 850, CONTENT_W = PAGE_W - MARGIN * 2; // A4

// ---------- Word helpers ----------
const run = (text, o = {}) => new TextRun({ text, font: 'Arial', size: o.size || 19, bold: !!o.bold, italics: !!o.italics, color: o.color || '111827' });
// Text with [placeholders] shown in grey.
function runs(text, o = {}) {
  return String(text).split(/(\[[^\]]*\])/).filter(Boolean).map(part =>
    /^\[.*\]$/.test(part) ? run(part, Object.assign({}, o, { color: '8A94A6' })) : run(part, o));
}
const p = (text, o = {}) => new Paragraph({ alignment: o.align, keepNext: !!o.keepNext, spacing: { before: o.before || 0, after: o.after == null ? 80 : o.after }, children: runs(text, o) });
const heading = text => new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 200, after: 80 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 2 } }, children: [run(text.toUpperCase(), { bold: true, size: 18, color: NAVY })] });
const writeLine = () => new Paragraph({ spacing: { before: 60, after: 60 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 6 } }, children: [run(' ')] });
const cellBorders = { top: { style: BorderStyle.SINGLE, size: 4, color: LINE }, bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE }, left: { style: BorderStyle.SINGLE, size: 4, color: LINE }, right: { style: BorderStyle.SINGLE, size: 4, color: LINE } };
function cell(text, width, o = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA }, borders: cellBorders, verticalAlign: VerticalAlign.CENTER,
    shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
    margins: { top: 70, bottom: 70, left: 100, right: 100 },
    children: [new Paragraph({ alignment: o.align, children: runs(text, { bold: o.bold, color: o.color, size: o.size || 18, italics: o.italics }) })]
  });
}
function table(widths, rows, o = {}) {
  return new Table({ borders: o.noBorders ? TableBorders.NONE : undefined, width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED, rows });
}
function scale(fracs) { const w = fracs.map(f => Math.round(CONTENT_W * f)); w[w.length - 1] += CONTENT_W - w.reduce((a, b) => a + b, 0); return w; }

function kvTable(pairs) {
  const w = scale([0.18, 0.32, 0.18, 0.32]);
  const rows = [];
  for (let i = 0; i < pairs.length; i += 2) {
    const a = pairs[i], b = pairs[i + 1] || ['', ''];
    rows.push(new TableRow({ children: [cell(a[0], w[0], { bold: true, fill: PALE }), cell(a[1], w[1]), cell(b[0], w[2], { bold: true, fill: b[0] ? PALE : undefined }), cell(b[1], w[3])] }));
  }
  return table(w, rows);
}

function itemsTable(cols, example, blank, totals) {
  const w = scale(cols.map(c => c.w));
  const right = cols.map(c => c.right ? AlignmentType.RIGHT : AlignmentType.LEFT);
  const rows = [new TableRow({ tableHeader: true, children: cols.map((c, i) => cell(c.h, w[i], { bold: true, fill: NAVY, color: 'FFFFFF', align: right[i], size: 17 })) })];
  if (example) rows.push(new TableRow({ children: example.map((t, i) => cell(t, w[i], { italics: true, color: GREY, align: right[i] })) }));
  for (let r = 0; r < blank; r++) rows.push(new TableRow({ cantSplit: true, height: { value: 340, rule: 'atLeast' }, children: cols.map((c, i) => cell('', w[i])) }));
  const span = w.slice(0, -1).reduce((a, b) => a + b, 0);
  (totals || []).forEach((t, idx) => {
    const last = idx === totals.length - 1;
    rows.push(new TableRow({ children: [
      new TableCell({ columnSpan: cols.length - 1, width: { size: span, type: WidthType.DXA }, borders: cellBorders, margins: { top: 70, bottom: 70, left: 100, right: 100 },
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: runs(t, { bold: last, size: last ? 20 : 18 }) })] }),
      cell('', w[w.length - 1], { fill: last ? PALE : undefined })
    ] }));
  });
  return table(w, rows);
}

function termsTable(rows) {
  const w = scale([0.22, 0.78]);
  return table(w, rows.map(r => new TableRow({ children: [cell(r[0], w[0], { bold: true, fill: PALE }), cell(r[1], w[1])] })));
}

function signBlock(text, who) {
  const w = scale([0.42, 0.38, 0.2]);
  return [
    p(text, { after: 100, keepNext: true }),
    table(w, [new TableRow({ cantSplit: true, height: { value: 640, rule: 'atLeast' }, children: [
      cell((who || 'Client') + ' signature:', w[0]), cell('Name' + (who ? ':' : ' and position:'), w[1]), cell('Date:', w[2])] })])
  ];
}

function buildDocx(cfg) {
  const children = [];
  const w = scale([0.55, 0.45]);
  children.push(table(w, [new TableRow({ children: [
    new TableCell({ width: { size: w[0], type: WidthType.DXA }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
      children: [new Paragraph({ children: [run('QUOTATION', { bold: true, size: 44, color: NAVY })] }), p(cfg.subtitle, { color: GREY, size: 17 })] }),
    new TableCell({ width: { size: w[1], type: WidthType.DXA }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
      children: ['[Your business name]', '[Address line 1]', '[Town, postcode]', '[Phone]  |  [Email]', cfg.taxNumber].map((t, i) => new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 20 }, children: runs(t, { bold: i === 0, size: i === 0 ? 22 : 17 }) }))
    })
  ] })], { noBorders: true }));
  children.push(new Paragraph({ spacing: { before: 120, after: 160 }, border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: NAVY, space: 1 } }, children: [run(' ', { size: 4 })] }));
  cfg.blocks.forEach(b => {
    if (b.heading) children.push(heading(b.heading));
    if (b.hint) children.push(p(b.hint, { color: GREY, size: 17, italics: true }));
    if (b.kv) children.push(kvTable(b.kv));
    if (b.lines) for (let i = 0; i < b.lines; i++) children.push(writeLine());
    if (b.items) children.push(itemsTable(b.items.cols, b.items.example, b.items.blank, b.items.totals));
    if (b.text) b.text.forEach(t => children.push(p(t)));
    if (b.terms) children.push(termsTable(b.terms));
    if (b.sign) signBlock(b.sign, b.who).forEach(x => children.push(x));
    if (b.gap) children.push(p(' ', { after: 40 }));
  });
  const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
    run('Free template from GetQuotationMaker.com  |  Fill it in online with automatic totals: ' + cfg.url + '  |  Page ', { size: 14, color: '9CA3AF' }),
    new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 14, color: '9CA3AF' })
  ] })] });
  return new Document({
    creator: 'GetQuotationMaker.com', title: cfg.docTitle, description: cfg.docTitle,
    styles: { default: { document: { run: { font: 'Arial', size: 19 } } } },
    sections: [{ properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: 680, bottom: 700, left: MARGIN, right: MARGIN, footer: 360 } } }, footers: { default: footer }, children }]
  });
}

// ---------- Template definitions ----------
const ACCEPT = 'To accept this quotation, sign below and return a copy, or reply to the email it came with confirming acceptance. This quotation is valid until the date shown above.';
const QUOTE_DETAILS = [['Quote no.', 'Q-[0001]'], ['Date', '[DD/MM/YYYY]'], ['Client', '[Client name]'], ['Valid until', '[DD/MM/YYYY]'], ['Client address', '[Address]'], ['Site / job address', '[If different]']];

const T = {
  tradesman: {
    file: 'tradesman-quote-template', docTitle: 'Tradesman quote template (UK)', subtitle: 'Tradesman quote template, UK (prices in GBP)',
    taxNumber: 'VAT reg. no.: [if VAT registered]', url: 'getquotationmaker.com/quote-template-contractor', currency: '£', taxName: 'VAT', taxRate: 0.2,
    blocks: [
      { kv: QUOTE_DETAILS },
      { heading: 'Scope of work', hint: 'Describe the job, the rooms or areas, and the finish the client will get.', lines: 2 },
      { heading: 'Price', items: { cols: [{ h: 'Description', w: 0.5 }, { h: 'Qty', w: 0.09, right: 1 }, { h: 'Unit', w: 0.11 }, { h: 'Rate (£)', w: 0.14, right: 1 }, { h: 'Amount (£)', w: 0.16, right: 1 }],
        example: ['Example: Labour, install new kitchen units', '3', 'day', '320.00', '960.00'], blank: 6, totals: ['Subtotal (excluding VAT)', 'VAT at 20% (only if VAT registered)', 'Total including VAT'] } },
      { heading: 'Terms', terms: [
        ['Payment', 'Deposit of [25]% on acceptance to book the start date and order materials. Balance due within [7] days of completion by bank transfer to [account name, sort code, account number].'],
        ['Validity', 'This quote is valid for [30] days from the date above. After that, prices may change to reflect current material costs.'],
        ['Not included', '[Decorating; building control or planning fees; skip permits; making good after other trades.] Hidden defects found once work starts will be priced and agreed with you before any extra work is done.'],
        ['Changes', 'Any work not listed above will be quoted and agreed in writing before it is carried out.'],
        ['VAT', 'Prices are shown excluding VAT. If we are VAT registered, VAT at 20% is added and shown above. If not, no VAT is charged.']] },
      { heading: 'Acceptance', sign: ACCEPT }
    ]
  },
  contractor: {
    file: 'contractor-quote-template', docTitle: 'Contractor quote template', subtitle: 'Contractor quote template (any currency)',
    taxNumber: 'Licence / tax no.: [if applicable]', url: 'getquotationmaker.com/quote-template-contractor', currency: '', taxName: 'Tax', taxRate: 0,
    blocks: [
      { kv: QUOTE_DETAILS },
      { heading: 'Project and scope', hint: 'Project description, site visit date, and what the finished work includes.', lines: 2 },
      { heading: 'Price', items: { cols: [{ h: 'Item / description', w: 0.46 }, { h: 'Qty', w: 0.1, right: 1 }, { h: 'Unit', w: 0.12 }, { h: 'Rate', w: 0.15, right: 1 }, { h: 'Amount', w: 0.17, right: 1 }],
        example: ['Example: Drywall supply, hang and finish', '640', 'sq ft', '2.75', '1,760.00'], blank: 5, totals: ['Subtotal', 'Tax at [__]%', 'Total'] } },
      { heading: 'Payment schedule', items: { cols: [{ h: 'Stage', w: 0.5 }, { h: '% of total', w: 0.16, right: 1 }, { h: 'Amount', w: 0.17, right: 1 }, { h: 'Due', w: 0.17 }],
        example: ['Example: Deposit on signing', '30%', '2,136.00', 'On acceptance'], blank: 2 } },
      { heading: 'Terms', terms: [
        ['Exclusions', '[Permits, painting, appliances, work not listed above.]'],
        ['Change orders', 'Changes to the scope will be priced in writing and signed by both parties before the work proceeds.'],
        ['Validity and timing', 'Valid for [30] days from the date above. Start date: [date]. Estimated duration: [x weeks], subject to weather and materials.']] },
      { heading: 'Acceptance', sign: ACCEPT }
    ]
  },
  painting: {
    file: 'painting-quote-template', docTitle: 'Painting and decorating quote template', subtitle: 'Painting and decorating quote template',
    taxNumber: 'VAT / tax no.: [if registered]', url: 'getquotationmaker.com/quote-template-painter', currency: '', taxName: 'Tax', taxRate: 0,
    blocks: [
      { kv: QUOTE_DETAILS },
      { heading: 'Areas and surfaces', items: { cols: [{ h: 'Room / area', w: 0.24 }, { h: 'Surfaces (walls, ceiling, woodwork...)', w: 0.32 }, { h: 'Coats', w: 0.1, right: 1 }, { h: 'Finish / colour', w: 0.17 }, { h: 'Price', w: 0.17, right: 1 }],
        example: ['Example: Living room', 'Walls and ceiling', '2', 'Matt, [colour]', '420.00'], blank: 5,
        totals: ['Paint and sundries', 'Protection, access and clean-up', 'Subtotal', 'VAT / tax at [__]% (if registered)', 'Total'] } },
      { heading: 'Preparation', hint: 'For example: fill minor cracks and holes, sand, caulk gaps, spot-prime repairs, mist coat on new plaster.', lines: 1 },
      { heading: 'Paint', text: ['Brand and range: [ ]          Paint supplied by:  [ ] us, included in the price   [ ] the client', 'Colours to be confirmed by: [date]'] },
      { heading: 'Terms', terms: [
        ['Not included', '[Re-plastering, wallpaper removal, rotten wood repair, moving heavy furniture.] These can be quoted separately.'],
        ['Payment', '[No deposit; payment on completion] or [25% deposit, balance on completion].'],
        ['Validity', 'This quote is valid for [30] days from the date above.'],
        ['Access', '[Ladders and tower included] or [scaffolding priced separately].']] },
      { heading: 'Acceptance', sign: ACCEPT }
    ]
  },
  auto: {
    file: 'auto-repair-quote-template', docTitle: 'Auto repair quote template', subtitle: 'Auto repair estimate / car repair quotation',
    taxNumber: 'Tax / registration no.: [if applicable]', url: 'getquotationmaker.com/quote-template-mechanic', currency: '', taxName: 'Tax', taxRate: 0,
    blocks: [
      { kv: [['Estimate no.', 'E-[0001]'], ['Date', '[DD/MM/YYYY]'], ['Customer', '[Name]'], ['Valid until', '[DD/MM/YYYY]'], ['Phone', '[Phone for approvals]'], ['Email', '[Email]']] },
      { heading: 'Vehicle', kv: [['Make / model / year', '[ ]'], ['Registration', '[ ]'], ['VIN', '[ ]'], ['Mileage', '[ ]']] },
      { heading: 'Concern and diagnosis', hint: 'Customer concern (in their words), then what you found.', lines: 1 },
      { heading: 'Parts', items: { cols: [{ h: 'Part no.', w: 0.16 }, { h: 'Description (OEM / aftermarket / used)', w: 0.44 }, { h: 'Qty', w: 0.1, right: 1 }, { h: 'Unit price', w: 0.14, right: 1 }, { h: 'Amount', w: 0.16, right: 1 }],
        example: ['[ ]', 'Example: Front brake pads, ceramic (aftermarket)', '1', '68.00', '68.00'], blank: 2, totals: ['Parts subtotal'] } },
      { heading: 'Labour', items: { cols: [{ h: 'Job', w: 0.6 }, { h: 'Hours', w: 0.1, right: 1 }, { h: 'Rate', w: 0.14, right: 1 }, { h: 'Amount', w: 0.16, right: 1 }],
        example: ['Example: Replace front pads and rotors', '1.6', '120.00', '192.00'], blank: 2,
        totals: ['Labour subtotal', 'Shop supplies and disposal', 'Tax at [__]%', 'Estimated total'] } },
      { heading: 'Terms', terms: [
        ['Additional work', 'No additional work will be carried out without the customer’s approval. If further faults are found, we will contact you with a revised price before continuing.'],
        ['Validity and warranty', 'Valid for [14] days; parts prices may change after that. Warranty: [parts x months, labour x months].']] },
      { heading: 'Authorization', who: 'Customer', sign: 'I authorize the repairs listed above for the estimated total shown.' }
    ]
  }
};

// ---------- Excel ----------
const thin = { style: 'thin', color: { argb: 'FFD1D5DB' } };
const box = { top: thin, left: thin, bottom: thin, right: thin };
const INPUT = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF7D6' } };
const HEAD = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F4C81' } };
const LABEL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F6FA' } };
const f = (o = {}) => Object.assign({ name: 'Arial', size: 10 }, o);

async function buildXlsx(key, cfg) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'GetQuotationMaker.com';
  wb.calcProperties.fullCalcOnLoad = true;
  const ws = wb.addWorksheet('Quote', { pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true, fitToWidth: 1, fitToHeight: 0, margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 } }, views: [{ showGridLines: false }] });
  ws.columns = [{ width: 44 }, { width: 10 }, { width: 10 }, { width: 14 }, { width: 16 }];
  const money = cfg.currency ? '"' + cfg.currency + '"#,##0.00' : '#,##0.00';
  let r = 1;
  const set = (addr, v, style) => { const c = ws.getCell(addr); c.value = v; if (style) Object.assign(c, style); return c; };

  set('A' + r, 'QUOTATION', { font: f({ size: 20, bold: true, color: { argb: 'FF0F4C81' } }) });
  set('D' + r, '[Your business name]', { font: f({ bold: true, size: 12 }), fill: INPUT, alignment: { horizontal: 'right' } }); ws.mergeCells('D' + r + ':E' + r); r++;
  set('A' + r, cfg.subtitle, { font: f({ color: { argb: 'FF6B7280' } }) });
  ['[Address]', '[Phone] | [Email]', cfg.taxNumber].forEach(t => { set('D' + r, t, { font: f({ size: 9 }), fill: INPUT, alignment: { horizontal: 'right' } }); ws.mergeCells('D' + r + ':E' + r); r++; });
  set('A' + r, 'How to use: fill in the yellow cells. Line amounts, subtotal, tax and total calculate automatically. Delete the example row.', { font: f({ italic: true, size: 9, color: { argb: 'FF6B7280' } }) }); ws.mergeCells('A' + r + ':E' + r); r += 2;

  const kv = key === 'auto'
    ? [['Estimate no.', 'E-0001'], ['Date', ''], ['Valid until', ''], ['Customer', ''], ['Vehicle (year, make, model)', ''], ['Registration / VIN', ''], ['Mileage', '']]
    : [['Quote no.', 'Q-0001'], ['Date', ''], ['Valid until', ''], ['Client', ''], ['Client address', ''], ['Site / job address', '']];
  kv.forEach(([k, v]) => {
    set('A' + r, k, { font: f({ bold: true }), fill: LABEL, border: box });
    set('B' + r, v, { font: f(), fill: INPUT, border: box }); ws.mergeCells('B' + r + ':E' + r);
    if (/Date|Valid/.test(k)) ws.getCell('B' + r).numFmt = 'dd/mm/yyyy';
    r++;
  });
  r++;

  const itemBlock = (title, heads, example, blank) => {
    set('A' + r, title.toUpperCase(), { font: f({ bold: true, color: { argb: 'FF0F4C81' } }) }); r++;
    heads.forEach((h, i) => set(String.fromCharCode(65 + i) + r, h, { font: f({ bold: true, color: { argb: 'FFFFFFFF' } }), fill: HEAD, border: box, alignment: { horizontal: i ? 'right' : 'left' } }));
    r++;
    const first = r;
    for (let i = 0; i < blank + 1; i++) {
      const ex = i === 0 ? example : null;
      set('A' + r, ex ? ex[0] : '', { font: f({ italic: !!ex, color: { argb: ex ? 'FF6B7280' : 'FF111827' } }), fill: INPUT, border: box, alignment: { wrapText: true } });
      set('B' + r, ex ? ex[1] : null, { font: f(), fill: INPUT, border: box });
      set('C' + r, ex ? ex[2] : null, { font: f(), fill: INPUT, border: box, alignment: { horizontal: 'right' } });
      set('D' + r, ex ? ex[3] : null, { font: f(), fill: INPUT, border: box, numFmt: money });
      set('E' + r, { formula: 'IF(OR(B' + r + '="",D' + r + '=""),"",B' + r + '*D' + r + ')', result: ex ? ex[1] * ex[3] : '' }, { font: f({ bold: true }), border: box, numFmt: money });
      r++;
    }
    return [first, r - 1];
  };

  const totalRow = (label, formula, result, opts = {}) => {
    set('D' + r, label, { font: f({ bold: !!opts.bold }), alignment: { horizontal: 'right' } });
    set('E' + r, { formula, result }, { font: f({ bold: !!opts.bold, size: opts.bold ? 11 : 10 }), border: box, numFmt: money, fill: opts.bold ? LABEL : undefined });
    const row = r; r++; return row;
  };

  let subRefs = [];
  if (key === 'auto') {
    const [a1, a2] = itemBlock('Parts', ['Description (part no., OEM/aftermarket)', 'Qty', '', 'Unit price', 'Amount'], ['Example: Front brake pads, ceramic', 1, '', 68], 6);
    const ps = totalRow('Parts subtotal', 'SUM(E' + a1 + ':E' + a2 + ')', 68); r++;
    const [b1, b2] = itemBlock('Labour', ['Job', 'Hours', '', 'Rate', 'Amount'], ['Example: Replace front pads and rotors', 1.6, '', 120], 5);
    const ls = totalRow('Labour subtotal', 'SUM(E' + b1 + ':E' + b2 + ')', 192);
    set('C' + r, 'Shop supplies', { font: f({ size: 9 }) });
    set('D' + r, 'Shop supplies / disposal', { font: f(), alignment: { horizontal: 'right' } });
    set('E' + r, 15, { font: f(), fill: INPUT, border: box, numFmt: money }); const sh = r; r++;
    subRefs = ['E' + ps, 'E' + ls, 'E' + sh];
  } else {
    const heads = key === 'painting' ? ['Room / area and surfaces', 'Qty', 'Coats', 'Rate', 'Amount'] : ['Description', 'Qty', 'Unit', 'Rate', 'Amount'];
    const ex = key === 'tradesman' ? ['Example: Labour, install new kitchen units', 3, 'day', 320]
      : key === 'painting' ? ['Example: Living room, walls and ceiling, matt', 1, 2, 420]
        : ['Example: Drywall supply, hang and finish (sq ft)', 640, 'sq ft', 2.75];
    const [a1, a2] = itemBlock(key === 'painting' ? 'Areas, surfaces and materials' : 'Price', heads, ex, 11);
    subRefs = ['SUM(E' + a1 + ':E' + a2 + ')'];
  }
  r++;
  const exampleSub = key === 'auto' ? 275 : key === 'tradesman' ? 960 : key === 'painting' ? 420 : 1760;
  const subRow = totalRow(key === 'tradesman' ? 'Subtotal (excl. VAT)' : 'Subtotal', subRefs.length > 1 ? subRefs.join('+') : subRefs[0], exampleSub);
  set('B' + r, key === 'tradesman' ? 'VAT rate (0% if not VAT registered)' : cfg.taxName + ' rate', { font: f({ size: 9 }), alignment: { horizontal: 'right' } });
  set('C' + r, cfg.taxRate, { font: f(), fill: INPUT, border: box, numFmt: '0%' });
  const taxRow = totalRow(cfg.taxName, 'E' + subRow + '*C' + r, exampleSub * cfg.taxRate);
  totalRow(key === 'tradesman' ? 'Total incl. VAT' : 'Total', 'E' + subRow + '+E' + taxRow, exampleSub * (1 + cfg.taxRate), { bold: true });
  r++;

  const terms = (cfg.blocks.find(b => b.terms) || {}).terms || [];
  set('A' + r, 'TERMS', { font: f({ bold: true, color: { argb: 'FF0F4C81' } }) }); r++;
  terms.forEach(([k, v]) => {
    set('A' + r, k + ': ' + v, { font: f({ size: 9 }), alignment: { wrapText: true, vertical: 'top' } }); ws.mergeCells('A' + r + ':E' + r);
    ws.getRow(r).height = Math.max(15, Math.ceil(v.length / 105) * 13 + 4); r++;
  });
  r++;
  set('A' + r, key === 'auto' ? 'AUTHORIZATION' : 'ACCEPTANCE', { font: f({ bold: true, color: { argb: 'FF0F4C81' } }) }); r++;
  set('A' + r, key === 'auto' ? 'I authorize the repairs listed above for the estimated total shown.' : ACCEPT, { font: f({ size: 9 }), alignment: { wrapText: true } }); ws.mergeCells('A' + r + ':E' + r); ws.getRow(r).height = 28; r++;
  set('A' + r, 'Signature:', { font: f(), border: { bottom: thin } }); set('D' + r, 'Date:', { font: f(), border: { bottom: thin } }); ws.mergeCells('D' + r + ':E' + r); ws.getRow(r).height = 26; r++;
  set('A' + r, 'Name:', { font: f(), border: { bottom: thin } }); ws.getRow(r).height = 22; r += 2;
  set('A' + r, 'Free template from GetQuotationMaker.com. Fill it in online with automatic totals: ' + cfg.url, { font: f({ size: 8, color: { argb: 'FF9CA3AF' } }) });
  ws.pageSetup.printArea = 'A1:E' + r;
  await wb.xlsx.writeFile(path.join(OUT, cfg.file + '.xlsx'));
}

(async () => {
  for (const [key, cfg] of Object.entries(T)) {
    const buf = await Packer.toBuffer(buildDocx(cfg));
    fs.writeFileSync(path.join(OUT, cfg.file + '.docx'), buf);
    await buildXlsx(key, cfg);
    console.log('built', cfg.file);
  }
})();
