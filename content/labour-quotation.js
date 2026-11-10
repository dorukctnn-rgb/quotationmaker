// /labour-quotation-format, added 10 Nov 2026 from the Bing citation report (BING-YZ-RAPORU.md, action 5).
// Copilot cited the old peakappsstudio.com contractor-quote page 199 times for "labour format" (40) and "labour quotation" (28);
// those links now redirect to /quote-template-contractor, which is a protected traffic page and was not touched. This page owns
// the labour-only topic in full: fields, labour-only against supply and fit, three ways to price labour, three worked examples
// that load into the tool, wording to copy and the tax lines for the UK, the UAE and India (each read on its official page on
// 10 November 2026). It is a how-to page (views/how-to.ejs) and carries its own presets.
const { example } = require('./country-pages');

const CHECKED = '10 November 2026';
const a = (href, text) => '<a href="' + href + '" rel="nofollow noopener" target="_blank">' + text + '</a>';
const load = (key, label) => '<p><button type="button" class="btn ghost" data-preset="' + key + '" style="cursor:pointer;font-size:13px;padding:9px 16px">' + label + '</button></p>';

const uk = example({
  key: 'labour-uk-tiling', label: 'UK labour-only tiling quote, day rate, with VAT (example prices)', currency: 'GBP', symbol: '£', rate: 20, taxLabel: 'VAT',
  labels: ['Subtotal, excluding VAT', 'VAT at 20%', 'Total including VAT'],
  items: [['Tiling labour, per tiler per day (2 tilers for 3 days)', 6, 190], ['Preparing walls and floor, per day (1 labourer)', 1, 140], ['Grouting, sealing and clean down, lump sum', 1, 120]],
  notes: 'Labour only. Tiles, adhesive, grout, trims and waste skip are supplied by the client and must be on site before we start.\nPrice is for 3 working days with 2 tilers. If the work runs on because materials or access are not ready, extra days are charged at the day rate above.\nPayment: 30% to book the dates, balance on completion.\nPrices exclude VAT; VAT at 20% is added below (set the rate to 0 if you are not VAT registered).\nValid for 30 days.'
});
const ae = example({
  key: 'labour-uae-fitout', label: 'UAE labour-only fit-out quotation, per sq m, with VAT (example prices)', currency: 'AED', symbol: 'AED ', rate: 5, taxLabel: 'VAT',
  labels: ['Subtotal before VAT', 'VAT at 5%', 'Total including VAT'],
  items: [['Gypsum partition framing, labour only, per sq m', 120, 38], ['Gypsum board fixing and jointing, labour only, per sq m', 240, 22], ['Painting, 2 coats, labour only, per sq m', 300, 14]],
  notes: 'Labour only. Boards, framing, paint, scaffolding, power and water are supplied by the client.\nQuantities are estimated from the drawings; the final bill uses measured quantities at the rates above.\nPayment: 20% advance, running bills for work measured to date, balance on completion. TRN: shown above.\nPlease reply with your Local Purchase Order (LPO) to confirm. Valid for 15 days.'
});
const inr = example({
  key: 'labour-in-flooring', label: 'India labour-only flooring quotation, per sq ft, with GST (example prices)', currency: 'INR', symbol: '₹', rate: 18, taxLabel: 'GST',
  labels: ['Subtotal before GST', 'GST at 18%', 'Total including GST'],
  items: [['Vitrified tile laying, 2 x 2 ft, labour only, per sq ft', 850, 24], ['Wall putty, 2 coats, labour only, per sq ft', 2200, 9], ['Skirting fixing, labour only, per running ft', 300, 15], ['Debris removal and site clean up, lump sum', 1, 2500]],
  notes: 'Labour only. Tiles, cement, adhesive, putty, water and electricity are provided by the client.\nQuantities are estimated; the final bill will use measured quantities at the rates above.\nPayment: 20% advance, then weekly running bills, balance on completion.\nGST shown at 18%; change the rate if a different rate applies to your work. GSTIN: shown above.\nValid for 15 days.'
});

const LABOUR = {
  slug: 'labour-quotation-format',
  title: 'Labour Quotation Format: Sample, Fields and Free Template',
  h1: 'Labour quotation format for labour-only work',
  desc: 'Labour quotation format for labour-only jobs: fields to fill, per-unit and day-rate pricing, three worked examples, wording to copy and a free template.',
  lead: 'A labour quotation prices work done by people, while the client buys the materials. This page gives the format field by field, shows how to price labour per unit, per day or per hour, and has three worked examples (UK, UAE, India) that load into the quote maker. A free Word and Excel template is below.',
  breadcrumb: 'Labour quotation format',
  published: '2026-11-10',
  updated: '2026-11-10',
  // Left out of the /blog list on purpose: /blog is a protected traffic page (see QM-DUZELTME-NOTLAR.md). Linked from the trade and country pages instead.
  inBlogIndex: false,
  jump: ['format', 'See the format'],
  heroLabel: 'Open an example in the quote maker',
  preset: uk.key,
  presetLabel: 'UK day-rate example',
  presetButtons: [
    { key: uk.key, label: 'UK: tiling, day rate, VAT' },
    { key: ae.key, label: 'UAE: fit-out, per sq m, VAT' },
    { key: inr.key, label: 'India: flooring, per sq ft, GST' }
  ],
  presets: { [uk.key]: uk.preset, [ae.key]: ae.preset, [inr.key]: inr.preset },
  related: [
    ['/quote-template-contractor', 'Contractor and tradesman quote template'],
    ['/quote-template-builder', 'Builder quote template: price by stage'],
    ['/blog/how-to-price-a-job-quote', 'How to price a job quote'],
    ['/quote-acceptance-template', 'Quote acceptance wording'],
    ['/how-to-send-a-quote-to-a-client', 'How to send a quote by email'],
    ['/free-quote-generator-uk', 'Quote generator for the UK'],
    ['/free-quote-generator-uae', 'Quote generator for the UAE'],
    ['/free-quote-generator-india', 'Quote generator for India']
  ],
  answer: `<p><strong>The short answer:</strong> a labour quotation is a written price for work done by people only. It names the task, the unit (square foot, square metre, running metre, day or hour), the quantity, the rate and the total, and it says who supplies the materials, tools and access. The format is: header, scope, rate table, what is not included, payment, validity and acceptance.</p>`,
  toc: [
    ['format', 'What goes in a labour quotation'],
    ['types', 'Labour only, supply and fit, or full contract'],
    ['pricing', 'How to price labour'],
    ['examples', 'Three worked examples'],
    ['wording', 'Wording to copy'],
    ['tax', 'Tax lines for the UK, the UAE and India'],
    ['template', 'Free Word and Excel template']
  ],
  content: `
<h2 id="format">What goes in a labour quotation</h2>
<p>The format is a normal quote with two additions: a clear line on who buys the materials, and a statement of how the final bill is measured. Use these fields in this order.</p>
<table>
<thead><tr><th>Field</th><th>What to write</th><th>Why it matters</th></tr></thead>
<tbody>
<tr><td>Header</td><td>Your name, address, phone and tax or registration number. Client name, site address, quote number, date.</td><td>The client can file the quote, and a registered business shows its tax number.</td></tr>
<tr><td>Scope of labour</td><td>The tasks in plain words: &ldquo;floor tiling, labour only, kitchen and hall, about 38 sq m&rdquo;.</td><td>Stops an argument later about what &ldquo;labour&rdquo; included.</td></tr>
<tr><td>Unit and quantity</td><td>Square foot, square metre, running metre, day, hour or lump sum, with the quantity.</td><td>The price follows the measured work.</td></tr>
<tr><td>Rate and amount</td><td>Rate per unit before tax, and the amount (quantity times rate).</td><td>The client can compare your rates line by line.</td></tr>
<tr><td>Materials and tools</td><td>Who supplies materials, consumables, scaffolding, power tools, water and electricity.</td><td>The most common dispute on a labour-only job.</td></tr>
<tr><td>Quantities basis</td><td>&ldquo;Estimated; the final bill uses measured quantities.&rdquo;</td><td>Lets the price move with the real area, in both directions.</td></tr>
<tr><td>Not included</td><td>Hidden defects, extra visits, work at height, waiting time, work by other trades.</td><td>Protects you from unpaid extras.</td></tr>
<tr><td>Working time</td><td>Hours per day, overtime rate, weekend work, number of workers.</td><td>Makes the day rate and the schedule clear.</td></tr>
<tr><td>Payment</td><td>Advance, running bills for work measured to date, final payment on completion.</td><td>Keeps your cash flow safe on a job with no materials to resell.</td></tr>
<tr><td>Tax</td><td>A tax line, or a statement that tax is not charged, with the tax numbers.</td><td>See the tax lines below.</td></tr>
<tr><td>Validity and acceptance</td><td>Days the price holds, and how the client says yes.</td><td>See <a href="/quote-acceptance-template">quote acceptance wording</a>.</td></tr>
</tbody></table>

<h2 id="types">Labour only, supply and fit, or full contract: which one are you quoting?</h2>
<p>The same trade can be quoted three ways. Decide which one before you write the first line, because the rate table looks different for each.</p>
<table>
<thead><tr><th></th><th>Labour only</th><th>Supply and fit</th><th>Full contract</th></tr></thead>
<tbody>
<tr><td>What the price covers</td><td>Work by people, sometimes with their tools</td><td>Materials and the work to fit them</td><td>All trades, materials and site management</td></tr>
<tr><td>Who buys the materials</td><td>The client</td><td>You</td><td>You</td></tr>
<tr><td>How you price it</td><td>Per unit of measured work, per day or per hour</td><td>A materials list plus labour lines</td><td>Stage prices with provisional and prime cost sums</td></tr>
<tr><td>Main risk</td><td>Quantities, waiting time, the quality of materials you did not choose</td><td>Material prices moving before the job</td><td>Scope growing without a price change</td></tr>
<tr><td>Template to start from</td><td>This page</td><td><a href="/quote-template-contractor">Contractor quote template</a></td><td><a href="/quote-template-builder">Builder quote template</a></td></tr>
</tbody></table>

<h2 id="pricing">How do you price labour: per unit, per day or per hour?</h2>
<table>
<thead><tr><th>Method</th><th>Use it when</th><th>How the price is built</th></tr></thead>
<tbody>
<tr><td>Per unit of measured work</td><td>Repeatable work with a clear quantity: tiling, plastering, painting, brickwork, board fixing</td><td>Rate per sq ft, sq m or running metre times the measured quantity</td></tr>
<tr><td>Day rate</td><td>The work is hard to measure first, or you are supplying a crew</td><td>Workers times days times the day rate, with working hours stated</td></tr>
<tr><td>Hourly rate</td><td>Repairs and small jobs where the scope is not known</td><td>Hours times the hourly rate, with a minimum charge and a limit that needs the client&rsquo;s approval to pass</td></tr>
<tr><td>Lump sum</td><td>A small task that is fully defined</td><td>One price for the named task</td></tr>
</tbody></table>
<p>To set a day rate, start from what you need to earn and how many days you can really bill. For example, if you need &pound;36,000 a year from the work and can bill 190 days, the pay part of the day rate is about &pound;189 (36,000 divided by 190) before tools, insurance, travel and profit. Our guide to <a href="/blog/how-to-price-a-job-quote">pricing a job quote</a> works through the overheads and the margin.</p>

<h2 id="examples">Three worked examples you can load</h2>
<p>Prices are illustrations, not market rates. Each button loads the example into the quote maker, where you change the lines, the currency and the tax.</p>

<h3>United Kingdom: tiling labour at a day rate, with VAT</h3>
${uk.html}
${load(uk.key, 'Load the UK example into the quote maker')}

<h3>United Arab Emirates: fit-out labour per square metre, with 5% VAT</h3>
${ae.html}
${load(ae.key, 'Load the UAE example into the quote maker')}

<h3>India: flooring labour per square foot, with 18% GST</h3>
${inr.html}
${load(inr.key, 'Load the Indian example into the quote maker')}

<h2 id="wording">Wording to copy into a labour quotation</h2>
<p>Change the square brackets to fit the job. This is a starting point, not legal advice; for a large contract, have it checked.</p>
<ul>
<li><strong>Labour only:</strong> &ldquo;This quotation is for labour only. Materials, consumables, scaffolding, power and water are supplied by the client and must be on site before work starts.&rdquo;</li>
<li><strong>Measured quantities:</strong> &ldquo;Quantities are estimated from [the drawings / a site visit]. The final bill uses measured quantities at the rates above.&rdquo;</li>
<li><strong>Waiting time:</strong> &ldquo;If work is held up because materials or access are not ready, the waiting time is charged at the day rate.&rdquo;</li>
<li><strong>Client&rsquo;s materials:</strong> &ldquo;We are responsible for our workmanship. We are not responsible for faults in materials supplied by the client.&rdquo;</li>
<li><strong>Extra work:</strong> &ldquo;Work not listed here is priced and agreed in writing before we start it.&rdquo;</li>
<li><strong>Payment:</strong> &ldquo;[20]% in advance, running bills for work measured to date, the balance on completion.&rdquo;</li>
<li><strong>Validity:</strong> &ldquo;This quotation is valid for [30] days from the date above.&rdquo;</li>
</ul>
<p>When the quote is ready, send it with one of our <a href="/how-to-send-a-quote-to-a-client">quote email templates</a> and ask for a written yes using the <a href="/quote-acceptance-template">acceptance wording</a>.</p>

<h2 id="tax">Tax lines on a labour quotation: UK, UAE and India</h2>
<p>Rules and rates below were read on the official pages linked beside them on ${CHECKED}. Tax rules change and depend on what you sell; check with the tax authority or an accountant.</p>
<ul>
<li><strong>UK, VAT:</strong> most building work on houses and flats is standard-rated at 20%, so a VAT-registered business adds VAT to labour-only work too, unless the zero rate, the reduced rate or the reverse charge applies. See ${a('https://www.gov.uk/vat-builders', 'GOV.UK: VAT for builders')}. Where the domestic reverse charge applies (a VAT-registered business in the Construction Industry Scheme working for another), you do not charge VAT and the invoice says so; see ${a('https://www.gov.uk/guidance/vat-domestic-reverse-charge-for-building-and-construction-services', 'GOV.UK: domestic reverse charge')}.</li>
<li><strong>UK, CIS:</strong> a contractor usually deducts 20% from a registered subcontractor&rsquo;s payment, 30% from an unregistered one and nothing from one with gross payment status, after taking away VAT and any materials the subcontractor paid for directly. Quote the full labour price; the deduction is made when you are paid. See ${a('https://www.gov.uk/what-you-must-do-as-a-cis-contractor/make-deductions-and-pay-subcontractors', 'GOV.UK: CIS deductions')}.</li>
<li><strong>UAE:</strong> a VAT-registered business shows its Tax Registration Number (TRN) and VAT at 5%. Registration is mandatory above AED 375,000 of taxable supplies over 12 months. The tax invoice that follows the work carries the words &ldquo;Tax Invoice&rdquo;, your TRN, a sequential number and the VAT in dirhams. See ${a('https://tax.gov.ae/en/taxes/Vat/vat.topics/registration.for.vat.aspx', 'Federal Tax Authority: registration')}. More on the <a href="/free-quote-generator-uae">UAE quote generator</a> page.</li>
<li><strong>India:</strong> GST registration is needed above &#8377;20 lakh of turnover for services in most states (lower in special category states). The standard rate is 18%, but the rate depends on the work, so confirm it for yours. See ${a('https://www.pib.gov.in/FactsheetDetails.aspx?Id=148644', 'Press Information Bureau: GST factsheet')}. More on the <a href="/free-quote-generator-india">India quote generator</a> page.</li>
</ul>

<h2 id="template">Free labour quotation template in Word and Excel</h2>
<p>A one-page labour-only template with the fields above, an example row, a terms block and a signature line. The Excel file adds up the lines for you; fill in the yellow cells.</p>
<ul class="dl">
<li><a href="/templates/labour-quotation-template.docx" download>Labour quotation template, Word (.docx)</a></li>
<li><a href="/templates/labour-quotation-template.xlsx" download>Labour quotation template, Excel (.xlsx)</a></li>
</ul>
<p>Or load one of the examples above and download the quote as a PDF from the quote maker.</p>
`,
  faq: [
    { q: 'What is a labour quotation?', a: 'A written price for work done by people only. It lists the tasks, the unit and quantity, the rate and the total, and it states that the client supplies the materials, tools and access.' },
    { q: 'What is the format of a labour contractor quotation?', a: 'Header with both parties and a quote number, a scope of labour, a table of tasks with unit, quantity, rate and amount, a line on who supplies materials, what is not included, payment terms, a tax line, a validity period and an acceptance block.' },
    { q: 'What is the difference between a labour quote and a full quote?', a: 'A labour quote covers the work only and the client buys the materials. A full quote, or supply and fit, includes the materials, so it has a materials list or allowance and a different risk if material prices change.' },
    { q: 'Should I price labour per square foot or per day?', a: 'Per unit of measured work suits repeatable jobs with a clear quantity, such as tiling or plastering. A day rate suits work that is hard to measure first or when you supply a crew. State the working hours with a day rate.' },
    { q: 'Do I charge VAT or GST on a labour-only quotation?', a: 'If you are registered for VAT or GST, yes, unless a special rule applies, such as the UK domestic reverse charge for construction services. If you are not registered, set the tax rate to 0 and do not mention tax. Check the rate for your work with the tax authority.' },
    { q: 'What happens if the client\'s materials are not ready?', a: 'Say in the quote that waiting time is charged at the day rate, and that the materials must be on site before work starts. That puts the cost of the delay on the side that caused it.' }
  ]
};

module.exports = { LABOUR_PAGES: [LABOUR] };
