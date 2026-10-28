// Rich content for the profession template pages that earn the most impressions.
const { tpl } = require('./helpers');

const LAST_CHECKED = '7 October 2026';

const load = (key, label) => '<p><button type="button" class="btn ghost" data-preset="' + key + '" style="cursor:pointer;font-size:13px;padding:9px 16px">' + label + '</button></p>';

const CONTRACTOR = {
  title: 'Free Contractor & Tradesman Quote Template: Word, Excel, PDF',
  desc: 'Free contractor and tradesman quote template to download in Word, Excel or PDF, or fill in online. UK version with a VAT line, payment terms, validity and acceptance.',
  h1: 'Contractor and tradesman quote template',
  badge: 'Free download: Word, Excel and PDF',
  lead: 'Download a free contractor quote template in Word, Excel or PDF, or fill one in online and download a finished PDF. The UK tradesman version has a VAT line, payment terms, a validity date and a signature box for the client.',
  updated: '2026-10-07',
  heroCta: { preset: 'tradesman-uk', label: 'Fill in the tradesman template online' },
  downloads: [
    { title: 'UK tradesman quote template', desc: 'Pounds, VAT at 20% shown separately, deposit and balance terms, 30-day validity, client signature.', files: [
      ['/templates/tradesman-quote-template.docx', 'Word'], ['/templates/tradesman-quote-template.xlsx', 'Excel'], ['/templates/tradesman-quote-template.pdf', 'PDF']], preset: 'tradesman-uk' },
    { title: 'Contractor quote template', desc: 'Any currency. Labour, materials, equipment and subcontract lines, tax rate cell, stage payments and change orders.', files: [
      ['/templates/contractor-quote-template.docx', 'Word'], ['/templates/contractor-quote-template.xlsx', 'Excel'], ['/templates/contractor-quote-template.pdf', 'PDF']], preset: 'contractor-us' }
  ],
  presetButtons: [
    { key: 'tradesman-uk', label: 'UK tradesman (VAT)' },
    { key: 'contractor-us', label: 'General contractor' },
    { key: 'labour-only', label: 'Labour only' },
    { key: 'carpentry-uk', label: 'Carpentry' }
  ],
  guide: `
<h2 id="whats-in-it">What the contractor quote template includes</h2>
<p>The Word, Excel and PDF versions share one layout, the same layout the online quote maker produces. Fill in the parts that apply to your job:</p>
<table>
<thead><tr><th>Section</th><th>What to put in it</th></tr></thead>
<tbody>
<tr><td>Your details</td><td>Business name, address, phone, email. Your VAT number if you are VAT registered (UK), or your licence number where your state or country requires one.</td></tr>
<tr><td>Client and site</td><td>Client name, billing address and the site address if it is different.</td></tr>
<tr><td>Quote number, date, valid until</td><td>A unique number such as Q-2026-031, so the quote, emails and invoice all match.</td></tr>
<tr><td>Scope of work</td><td>A plain description of the job, the rooms or areas, and the finish the client will get.</td></tr>
<tr><td>Itemised price</td><td>Labour, materials, plant or equipment hire, subcontractors and waste removal on separate lines, each with a quantity and rate.</td></tr>
<tr><td>Exclusions</td><td>What is not included: decorating, permits, making good after other trades, hidden defects.</td></tr>
<tr><td>Tax</td><td>A VAT, GST or sales tax line under the subtotal, and the total including tax.</td></tr>
<tr><td>Payment terms</td><td>Deposit, stage payments and when the balance is due.</td></tr>
<tr><td>Variations</td><td>How changes are priced and agreed: in writing, before the work.</td></tr>
<tr><td>Acceptance</td><td>How the client accepts, with a signature and date line.</td></tr>
</tbody></table>
<p>The Excel version adds the totals for you: enter quantities and rates in the yellow cells and the line amounts, subtotal, tax and total update. The Word and PDF versions are for typing or writing in by hand.</p>

<h2 id="tradesman-example">Example: a UK tradesman quote</h2>
<p>A small refit job priced with the UK tradesman template. Prices are examples only.</p>
<table>
<thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead>
<tbody>
<tr><td>Labour: remove existing units and prepare walls (days)</td><td class="n">2</td><td class="n">&pound;320.00</td><td class="n">&pound;640.00</td></tr>
<tr><td>Labour: installation and first fix (days)</td><td class="n">3</td><td class="n">&pound;320.00</td><td class="n">&pound;960.00</td></tr>
<tr><td>Materials: timber, fixings, adhesives and sealants</td><td class="n">1</td><td class="n">&pound;485.00</td><td class="n">&pound;485.00</td></tr>
<tr><td>Skip hire and waste removal</td><td class="n">1</td><td class="n">&pound;260.00</td><td class="n">&pound;260.00</td></tr>
<tr><td>Making good and clean down on completion</td><td class="n">1</td><td class="n">&pound;140.00</td><td class="n">&pound;140.00</td></tr>
<tr><td colspan="3"><strong>Subtotal</strong></td><td class="n"><strong>&pound;2,485.00</strong></td></tr>
<tr><td colspan="3">VAT at 20%</td><td class="n">&pound;497.00</td></tr>
<tr><td colspan="3"><strong>Total including VAT</strong></td><td class="n"><strong>&pound;2,982.00</strong></td></tr>
</tbody></table>
${load('tradesman-uk', 'Load this example into the quote maker')}

<h2 id="uk-vat">UK tradesman quotes: VAT, consumer prices and cancellation</h2>
<ul>
<li><strong>Only add VAT if you are VAT registered.</strong> The standard rate is 20% (<a href="https://www.gov.uk/vat-rates" rel="nofollow noopener" target="_blank">GOV.UK VAT rates</a>). You must register once your taxable turnover goes over &pound;90,000 in the last 12 months (<a href="https://www.gov.uk/register-for-vat" rel="nofollow noopener" target="_blank">GOV.UK: register for VAT</a>). If you are not registered, set the tax line to 0 and don&rsquo;t mention VAT.</li>
<li><strong>Show the net price, the VAT and the total</strong> as separate lines, and add your VAT number. It isn&rsquo;t an invoice, but the client can check the figures will match the VAT invoice later.</li>
<li><strong>Homeowners should see the full price up front.</strong> UK guidance says prices for consumers must include VAT and any other mandatory charges (<a href="https://www.gov.uk/government/publications/price-transparency-cma209/providing-clear-and-accurate-information-about-prices-summary" rel="nofollow noopener" target="_blank">CMA price transparency guidance</a>). Lead with the VAT-inclusive total.</li>
<li><strong>Quote or estimate?</strong> Citizens Advice describes a quote as "a promise to do work at an agreed price" and an estimate as "the trader&rsquo;s best guess" (<a href="https://www.citizensadvice.org.uk/consumer/getting-home-improvements-done/problem-with-home-improvements/" rel="nofollow noopener" target="_blank">Citizens Advice</a>). Call it a quote only if the price is fixed for the work described.</li>
<li><strong>Jobs agreed at the customer&rsquo;s home.</strong> A consumer who agrees a contract away from your premises generally has 14 days to cancel a services contract (<a href="https://www.legislation.gov.uk/uksi/2013/3134/regulation/30" rel="nofollow noopener" target="_blank">Consumer Contracts Regulations 2013</a>; <a href="https://www.citizensadvice.org.uk/consumer/getting-home-improvements-done/cancelling-building-or-decorating-work/" rel="nofollow noopener" target="_blank">Citizens Advice on cancelling building work</a>).</li>
</ul>
<p class="src">Last checked ${LAST_CHECKED}. General information, not legal or tax advice.</p>

<h3>Payment terms you can copy</h3>
${tpl('pay', 'Payment terms wording', `Payment terms: a deposit of [25%] ([amount]) is due on acceptance to book the start date and order materials. The balance is due within [7] days of completion, by bank transfer to [account name, sort code, account number].

For larger jobs: [20%] deposit on acceptance, [40%] on completion of [first fix], [40%] on completion.

Any work not listed in this quote will be priced and agreed with you in writing before it is carried out.`)}

<h3>Validity and exclusions wording</h3>
${tpl('valid', 'Validity and exclusions', `This quotation is valid for [30] days from the date above. After that, prices may change to reflect current material costs.

Not included: [decorating; building control or planning fees; skip permits; making good after other trades]. Hidden defects found once work starts, for example rotten timbers or faulty existing wiring, are not included and will be quoted separately before any extra work is done.`)}

<h2 id="contractor-format">Contractor quotation format</h2>
<p>For bigger jobs, set the quote out so the client can compare it line by line with other bids:</p>
<ol>
<li><strong>Project and site details:</strong> address, a short description of the work and the date of your site visit.</li>
<li><strong>Itemised work:</strong> each stage or task with quantity, unit (m&sup2;, sq ft, linear metre, day), rate and amount.</li>
<li><strong>Materials:</strong> itemised or as an allowance, and who supplies what.</li>
<li><strong>Exclusions:</strong> permits, skip hire, making good after other trades, unforeseen structural work.</li>
<li><strong>Stage payments:</strong> tied to stages that are easy to check, never a large sum far ahead of the work.</li>
<li><strong>Variations or change orders:</strong> priced and signed off in writing before the work.</li>
<li><strong>Validity, start date and duration.</strong></li>
</ol>
${load('contractor-us', 'Load a general contractor example')}

<h2 id="labour-only">Labour contractor quotation format (labour only)</h2>
<p>When the client supplies materials, quote labour by unit of work so the price follows the measured quantities. Example rates in rupees; change the currency in the quote maker.</p>
<table>
<thead><tr><th>Work item (labour only)</th><th>Unit</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead>
<tbody>
<tr><td>Brickwork, 9 inch wall</td><td>sq ft</td><td class="n">450</td><td class="n">&#8377;32</td><td class="n">&#8377;14,400</td></tr>
<tr><td>Internal plastering</td><td>sq ft</td><td class="n">1,200</td><td class="n">&#8377;18</td><td class="n">&#8377;21,600</td></tr>
<tr><td>Floor tiling</td><td>sq ft</td><td class="n">380</td><td class="n">&#8377;28</td><td class="n">&#8377;10,640</td></tr>
<tr><td>Site cleaning and debris stacking</td><td>lump sum</td><td class="n">1</td><td class="n">&#8377;3,500</td><td class="n">&#8377;3,500</td></tr>
<tr><td colspan="4"><strong>Total labour (before GST)</strong></td><td class="n"><strong>&#8377;50,140</strong></td></tr>
</tbody></table>
<p>State clearly that materials, scaffolding, water and electricity are supplied by the client, that the final bill uses measured quantities, and who clears the site. In India the standard GST rate is 18% (<a href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2163555" rel="nofollow noopener" target="_blank">PIB, 56th GST Council</a>); confirm the rate that applies to your work.</p>
${load('labour-only', 'Load the labour-only example')}

<h2 id="carpentry">Carpentry and joinery quotes</h2>
<p>Carpenters usually price per item (per door hung, per window board), per linear metre (skirting, architrave, worktops) or per piece for fitted furniture. Say who supplies the timber and ironmongery, whether the price includes finishing or painting, and how long fitted pieces take to make.</p>
<table>
<thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead>
<tbody>
<tr><td>Supply and hang internal doors, including hinges and handles</td><td class="n">5</td><td class="n">&pound;145</td><td class="n">&pound;725</td></tr>
<tr><td>Fit new architrave and skirting (linear metres)</td><td class="n">38</td><td class="n">&pound;12</td><td class="n">&pound;456</td></tr>
<tr><td>Fitted alcove cupboards in MDF, primed</td><td class="n">2</td><td class="n">&pound;680</td><td class="n">&pound;1,360</td></tr>
<tr><td>Collection of materials and waste removal</td><td class="n">1</td><td class="n">&pound;90</td><td class="n">&pound;90</td></tr>
<tr><td colspan="3"><strong>Subtotal (VAT added if registered)</strong></td><td class="n"><strong>&pound;2,631</strong></td></tr>
</tbody></table>
${load('carpentry-uk', 'Load the carpentry example')}

<h2 id="send">Sending the quote and getting a yes</h2>
<p>Send the PDF with a short email that states the total, what it covers and how to accept. Copy one of our <a href="/how-to-send-a-quote-to-a-client">quote email templates</a>, and when the client says yes, confirm it in writing with the <a href="/quote-acceptance-template">quote acceptance wording</a>. Building a larger project quote with provisional sums? See the <a href="/quote-template-builder">builder quote template</a>.</p>`,
  faq: [
    { q: 'Is this contractor quote template free?', a: 'Yes. The Word, Excel and PDF templates are free to download with no signup, and the online quote maker is free too. Pro ($9 one-time) only removes the small "Made with GetQuotationMaker" line from PDFs made online, adds your logo and lets you turn a quote into an invoice.' },
    { q: 'Is there a tradesman quote template for the UK?', a: 'Yes. The UK tradesman quote template is in pounds, shows VAT at 20% on its own line, and includes deposit and balance payment terms, a 30-day validity date and a signature box. If you are not VAT registered, set the VAT rate to 0.' },
    { q: 'Can I use the template in Google Docs or Google Sheets?', a: 'Yes. Upload the .docx file to Google Drive and open it with Google Docs, or upload the .xlsx file and open it with Google Sheets. The Excel formulas for line amounts, subtotal, tax and total work in Google Sheets.' },
    { q: 'Do I have to put VAT on my quote?', a: 'Only if you are VAT registered. In the UK you must register once your taxable turnover goes over £90,000 in a 12-month period, and the standard rate is 20%. If you are registered, show the net price, the VAT and the total, and give homeowners the VAT-inclusive total up front.' },
    { q: 'What is the difference between a quote and an estimate?', a: 'A quote is a fixed price for the work described. An estimate is a best guess that can change. If unknowns could change the price, either call it an estimate or exclude those unknowns and say they will be priced separately.' },
    { q: 'How long should a contractor quote be valid?', a: 'Thirty days is common. Use a shorter period, such as 14 days, when material prices are moving, and always write the actual date on the quote rather than only the number of days.' },
    { q: 'What payment terms should a tradesman put on a quote?', a: 'Small jobs: payment on completion, or a small deposit for materials. Larger jobs: a deposit on acceptance and stage payments tied to stages that are easy to check, with the balance on completion. Say how to pay and when each payment is due.' }
  ]
};

const PAINTER = {
  title: 'Painting Quote Template: Free Word, Excel & PDF Download',
  desc: 'Free painting and decorating quote template in Word, Excel and PDF, plus an online quote maker. Example quotation, pricing per room or m², wording to copy.',
  h1: 'Painting quote template (painting and decorating)',
  badge: 'Free download: Word, Excel and PDF',
  lead: 'A free painting quotation template for painters and decorators. Download it in Word, Excel or PDF, or fill it in online and download a finished PDF. It covers rooms and surfaces, preparation, paint and number of coats, exclusions, VAT and payment terms.',
  updated: '2026-10-07',
  heroCta: { preset: 'painting-interior-uk', label: 'Fill in the painting template online' },
  downloads: [
    { title: 'Painting and decorating quote template', desc: 'Areas and surfaces, preparation, paint system and coats, who supplies paint, exclusions, tax line, payment terms and client signature.', files: [
      ['/templates/painting-quote-template.docx', 'Word'], ['/templates/painting-quote-template.xlsx', 'Excel'], ['/templates/painting-quote-template.pdf', 'PDF']], preset: 'painting-interior-uk' }
  ],
  presetButtons: [
    { key: 'painting-interior-uk', label: 'Interior decorating (UK, VAT)' },
    { key: 'painting-exterior-us', label: 'Exterior house painting' },
    { key: 'painting-commercial', label: 'Commercial, per m²' }
  ],
  guide: `
<h2 id="what-to-include">What to include in a painting quote</h2>
<ul>
<li><strong>Areas and surfaces:</strong> each room or elevation, and what gets painted in it: walls, ceilings, woodwork, doors, radiators, exterior render or siding.</li>
<li><strong>Preparation:</strong> filling, sanding, caulking, stain block, mist coats on new plaster, and what is not included (re-plastering, rotten wood repair).</li>
<li><strong>Paint system:</strong> brand and range, finish (matt, eggshell, satin, gloss) and the number of coats for each surface.</li>
<li><strong>Who supplies the paint</strong>, and who chooses colours and by when.</li>
<li><strong>Protection and clean-up:</strong> dust sheets, masking, moving furniture, daily tidy and final clean.</li>
<li><strong>Access:</strong> ladders, towers or scaffolding for stairwells and exteriors.</li>
<li><strong>Price, tax and terms:</strong> itemised price, VAT or sales tax if registered, payment terms, validity date and how to accept.</li>
</ul>

<h2 id="example">Example painting quotation (interior repaint)</h2>
<p>A three-area interior job priced with the template. Prices are examples only.</p>
<table>
<thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead>
<tbody>
<tr><td>Living room: walls and ceiling, 2 coats emulsion, fill minor cracks</td><td class="n">1</td><td class="n">&pound;420</td><td class="n">&pound;420</td></tr>
<tr><td>Hall, stairs and landing: walls, ceiling and woodwork</td><td class="n">1</td><td class="n">&pound;780</td><td class="n">&pound;780</td></tr>
<tr><td>Bedroom 1: walls and ceiling, 2 coats emulsion</td><td class="n">1</td><td class="n">&pound;310</td><td class="n">&pound;310</td></tr>
<tr><td>Doors and frames: sand, undercoat and satinwood</td><td class="n">6</td><td class="n">&pound;65</td><td class="n">&pound;390</td></tr>
<tr><td>Paint and sundries</td><td class="n">1</td><td class="n">&pound;265</td><td class="n">&pound;265</td></tr>
<tr><td>Protection, dust sheets and daily clean-up</td><td class="n">1</td><td class="n">&pound;60</td><td class="n">&pound;60</td></tr>
<tr><td colspan="3"><strong>Subtotal</strong></td><td class="n"><strong>&pound;2,225</strong></td></tr>
<tr><td colspan="3">VAT at 20% (if VAT registered)</td><td class="n">&pound;445</td></tr>
<tr><td colspan="3"><strong>Total</strong></td><td class="n"><strong>&pound;2,670</strong></td></tr>
</tbody></table>
${load('painting-interior-uk', 'Load this example into the quote maker')}

<h2 id="pricing">How to price a painting job</h2>
<p>Most painters use one of three methods. Whichever you use, the quote should still list the areas, so the client can see what is included.</p>
<table>
<thead><tr><th>Method</th><th>How it works</th><th>Good for</th></tr></thead>
<tbody>
<tr><td>Per room or area</td><td>A fixed price for each room, based on size, condition and number of coats</td><td>Domestic interiors; easy for homeowners to compare</td></tr>
<tr><td>Per m&sup2; or sq ft</td><td>Measured surface area &times; your rate for that surface and finish</td><td>Commercial work, new builds, exteriors</td></tr>
<tr><td>Day rate</td><td>Days needed &times; your day rate, plus materials</td><td>Small or awkward jobs where measuring isn&rsquo;t practical</td></tr>
</tbody></table>
<h3>Working out wall area and paint</h3>
<ol>
<li><strong>Wall area:</strong> perimeter &times; height. A 4.2 m &times; 3.6 m room with 2.4 m walls: (4.2 + 3.6) &times; 2 = 15.6 m, &times; 2.4 = 37.4 m&sup2;.</li>
<li><strong>Take off doors and windows:</strong> 37.4 &minus; 1.9 (door) &minus; 1.8 (window) = about 33.7 m&sup2;.</li>
<li><strong>Multiply by coats:</strong> 2 coats = about 67 m&sup2; of coverage.</li>
<li><strong>Divide by the coverage on the tin.</strong> If the manufacturer gives 12 m&sup2; per litre, that is about 5.6 litres. Coverage varies by product and surface, so use the figure on the data sheet.</li>
<li><strong>Price it:</strong> area &times; your rate per m&sup2;, or the hours it will take &times; your hourly rate, plus paint and sundries.</li>
</ol>

<h2 id="uk">Painting and decorating quote template (UK)</h2>
<ul>
<li><strong>VAT:</strong> add VAT at 20% only if you are VAT registered (<a href="https://www.gov.uk/vat-rates" rel="nofollow noopener" target="_blank">GOV.UK VAT rates</a>). Registration is required once taxable turnover goes over &pound;90,000 in 12 months (<a href="https://www.gov.uk/register-for-vat" rel="nofollow noopener" target="_blank">GOV.UK</a>).</li>
<li><strong>Homeowners</strong> should see the full price including VAT up front (<a href="https://www.gov.uk/government/publications/price-transparency-cma209/providing-clear-and-accurate-information-about-prices-summary" rel="nofollow noopener" target="_blank">CMA guidance</a>).</li>
<li><strong>Agreed at the customer&rsquo;s home?</strong> Consumers generally have a 14-day cooling-off period for decorating work agreed away from your premises (<a href="https://www.citizensadvice.org.uk/consumer/getting-home-improvements-done/cancelling-building-or-decorating-work/" rel="nofollow noopener" target="_blank">Citizens Advice</a>).</li>
</ul>
<p class="src">Last checked ${LAST_CHECKED}. General information, not legal or tax advice.</p>

<h2 id="wording">Painting quote wording to copy</h2>
${tpl('pscope', 'Scope and preparation', `Scope: [rooms or elevations]. Walls and ceilings: [2] coats of [brand, range, finish]. Woodwork: sand, undercoat and [1] coat of [satinwood or gloss].

Preparation: fill minor cracks and holes, sand, caulk gaps and spot-prime repairs. Mist coat on new plaster where needed.

Not included: re-plastering, wallpaper removal, rotten wood repair, and moving heavy furniture. Any of these can be quoted separately.`)}
${tpl('pterms', 'Paint, access, payment and validity', `Paint: [we supply the paint, included in the price] or [you supply the paint; we will confirm quantities a week before we start]. Colours to be confirmed by [date].

Access: [ladders and tower included] or [scaffolding priced separately].

Payment: [no deposit; payment on completion] or [25% deposit, balance on completion].

This quote is valid for [30] days. To accept, reply to the email this quote came with or sign and return it.`)}

<h2 id="exterior">Exterior painting quotes</h2>
<p>Exterior quotes need a few extra lines: washing or pressure cleaning, scraping and priming bare wood, caulking, repairs to rotten wood (usually priced separately once found), the number of coats on each surface, and a note that start dates depend on dry weather.</p>
${load('painting-exterior-us', 'Load an exterior painting example')}
<p>Once the quote is ready, send it with one of our <a href="/how-to-send-a-quote-to-a-client">quote email templates</a> and give the client <a href="/quote-acceptance-template">clear acceptance wording</a>.</p>`,
  faq: [
    { q: 'What should a painting quote include?', a: 'The rooms or areas, the surfaces in each, preparation work, the paint brand, finish and number of coats, who supplies the paint, protection and clean-up, access equipment, exclusions, the price with any VAT or sales tax, payment terms and a validity date.' },
    { q: 'Is the painting quote template free to download?', a: 'Yes. The Word, Excel and PDF versions are free with no signup. You can also fill in the template online and download a PDF for free.' },
    { q: 'How do I write a quote for painting and decorating?', a: 'Visit the job, measure each area, note the condition and preparation needed, then list each room or surface as a line with its price. Add paint and sundries, protection and access, then exclusions, payment terms and a validity date. The template above has all of these sections.' },
    { q: 'Should I price painting per room or per square metre?', a: 'Per room is easiest for homeowners to understand. Per square metre (or square foot) is more accurate for commercial and exterior work. Either way, list the areas and coats so the client knows exactly what the price covers.' },
    { q: 'How do I work out how much paint a job needs?', a: 'Multiply the wall area by the number of coats, then divide by the coverage the manufacturer gives on the tin or data sheet. Coverage differs between products and surfaces, so use the figure for the paint you will actually use.' },
    { q: 'Should a painting quote include materials?', a: 'Say clearly either way. If you supply the paint, name the brand, range and finish, and include it as its own line. If the client supplies it, say when it needs to be on site and that you will confirm quantities.' },
    { q: 'Do painters charge VAT in the UK?', a: 'Only painters who are VAT registered. Registration is required once taxable turnover goes over £90,000 in 12 months, and the standard rate is 20%. A painter who is not registered must not add VAT.' }
  ]
};

const MECHANIC = {
  title: 'Auto Repair Quote Template: Free Car Repair Quotation PDF',
  desc: 'Free auto repair quote template in Word, Excel and PDF, plus an online car repair quotation maker. Sample quote, parts and labour lines, authorization wording.',
  h1: 'Auto repair quote template (car repair quotation)',
  badge: 'Free download: Word, Excel and PDF',
  lead: 'A free car repair quotation template for mechanics, garages and body shops. Download it in Word, Excel or PDF, or fill it in online with parts and labour lines and download a PDF estimate for your customer.',
  updated: '2026-10-07',
  heroCta: { preset: 'auto-brakes', label: 'Fill in the repair quote online' },
  downloads: [
    { title: 'Auto repair quote template', desc: 'Vehicle details, customer concern and diagnosis, separate parts and labour tables, shop supplies, tax, validity and customer authorization.', files: [
      ['/templates/auto-repair-quote-template.docx', 'Word'], ['/templates/auto-repair-quote-template.xlsx', 'Excel'], ['/templates/auto-repair-quote-template.pdf', 'PDF']], preset: 'auto-brakes' }
  ],
  presetButtons: [
    { key: 'auto-brakes', label: 'Brake repair' },
    { key: 'auto-service-uk', label: 'Service and diagnosis (UK)' },
    { key: 'panel-beating', label: 'Panel beating / body repair' }
  ],
  guide: `
<h2 id="what-goes-on">What goes on an auto repair quote</h2>
<ul>
<li><strong>Vehicle:</strong> year, make and model, registration or VIN, and mileage.</li>
<li><strong>Customer concern:</strong> what the customer described, in their words.</li>
<li><strong>Diagnosis:</strong> what you found, and any diagnostic fee.</li>
<li><strong>Parts:</strong> each part with a part number or description, whether it is OEM, aftermarket or used, the quantity and the price.</li>
<li><strong>Labour:</strong> each job with the hours (book time from a labour guide keeps quotes consistent) multiplied by your hourly rate.</li>
<li><strong>Shop supplies, fluids and disposal</strong> as their own lines.</li>
<li><strong>Tax, total and validity:</strong> parts prices move, so 7 or 14 days is common.</li>
<li><strong>Authorization:</strong> a signature line, and a statement that no extra work will be done without the customer&rsquo;s approval.</li>
</ul>

<h2 id="sample">Sample car repair quotation (brake repair)</h2>
<p>Prices are examples only. Add your local sales tax or VAT.</p>
<table>
<thead><tr><th>Item</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead>
<tbody>
<tr><td>Front brake pads, ceramic</td><td class="n">1 set</td><td class="n">$68.00</td><td class="n">$68.00</td></tr>
<tr><td>Front brake rotors</td><td class="n">2</td><td class="n">$54.00</td><td class="n">$108.00</td></tr>
<tr><td>Labor: replace front pads and rotors</td><td class="n">1.6 h</td><td class="n">$120.00</td><td class="n">$192.00</td></tr>
<tr><td>Brake fluid flush</td><td class="n">1</td><td class="n">$89.00</td><td class="n">$89.00</td></tr>
<tr><td>Shop supplies and disposal</td><td class="n">1</td><td class="n">$15.00</td><td class="n">$15.00</td></tr>
<tr><td colspan="3"><strong>Subtotal before tax</strong></td><td class="n"><strong>$472.00</strong></td></tr>
</tbody></table>
${load('auto-brakes', 'Load this example into the quote maker')}

<h2 id="authorization">Written estimates and authorizing extra work</h2>
<p>Getting the customer&rsquo;s approval before work starts, and again before any extra work, protects the shop and the customer. In some places it is the law:</p>
<ul>
<li><strong>California:</strong> repair dealers must give a written estimated price for parts and labour, and "no work shall be done and no charges shall accrue before authorization to proceed is obtained from the customer". Work beyond the estimate needs the customer&rsquo;s consent (<a href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&amp;sectionNum=9884.9" rel="nofollow noopener" target="_blank">Business and Professions Code &sect;9884.9</a>; <a href="https://www.bar.ca.gov/auto-repairs" rel="nofollow noopener" target="_blank">Bureau of Automotive Repair</a>).</li>
<li><strong>UK:</strong> if a garage does extra work the customer didn&rsquo;t ask for, Citizens Advice tells customers to insist on paying only for the work that was agreed (<a href="https://www.citizensadvice.org.uk/consumer/buying-or-repairing-a-car/problems-with-a-car-repair/" rel="nofollow noopener" target="_blank">Citizens Advice</a>). It also notes that an estimate is a best guess and is not a quote.</li>
</ul>
<p class="src">Last checked ${LAST_CHECKED}. Rules vary by state and country; check yours. General information, not legal advice.</p>
${tpl('auth', 'Authorization wording to copy', `I authorize [shop name] to carry out the repairs listed on this estimate for a total of [amount] including tax. No additional work will be carried out without my approval. If further faults are found, the shop will contact me with a revised price before continuing.

Customer name: ____________________
Signature: ____________________   Date: ____________
Phone for approvals: ____________________`)}

<h2 id="panel-beating">Panel beating and body repair quotation</h2>
<p>Body shop quotes are usually split into strip and refit, panel repair, paint (preparation, primer, base and clear coat, blending into adjacent panels), paint materials and parts. Add the insurance claim number if there is one, and say that hidden damage found after strip-down will be quoted before repair.</p>
${load('panel-beating', 'Load a panel beating example')}

<h2 id="pricing">How to price parts and labour</h2>
<ul>
<li><strong>Labour:</strong> hours &times; your hourly rate. Using book times from a labour guide keeps quotes consistent between technicians.</li>
<li><strong>Diagnostics:</strong> charge separately, and say whether the fee is credited if the customer goes ahead.</li>
<li><strong>Parts:</strong> state OEM, aftermarket or used, and the warranty on each.</li>
<li><strong>Supplies and disposal:</strong> show them as lines rather than hiding them in labour.</li>
</ul>
<p>Send the estimate with a short email that states the total and asks for approval. Our <a href="/how-to-send-a-quote-to-a-client">quote email templates</a> work for repair estimates too.</p>`,
  faq: [
    { q: 'What should a car repair quotation include?', a: 'Vehicle details (make, model, year, registration or VIN, mileage), the customer’s concern, your diagnosis, parts with prices, labour hours and rate, shop supplies and disposal, tax, the total, how long the price is valid, and a signature line authorizing the work.' },
    { q: 'Is an auto repair estimate the same as a quote?', a: 'Not always. An estimate is a best guess that can change; a quote is a fixed price for the work described. Many shops call their document an estimate and get approval before going over it. Use whichever word matches how firm your price is.' },
    { q: 'Can a mechanic charge more than the estimate?', a: 'Not without the customer’s agreement in many places. In California, for example, work beyond the written estimate needs the customer’s consent. Contact the customer with a revised price before doing extra work.' },
    { q: 'How long should a repair quote be valid?', a: 'Seven to fourteen days is common because parts prices and availability change. Write the expiry date on the quote.' },
    { q: 'Is there an auto repair quote template in Excel?', a: 'Yes. The Excel version has separate parts and labour tables with formulas for line amounts, subtotal, tax and total. It also opens in Google Sheets.' },
    { q: 'How do I write a panel beating quotation?', a: 'List strip and refit, panel repair, paint work (preparation, primer, base and clear coat, blending), paint materials and replacement parts as separate lines. Add the vehicle and insurance claim details and a note that hidden damage will be quoted before repair.' }
  ]
};

// Web design page, rebuilt 28 Oct 2026 from Search Console queries: "web design quote template", "web development quote
// template", "web design quotation template", "website quote format", "website quote sample". Prices are examples.
const WEB_DESIGNER = {
  title: 'Web Design and Development Quote Template (Free PDF)',
  desc: 'Free web design and web development quote template. Fill it in online, load a website quotation example with milestones and exclusions, and download a PDF.',
  h1: 'Web design and web development quote template',
  lead: 'A free website quote template for designers, developers and small agencies. Load an example, change the lines to match your project and download a PDF. It prices the work by milestone and says in plain words how many revisions are included, who supplies the content and what happens when the scope changes.',
  updated: '2026-10-28',
  published: '2026-05-06',
  custom: true,
  heroCta: { preset: 'web-designer', label: 'Load an example website quote' },
  presetButtons: [
    { key: 'web-designer', label: 'Small business website (5 pages)' },
    { key: 'web-development', label: 'Custom web development' },
    { key: 'web-maintenance', label: 'Monthly maintenance' }
  ],
  presets: {
    'web-development': {
      label: 'Web development quote (example prices)', currency: 'USD', taxRate: 0, taxLabel: 'Tax', validDays: 30,
      items: [
        ['Discovery, requirements and technical specification', 1, 1800],
        ['UX design: wireframes and 8 screens, 2 rounds of revisions', 1, 3200],
        ['Front-end build, responsive from phone to desktop', 1, 4200],
        ['Back-end, database and admin area', 1, 5600],
        ['Integrations: payments and transactional email', 1, 1500],
        ['Testing, deployment and handover documentation', 1, 1400]
      ],
      notes: 'Payment: 30% to start, 40% when the front-end is approved, 30% before launch.\nAssumptions: the client supplies content, brand assets and third-party accounts by the dates agreed. Work outside this specification is priced as a change request.\nNot included: hosting, domain, third-party licences and fees (billed at cost), ongoing support.\nValid for 30 days.'
    },
    'web-maintenance': {
      label: 'Website maintenance quote (example prices)', currency: 'USD', taxRate: 0, taxLabel: 'Tax', validDays: 30,
      items: [
        ['Monthly maintenance: core, theme and plugin updates, backups', 1, 90],
        ['Content changes, per hour (2 hours a month included)', 2, 60],
        ['Uptime and security monitoring', 1, 30]
      ],
      notes: 'Billed monthly in advance. Rolling contract, 30 days notice to cancel.\nNot included: new pages or features, redesigns, hosting fees. Extra hours are billed at the hourly rate above.\nValid for 30 days.'
    }
  },
  guide: `
<h2 id="what-to-include">What a website quote includes</h2>
<p>A client reading a website quote wants to know what they will get, when, and what it will cost if something changes. These are the parts that answer those questions:</p>
<ul>
<li><strong>Project summary:</strong> one or two lines on the goal, for example a five-page site for a dental practice with online booking.</li>
<li><strong>Pages and features:</strong> the number of page templates, plus each feature as its own line: contact forms, booking, shop, blog, multilingual pages.</li>
<li><strong>Platform:</strong> WordPress, Webflow, Shopify or custom code, and who owns the accounts.</li>
<li><strong>Content:</strong> who writes the copy and supplies photos and logos, and by which date. Late content is the usual reason a launch slips.</li>
<li><strong>Design rounds:</strong> how many rounds of changes each stage includes, and your rate for extra ones.</li>
<li><strong>Milestones and payments:</strong> a deposit, then payments tied to events the client can see, such as design sign-off and launch.</li>
<li><strong>Timeline:</strong> a start date, the milestone dates and the launch date, all depending on content arriving on time.</li>
<li><strong>Exclusions:</strong> domain, hosting, paid plugins and themes, stock photography, copywriting, SEO, training beyond what is listed.</li>
<li><strong>Ongoing costs:</strong> hosting and maintenance as separate, optional lines.</li>
<li><strong>Ownership:</strong> when the finished design and code pass to the client, usually on final payment.</li>
<li><strong>Validity and acceptance:</strong> a valid-until date and one clear way to say yes.</li>
</ul>

<h2 id="example">Example website quote: a five-page business site</h2>
<p>A fixed-fee quote for a small business website, built from the milestones above. Prices are examples only, not market rates.</p>
<table>
<thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead>
<tbody>
<tr><td>Discovery workshop and sitemap</td><td class="n">1</td><td class="n">$600</td><td class="n">$600</td></tr>
<tr><td>Design: 5 page templates, 2 rounds of revisions</td><td class="n">1</td><td class="n">$2,400</td><td class="n">$2,400</td></tr>
<tr><td>Development and CMS setup</td><td class="n">1</td><td class="n">$3,200</td><td class="n">$3,200</td></tr>
<tr><td>Content upload (client supplies copy and images)</td><td class="n">1</td><td class="n">$450</td><td class="n">$450</td></tr>
<tr><td>Launch and 1 hour training</td><td class="n">1</td><td class="n">$250</td><td class="n">$250</td></tr>
<tr><td colspan="3"><strong>Total</strong></td><td class="n"><strong>$6,900</strong></td></tr>
</tbody></table>
<p>Payment in this example: 50% deposit ($3,450), 25% on design sign-off ($1,725) and 25% before launch ($1,725). Domain, hosting, paid plugins, copywriting and stock images are listed as not included.</p>
${load('web-designer', 'Load this example into the quote maker')}

<h2 id="pricing">How to price a website project</h2>
<p>Pick one pricing method and show it on the quote. The line items should still list the work, so the client can see what each part of the fee covers.</p>
<table>
<thead><tr><th>Method</th><th>How it works</th><th>Good for</th></tr></thead>
<tbody>
<tr><td>Fixed fee per milestone</td><td>A set price for discovery, design, build and launch, each paid when it is done</td><td>Brochure sites and small shops with a clear scope</td></tr>
<tr><td>Time and materials</td><td>Hours worked &times; your rate, usually with an estimate and a cap the client must approve before it is passed</td><td>Projects where the scope will change as you learn more</td></tr>
<tr><td>Monthly retainer</td><td>A set monthly fee for a set number of hours or tasks</td><td>Maintenance, content updates and continuing work after launch</td></tr>
</tbody></table>
<p>To build a fixed fee, estimate the hours for each milestone, multiply by your hourly rate and add a buffer for revision rounds and client delays. For example, 80 hours at $75 is $6,000; a 15% buffer brings it to $6,900. Round to a clean figure and write the milestones next to it. Quote by milestone rather than by the hour for design work: clients compare the total, and open hours invite scope creep.</p>

<h2 id="development">Web development quote: custom builds and web apps</h2>
<p>Custom development carries more unknowns than a template site, so a development quote leans on written assumptions. Split the work into phases that can each be accepted on their own:</p>
<ol>
<li><strong>Discovery and specification:</strong> requirements, user flows, data model and a written spec. Price it separately so the client can stop after it.</li>
<li><strong>Design:</strong> wireframes and screens, with a stated number of screens and revision rounds.</li>
<li><strong>Front-end build:</strong> responsive layouts and the browsers and devices you test on.</li>
<li><strong>Back-end:</strong> database, admin area, accounts and any API work.</li>
<li><strong>Integrations:</strong> payments, email, analytics and other third-party services, with their fees billed at cost.</li>
<li><strong>Testing, deployment and handover:</strong> the test pass, the launch, documentation and a short support window for fixes.</li>
</ol>
<p>State the assumptions that the price depends on, for example that the client supplies content and API access, that the spec is signed off before design starts, and that anything outside the spec is a change request. Load the development example to see the phases as quote lines.</p>
${load('web-development', 'Load a custom web development example')}

<h2 id="wording">Website quote wording to copy</h2>
<p>Replace everything in square brackets. This is general wording, not legal advice; have a solicitor check terms for larger projects.</p>
${tpl('wdscope', 'Scope and deliverables', `Scope: design and build of a [5]-page website on [WordPress] for [client name], with [a contact form and a booking page]. Pages: [Home, About, Services, Pricing, Contact].

Deliverables: the finished website on the client's hosting, [a short training session], and login details for every account set up for the project.

Not included: domain registration, hosting, paid plugins and themes, copywriting, stock photography and search engine optimisation. We can quote any of these separately.`)}
${tpl('wdcontent', 'Content, revisions and changes', `Content: you supply all text, images and logos by [date]. If content arrives more than [10] working days late, the launch date moves by the same number of days.

Revisions: each design stage includes [two] rounds of changes. Further rounds are billed at [$75] an hour.

Changes: any work not described in this quotation is a change request. We will price it in writing and agree it with you before we start.`)}
${tpl('wdterms', 'Payment, ownership and validity', `Payment: [50]% deposit to book the start date, [25]% when the design is approved and [25]% before launch. Invoices are due within [7] days.

Ownership: the copyright in the finished design and code passes to you when the final invoice is paid. Themes, plugins and fonts licensed from third parties stay under their own licences.

Validity: this quotation is valid until [date]. To accept, reply to the email it came with or sign and return it.`)}

<h2 id="ongoing">Hosting and maintenance after launch</h2>
<p>Quote what happens after launch as separate, optional lines so the project price stays comparable. Typical lines are hosting (at cost or with a stated markup), a monthly maintenance plan for updates and backups, and an hourly rate for changes outside the plan. The maintenance example shows how a retainer can be written.</p>
${load('web-maintenance', 'Load a maintenance quote example')}
<p>Once the quote is ready, send it with one of our <a href="/how-to-send-a-quote-to-a-client">quote email templates</a>, give the client <a href="/quote-acceptance-template">acceptance wording</a>, and see <a href="/blog/how-to-write-a-professional-quote">how to write a professional quote</a> for the order the parts should go in.</p>`,
  faq: [
    { q: 'What should a web design quote include?', a: 'The project summary, the number of pages and features, the platform, who supplies the content, the number of design revision rounds, milestones and payments, a timeline, what is not included (domain, hosting, paid plugins, copywriting, stock photos), any ongoing costs, when ownership passes to the client and a valid-until date.' },
    { q: 'What is the difference between a web design quote and a web development quote?', a: 'A web design quote prices layouts, visuals and page templates. A web development quote prices building the site or app: front-end code, back-end, databases and integrations. Many projects are quoted together, with design and development as separate milestones.' },
    { q: 'Should I quote a website as a fixed price or by the hour?', a: 'A fixed fee per milestone suits projects with a clear scope, and clients can compare it easily. Time and materials suits projects whose scope is likely to change; give an estimate and ask the client to approve any increase before it happens.' },
    { q: 'How do I work out what to charge for a website?', a: 'Estimate the hours for each milestone, multiply by your hourly rate and add a buffer for revisions and delays. Then check the total against the value to the client and what similar projects cost you to deliver. The example prices on this page are illustrations, not market rates.' },
    { q: 'How many revision rounds should a website quote include?', a: 'Two rounds per design stage is a common choice. Put the number on the quote and your rate for extra rounds, so a request for a third round is a priced change and not an argument.' },
    { q: 'Should hosting and the domain be in the website quote?', a: 'List them even when they are not included, so the client knows they are separate costs. If you set them up for the client, say whether the accounts are in the client\'s name and whether you bill them at cost.' },
    { q: 'How do I handle extra work after the client accepts the quote?', a: 'Write a change-request clause into the quote: work outside the described scope is priced in writing and agreed before you start. Send the price and the effect on the launch date each time.' },
    { q: 'Is this website quote template free?', a: 'Yes. Fill it in online and download a PDF with no signup. The example website, development and maintenance quotes load in one click, and you can change every line.' }
  ]
};

// Short trade-specific guides for profession pages that had only generic copy.
const SHORT_GUIDES = {
  electrician: `
<h2>How to write an electrical quote</h2>
<ul>
<li><strong>Describe each circuit or point:</strong> number and location of sockets, lights, switches and fused spurs, and the cable route.</li>
<li><strong>Testing and certification</strong> as its own line, and which certificate the customer will receive.</li>
<li><strong>Making good:</strong> whether you fill chases and repair plaster, and that decorating is excluded.</li>
<li><strong>Assumptions:</strong> for example, that the existing installation passes inspection. Faults found during testing are quoted separately.</li>
</ul>`,
  'photographer': `
<h2>How to write a photography quote</h2>
<ul>
<li><strong>Coverage:</strong> hours or days on location, and the number of photographers.</li>
<li><strong>Deliverables:</strong> number of edited images, delivery method and turnaround time.</li>
<li><strong>Licence:</strong> personal, editorial or commercial use, and for how long. Price commercial licences separately.</li>
<li><strong>Booking fee and cancellation:</strong> how much secures the date and whether it is refundable.</li>
<li><strong>Travel and expenses:</strong> included up to a distance, or billed at cost.</li>
</ul>`,
  'graphic-designer': `
<h2>How to write a graphic design quote</h2>
<ul>
<li><strong>Deliverables:</strong> exactly what you will hand over (logo files, guidelines, print files) and in which formats.</li>
<li><strong>Concepts and revision rounds:</strong> how many are included, and your rate for extra rounds.</li>
<li><strong>Usage rights:</strong> when ownership or the licence passes to the client, usually on final payment.</li>
<li><strong>Timeline and payment:</strong> deposit to start, balance on delivery.</li>
</ul>`,
  hvac: `
<h2>How to write an HVAC quote</h2>
<ul>
<li><strong>Equipment:</strong> make, model, capacity and efficiency rating of each unit, so the customer can compare quotes.</li>
<li><strong>Installation:</strong> labour, line sets, pads, electrical work, removal of the old unit and disposal.</li>
<li><strong>Permits and inspection</strong> as their own line where your area requires them.</li>
<li><strong>Warranty:</strong> manufacturer parts warranty and your labour warranty, listed separately.</li>
<li><strong>Options:</strong> a maintenance plan priced as an optional extra.</li>
</ul>`,
  flooring: `
<h2>How to write a flooring quote</h2>
<ul>
<li><strong>Measured area</strong> for each room in m&sup2; or sq ft, plus your waste allowance on materials.</li>
<li><strong>Materials:</strong> product, range and colour; underlay and adhesives as separate lines.</li>
<li><strong>Subfloor preparation:</strong> levelling compound, ply, moisture checks, and what happens if the subfloor is worse than expected.</li>
<li><strong>Finishing:</strong> door bars, beading, skirting removal and refit.</li>
<li><strong>Uplift and disposal</strong> of the old floor, and who moves furniture.</li>
</ul>`,
  'it-support': `
<h2>How to write an IT support quote</h2>
<ul>
<li><strong>One-off work:</strong> setup, migration or repair, priced per device, per user or as a fixed project fee.</li>
<li><strong>Ongoing support:</strong> price per user or device per month, what it covers, response times and support hours.</li>
<li><strong>Licences and hardware:</strong> listed separately, and whether they are billed at cost.</li>
<li><strong>Exclusions:</strong> on-site visits, out-of-hours work and third-party software issues.</li>
</ul>`,
  architect: `
<h2>How to write an architecture fee quote</h2>
<ul>
<li><strong>Stages:</strong> survey, concept design, planning, technical design and site stages, each with its own fee.</li>
<li><strong>What each stage delivers:</strong> drawings, number of design options and revision rounds.</li>
<li><strong>Exclusions:</strong> planning and building control fees, structural engineer, party wall surveyor, other consultants.</li>
<li><strong>Payment:</strong> invoiced at the end of each stage, so fees follow the work.</li>
</ul>`,
  'wedding-planner': `
<h2>How to write a wedding planning quote</h2>
<ul>
<li><strong>Package:</strong> full planning, partial planning or on-the-day coordination, and the number of hours or meetings included.</li>
<li><strong>Supplier management:</strong> which suppliers you book and manage, and whether supplier costs are paid by the couple directly.</li>
<li><strong>On the day:</strong> hours on site and number of staff.</li>
<li><strong>Retainer and payment schedule</strong>, with dates, and your cancellation terms.</li>
</ul>`,
  'personal-trainer': `
<h2>How to write a personal training quote</h2>
<ul>
<li><strong>Sessions:</strong> number, length, location and the period they must be used within.</li>
<li><strong>Extras:</strong> assessments, programmes and nutrition plans as separate lines.</li>
<li><strong>Policies:</strong> rescheduling notice, missed sessions and refunds.</li>
<li><strong>Payment:</strong> per session, per block in advance, or monthly.</li>
</ul>`
};

module.exports = { PROFESSION_EXTRAS: { contractor: CONTRACTOR, painter: PAINTER, mechanic: MECHANIC, 'web-designer': WEB_DESIGNER }, SHORT_GUIDES };
