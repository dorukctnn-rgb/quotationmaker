// Rebuilt trade pages (10 Nov 2026 technical audit): plumber, builder and IT support. Until now these three pages carried one
// generic checklist each, 150 to 250 words, and Google had not indexed them. Each entry here replaces the page's own text,
// adds example quotes that load into the tool and a Word and Excel download, and links to the guides that own the neighbouring
// intents (acceptance wording, confirming a quotation, acceptance rate). Slug, label and name stay as in server.js.
// Prices in the examples are illustrations, not market rates. Tax and legal facts below were read on the official pages
// named in the links on 10 November 2026.
const { tpl } = require('./helpers');

const load = (key, label) => '<p><button type="button" class="btn ghost" data-preset="' + key + '" style="cursor:pointer;font-size:13px;padding:9px 16px">' + label + '</button></p>';
const a = (href, text) => '<a href="' + href + '" rel="nofollow noopener" target="_blank">' + text + '</a>';

const FOLLOW_UP = `<p>When the quote is ready, send it with one of our <a href="/how-to-send-a-quote-to-a-client">quote email templates</a>. Give the client clear <a href="/quote-acceptance-template">quote acceptance wording</a>, and use the steps in <a href="/quotation-confirmation">confirm a quotation</a> once they say yes. If quotes are not turning into jobs, <a href="/blog/quote-acceptance-rate-tips">improve your quote acceptance rate</a> with the nine changes in that guide.</p>`;

// ---------------------------------------------------------------------------------------------------------------------
const PLUMBER = {
  title: 'Plumber Quote Template: Free Word, Excel & PDF Download',
  desc: 'Free plumber quote template to download in Word or Excel, or fill in online. Example quotes with call-out fee, parts, guarantee and Gas Safe wording.',
  h1: 'Plumber quote template',
  lead: 'A free plumbing quote template for plumbers, heating engineers and small plumbing firms. Download it in Word or Excel, or load an example and fill it in online. It has a line for the call-out fee, labour, parts and making good, and wording for the guarantee and for hidden faults.',
  updated: '2026-11-10',
  published: '2026-09-02',
  custom: true,
  heroCta: { preset: 'plumber-bathroom', label: 'Load an example bathroom quote' },
  downloads: [
    {
      title: 'Plumber quote template (UK)',
      desc: 'Pounds, VAT at 20% shown separately, call-out fee, parts, Gas Safe line, guarantee and 30-day validity.',
      files: [['/templates/plumber-quote-template.docx', 'Word'], ['/templates/plumber-quote-template.xlsx', 'Excel']],
      preset: 'plumber-bathroom'
    }
  ],
  presetButtons: [
    { key: 'plumber-bathroom', label: 'Bathroom: bath to walk-in shower' },
    { key: 'plumber-callout', label: 'Emergency repair with call-out fee' },
    { key: 'plumber', label: 'Replace a kitchen tap' }
  ],
  presets: {
    'plumber-bathroom': {
      label: 'Plumbing quote, bathroom (example prices)', currency: 'GBP', taxRate: 20, taxLabel: 'VAT', validDays: 30,
      items: [
        ['Strip out bath, taps and waste; remove rubble', 1, 180],
        ['Labour: first fix, new shower valve, waste and supply pipework (2 days)', 2, 290],
        ['Walk-in shower tray, 1200 x 800 mm, with waste', 1, 185],
        ['Thermostatic shower valve and 200 mm rain head', 1, 210],
        ['Pipe, fittings, isolation valves and sundries', 1, 95],
        ['Labour: second fix, connect, test and commission (1 day)', 1, 290]
      ],
      notes: 'Tiling, glass screen, plastering and decoration are not included and can be quoted separately.\nHidden faults found once the old bath is out (for example corroded pipework) are priced and agreed with you before any extra work.\nGuarantee: 12 months on workmanship from completion; manufacturer guarantees apply to parts.\nPayment: 30% to order materials, balance on completion. Valid for 30 days.'
    },
    'plumber-callout': {
      label: 'Emergency repair quote (example prices)', currency: 'GBP', taxRate: 0, taxLabel: 'VAT', validDays: 14,
      items: [
        ['Call-out fee, evening visit (waived because you accepted this quote on the visit)', 1, 0],
        ['Labour: locate and repair leaking compression joint under the kitchen floor, 1.5 hours', 1.5, 65],
        ['Replace 15 mm copper section and two compression fittings', 1, 28],
        ['Refill, vent and test the system', 1, 40]
      ],
      notes: 'Normally a call-out fee of GBP 70 applies. It is waived because you accepted this quote on the visit.\nFloorboards are lifted and replaced; carpet and decoration are not included.\nGuarantee: 12 months on the repair. Payment on completion. Valid for 14 days.'
    }
  },
  guide: `
<h2 id="what-to-include">What a plumbing quote includes</h2>
<p>A customer comparing plumbers reads the total first and the small print second. These are the lines that stop an argument later.</p>
<table>
<thead><tr><th>Line</th><th>What to write</th><th>Why it matters</th></tr></thead>
<tbody>
<tr><td>Call-out or visit fee</td><td>The amount, and whether it comes off the price if the customer accepts</td><td>Customers expect it to be deducted; say so or say it is not</td></tr>
<tr><td>Labour</td><td>A fixed price for the job, or hours multiplied by your rate. Show out-of-hours and emergency rates separately</td><td>A fixed price is easy to compare; hours leave the total open</td></tr>
<tr><td>Parts and fittings</td><td>Valves, pipe runs, fixtures and appliances as separate lines, and who supplies the sanitaryware</td><td>Customer-supplied items are the usual source of warranty disputes</td></tr>
<tr><td>Making good</td><td>Whether you repair tiles, plaster and flooring you disturb, or leave that to other trades</td><td>Most complaints about plumbers are about the mess left behind</td></tr>
<tr><td>Hidden faults</td><td>What happens when the old pipework is worse than it looked</td><td>Without a clause you either absorb the cost or argue about it on site</td></tr>
<tr><td>Certification and guarantee</td><td>Gas Safe number for gas work, the guarantee period for workmanship, and the manufacturer's guarantee for parts</td><td>This is what a careful customer asks about before saying yes</td></tr>
<tr><td>Payment and validity</td><td>Deposit for materials, balance on completion, and a valid-until date</td><td>Pipe and fitting prices change; a date protects your margin</td></tr>
</tbody></table>

<h2 id="example">Example: replace a bath with a walk-in shower</h2>
<p>A fixed-price quote for a bathroom job, written the way the template lays it out. Prices are examples only.</p>
<table>
<thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead>
<tbody>
<tr><td>Strip out bath, taps and waste; remove rubble</td><td class="n">1</td><td class="n">&pound;180</td><td class="n">&pound;180</td></tr>
<tr><td>Labour: first fix, shower valve, waste and supply pipework (2 days)</td><td class="n">2</td><td class="n">&pound;290</td><td class="n">&pound;580</td></tr>
<tr><td>Walk-in shower tray, 1200 x 800 mm, with waste</td><td class="n">1</td><td class="n">&pound;185</td><td class="n">&pound;185</td></tr>
<tr><td>Thermostatic shower valve and 200 mm rain head</td><td class="n">1</td><td class="n">&pound;210</td><td class="n">&pound;210</td></tr>
<tr><td>Pipe, fittings, isolation valves and sundries</td><td class="n">1</td><td class="n">&pound;95</td><td class="n">&pound;95</td></tr>
<tr><td>Labour: second fix, connect, test and commission (1 day)</td><td class="n">1</td><td class="n">&pound;290</td><td class="n">&pound;290</td></tr>
<tr><td colspan="3">Subtotal, excluding VAT</td><td class="n">&pound;1,540</td></tr>
<tr><td colspan="3">VAT at 20% (only if you are VAT registered)</td><td class="n">&pound;308</td></tr>
<tr><td colspan="3"><strong>Total including VAT</strong></td><td class="n"><strong>&pound;1,848</strong></td></tr>
</tbody></table>
<p>Tiling, a glass screen, plastering and decoration are listed as not included. The deposit in this example is 30% of the total (&pound;554.40), paid when materials are ordered.</p>
${load('plumber-bathroom', 'Load this bathroom example into the quote maker')}

<h2 id="pricing">How to price plumbing work</h2>
<p>Pick one method per job and show it on the quote. The line items should still list the work, so the customer can see what each part of the price covers.</p>
<table>
<thead><tr><th>Method</th><th>How it works</th><th>Good for</th></tr></thead>
<tbody>
<tr><td>Fixed price</td><td>One price for the work described, with parts listed or included</td><td>Tap, toilet and radiator swaps, bathroom fits, boiler installs</td></tr>
<tr><td>Hourly rate plus parts</td><td>Hours at your rate, parts at cost or with a stated handling margin</td><td>Fault finding and repairs where the cause is not yet known</td></tr>
<tr><td>Day rate</td><td>A set price per day on site, with a day count estimate</td><td>Larger refits where the work runs over several days</td></tr>
</tbody></table>
<p>If the customer buys the fittings and you only fit them, the quote is labour only: see the <a href="/labour-quotation-format">labour quotation format</a>.</p>
<p>To build a fixed price, estimate the hours, multiply by your rate and add the parts. A repair of 3.5 hours at &pound;55 is &pound;192.50 of labour. Add &pound;120 of parts at cost and a 15% handling margin on them (&pound;18) and the price is &pound;330.50 before VAT. For emergency repairs where the cause is unknown, quote the call-out and the first hour firmly and say you will price the repair once you have seen the fault.</p>
${load('plumber-callout', 'Load the emergency repair example')}

<h2 id="gas-vat">Gas work, VAT and late payment</h2>
<ul>
<li><strong>Gas work:</strong> in Great Britain, gas work must be done by an engineer on the ${a('https://www.gassaferegister.co.uk/', 'Gas Safe Register')}. Put your registration number on any quote that includes gas work.</li>
<li><strong>VAT:</strong> most building work on houses and flats, including work by plumbers, is standard-rated at 20%. A few jobs, such as renovating an empty home, can qualify for the 5% reduced rate. See ${a('https://www.gov.uk/vat-builders', 'GOV.UK: VAT for builders')}. You charge VAT only once you are registered; see the <a href="/blog/vat-on-quotes-explained">guide to VAT on quotes</a> for how to show it.</li>
<li><strong>Late payment:</strong> for business customers, the statutory rate is 8% plus the Bank of England base rate, plus a fixed sum of &pound;40, &pound;70 or &pound;100 depending on the size of the debt. Write your payment terms on the quote. See ${a('https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt', 'GOV.UK: charging interest on late commercial payments')}.</li>
</ul>

<h2 id="wording">Plumbing quote wording to copy</h2>
<p>Replace everything in square brackets. This is general wording, not legal advice.</p>
${tpl('plscope', 'Scope, parts and making good', `Scope: [remove the existing bath, taps and waste and fit a walk-in shower tray, thermostatic shower valve and waste] at [address].

Parts: all fittings and fixtures are listed in the price above. Items you supply yourself are fitted but not covered by our guarantee.

Making good: we [repair] / [do not repair] tiles, plaster and flooring disturbed by the work. [Tiling and decoration can be quoted separately.]`)}
${tpl('plhidden', 'Hidden faults and extra work', `The price covers the work described. If we find a fault that could not be seen before the work started, for example corroded or undersized pipework, we will stop, tell you what we found, and give you a price for the extra work. We do not carry it out until you agree in writing.`)}
${tpl('plterms', 'Call-out fee, guarantee, payment and validity', `Call-out: a call-out fee of [GBP 45] applies. It is deducted from the price if you accept this quote within [14] days.

Guarantee: [12] months on workmanship from the completion date. Manufacturer guarantees apply to parts.

Payment: [30]% to order materials and the balance on completion, by bank transfer or card. This quotation is valid until [date]. To accept, reply to the email it came with or sign and return it.`)}
${FOLLOW_UP}
<p>Other trades work the same way: see the <a href="/quote-template-electrician">electrician quote template</a> and the <a href="/quote-template-contractor">contractor and tradesman quote template</a>, or the <a href="/quote-template-builder">builder quote template</a> if the plumbing is part of a larger job.</p>`,
  faq: [
    { q: 'What should a plumbing quote include?', a: 'Your business details and, for gas work, your Gas Safe number; the customer and the job address; a quote number and date; the call-out fee and whether it is deducted; labour; parts and fittings as separate lines; what you will and will not make good; the guarantee; a payment schedule and a valid-until date.' },
    { q: 'Should a plumber charge a call-out fee on a quote?', a: 'Many do, to cover the travel and the visit. Write the amount on the quote and say whether it comes off the price when the customer accepts. Customers tend to expect the deduction, so state clearly if you do not offer it.' },
    { q: 'Should I quote plumbing work at a fixed price or by the hour?', a: 'Quote a fixed price when the work is clear, such as a tap, a toilet, a radiator or a bathroom fit. Use an hourly rate with a stated first-hour price for fault finding, where you cannot know the cause before you open things up.' },
    { q: 'How do I handle hidden faults in a plumbing quote?', a: 'Add a clause that says what happens: you stop, tell the customer what you found, price the extra work and wait for agreement before doing it. The wording above can be copied into any plumbing quote.' },
    { q: 'Do I charge VAT on a plumbing quote?', a: 'Only if you are VAT registered. Most plumbing work on a home is standard-rated at 20%. Show the price before VAT, the VAT and the total including VAT, and add your VAT number to the quote.' },
    { q: 'Is a plumbing quote legally binding?', a: 'A quote is an offer. Once the customer accepts it, it normally becomes the agreement for that work at that price, which is why the scope, exclusions and valid-until date matter. An estimate is a best guess and can change; say which one you are giving.' },
    { q: 'Is this plumber quote template free?', a: 'Yes. Download the Word or Excel version, or fill it in online and download a PDF. No signup. The Excel version adds up the lines, VAT and total for you.' }
  ]
};

// ---------------------------------------------------------------------------------------------------------------------
const BUILDER = {
  title: 'Builder Quote Template: Free Word & Excel Download',
  desc: 'Free builder quote template: price by stage, provisional and prime cost sums, stage payments and variations. Download in Word or Excel, or fill in online.',
  h1: 'Builder quote template',
  lead: 'A free building quote template for builders, small construction firms and project managers. Price the job stage by stage, mark provisional and prime cost sums, set a payment schedule and say how variations are handled. Download it in Word or Excel, or load an example and fill it in online.',
  updated: '2026-11-10',
  published: '2026-09-02',
  custom: true,
  heroCta: { preset: 'builder', label: 'Load an example extension quote' },
  downloads: [
    {
      title: 'Builder quote template (UK)',
      desc: 'Pounds, price by stage, provisional and prime cost sums, payment schedule, variations, VAT and reverse charge wording.',
      files: [['/templates/builder-quote-template.docx', 'Word'], ['/templates/builder-quote-template.xlsx', 'Excel']],
      preset: 'builder'
    }
  ],
  presetButtons: [
    { key: 'builder', label: 'Rear extension' },
    { key: 'builder-loft', label: 'Loft conversion' }
  ],
  presets: {
    'builder-loft': {
      label: 'Loft conversion quote (example prices)', currency: 'GBP', taxRate: 20, taxLabel: 'VAT', validDays: 30,
      items: [
        ['Scaffold, access and protection', 1, 1400],
        ['Structural steelwork, new floor structure and roof windows', 1, 7600],
        ['Rear dormer: frame, roof covering and cladding', 1, 9800],
        ['Insulation, plasterboard and skim', 1, 5200],
        ['Staircase supply and fit', 1, 2900],
        ['First and second fix: electrics and heating', 1, 3600],
        ['Prime cost sum: ensuite sanitaryware and tiles (client chooses)', 1, 2200]
      ],
      notes: 'Prime cost sum: the allowance covers the client\'s choice of ensuite fittings and tiles. The final price follows the invoices for what is chosen, plus fitting at the rates above.\nNot included: planning and building control fees, structural engineer, party wall costs, decoration, flooring.\nStage payments: 10% on acceptance, then on completion of each stage. Variations priced and agreed in writing before work. Valid for 30 days.'
    }
  },
  guide: `
<h2 id="what-to-include">What a builder's quote includes</h2>
<p>Building quotes are long because the work is. A reader should be able to check the total on the first page and the detail behind it on the next ones.</p>
<ul>
<li><strong>Summary:</strong> what is being built, where, the start date, how long it takes and how long the price holds.</li>
<li><strong>Price by stage:</strong> groundworks, structure, roof, first fix, second fix and finishes, each with labour and materials, so a change in one stage does not unravel the rest.</li>
<li><strong>Provisional sums:</strong> allowances for work nobody can price yet, such as drainage that depends on a survey. Mark each one as subject to change.</li>
<li><strong>Prime cost (PC) sums:</strong> allowances for items the client will choose, such as a kitchen or tiles. Say what the allowance buys and what you charge to fit it.</li>
<li><strong>Exclusions:</strong> planning and building control fees, structural engineer, party wall costs, decoration and anything else you have not priced.</li>
<li><strong>Payment schedule:</strong> tied to stages the client can see, never a large sum far ahead of the work.</li>
<li><strong>Variations:</strong> priced and agreed in writing before the work is done, with the effect on the end date.</li>
</ul>
<p>Quoting only the labour of a trade, with the client buying the materials? Use the <a href="/labour-quotation-format">labour quotation format</a>: it has the fields, per-unit and day-rate pricing, and a free Word and Excel file.</p>

<h2 id="example">Example: single-storey rear extension</h2>
<p>A quote for a rear extension, laid out by stage. Prices are examples only.</p>
<table>
<thead><tr><th>Stage</th><th class="n">Amount</th></tr></thead>
<tbody>
<tr><td>Groundworks and foundations</td><td class="n">&pound;7,800</td></tr>
<tr><td>Blockwork, brickwork and steel installation</td><td class="n">&pound;11,200</td></tr>
<tr><td>Roof structure and covering</td><td class="n">&pound;6,400</td></tr>
<tr><td>First and second fix: electrics and plumbing</td><td class="n">&pound;4,900</td></tr>
<tr><td>Plastering and finishes</td><td class="n">&pound;3,600</td></tr>
<tr><td>Provisional sum: drainage alterations (subject to survey)</td><td class="n">&pound;1,500</td></tr>
<tr><td><strong>Subtotal, excluding VAT</strong></td><td class="n"><strong>&pound;35,400</strong></td></tr>
<tr><td>VAT at 20%</td><td class="n">&pound;7,080</td></tr>
<tr><td><strong>Total including VAT</strong></td><td class="n"><strong>&pound;42,480</strong></td></tr>
</tbody></table>
${load('builder', 'Load this extension example into the quote maker')}

<h2 id="payments">Stage payments for the same job</h2>
<p>Each payment follows a stage the client can see. The amounts below are percentages of the &pound;35,400 subtotal, before VAT.</p>
<table>
<thead><tr><th>Stage</th><th class="n">Share</th><th class="n">Amount</th></tr></thead>
<tbody>
<tr><td>On acceptance, to book the start date</td><td class="n">10%</td><td class="n">&pound;3,540</td></tr>
<tr><td>Groundworks and structure complete</td><td class="n">25%</td><td class="n">&pound;8,850</td></tr>
<tr><td>Roof watertight</td><td class="n">25%</td><td class="n">&pound;8,850</td></tr>
<tr><td>First fix complete</td><td class="n">25%</td><td class="n">&pound;8,850</td></tr>
<tr><td>Completion and snagging done</td><td class="n">15%</td><td class="n">&pound;5,310</td></tr>
</tbody></table>
<p>A small final payment is a reason for the client to wait for snagging to be finished. Write what counts as complete next to each stage, for example that the roof is watertight when the covering and flashings are on.</p>

<h2 id="sums">Provisional sums and prime cost sums</h2>
<p>Both are placeholders, but they mean different things, and mixing them up is how a quote turns into a dispute.</p>
<table>
<thead><tr><th></th><th>Provisional sum</th><th>Prime cost sum</th></tr></thead>
<tbody>
<tr><td>What it covers</td><td>Work you cannot price yet</td><td>An item the client has not chosen yet</td></tr>
<tr><td>Example</td><td>Drainage, subject to a survey</td><td>Kitchen units, tiles, a sanitaryware set</td></tr>
<tr><td>What changes</td><td>The scope and price once the facts are known</td><td>The price of the item, to match what is chosen</td></tr>
<tr><td>What stays fixed</td><td>Your day rates and margins</td><td>Your fitting charge and handling margin</td></tr>
<tr><td>Where to write it</td><td>Its own line, marked as subject to change</td><td>Its own line, with what the allowance buys</td></tr>
</tbody></table>
<p>Load the loft conversion example to see a prime cost sum as a quote line.</p>
${load('builder-loft', 'Load the loft conversion example')}

<h2 id="vat">VAT on building work</h2>
<ul>
<li><strong>Rates:</strong> most building work on houses and flats is standard-rated at 20%. Building a new house or flat is zero-rated, and converting a building into homes or renovating an empty home can qualify for the 5% rate. See ${a('https://www.gov.uk/vat-builders', 'GOV.UK: VAT for builders')}.</li>
<li><strong>Domestic reverse charge:</strong> where it applies, a VAT-registered business that supplies building services to another VAT-registered business in the Construction Industry Scheme does not charge VAT; the customer accounts for it. It covers most construction work, including installing heating, electrical and drainage systems and site work such as scaffolding. See ${a('https://www.gov.uk/guidance/vat-domestic-reverse-charge-for-building-and-construction-services', 'GOV.UK: the VAT domestic reverse charge for building and construction services')}. Say on the quote which VAT treatment you expect, because it changes the total your customer pays.</li>
<li><strong>Late payment:</strong> for business customers the statutory interest is 8% plus the Bank of England base rate, with a fixed sum of &pound;40, &pound;70 or &pound;100 by size of debt. See ${a('https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt', 'GOV.UK: charging interest on late commercial payments')}.</li>
</ul>
<p>The <a href="/blog/vat-on-quotes-explained">guide to VAT on quotes</a> shows how to lay out VAT on the page.</p>

<h2 id="wording">Building quote wording to copy</h2>
<p>Replace everything in square brackets. This is general wording, not legal advice; have a solicitor check a contract for larger projects.</p>
${tpl('bdsummary', 'Project summary and exclusions', `Project: [single-storey rear extension of about 20 square metres] at [address], for [client name].

Start: [date]. Expected duration: [14 weeks], depending on weather, access and decisions on provisional and prime cost items.

Not included: planning and building control fees, structural engineer, party wall costs, kitchen supply, decoration and flooring. We can quote any of these separately.`)}
${tpl('bdsums', 'Provisional and prime cost sums', `Provisional sums are allowances for work that cannot be priced until [a survey]. They are marked on the quote. The final price follows the work found, at the day rates in this quotation.

Prime cost sums are allowances for items you choose. If your choice costs more or less than the allowance, the difference is added to or taken off the price, and our fitting charge stays as quoted.`)}
${tpl('bdvar', 'Variations, payment and validity', `Variations: any change to the work above is priced in writing, with its effect on the end date, and agreed by you before we carry it out.

Payment: [10]% on acceptance, then on completion of each stage in the payment schedule. Invoices are due within [7] days.

This quotation is valid until [date]. To accept, sign and return it or reply to the email it came with.`)}
${FOLLOW_UP}
<p>For smaller jobs use the <a href="/quote-template-contractor">contractor and tradesman quote template</a>; for the plumbing inside a build, the <a href="/quote-template-plumber">plumber quote template</a> has the call-out and guarantee lines.</p>`,
  faq: [
    { q: 'What should a builder\'s quote include?', a: 'A project summary with start date and duration, the price broken down by stage, provisional and prime cost sums marked as such, exclusions, a payment schedule tied to stages, how variations are handled, the VAT treatment and a valid-until date.' },
    { q: 'What is a provisional sum in a building quote?', a: 'An allowance for work that cannot be priced yet, such as drainage that depends on a survey. It is marked as subject to change, and the final price follows the work that is actually needed.' },
    { q: 'What is a prime cost sum?', a: 'An allowance for an item the client has not chosen yet, such as a kitchen or tiles. The final price follows what is chosen. Your fitting charge and handling margin stay as quoted.' },
    { q: 'How should stage payments be set for building work?', a: 'Tie each payment to a stage the client can see, such as groundworks complete or roof watertight, and keep a final share for completion and snagging. Avoid asking for a large sum far ahead of the work.' },
    { q: 'How do I handle changes to the work once the client accepts?', a: 'Add a variations clause: any change is priced in writing, with the effect on the end date, and agreed before it is carried out. Send the price each time, so nothing is settled by memory at the end.' },
    { q: 'Do I charge VAT on building work?', a: 'If you are VAT registered, most building work on a home is standard-rated at 20%, with zero or reduced rates for some jobs, and the domestic reverse charge applies to many supplies between VAT-registered businesses in the Construction Industry Scheme. Check the GOV.UK pages linked above for your job.' },
    { q: 'Is this builder quote template free?', a: 'Yes. Download the Word or Excel version, or fill it in online and download a PDF. No signup. The Excel version adds up the lines, VAT and total for you.' }
  ]
};

// ---------------------------------------------------------------------------------------------------------------------
const IT_SUPPORT = {
  title: 'IT Support Quote Template: Free Word & Excel Download',
  desc: 'Free IT support quote template: one-off work and monthly support per user or device, response times and licences. Word, Excel or fill in online.',
  h1: 'IT support quote template',
  lead: 'A free IT support quote template for freelancers, managed service providers and in-house teams quoting a client. Price one-off setup and migrations, add monthly support per user or per device, and write down the hours, response times and what is not covered. Download it in Word or Excel, or load an example and fill it in online.',
  updated: '2026-11-10',
  published: '2026-09-02',
  custom: true,
  heroCta: { preset: 'it-managed', label: 'Load an example managed support quote' },
  downloads: [
    {
      title: 'IT support quote template (UK)',
      desc: 'Pounds, VAT at 20% shown separately, one-off work, monthly support, support hours, response times and licence terms.',
      files: [['/templates/it-support-quote-template.docx', 'Word'], ['/templates/it-support-quote-template.xlsx', 'Excel']],
      preset: 'it-managed'
    }
  ],
  presetButtons: [
    { key: 'it-managed', label: 'Managed support, 12-person office' },
    { key: 'it-support', label: 'Laptop setup and email migration' }
  ],
  presets: {
    'it-managed': {
      label: 'Managed IT support quote (example prices)', currency: 'GBP', taxRate: 20, taxLabel: 'VAT', validDays: 30,
      items: [
        ['Onboarding: audit of 12 users and 14 devices, documentation, monitoring agent install', 1, 450],
        ['Monthly support per user: remote help desk, account changes (12 users)', 12, 28],
        ['Monthly monitoring and patching per device (14 devices)', 14, 6],
        ['Monthly backup monitoring and weekly restore check', 1, 40]
      ],
      notes: 'The first line is billed once; the other lines are monthly, billed in advance.\nSupport hours: Monday to Friday, 9:00 to 17:30. Urgent issues answered within 1 hour, normal issues within 4 working hours.\nNot included: on-site visits, new hardware, projects. Licences are billed at cost and stay in your name.\n12-month term, then rolling monthly with 30 days notice. Valid for 30 days.'
    }
  },
  guide: `
<h2 id="what-to-include">What an IT support quote includes</h2>
<p>A client choosing an IT provider wants to know what is covered, how fast a problem gets answered and what they will pay in a normal month. These are the parts that answer those questions:</p>
<ul>
<li><strong>Scope:</strong> the systems, sites, users and devices covered, and what the client has today.</li>
<li><strong>One-off work:</strong> setup, migrations and onboarding, priced per device, per user or as a fixed project fee.</li>
<li><strong>Monthly support:</strong> the unit you charge (per user, per device or a flat fee), what it includes and the hours you answer the phone.</li>
<li><strong>Response times:</strong> by severity, for example a system down, a single user blocked and a routine request.</li>
<li><strong>Licences and hardware:</strong> listed separately, with whether they are billed at cost or with a fee, and whose name the accounts are in.</li>
<li><strong>Exclusions:</strong> on-site visits, new hardware, project work, out-of-hours calls and problems caused by software the client installs.</li>
<li><strong>Term and cancellation:</strong> the length of the first term and the notice to cancel after it.</li>
</ul>

<h2 id="pricing">How to price IT support</h2>
<table>
<thead><tr><th>Model</th><th>How it works</th><th>Good for</th></tr></thead>
<tbody>
<tr><td>Per user per month</td><td>A set fee for each person, covering their devices and accounts</td><td>Small offices where each person has one or two devices</td></tr>
<tr><td>Per device per month</td><td>A set fee for each laptop, desktop or server you monitor</td><td>Sites with shared machines, servers or a mix of device types</td></tr>
<tr><td>Block of hours</td><td>Prepaid hours at a lower rate, with a rate for hours above the block</td><td>Clients who want occasional help and no monthly commitment</td></tr>
<tr><td>Fixed project fee</td><td>One price for a defined piece of work with a written scope</td><td>Migrations, new office setups and replacements</td></tr>
</tbody></table>
<p>To work out a per-user fee, add the monthly cost of your tools and your time for the average user, then add a margin. A client with 12 users at &pound;28 each pays &pound;336 a month for support; 14 monitored devices at &pound;6 add &pound;84, and a &pound;40 backup check brings the monthly total to &pound;460, plus a one-off onboarding fee.</p>

<h2 id="example">Example: managed support for a 12-person office</h2>
<table>
<thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead>
<tbody>
<tr><td>Onboarding: audit, documentation, monitoring agent install (one-off)</td><td class="n">1</td><td class="n">&pound;450</td><td class="n">&pound;450</td></tr>
<tr><td>Support per user per month</td><td class="n">12</td><td class="n">&pound;28</td><td class="n">&pound;336</td></tr>
<tr><td>Monitoring and patching per device per month</td><td class="n">14</td><td class="n">&pound;6</td><td class="n">&pound;84</td></tr>
<tr><td>Backup monitoring and weekly restore check, per month</td><td class="n">1</td><td class="n">&pound;40</td><td class="n">&pound;40</td></tr>
<tr><td colspan="3">First month, excluding VAT</td><td class="n">&pound;910</td></tr>
<tr><td colspan="3">VAT at 20% (only if you are VAT registered)</td><td class="n">&pound;182</td></tr>
<tr><td colspan="3"><strong>First month including VAT</strong></td><td class="n"><strong>&pound;1,092</strong></td></tr>
</tbody></table>
<p>Later months cost &pound;460 plus VAT, since the onboarding fee is billed once.</p>
${load('it-managed', 'Load this managed support example into the quote maker')}

<h2 id="response">Response times in plain words</h2>
<table>
<thead><tr><th>Level</th><th>What it means</th><th>Example response</th></tr></thead>
<tbody>
<tr><td>Urgent</td><td>A system or the whole office is down</td><td>Within 1 hour in support hours</td></tr>
<tr><td>Normal</td><td>One user cannot work or a feature is broken</td><td>Within 4 working hours</td></tr>
<tr><td>Request</td><td>A new starter, a leaver, a software install</td><td>Within 1 working day</td></tr>
</tbody></table>
<p>Quote what you can meet on a bad day. A response time you miss twice costs more than a longer one you always hit.</p>

<h2 id="wording">IT support quote wording to copy</h2>
<p>Replace everything in square brackets. This is general wording, not legal advice; have a solicitor check a service contract for larger clients.</p>
${tpl('itscope', 'Scope and exclusions', `Scope: remote support, monitoring and patching for [12] users and [14] devices at [company name], covering [Microsoft 365 accounts, laptops, the office network and cloud backups].

Not included: on-site visits, new hardware, project work and problems caused by software you install without telling us. We can quote any of these separately.`)}
${tpl('ithours', 'Support hours and response times', `Support hours: [Monday to Friday, 9:00 to 17:30], excluding public holidays. Work outside these hours is billed at [1.5] times the hourly rate.

Response times in support hours: urgent (a system or the office is down) within [1 hour]; normal within [4 working hours]; requests within [1 working day].`)}
${tpl('itterms', 'Licences, term and payment', `Licences: software and cloud licences are billed [at cost] and stay in your name, so you keep them if you leave.

Term: [12] months from [start date], then rolling monthly. After the first term either side can cancel with [30] days notice.

Payment: monthly in advance, due within [14] days. This quotation is valid until [date]. To accept, sign and return it or reply to the email it came with.`)}
${FOLLOW_UP}
<p>If you also sell setup work, the <a href="/quote-template-web-designer">web design quote template</a> shows how to price milestones, and the <a href="/quote-template-consultant">consulting quote template</a> covers day rates and fixed fees.</p>`,
  faq: [
    { q: 'What should an IT support quote include?', a: 'The scope (systems, users and devices), one-off work with its price, the monthly support fee and what it covers, support hours and response times, licences and hardware as separate lines, exclusions, the length of the term, the notice to cancel and a valid-until date.' },
    { q: 'Should I price IT support per user or per device?', a: 'Per user suits small offices where each person has one or two devices and the client thinks in people. Per device suits shared machines and servers. Many quotes use both: a fee per user for help desk and a fee per device for monitoring and patching.' },
    { q: 'How do I price a managed IT support contract?', a: 'Add up the monthly cost of your tools and your time for the average user, then add a margin. Show the unit price and the number of units on the quote, so the client can see how the total changes when they add a person.' },
    { q: 'Should software licences be in the quote?', a: 'List them as their own lines and say whether you bill them at cost or with a handling fee. Keep the accounts in the client\'s name, so they keep the licences if they change provider.' },
    { q: 'What response times should I promise?', a: 'Promise what you can meet on a bad day. A common split is one hour for urgent problems, four working hours for normal ones and one working day for requests, all within stated support hours.' },
    { q: 'How long should an IT support contract run?', a: 'Twelve months is common for monthly support, then rolling monthly with 30 days notice. Project work is quoted separately and ends when the project does.' },
    { q: 'Is this IT support quote template free?', a: 'Yes. Download the Word or Excel version, or fill it in online and download a PDF. No signup. The example managed support quote loads in one click and you can change every line.' }
  ]
};

module.exports = { PLUMBER, BUILDER, IT_SUPPORT };
