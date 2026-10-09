// Long-form bodies for profession template pages, how-to guides and blog posts.
// Profession guides are inserted into /quote-template-* pages.

const PROFESSION_GUIDES = {
  consultant: `
<h2>How to structure a consulting quotation</h2>
<p>Consulting clients are buying an outcome, so a good consulting quote starts with the problem and the deliverables, not your hourly rate. Use this structure:</p>
<ol>
<li><strong>Background:</strong> one or two sentences restating the client's situation in their words.</li>
<li><strong>Scope and deliverables:</strong> what you will produce, for example "market assessment report (20&ndash;30 pages), two workshop sessions, final presentation to the leadership team".</li>
<li><strong>Approach and timeline:</strong> phases with dates or durations.</li>
<li><strong>Fees:</strong> a fixed fee per phase, a day rate with an estimated number of days, or a monthly retainer.</li>
<li><strong>Expenses:</strong> whether travel is included, billed at cost, or capped.</li>
<li><strong>Assumptions and exclusions:</strong> what the client provides (data, access to staff) and what is not included.</li>
<li><strong>Payment terms and validity:</strong> for example 40% on signature, 60% on delivery, and "valid for 30 days".</li>
</ol>
<h2>Sample quotation for consultancy services</h2>
<table><thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>
<tr><td>Discovery interviews and data review</td><td>3 days</td><td>$1,200</td><td>$3,600</td></tr>
<tr><td>Analysis and recommendations report</td><td>4 days</td><td>$1,200</td><td>$4,800</td></tr>
<tr><td>Leadership workshop (half day, on site)</td><td>1</td><td>$900</td><td>$900</td></tr>
<tr><td>Travel expenses</td><td colspan="2">Billed at cost, capped at</td><td>$600</td></tr>
<tr><td colspan="3"><strong>Total (excluding tax)</strong></td><td><strong>$9,900</strong></td></tr>
</tbody></table>
<h2>Fixed fee, day rate or retainer?</h2>
<p>Use a <strong>fixed fee</strong> when the deliverable is well defined; clients like the certainty and you're paid for efficiency. Use a <strong>day rate</strong> when the scope is uncertain, and state an estimate plus a cap that needs sign-off to exceed. Use a <strong>retainer</strong> for ongoing advisory work, listing the hours or response times included each month.</p>`,

  plumber: `
<h2>How to write a plumbing quote</h2>
<ul>
<li><strong>Call-out or visit fee,</strong> and whether it's deducted if the customer accepts the quote.</li>
<li><strong>Labour</strong> as a fixed price for the job or hours multiplied by your rate. Show out-of-hours or emergency rates separately.</li>
<li><strong>Parts and fittings</strong> itemised: valves, pipe runs, fixtures. Say if the customer is supplying sanitaryware.</li>
<li><strong>Making good:</strong> whether you repair plaster or tiles you disturb, or leave that to others.</li>
<li><strong>Certification:</strong> in the UK, gas work must be done by a Gas Safe registered engineer. Include your registration number on gas quotes.</li>
<li><strong>Guarantee</strong> on workmanship and parts, validity date and payment terms.</li>
</ul>
<p>Example lines: <em>Replace kitchen mixer tap, fixed price $140 labour; mixer tap (customer choice, up to $120) at cost; isolation valves 2 &times; $12.</em></p>`,

  cleaner: `
<h2>How to quote for cleaning services</h2>
<p>Most cleaning quotes use one of three pricing methods. Pick the one that matches the job and say which it is:</p>
<ul>
<li><strong>Hourly:</strong> hours per visit multiplied by your rate. Good for regular domestic cleans where the scope varies.</li>
<li><strong>Per clean (flat rate):</strong> based on rooms, bathrooms and property size. Customers prefer it for recurring work.</li>
<li><strong>Per square metre or foot:</strong> common for commercial, end-of-tenancy and post-construction cleans.</li>
</ul>
<p>Then list the frequency (weekly, fortnightly, one-off), the rooms and tasks included, who provides supplies and equipment, extras such as oven or window cleaning, access arrangements, and your cancellation policy. For recurring contracts, show the price per visit and the monthly total.</p>`,

  'web-designer': `
<h2>How to quote for a web design project</h2>
<ol>
<li><strong>Scope:</strong> number of page templates, key features (booking, shop, blog), and the CMS or platform.</li>
<li><strong>Content:</strong> who writes copy and supplies images. It's the most common cause of delays.</li>
<li><strong>Design rounds:</strong> how many revision rounds are included, for example two rounds per stage.</li>
<li><strong>Milestones and payments:</strong> for example 50% deposit, 25% on design sign-off, 25% before launch.</li>
<li><strong>Exclusions:</strong> domain, hosting, paid plugins, stock photography, copywriting, SEO.</li>
<li><strong>Ongoing costs:</strong> a separate optional line for monthly maintenance or hosting.</li>
</ol>
<p>Quote the project as a fixed fee per milestone. Clients compare total cost, and hourly quotes for design work invite scope creep.</p>`,

  landscaper: `
<h2>How to quote for landscaping work</h2>
<ul>
<li><strong>Site visit notes:</strong> measurements, access for machinery, drainage and soil conditions.</li>
<li><strong>Design fee</strong> if you produce plans, and whether it's credited against the build.</li>
<li><strong>Materials by quantity:</strong> turf and topsoil by m&sup2; or tonne, paving by m&sup2;, plants by size and number.</li>
<li><strong>Labour</strong> by day or by task, plus machinery hire.</li>
<li><strong>Waste removal:</strong> skip or green waste disposal.</li>
<li><strong>Aftercare:</strong> watering instructions, and an optional seasonal maintenance price.</li>
</ul>
<p>Weather affects landscaping schedules, so add a line that start dates may move with the weather and that prices are valid for 30 days.</p>`,

  builder: `
<h2>How to write a construction or building quote</h2>
<p>Building quotes are long because the work is. Keep them readable with a summary page followed by the detail:</p>
<ul>
<li><strong>Summary:</strong> project description, total price, start date, duration and validity.</li>
<li><strong>Breakdown by stage:</strong> groundworks, structure, first fix, second fix, finishes, with labour and materials for each.</li>
<li><strong>Provisional sums:</strong> allowances for work you can't price yet (for example unknown foundations), clearly marked as subject to change.</li>
<li><strong>Prime cost (PC) sums:</strong> allowances for items the client will choose, such as a kitchen or tiles, with your handling margin stated.</li>
<li><strong>Exclusions:</strong> planning fees, building control fees, structural engineer, party wall costs, furniture removal.</li>
<li><strong>Payment schedule:</strong> tied to stages that are easy to verify, never a large sum far ahead of the work.</li>
<li><strong>Variations</strong> priced and agreed in writing before the work is done.</li>
</ul>`
};

const HOWTO_CONTENT = {
  'how-to-write-a-roofing-quote': `
<p>A clear roofing quote protects you and reassures the homeowner. Set out the work, the materials and what is and isn&rsquo;t included, so there are no surprises once you are on the roof.</p>
<h2>What to include in a roofing quote</h2>
<ul>
<li>The roof area in square metres (or squares) and the pitch</li>
<li>Strip-off and disposal of the existing covering</li>
<li>New materials: membrane or felt, battens, tiles or slates, ridge, flashing and fixings</li>
<li>Labour, broken down by stage where helpful</li>
<li>Scaffolding or access equipment, and how long it is needed</li>
<li>Skip hire and waste removal</li>
<li>Any repairs to timbers, fascias or guttering</li>
<li>VAT or other tax as a separate line</li>
<li>A validity date, since material prices move</li>
</ul>
<h2>Example roofing quote</h2>
<p>A re-roof of a 68 m&sup2; pitched roof. Prices are examples only.</p>
<table><thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead><tbody>
<tr><td>Strip existing tiles and battens, dispose (m&sup2;)</td><td class="n">68</td><td class="n">&pound;18</td><td class="n">&pound;1,224</td></tr>
<tr><td>Breathable membrane and new treated battens (m&sup2;)</td><td class="n">68</td><td class="n">&pound;16</td><td class="n">&pound;1,088</td></tr>
<tr><td>Re-tile with new concrete interlocking tiles (m&sup2;)</td><td class="n">68</td><td class="n">&pound;34</td><td class="n">&pound;2,312</td></tr>
<tr><td>Dry ridge system (linear metres)</td><td class="n">9</td><td class="n">&pound;42</td><td class="n">&pound;378</td></tr>
<tr><td>Scaffolding, erect and dismantle</td><td class="n">1</td><td class="n">&pound;1,450</td><td class="n">&pound;1,450</td></tr>
<tr><td>Skip hire</td><td class="n">2</td><td class="n">&pound;280</td><td class="n">&pound;560</td></tr>
<tr><td colspan="3"><strong>Subtotal (VAT added if registered)</strong></td><td class="n"><strong>&pound;7,012</strong></td></tr>
</tbody></table>
<p>Load this example into the quote maker below, change the figures and download it as a PDF.</p>
<h2>How to price a roofing quote</h2>
<p>Measure the roof accurately and add an allowance to material quantities for waste and cuts. Price labour at your true day rate, including insurance, vehicle and tools. Put scaffolding and skips on their own lines so the homeowner can see them. Then decide how to handle the unknowns, such as rotten battens or felt, which often only show once the old covering is off: exclude them and price them when found, or add a clearly labelled provisional sum.</p>
<h2>What to exclude and flag</h2>
<p>State clearly that hidden defects found after strip-off, such as rotten rafters or damaged chimney work, are not included and will be quoted separately before any extra work begins. This one line prevents most disputes.</p>
<h2>Roofing quote validity</h2>
<p>Because tile, slate and timber prices change, keep a roofing quote valid for 14 to 30 days. Write the date on the quote and mention it when you follow up. For the covering email, use one of our <a href="/how-to-send-a-quote-to-a-client">quote email templates</a>.</p>`,

  // Rewritten 9 Oct 2026 (was "Crawled - currently not indexed"); absorbs /blog/quote-vs-invoice-difference.
  'how-to-convert-a-quote-to-an-invoice': {
    answer: `<p><strong>The short answer:</strong> start the invoice from the quote the client accepted and keep its descriptions, quantities and prices. Then change five things: the title (Invoice), the number (the next one in your invoice sequence, with the quote number kept as a reference), the dates (an invoice date and a due date instead of a valid-until date), the extras (work the client agreed to add, each on its own line) and what has already been paid (deposits deducted). Finish with your payment details.</p>
<p><strong>Quote or invoice?</strong> A quote is an offer made before the work, valid until a date. An invoice asks for payment for work done, or for an agreed stage, by a due date. A quote never goes into your books; an invoice records money a client owes you. Same job and same prices, different purpose.</p>`,
    toc: [
      ['changes', 'What changes and what stays'],
      ['steps', 'Step by step'],
      ['example', 'Worked example: quote, deposit invoice, final invoice'],
      ['more-than-quoted', 'Can the invoice be more than the quote?'],
      ['deposits', 'Deposits, stage payments and part-accepted quotes'],
      ['vat', 'VAT when you invoice a quoted job (UK)'],
      ['software', 'In accounting software'],
      ['here', 'Doing it with GetQuotationMaker']
    ],
    content: `
<h2 id="changes">What changes and what stays</h2>
<p>Put the accepted quote next to the new invoice and work down this table one row at a time.</p>
<table><thead><tr><th>Part</th><th>On the quote</th><th>On the invoice</th></tr></thead><tbody>
<tr><td>Title</td><td>Quotation</td><td>Invoice</td></tr>
<tr><td>Number</td><td>Q-2026-031</td><td>INV-2026-071, the next number in your invoice series, plus &ldquo;Ref. quotation Q-2026-031&rdquo;</td></tr>
<tr><td>Dates</td><td>Quote date and valid-until date</td><td>Invoice date and due date</td></tr>
<tr><td>Client</td><td>Prepared for</td><td>Bill to: the client&rsquo;s legal or trading name, billing address and any purchase order number they gave you</td></tr>
<tr><td>Line items</td><td>The work and prices offered</td><td>The same descriptions, quantities and prices, as accepted</td></tr>
<tr><td>Extras</td><td>None yet</td><td>Agreed variations as separate lines, each with the date it was agreed</td></tr>
<tr><td>Deposit</td><td>&ldquo;25% on acceptance&rdquo;</td><td>The deposit already invoiced or paid, deducted on its own line</td></tr>
<tr><td>Tax</td><td>Rate and amount</td><td>The same rate on the same lines, tax on any extras, and your tax number if you are registered</td></tr>
<tr><td>Terms</td><td>Validity, exclusions, how to accept</td><td>Payment terms, bank details or a payment link, late payment terms</td></tr>
<tr><td>Signature box</td><td>&ldquo;Signed to accept&rdquo;</td><td>Removed</td></tr>
</tbody></table>

<h2 id="steps">Step by step</h2>
<ol>
<li><strong>Find the version the client accepted.</strong> Use the quote number, revision and date they accepted, and keep their acceptance email or signed copy with the job. If they said yes on the phone, confirm it in writing first (<a href="/quote-acceptance-template#c4-h">confirmation wording</a>).</li>
<li><strong>Copy the lines instead of retyping them.</strong> Same descriptions, quantities and unit prices. Clients and their accounts teams check an invoice against the quote line by line, and any difference holds up payment while it is queried.</li>
<li><strong>Give it an invoice number.</strong> Invoices run in their own sequence, separate from quotes. Keep the quote number on the invoice as a reference so the two documents can be matched later.</li>
<li><strong>Replace the dates.</strong> Add the invoice date and a due date written as a date (&ldquo;Due 16 October 2026&rdquo;), not only &ldquo;14 days&rdquo;.</li>
<li><strong>Add agreed extras as separate lines.</strong> Name each one and say when it was agreed, for example &ldquo;Variation 1: extra double socket, agreed by email 18 September&rdquo;. Leave out anything the client never agreed to.</li>
<li><strong>Deduct what has already been invoiced or paid.</strong> Show the deposit or earlier stage payments on their own line with the number of the invoice they were billed on.</li>
<li><strong>Check the tax.</strong> The same rate on the same lines, tax on the extras, and your VAT, GST or sales tax number if you are registered. UK VAT points are <a href="#vat">below</a>.</li>
<li><strong>Add how to pay, then send it.</strong> Bank details or a payment link, then send the PDF with the amount and due date written in the email itself.</li>
</ol>

<h2 id="example">Worked example: quote, deposit invoice, final invoice</h2>
<p>A VAT-registered fitter quotes a business client for a staff kitchen refit, invoices a 25% deposit on acceptance, does one agreed extra and invoices the balance on completion. Names, prices and dates are made up to show the method.</p>
<div class="doc">
<div class="doc-h"><span><b>QUOTATION</b> Q-2026-031</span><span>2 September 2026, valid until 2 October 2026</span></div>
<table><thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead><tbody>
<tr><td>Strip out existing units and worktop, remove waste</td><td class="n">1</td><td class="n">&pound;480.00</td><td class="n">&pound;480.00</td></tr>
<tr><td>Supply and fit base and wall units</td><td class="n">6</td><td class="n">&pound;310.00</td><td class="n">&pound;1,860.00</td></tr>
<tr><td>Laminate worktop, supply and fit (metres)</td><td class="n">4</td><td class="n">&pound;95.00</td><td class="n">&pound;380.00</td></tr>
<tr><td>Plumbing for sink and dishwasher</td><td class="n">1</td><td class="n">&pound;420.00</td><td class="n">&pound;420.00</td></tr>
<tr><td>Two double sockets and under-unit lighting</td><td class="n">1</td><td class="n">&pound;560.00</td><td class="n">&pound;560.00</td></tr>
<tr class="sub"><td colspan="3">Subtotal</td><td class="n">&pound;3,700.00</td></tr>
<tr class="sub"><td colspan="3">VAT 20%</td><td class="n">&pound;740.00</td></tr>
<tr class="tot"><td colspan="3">Total</td><td class="n">&pound;4,440.00</td></tr>
</tbody></table>
<div class="doc-f">Terms: 25% deposit on acceptance, balance within 14 days of completion.</div>
</div>
<p>The client accepts on 8 September, and you invoice the deposit the same day:</p>
<div class="doc">
<div class="doc-h"><span><b>INVOICE</b> INV-2026-058</span><span>8 September 2026, ref. quotation Q-2026-031</span></div>
<table><tbody>
<tr><td>Deposit, 25% of quotation Q-2026-031</td><td class="n">&pound;925.00</td></tr>
<tr class="sub"><td>VAT 20%</td><td class="n">&pound;185.00</td></tr>
<tr class="tot"><td>Due on receipt</td><td class="n">&pound;1,110.00</td></tr>
</tbody></table>
</div>
<p>On 18 September the client asks for one more double socket by the window and agrees &pound;95 plus VAT by email. The work finishes on 30 September and you send the final invoice on 2 October:</p>
<div class="doc">
<div class="doc-h"><span><b>INVOICE</b> INV-2026-071</span><span>2 October 2026, due 16 October 2026, ref. quotation Q-2026-031</span></div>
<table><thead><tr><th>Description</th><th class="n">Amount</th></tr></thead><tbody>
<tr><td>Quotation Q-2026-031: the five quoted lines, as quoted</td><td class="n">&pound;3,700.00</td></tr>
<tr><td>Variation 1: extra double socket by the window, agreed by email 18 September</td><td class="n">&pound;95.00</td></tr>
<tr><td>Less deposit invoiced on INV-2026-058 (before VAT)</td><td class="n">&minus;&pound;925.00</td></tr>
<tr class="sub"><td>Net amount on this invoice</td><td class="n">&pound;2,870.00</td></tr>
<tr class="sub"><td>VAT 20%</td><td class="n">&pound;574.00</td></tr>
<tr class="tot"><td>Balance due by 16 October 2026</td><td class="n">&pound;3,444.00</td></tr>
</tbody></table>
<div class="doc-f">On the real invoice, list the five quoted lines one by one, exactly as they were on the quote.</div>
</div>
<p><strong>Why the deposit comes off before VAT.</strong> The deposit invoice already charged &pound;185 of VAT. Taking the deposit off before VAT means the final invoice charges VAT only on the part not yet invoiced, so the VAT on the two invoices adds up to the VAT on the whole job: &pound;185 + &pound;574 = &pound;759, which is 20% of &pound;3,795 (&pound;3,700 quoted plus &pound;95 extra). If the final invoice charged VAT on the full &pound;3,795 and then took off the &pound;1,110 deposit, the balance would be the same, but the two invoices together would show &pound;944 of VAT for a job that carries &pound;759, which is wrong for a client who reclaims VAT.</p>
<p>In total the client pays &pound;1,110 + &pound;3,444 = &pound;4,554: the quoted &pound;4,440 plus &pound;114 for the extra (&pound;95 and &pound;19 VAT).</p>

<h2 id="more-than-quoted">Can the invoice be more than the quote?</h2>
<p>Only for extra work the client agreed to. A quote is a fixed price for the work it describes. Citizens Advice tells consumers that a trader can&rsquo;t charge more than they quoted unless they explained that extra work was needed and the customer agreed to pay more, or the quoted price was an obvious mistake, and that a rise in the trader&rsquo;s own costs since the quote is not a reason (<a href="https://www.citizensadvice.org.uk/consumer/getting-home-improvements-done/problem-with-home-improvements/" rel="nofollow noopener" target="_blank">Citizens Advice</a>).</p>
<p>An estimate is different. It is the trader&rsquo;s best guess, so the final bill can differ from it, but a consumer can dispute a bill far above it, and where no price was fixed the customer has to pay a reasonable price and no more (<a href="https://www.legislation.gov.uk/ukpga/2015/15/section/51" rel="nofollow noopener" target="_blank">Consumer Rights Act 2015, s.51</a>). In practice:</p>
<ul>
<li>Price any extra in writing before you do it, and put it on the invoice as its own line with the date it was agreed.</li>
<li>If you quoted a rate with a final measure (&ldquo;&pound;55 per m&sup2;, measured on completion&rdquo;), invoice the measured quantity and show the measurement.</li>
<li>If part of the quoted work was not done, remove or reduce that line and say why.</li>
</ul>

<h2 id="deposits">Deposits, stage payments and part-accepted quotes</h2>
<ul>
<li><strong>Deposits.</strong> Invoice the deposit when it is due, then deduct it on the final invoice with the deposit invoice&rsquo;s number, as in the example.</li>
<li><strong>Stage payments.</strong> Send one invoice per stage, each saying which stage it covers (&ldquo;Stage 2 of 4 under quotation Q-2026-031&rdquo;), how much has been invoiced so far and how much is left. The last invoice covers the final stage plus any agreed extras.</li>
<li><strong>Only part of the quote accepted.</strong> Invoice only the accepted items. It is cleaner to send a revised quote for those items and have that accepted first (<a href="/quote-acceptance-template#changes">accepting part of a quote</a>).</li>
<li><strong>Pro forma invoices.</strong> If you ask for payment before supplying anything by sending a pro forma, HMRC says it can&rsquo;t be used to reclaim VAT and should be marked &ldquo;This is not a VAT invoice&rdquo;; once you are paid or you supply the work, issue a proper VAT invoice (<a href="https://www.gov.uk/guidance/vat-guide-notice-700#pro-forma-invoices" rel="nofollow noopener" target="_blank">VAT Notice 700, 17.3</a>).</li>
</ul>

<h2 id="vat">VAT when you invoice a quoted job (UK)</h2>
<ul>
<li><strong>A deposit creates a tax point when you receive it.</strong> HMRC treats most deposits as advance payments, so the VAT on a deposit belongs to the VAT period in which you are paid, even if the work starts later (<a href="https://www.gov.uk/guidance/vat-guide-notice-700#deposits" rel="nofollow noopener" target="_blank">VAT Notice 700, 14.2.2 and 14.2.3</a>).</li>
<li><strong>VAT-registered clients get a VAT invoice.</strong> For standard-rated or reduced-rated work you must give one to a VAT-registered customer, normally within 30 days of the tax point. Customers who aren&rsquo;t VAT registered don&rsquo;t need one (<a href="https://www.gov.uk/guidance/vat-guide-notice-700#vat-invoices-and-when-they-should-be-issued" rel="nofollow noopener" target="_blank">VAT Notice 700, 16.2</a>).</li>
<li><strong>What a full VAT invoice shows:</strong> a unique sequential number, the time of supply (tax point), the date of issue if different, your name, address and VAT number, the customer&rsquo;s name and address, a description, the quantity or extent, the VAT rate and the amount before VAT for each line, the total before VAT, any cash discount rate, the unit price, and the total VAT in sterling (VAT Notice 700, 16.3). For supplies of &pound;250 or less a simplified invoice can be used if the customer agrees (16.6).</li>
<li><strong>If the VAT rate changes between quote and invoice,</strong> section 89 of the VAT Act 1994 adds the difference to the price, or takes it off, unless the contract says otherwise (<a href="https://www.legislation.gov.uk/ukpga/1994/23/section/89" rel="nofollow noopener" target="_blank">legislation.gov.uk</a>).</li>
</ul>
<p class="src">Sources checked 9 October 2026: HMRC VAT Notice 700 (last updated 25 June 2026), VAT Act 1994 s.89, Consumer Rights Act 2015 s.51, Citizens Advice. General information, not tax or legal advice. Putting VAT on the quote itself is covered in <a href="/blog/vat-on-quotes-explained">VAT on quotes</a>.</p>

<h2 id="software">In accounting software</h2>
<p>Most accounting tools have a Convert to invoice action on the quote (some call it an estimate) that copies the lines for you. The official steps for three of them: <a href="https://quickbooks.intuit.com/learn-support/en-uk/help-article/invoicing/convert-estimate-invoice-quickbooks-online/L2dAsWOiq_GB_en_GB" rel="nofollow noopener" target="_blank">QuickBooks Online</a>, <a href="https://www.zoho.com/books/kb/invoices/quote-invoice-convert.html" rel="nofollow noopener" target="_blank">Zoho Books</a> and <a href="https://support.waveapps.com/hc/en-us/articles/208621756-Convert-an-estimate-to-an-invoice" rel="nofollow noopener" target="_blank">Wave</a>. Check what comes out against the table at the top of this page: the number, the dates, the extras and the deposit are the parts a converted draft most often gets wrong.</p>
<p class="src">Help pages checked 9 October 2026.</p>

<h2 id="here">Doing it with GetQuotationMaker</h2>
<p>Load the example quote into the quote maker below, or start your own. With <a href="/#pricing">Pro</a> ($9 one-time) the quote maker downloads the same quote as an invoice PDF: the same lines, tax and totals, with an invoice number, invoice date, due date and a &ldquo;Ref. quotation&rdquo; line. Before you download, add each agreed extra as a line, and the deposit as a line with a minus rate, for example &ldquo;Less deposit invoiced on INV-2026-058&rdquo; at &minus;925.</p>
<p>On the free plan, make the invoice in our free sister tool, <a href="https://getinvoicemaker.com/">GetInvoiceMaker</a>, which also works without an account.</p>`,
    faq: [
      { q: 'Can I use the quote as the invoice?', a: 'Not as it stands. A quote is an offer with a valid-until date; an invoice is a request for payment with its own number, invoice date and due date. Start from the accepted quote, then change the title, number and dates, add agreed extras and deduct any deposit.' },
      { q: 'Should the invoice number be the same as the quote number?', a: 'No. Give the invoice the next number in your invoice sequence and keep the quote number on it as a reference, for example "INV-2026-071, ref. quotation Q-2026-031". Separate sequences keep both sets of records complete.' },
      { q: 'Can an invoice be higher than the quote?', a: 'Only for extra work the client agreed to, shown as separate lines. A quote is a fixed price for the work described, and Citizens Advice tells consumers that a rise in the trader’s own costs is not a reason to charge more than the quote.' },
      { q: 'Do I need a separate invoice for the deposit?', a: 'It is the clearest way to handle it. If you are VAT registered, the deposit creates a tax point when you receive it, so the VAT on it is due then. Deduct the deposit on the final invoice and quote the deposit invoice number.' },
      { q: 'How soon after the job should I send the invoice?', a: 'As soon as the work is finished, or on the date the quote set. A VAT-registered business in the UK must normally give a VAT-registered customer a VAT invoice within 30 days of the tax point.' },
      { q: 'What if the client accepted only part of the quote?', a: 'Invoice only the accepted items. Ideally send a revised quote for those items first and get it accepted, so the invoice matches a document the client agreed to.' }
    ],
    related: [
      ['/blog/what-is-a-quotation-in-business', 'What a quotation is, with an annotated example'],
      ['/blog/vat-on-quotes-explained', 'VAT on quotes'],
      ['/quote-acceptance-template', 'Quote acceptance wording'],
      ['/how-to-send-a-quote-to-a-client', 'How to send a quote by email'],
      ['/blog/how-to-price-a-job-quote', 'How to price a job quote']
    ]
  }
};

const BLOG_CONTENT = {
  'quote-acceptance-rate-tips': `
<div class="answer"><p><strong>Quote acceptance wording:</strong> to accept or confirm a quotation, reply in writing with the quote number, its date and the total, for example: &ldquo;We accept quotation Q-1042 dated 2 October for the kitchen refit at &pound;8,450 including VAT, on the terms set out in the quotation. Please confirm the start date.&rdquo;</p><p>For confirmation of quotation emails, a formal acceptance letter and accepting with changes, copy the <a href="/quote-acceptance-template">quote acceptance wording templates</a>. This article covers the other side: getting more of the quotes you send accepted.</p></div>
<p>Your quote acceptance rate (also called a win rate or conversion rate) is the share of quotes you send that clients accept. It tells you whether your quoting process is working, and it is the number to watch when you change how you price, present or follow up.</p>
<h2>How to work out your quote acceptance rate</h2>
<p><strong>Acceptance rate = quotes accepted &divide; quotes sent &times; 100.</strong> If you sent 40 quotes last quarter and 18 were accepted, your rate is 45%.</p>
<p>Work it out by job type and by where the enquiry came from (referral, website, directory). A low rate on one source often means those enquiries need qualifying before you spend time quoting, not that your prices are wrong.</p>
<h2>9 ways to get more quotes accepted</h2>
<h3>1. Reply quickly</h3>
<p>Send the quote while the client is still thinking about the job, ideally within a working day of the visit or call. If a complicated quote will take longer, tell the client when to expect it.</p>
<h3>2. Qualify before you quote</h3>
<p>Ask about budget, timing and who makes the decision before you visit or price. You will send fewer quotes that were never going to be accepted.</p>
<h3>3. Be specific</h3>
<p>Itemise the work with quantities and rates, and name the materials or deliverables. A single figure invites comparison on price alone; specific line items show what the client gets.</p>
<h3>4. Offer options</h3>
<p>Two or three options (for example essential, recommended and premium) let the client choose how much to spend instead of deciding whether to go ahead at all.</p>
<h3>5. Show the real total</h3>
<p>Make the total, including tax, easy to find. In the UK, prices for consumers have to include VAT and other mandatory charges up front (<a href="https://www.gov.uk/government/publications/price-transparency-cma209/providing-clear-and-accurate-information-about-prices-summary" rel="nofollow noopener" target="_blank">CMA guidance</a>), and a surprise at the end loses trust.</p>
<h3>6. Add a validity date</h3>
<p>A date gives the client a reason to decide and protects you from honouring old prices. Thirty days is common; use less when material prices move.</p>
<h3>7. Make accepting one step</h3>
<p>Tell the client exactly how to say yes: reply "accepted", sign the PDF or pay the deposit. Put <a href="/quote-acceptance-template#seller-templates">acceptance wording on the quote</a> itself, and send the PDF as an attachment rather than asking the client to log in somewhere.</p>
<h3>8. Follow up on a schedule</h3>
<p>Follow up three to five days after sending, again a week later with something useful, and once more before the quote expires. Our <a href="/how-to-send-a-quote-to-a-client#follow-up">follow-up email templates</a> have wording for each step.</p>
<h3>9. Find out why quotes are lost</h3>
<p>When a client says no, ask one short question: was it price, timing or something else? Keep a note of the answers.</p>
<table><thead><tr><th>Reason the quote was lost</th><th>What to change</th></tr></thead><tbody>
<tr><td>Too expensive</td><td>Offer a lower-scope option, explain what the price includes, or qualify budget earlier</td></tr>
<tr><td>Went with someone faster</td><td>Quote sooner; send a short "quote coming Thursday" message if it will take time</td></tr>
<tr><td>Didn&rsquo;t understand the quote</td><td>Itemise, use plain descriptions, add a scope summary in the email</td></tr>
<tr><td>Project postponed</td><td>Set a reminder to follow up when they said the timing might change</td></tr>
<tr><td>No reply at all</td><td>Follow up on a schedule, and make the next step clearer</td></tr>
</tbody></table>
<h2>Track it in one place</h2>
<p>A simple spreadsheet is enough: quote number, date sent, client, source, amount, status (sent, accepted, lost) and the reason if lost. Number every quote so the spreadsheet, emails and PDFs match. Our <a href="/">free quotation maker</a> numbers each quote and adds a validity date to the PDF.</p>`,

  // Rewritten 9 Oct 2026 (was "Crawled - currently not indexed"): every rule checked on GOV.UK and legislation.gov.uk.
  'vat-on-quotes-explained': {
    answer: `<p><strong>The short answer:</strong> if you are VAT registered, show VAT on every quote: the price before VAT, the VAT rate and amount, and the total including VAT. If you are not VAT registered, don&rsquo;t add VAT at all.</p>
<p>Never leave it unsaid. For VAT purposes a price that doesn&rsquo;t mention VAT is treated as already including it (<a href="https://www.legislation.gov.uk/ukpga/1994/23/section/19" rel="nofollow noopener" target="_blank">VAT Act 1994, s.19(2)</a>), so a VAT-registered business that quotes &ldquo;&pound;3,000&rdquo; for standard-rated work keeps &pound;2,500 and pays &pound;500 to HMRC, unless the quote said &ldquo;plus VAT&rdquo;.</p>`,
    toc: [
      ['registered', 'Do you have to put VAT on a quote?'],
      ['silent', 'If a quote says nothing about VAT'],
      ['show', 'How to show VAT on a quote'],
      ['consumers', 'Quoting homeowners and quoting businesses'],
      ['rates', 'Which rate: 20%, 5% or 0%'],
      ['schemes', 'Flat Rate Scheme, materials, deposits and subcontracting'],
      ['changes', 'If the rate changes, or you register, after quoting'],
      ['wording', 'Wording to copy']
    ],
    content: `
<h2 id="registered">Do you have to put VAT on a quote?</h2>
<ul>
<li><strong>VAT registered:</strong> you must charge VAT on what you sell unless it is exempt (<a href="https://www.gov.uk/charge-reclaim-record-vat" rel="nofollow noopener" target="_blank">GOV.UK: charge, reclaim and record VAT</a>), so your quote should show it. HMRC&rsquo;s layout rules are for invoices rather than quotes, but a quote that shows VAT the way the invoice will show it leaves nothing to argue about later.</li>
<li><strong>Not registered:</strong> you can&rsquo;t charge VAT, so leave out both the VAT line and any VAT number. You must register once your taxable turnover for the last 12 months goes over &pound;90,000, or when you expect it to go over &pound;90,000 in the next 30 days, and you can register voluntarily below that (<a href="https://www.gov.uk/register-for-vat" rel="nofollow noopener" target="_blank">GOV.UK: register for VAT</a>).</li>
</ul>

<h2 id="silent">If a quote says nothing about VAT</h2>
<p>Section 19(2) of the VAT Act 1994 treats the price agreed as including any VAT due. Here is what three ways of writing the same figure mean for a VAT-registered business doing standard-rated work:</p>
<table><thead><tr><th>The quote says</th><th class="n">Client pays</th><th class="n">VAT to HMRC</th><th class="n">You keep</th></tr></thead><tbody>
<tr><td>&ldquo;&pound;3,000&rdquo;</td><td class="n">&pound;3,000</td><td class="n">&pound;500</td><td class="n">&pound;2,500</td></tr>
<tr><td>&ldquo;&pound;3,000 including VAT&rdquo;</td><td class="n">&pound;3,000</td><td class="n">&pound;500</td><td class="n">&pound;2,500</td></tr>
<tr><td>&ldquo;&pound;3,000 plus VAT at 20%&rdquo;</td><td class="n">&pound;3,600</td><td class="n">&pound;600</td><td class="n">&pound;3,000</td></tr>
</tbody></table>
<p>At 20%, the VAT inside a VAT-inclusive price is one sixth of it: &pound;3,000 &divide; 6 = &pound;500.</p>
<p>It works against you at invoice stage too. If a homeowner accepted a quote that never mentioned VAT, adding VAT to the invoice is charging more than you quoted, and Citizens Advice tells consumers a trader can&rsquo;t do that without their agreement (<a href="https://www.citizensadvice.org.uk/consumer/getting-home-improvements-done/problem-with-home-improvements/" rel="nofollow noopener" target="_blank">Citizens Advice</a>).</p>

<h2 id="show">How to show VAT on a quote</h2>
<ol>
<li>List each line at its price <strong>before VAT</strong>.</li>
<li>Show the <strong>subtotal</strong>, then the <strong>VAT rate and amount</strong>, then the <strong>total including VAT</strong>.</li>
<li>Put your <strong>VAT registration number</strong> with your business details. It has to be on a VAT invoice, so having it on the quote keeps the two documents consistent (<a href="https://www.gov.uk/guidance/vat-guide-notice-700#information-required-on-a-vat-invoice" rel="nofollow noopener" target="_blank">VAT Notice 700, 16.3</a>).</li>
<li>If lines carry different rates, show the rate against each line and the VAT for each rate. Zero-rated or exempt items should show clearly that no VAT is payable, with their own total (<a href="https://www.gov.uk/guidance/vat-guide-notice-700#invoicing-zero-rated-or-exempt-supplies" rel="nofollow noopener" target="_blank">VAT Notice 700, 16.5</a>).</li>
</ol>
<table><thead><tr><th>Example, business client</th><th class="n">Amount</th></tr></thead><tbody>
<tr><td>Labour: 4 days at &pound;450</td><td class="n">&pound;1,800.00</td></tr>
<tr><td>Materials</td><td class="n">&pound;1,200.00</td></tr>
<tr><td>Subtotal before VAT</td><td class="n">&pound;3,000.00</td></tr>
<tr><td>VAT at 20%</td><td class="n">&pound;600.00</td></tr>
<tr><td><strong>Total including VAT</strong></td><td class="n"><strong>&pound;3,600.00</strong></td></tr>
</tbody></table>
<p>For pennies, HMRC lets invoice traders round the total VAT on an invoice down to a whole penny, and VAT worked out line by line either down to 0.1p or to the nearest 1p or 0.5p, as long as the method is consistent (<a href="https://www.gov.uk/guidance/vat-guide-notice-700#calculation-of-vat-on-invoices--rounding-of-amounts" rel="nofollow noopener" target="_blank">VAT Notice 700, 17.5</a>). Work the quote out the same way your invoice will, so the two totals match.</p>

<h2 id="consumers">Quoting homeowners and quoting businesses</h2>
<p>VAT-registered businesses can usually reclaim the VAT you charge them, so they compare prices before VAT. Consumers pay the whole amount. The CMA&rsquo;s guidance on the Digital Markets, Competition and Consumers Act 2024 says the total price shown to consumers should normally include unavoidable charges, VAT among them, and that listing those charges separately will not normally be enough (<a href="https://www.gov.uk/government/publications/price-transparency-cma209/providing-clear-and-accurate-information-about-prices-summary" rel="nofollow noopener" target="_blank">CMA, updated 7 January 2026</a>).</p>
<table><thead><tr><th></th><th>Business client</th><th>Homeowner</th></tr></thead><tbody>
<tr><td>Lead with</td><td>The price before VAT</td><td>The total including VAT</td></tr>
<tr><td>Lines</td><td>Before VAT</td><td>Before VAT is fine, as long as the VAT-inclusive total is easy to see</td></tr>
<tr><td>In the email</td><td>&ldquo;&pound;3,000 plus VAT at 20% (&pound;600), &pound;3,600 in total&rdquo;</td><td>&ldquo;&pound;3,600 including VAT at 20%&rdquo;</td></tr>
</tbody></table>

<h2 id="rates">Which rate: 20%, 5% or 0%</h2>
<p>Most work is standard-rated at 20%. The reduced rate is 5%, and some goods and services are zero-rated (<a href="https://www.gov.uk/vat-rates" rel="nofollow noopener" target="_blank">GOV.UK: VAT rates</a>). Cases that come up in trade quotes:</p>
<ul>
<li><strong>Energy-saving materials in homes.</strong> Installing insulation, draught stripping, heating controls, solar panels, heat pumps, battery storage and the other listed materials in residential accommodation in Great Britain is zero-rated from 1 May 2023 to 31 March 2027, and goes back to 5% from 1 April 2027 (<a href="https://www.gov.uk/guidance/vat-on-energy-saving-materials-and-heating-equipment-notice-7086" rel="nofollow noopener" target="_blank">VAT Notice 708/6</a>). For work that will run past 31 March 2027, check the rate that applies at the tax point.</li>
<li><strong>Mobility aids</strong> for someone over 60, installed in their home, are reduced-rated at 5% (<a href="https://www.gov.uk/charge-reclaim-record-vat" rel="nofollow noopener" target="_blank">GOV.UK</a>).</li>
<li><strong>Building work.</strong> New homes can be zero-rated, and converting premises to a different residential use or renovating homes that have been empty for two years or more can be reduced-rated, each with conditions (<a href="https://www.gov.uk/guidance/buildings-and-construction-vat-notice-708" rel="nofollow noopener" target="_blank">VAT Notice 708</a>). Check the conditions before you quote below 20%.</li>
</ul>

<h2 id="schemes">Flat Rate Scheme, materials, deposits and subcontracting</h2>
<ul>
<li><strong>Flat Rate Scheme.</strong> You still charge customers VAT at the normal rate; the flat rate only changes what you pay HMRC. GOV.UK&rsquo;s example: you bill &pound;1,000 plus 20% VAT, &pound;1,200 in total, and a photographer on an 11% flat rate pays HMRC 11% of &pound;1,200, which is &pound;132 (<a href="https://www.gov.uk/vat-flat-rate-scheme/how-much-you-pay" rel="nofollow noopener" target="_blank">GOV.UK: Flat Rate Scheme</a>).</li>
<li><strong>Materials.</strong> When you are VAT registered you can reclaim the VAT on items you buy for the business, with valid VAT invoices (<a href="https://www.gov.uk/charge-reclaim-record-vat/reclaim-vat-business-expenses" rel="nofollow noopener" target="_blank">GOV.UK</a>). So price materials at their cost before VAT, add your margin, and add VAT once on the quote total. Pricing from the VAT-inclusive receipt puts VAT on top of VAT.</li>
<li><strong>Deposits.</strong> HMRC treats most deposits as advance payments, so the VAT on a deposit is due when you receive it (<a href="https://www.gov.uk/guidance/vat-guide-notice-700#deposits" rel="nofollow noopener" target="_blank">VAT Notice 700, 14.2.3</a>). Show the deposit with its VAT on the quote, for example &ldquo;Deposit 25%: &pound;750 plus VAT &pound;150, &pound;900&rdquo;, and see <a href="/how-to-convert-a-quote-to-an-invoice#example">how the deposit comes off the final invoice</a>.</li>
<li><strong>Subcontracting to a contractor.</strong> Most building and construction services between VAT-registered businesses that are reported under the Construction Industry Scheme fall under the VAT domestic reverse charge, where the customer accounts for the VAT instead of you (<a href="https://www.gov.uk/guidance/vat-domestic-reverse-charge-for-building-and-construction-services" rel="nofollow noopener" target="_blank">GOV.UK</a>). Check that guidance before adding VAT to a quote for a main contractor.</li>
</ul>

<h2 id="changes">If the rate changes, or you register, after quoting</h2>
<ul>
<li><strong>The rate changes.</strong> If the VAT on the work changes after the contract is made and before the work is done, section 89 of the VAT Act 1994 adds the difference to the price, or takes it off, unless the contract says otherwise (<a href="https://www.legislation.gov.uk/ukpga/1994/23/section/89" rel="nofollow noopener" target="_blank">legislation.gov.uk</a>). Stating the rate on the quote makes any change easy to explain.</li>
<li><strong>You register.</strong> A quote given while you were unregistered won&rsquo;t mention VAT, and the price agreed is treated as including any VAT due. If you are close to &pound;90,000, say on the quote how VAT will be handled if you register before the work is invoiced, agree it with the client, and ask your accountant about quotes already accepted.</li>
</ul>

<h2 id="wording">Wording to copy</h2>
<blockquote><strong>Business clients:</strong> All prices are shown before VAT. VAT at 20% is added to the total.</blockquote>
<blockquote><strong>Homeowners:</strong> The total of &pound;3,600 includes VAT at 20% (&pound;600).</blockquote>
<blockquote><strong>Not VAT registered:</strong> We are not registered for VAT, so no VAT is charged on this quote.</blockquote>
<blockquote><strong>Mixed rates:</strong> Insulation work on this quote is zero-rated (VAT Notice 708/6). All other work is standard-rated at 20%.</blockquote>
<blockquote><strong>Rate changes:</strong> VAT is charged at the rate in force when the work is invoiced.</blockquote>
<p class="src">Sources checked 9 October 2026: VAT Act 1994 ss.19 and 89; HMRC VAT Notice 700 (updated 25 June 2026), VAT Notice 708 (updated 26 August 2026) and VAT Notice 708/6; GOV.UK pages on VAT rates, registration, reclaiming VAT and the Flat Rate Scheme; CMA price transparency guidance (updated 7 January 2026); Citizens Advice. General information, not tax advice.</p>`,
    faq: [
      { q: 'Do I have to put VAT on a quote?', a: 'If you are VAT registered, show it: the price before VAT, the rate, the VAT amount and the total. If you are not registered you can’t charge VAT, so leave it off. A price that says nothing about VAT is treated as including it.' },
      { q: 'What does "plus VAT" mean on a quote?', a: 'That VAT will be added to the price shown. "£3,000 plus VAT" at 20% means the client pays £3,600. Write the rate as well, so nobody has to work out the total.' },
      { q: 'My quote didn’t mention VAT. Can I add it to the invoice?', a: 'Not without the client agreeing. For VAT purposes the agreed price is treated as including any VAT due, so the VAT comes out of the price you quoted: £3,000 becomes £2,500 plus £500 VAT.' },
      { q: 'Do I charge 20% VAT if I use the Flat Rate Scheme?', a: 'Yes. You charge customers VAT at the normal rate and pay HMRC a flat percentage of your VAT-inclusive turnover.' },
      { q: 'Is a quote a VAT invoice?', a: 'No. A quote is an offer. A VAT-registered client reclaims VAT from the VAT invoice you issue when they pay a deposit or when the work is done.' },
      { q: 'Should a quote to a homeowner include VAT?', a: 'Show the total including VAT. Consumers pay the whole amount, and CMA guidance says the total price shown to consumers should normally include unavoidable charges such as VAT.' }
    ],
    cta: { title: 'Make a quote with VAT on its own line', text: 'Free UK quote maker: lines before VAT, VAT at 20%, the total and a valid-until date, downloaded as a PDF. No signup.', href: '/free-quote-generator-uk#qtTool', label: 'Open the UK quote maker' },
    related: [
      ['/how-to-convert-a-quote-to-an-invoice', 'How-to', 'How to convert a quote to an invoice'],
      ['/blog/what-is-a-quotation-in-business', 'Guide', 'What is a quotation in business?'],
      ['/quote-template-contractor', 'Template', 'UK tradesman quote template']
    ]
  },

  // Rewritten 9 Oct 2026 ("URL is unknown to Google", 201 words): formula, calculator, markup vs margin, hourly rate method.
  'how-to-price-a-job-quote': {
    script: '/price-calc.js',
    answer: `<p><strong>The formula:</strong> price before tax = (materials + labour + overheads) &divide; (1 &minus; profit margin). Take materials at cost plus waste and delivery, labour as hours &times; your rate, and overheads as hours &times; your overhead cost per hour. Dividing by (1 &minus; margin) gives you the margin you planned; adding the same percentage on top (a markup) gives you less.</p>`,
    toc: [
      ['calculator', 'Job price calculator'],
      ['parts', 'The four parts of a price'],
      ['margin', 'Markup or margin: the mistake that costs most'],
      ['rate', 'Working out your hourly rate and overheads'],
      ['method', 'Fixed price, day rate or time and materials'],
      ['check', 'Checking the price before you send it']
    ],
    content: `
<h2 id="calculator">Job price calculator</h2>
<div class="pcalc" id="pcalc">
<div class="pc-grid">
<label>Materials at cost<input type="number" id="pcMat" value="900" min="0" step="any" inputmode="decimal"></label>
<label>Waste allowance (%)<input type="number" id="pcWaste" value="10" min="0" step="any" inputmode="decimal"></label>
<label>Delivery and collection<input type="number" id="pcDel" value="40" min="0" step="any" inputmode="decimal"></label>
<label>Labour hours<input type="number" id="pcHours" value="22" min="0" step="any" inputmode="decimal"></label>
<label>Labour rate per hour<input type="number" id="pcRate" value="45" min="0" step="any" inputmode="decimal"></label>
<label>Overheads per hour<input type="number" id="pcOver" value="9" min="0" step="any" inputmode="decimal"></label>
<label>Profit margin (%)<input type="number" id="pcMargin" value="20" min="0" max="90" step="any" inputmode="decimal"></label>
<label>Currency<select id="pcCur"><option value="&pound;">&pound; GBP</option><option value="$">$ USD</option><option value="&euro;">&euro; EUR</option></select></label>
</div>
<table class="pc-out" aria-live="polite"><tbody>
<tr><td>Materials (with waste and delivery)</td><td class="n" id="pcoMat"></td></tr>
<tr><td>Labour</td><td class="n" id="pcoLab"></td></tr>
<tr><td>Overheads</td><td class="n" id="pcoOver"></td></tr>
<tr class="sub"><td>Cost of the job</td><td class="n" id="pcoCost"></td></tr>
<tr><td>Profit</td><td class="n" id="pcoProfit"></td></tr>
<tr class="tot"><td>Price before tax</td><td class="n" id="pcoPrice"></td></tr>
</tbody></table>
<p class="pc-note" id="pcoNote"></p>
<noscript><p class="pc-note">The calculator needs JavaScript. With the example figures: cost &pound;2,218.00, price &pound;2,772.50 at a 20% margin.</p></noscript>
</div>
<p>The figures loaded are the worked example below. Change any of them; the result updates as you type. Add VAT on top if you are registered (<a href="/blog/vat-on-quotes-explained">VAT on quotes</a>).</p>

<h2 id="parts">The four parts of a price</h2>
<table><thead><tr><th>Part</th><th>How to work it out</th><th class="n">Example</th></tr></thead><tbody>
<tr><td>Materials</td><td>&pound;900 at cost, plus a 10% waste allowance, plus &pound;40 delivery</td><td class="n">&pound;1,030.00</td></tr>
<tr><td>Labour</td><td>22 hours, including setting up, clearing up and travel, at &pound;45</td><td class="n">&pound;990.00</td></tr>
<tr><td>Overheads</td><td>22 hours at &pound;9, your overheads per billable hour (see below)</td><td class="n">&pound;198.00</td></tr>
<tr class="sub"><td>Cost</td><td>What the job costs you before any profit</td><td class="n">&pound;2,218.00</td></tr>
<tr><td>Profit</td><td>A 20% margin: &pound;2,218 &divide; 0.8 = &pound;2,772.50</td><td class="n">&pound;554.50</td></tr>
<tr class="tot"><td>Price before tax</td><td></td><td class="n">&pound;2,772.50</td></tr>
</tbody></table>
<p>The example figures are made up; use your own costs and rate. If you are VAT registered, price materials before VAT, because you can reclaim the VAT you pay on them.</p>

<h2 id="margin">Markup or margin: the mistake that costs most</h2>
<p>Markup is profit as a share of your cost. Margin is profit as a share of the price. They are not the same number, and pricing with one while thinking of the other quietly lowers every quote.</p>
<table><thead><tr><th>On &pound;2,218 of cost</th><th class="n">Add 20% to cost</th><th class="n">Price for a 20% margin</th></tr></thead><tbody>
<tr><td>Price</td><td class="n">&pound;2,661.60</td><td class="n">&pound;2,772.50</td></tr>
<tr><td>Profit</td><td class="n">&pound;443.60</td><td class="n">&pound;554.50</td></tr>
<tr><td>Markup (profit &divide; cost)</td><td class="n">20%</td><td class="n">25%</td></tr>
<tr><td>Margin (profit &divide; price)</td><td class="n">16.7%</td><td class="n">20%</td></tr>
</tbody></table>
<p>To convert: margin = markup &divide; (1 + markup), and markup = margin &divide; (1 &minus; margin). A 25% markup is a 20% margin; a 20% markup is a 16.7% margin.</p>

<h2 id="rate">Working out your hourly rate and overheads</h2>
<p>Your labour rate and your overheads both depend on how many hours you can actually bill in a year, which is fewer than the hours you work. An example with made-up figures:</p>
<ol>
<li><strong>Billable hours:</strong> 46 working weeks &times; 5 days &times; 6 billable hours = 1,380 hours. Quoting, travel between jobs, admin and holidays are the hours you don&rsquo;t bill.</li>
<li><strong>Overheads per hour:</strong> van &pound;4,800 + insurance &pound;900 + tools &pound;1,500 + phone and software &pound;720 + accountant &pound;1,200 = &pound;9,120 a year, &divide; 1,380 = &pound;6.61 per billable hour.</li>
<li><strong>Labour rate:</strong> the yearly pay you need, say &pound;45,000, &divide; 1,380 = &pound;32.61 per billable hour.</li>
<li><strong>Cost per hour before profit:</strong> &pound;32.61 + &pound;6.61 = &pound;39.22. Anything you charge below this per billable hour loses money, however busy you are.</li>
</ol>

<h2 id="method">Fixed price, day rate or time and materials</h2>
<ul>
<li><strong>Fixed price:</strong> one price for a defined scope. Use it when you can see the whole job, and state what is excluded.</li>
<li><strong>Day rate or hourly rate:</strong> the rate, an estimated number of days and a cap that needs sign-off to exceed. Use it when the scope will change as the work goes on.</li>
<li><strong>Time and materials:</strong> hours at your rate plus materials at cost and an agreed handling charge. Use it for repairs and fault-finding, and call the document an estimate.</li>
</ul>
<p>Unknowns are better named than hidden. A labelled allowance or an exclusion (&ldquo;rotten timbers found after strip-out will be priced separately&rdquo;) keeps the quote fair to both sides; see <a href="/blog/what-is-a-quotation-in-business#quote-or-estimate">when to send a quote and when an estimate</a>.</p>

<h2 id="check">Checking the price before you send it</h2>
<ul>
<li>Compare the hours with the last similar job you did, using the hours it actually took rather than what you quoted.</li>
<li>Work out what the price earns per labour hour once materials are taken out: (price &minus; materials) &divide; hours. In the example that is (&pound;2,772.50 &minus; &pound;1,030) &divide; 22 = &pound;79.20, well above the &pound;39.22 cost per hour worked out above.</li>
<li>Round the total, then present it as priced lines, not one figure (<a href="/blog/how-to-write-a-professional-quote#lines">line items a client can check</a>).</li>
</ul>`,
    faq: [
      { q: 'What is the difference between markup and margin?', a: 'Markup is profit as a share of cost; margin is profit as a share of the price. A 25% markup on £100 of cost gives a £125 price, which is a 20% margin.' },
      { q: 'How do I work out a price from a profit margin?', a: 'Divide the cost by (1 minus the margin). For a 20% margin on £2,218 of cost: 2,218 ÷ 0.8 = £2,772.50, which leaves £554.50 of profit.' },
      { q: 'How much profit should I put on a quote?', a: 'There is no single right figure. Work out the margin your recent jobs actually made, once every hour and cost is counted, and price from that. Your own wage belongs in the labour line, not in the profit.' },
      { q: 'Should I charge for travel time?', a: 'If the travel is part of the job, include it in the labour hours or show it as its own line. Travel between jobs belongs in your overheads, which is why it reduces your billable hours.' },
      { q: 'How do I price materials on a quote?', a: 'At what they cost you, plus an allowance for waste and offcuts and any delivery or collection. If you are VAT registered, use prices before VAT, because you reclaim the VAT you pay.' }
    ],
    cta: { title: 'Turn the price into a quote', text: 'Put the figures into priced lines in the free quote maker and download the PDF. No signup.', href: '/#tool', label: 'Open the quote maker' },
    related: [
      ['/blog/how-to-write-a-professional-quote', 'Guide', 'How to write a professional quote'],
      ['/blog/vat-on-quotes-explained', 'Tax', 'VAT on quotes'],
      ['/quote-template-contractor', 'Template', 'Contractor and tradesman quote template']
    ]
  },
  // Rewritten 9 Oct 2026 (was "Crawled - currently not indexed"): annotated example, document comparison, sourced binding rules.
  'what-is-a-quotation-in-business': {
    answer: `<p><strong>A quotation</strong> (or quote) is a document a business sends before a sale or a job, offering to supply specific goods or services at a stated price, usually until a stated date. If the customer accepts it, the quote normally becomes the agreed price and scope for the job.</p>
<p>It is not an <strong>estimate</strong>, which is a best guess that can change, and not an <strong>invoice</strong>, which asks for payment once the work is done. Citizens Advice puts the first difference plainly: a quote is &ldquo;a promise to do work at an agreed price&rdquo;, an estimate is &ldquo;the trader&rsquo;s best guess&rdquo; (<a href="https://www.citizensadvice.org.uk/consumer/getting-home-improvements-done/problem-with-home-improvements/" rel="nofollow noopener" target="_blank">Citizens Advice</a>).</p>`,
    toc: [
      ['example', 'What a quotation looks like'],
      ['parts', 'What each part is for'],
      ['documents', 'Quotation, estimate, pro forma, invoice: which is which'],
      ['quote-or-estimate', 'When to send a quote and when an estimate'],
      ['pricing', 'Ways to price a quotation'],
      ['binding', 'When a quotation binds you'],
      ['validity', 'How long a quotation lasts']
    ],
    content: `
<h2 id="example">What a quotation looks like</h2>
<p>A quotation from a fencing contractor to a homeowner, with each part numbered. The business, the customer, the prices and the dates are made up.</p>
<div class="doc qdoc">
<div class="doc-h"><span><span class="qn">1</span><b>QUOTATION</b> Q-2026-114</span><span><span class="qn">2</span>12 October 2026, valid until 11 November 2026</span></div>
<div class="qparties">
<p><span class="qn">3</span><strong>From</strong> Brookside Fencing Ltd, Mill Lane, Harrogate. VAT no. GB 000 0000 00</p>
<p><span class="qn">4</span><strong>For</strong> Sam Taylor, Orchard Close, Harrogate</p>
</div>
<p class="qscope"><span class="qn">5</span>Replace the 11 m rear boundary fence and the side gate, as discussed on site on 9 October.</p>
<table><thead><tr><th><span class="qn">6</span>Description</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead><tbody>
<tr><td>Remove old fence and posts and take them away (metres)</td><td class="n">11</td><td class="n">&pound;12.00</td><td class="n">&pound;132.00</td></tr>
<tr><td>Concrete posts and gravel boards, supplied and set in concrete</td><td class="n">7</td><td class="n">&pound;58.00</td><td class="n">&pound;406.00</td></tr>
<tr><td>1.8 m featheredge panels, supplied and fitted</td><td class="n">6</td><td class="n">&pound;96.00</td><td class="n">&pound;576.00</td></tr>
<tr><td>Side gate with latch, supplied and hung</td><td class="n">1</td><td class="n">&pound;245.00</td><td class="n">&pound;245.00</td></tr>
<tr><td>Waste removal</td><td class="n">1</td><td class="n">&pound;85.00</td><td class="n">&pound;85.00</td></tr>
<tr class="sub"><td colspan="3">Subtotal</td><td class="n">&pound;1,444.00</td></tr>
<tr class="sub"><td colspan="3">VAT 20%</td><td class="n">&pound;288.80</td></tr>
<tr class="tot"><td colspan="3"><span class="qn">7</span>Total including VAT</td><td class="n">&pound;1,732.80</td></tr>
</tbody></table>
<div class="doc-f">
<p><span class="qn">8</span><strong>Not included:</strong> moving plants along the fence line, work on the neighbour&rsquo;s side, and pipes or cables that were not pointed out to us before work starts.</p>
<p><span class="qn">9</span><strong>Payment:</strong> &pound;300 deposit to book a date, balance within 7 days of completion by bank transfer.</p>
<p><span class="qn">10</span><strong>To accept:</strong> reply to the email this quote came with, or sign and return it. Signed ______________ Date __________</p>
</div>
</div>

<h2 id="parts">What each part is for</h2>
<ol class="qlegend">
<li><strong>Title and quote number.</strong> &ldquo;Quotation&rdquo; tells the customer this is an offer, not a bill. The number identifies this exact version, and it becomes the reference on the invoice later.</li>
<li><strong>Date and valid-until date.</strong> When the price was given and how long it stands. After that date you can re-quote at current prices.</li>
<li><strong>Your details.</strong> Legal or trading name, address and contact details, plus your VAT number if you are registered.</li>
<li><strong>The customer&rsquo;s details.</strong> Who the offer is made to. For a company, use its legal name.</li>
<li><strong>Scope.</strong> A sentence or two on what the job is and where, so the lines make sense to someone who wasn&rsquo;t at the site visit, such as a partner or an accounts team.</li>
<li><strong>Line items.</strong> Each piece of work or product with a quantity, a rate and a line total. Itemising shows what the money buys and lets the customer change one item instead of turning down the whole quote.</li>
<li><strong>Tax and total.</strong> Subtotal, VAT and total. A homeowner should see the total including VAT; a business compares prices before VAT (<a href="/blog/vat-on-quotes-explained">VAT on quotes</a>).</li>
<li><strong>Exclusions.</strong> What the price does not cover. Most arguments about a quoted job start with something each side assumed differently.</li>
<li><strong>Payment terms.</strong> Any deposit, when the balance is due and how to pay.</li>
<li><strong>How to accept.</strong> One clear action: reply, sign or pay the deposit (<a href="/quote-acceptance-template#seller-templates">acceptance wording to put on a quote</a>).</li>
</ol>

<h2 id="documents">Quotation, estimate, pro forma, invoice: which is which</h2>
<table><thead><tr><th>Document</th><th>Sent by</th><th>When</th><th>Is the price fixed?</th></tr></thead><tbody>
<tr><td>Request for quotation (RFQ)</td><td>Buyer</td><td>Before choosing a supplier</td><td>No price yet: it asks suppliers to quote for a stated need</td></tr>
<tr><td>Quotation</td><td>Seller</td><td>Before the work or sale</td><td>Yes, for the work described, until the valid-until date</td></tr>
<tr><td>Estimate</td><td>Seller</td><td>Before the work, when the scope is uncertain</td><td>No: a best guess that can change</td></tr>
<tr><td>Proposal</td><td>Seller</td><td>Before larger or advisory work</td><td>Usually contains a quote, plus the approach and timetable</td></tr>
<tr><td>Tender (bid)</td><td>Seller</td><td>In reply to a formal invitation to tender</td><td>Yes, in the buyer&rsquo;s format and on the buyer&rsquo;s terms</td></tr>
<tr><td>Purchase order</td><td>Buyer</td><td>After accepting a quote</td><td>Confirms the order and price; put its number on your invoice</td></tr>
<tr><td>Pro forma invoice</td><td>Seller</td><td>Before supply, when payment comes first</td><td>Yes. In the UK it is not a VAT invoice and should say so (<a href="https://www.gov.uk/guidance/vat-guide-notice-700#pro-forma-invoices" rel="nofollow noopener" target="_blank">VAT Notice 700, 17.3</a>)</td></tr>
<tr><td>Invoice</td><td>Seller</td><td>After the work, or at an agreed stage</td><td>Asks for the agreed price plus any agreed extras</td></tr>
</tbody></table>
<p>Turning an accepted quote into the invoice, with deposits and extras, is shown step by step in <a href="/how-to-convert-a-quote-to-an-invoice">how to convert a quote to an invoice</a>.</p>

<h2 id="quote-or-estimate">When to send a quote and when an estimate</h2>
<ul>
<li><strong>Send a quote</strong> when you can see the whole job: a measured room, a known parts list, a defined deliverable. It gives the customer a fixed price to compare and to accept.</li>
<li><strong>Send an estimate</strong> when you can&rsquo;t know the scope until you start, such as a repair behind a wall. Call it an estimate on the document and say what could change the price.</li>
<li><strong>Or quote, and name the unknowns.</strong> Price everything you can see, then list the unknowns as exclusions or as a clearly labelled allowance (a provisional sum) that will be adjusted to the actual cost.</li>
</ul>

<h2 id="pricing">Ways to price a quotation</h2>
<table><thead><tr><th>Format</th><th>How the price is set</th><th>Suits</th></tr></thead><tbody>
<tr><td>Fixed price</td><td>One total for a defined scope</td><td>Small, well-defined jobs</td></tr>
<tr><td>Itemised</td><td>A price per line, adding up to the total</td><td>Most trade and project work</td></tr>
<tr><td>Options</td><td>Two or three versions, each with its own total</td><td>Letting the customer choose the specification</td></tr>
<tr><td>Rate-based</td><td>A rate per hour, day, m&sup2; or unit, with an estimated quantity</td><td>Work measured on completion</td></tr>
<tr><td>With allowances</td><td>Fixed prices plus provisional sums for unknowns</td><td>Building work with hidden conditions</td></tr>
</tbody></table>

<h2 id="binding">When a quotation binds you</h2>
<p>A quote is an offer. When the customer accepts it as written, before it expires, that normally forms an agreement: you do the work described and they pay the quoted price. Three things follow from that:</p>
<ul>
<li><strong>Accepting with changes is not accepting.</strong> A reply that accepts &ldquo;if you can do it for &pound;1,500&rdquo; is a counter-offer, and nothing is agreed until you confirm.</li>
<li><strong>What you write counts.</strong> For consumers, what a trader says or writes about the service, when the consumer takes it into account, is treated as a term of the contract (<a href="https://www.legislation.gov.uk/ukpga/2015/15/section/50" rel="nofollow noopener" target="_blank">Consumer Rights Act 2015, s.50</a>). Keep the scope and the exclusions accurate.</li>
<li><strong>Higher costs don&rsquo;t justify a higher bill.</strong> Citizens Advice says a trader can&rsquo;t charge more than they quoted because their own costs have gone up. The valid-until date is what protects you from price rises, not the invoice.</li>
</ul>
<p>Acceptance wording, the 14-day cancellation right for jobs agreed at a customer&rsquo;s home, and accepting only part of a quote are covered in <a href="/quote-acceptance-template#binding">quote acceptance wording</a>.</p>

<h2 id="validity">How long a quotation lasts</h2>
<p>As long as the date on it says. Pick a period that suits your costs, such as 30 days, or 14 to 21 days if your material prices move quickly. A quote without a date leaves it unclear how long the price stands. If you need to change a quote before it is accepted, send a revised version with a new revision number (Q-2026-114 rev. 2) and say that it replaces the earlier one.</p>
<p class="src">Sources checked 9 October 2026: Citizens Advice; Consumer Rights Act 2015, s.50; HMRC VAT Notice 700 (updated 25 June 2026). General information, not legal advice.</p>`,
    faq: [
      { q: 'Is a quotation the same as an invoice?', a: 'No. A quotation offers a price before the work; an invoice asks for payment after it, or at an agreed stage. Once a quote is accepted, the invoice should match it line for line, plus any extras the customer agreed.' },
      { q: 'Is a quotation legally binding?', a: 'It becomes binding when the customer accepts it as written, before it expires. Until then it is an offer, and a reply that accepts with changes is a counter-offer that binds nobody until the other side agrees.' },
      { q: 'What is the difference between a quotation and an estimate?', a: 'A quotation is a fixed price for the work described. An estimate is a best guess that can change. Citizens Advice describes a quote as "a promise to do work at an agreed price" and an estimate as "the trader’s best guess".' },
      { q: 'What is a quotation number?', a: 'A unique reference for each quote, such as Q-2026-114. It identifies the exact version the customer accepted, and it is quoted on the invoice later. Number quotes in their own sequence, separate from invoices.' },
      { q: 'Does a quotation need to include VAT?', a: 'If you are VAT registered, show the VAT rate, the VAT amount and the total including VAT. If you are not registered, don’t add VAT. A price that does not mention VAT is treated as including it.' }
    ],
    cta: { title: 'Make a quotation like the example', text: 'Free quotation maker: quote number, line items, VAT, a valid-until date and your terms, downloaded as a PDF. No signup.', href: '/?preset=fencing-uk#tool', label: 'Open the example in the quote maker' },
    related: [
      ['/how-to-convert-a-quote-to-an-invoice', 'How-to', 'How to convert a quote to an invoice'],
      ['/quote-acceptance-template', 'Templates', 'Quote acceptance wording'],
      ['/blog/how-to-write-a-professional-quote', 'Guide', 'How to write a professional quote']
    ]
  },

  // Rewritten 9 Oct 2026 ("URL is unknown to Google", 193 words): section order, wording to copy, before and after.
  'how-to-write-a-professional-quote': {
    answer: `<p><strong>The short answer:</strong> write the quote in the order the client reads it. Say what they asked for in a line, list the work as priced lines with quantities, say what is not included, show tax and the total, then give the terms: when you can start, how changes are priced, the deposit and payment, how long the price stands and exactly how to accept. Wording for each part is below, ready to copy.</p>`,
    toc: [
      ['order', 'The eight parts, in order'],
      ['lines', 'Line items a client can check'],
      ['wording', 'Wording to copy'],
      ['example', 'Before and after: one quote rewritten'],
      ['check', 'Check before you send']
    ],
    content: `
<h2 id="order">The eight parts, in order</h2>
<ol>
<li><strong>Header:</strong> the word &ldquo;Quotation&rdquo;, a quote number, the date and a valid-until date, then your business details and the client&rsquo;s. Every part is labelled in <a href="/blog/what-is-a-quotation-in-business#example">this annotated example</a>.</li>
<li><strong>What they asked for:</strong> a line or two in the client&rsquo;s own words, with the address or project name.</li>
<li><strong>The work, priced line by line:</strong> each line with a quantity, a unit, a rate and an amount.</li>
<li><strong>What is not included:</strong> the things this client is likely to assume are in the price.</li>
<li><strong>Tax and total:</strong> subtotal, tax rate and amount, and the total. The VAT rules are in <a href="/blog/vat-on-quotes-explained">VAT on quotes</a>.</li>
<li><strong>Timing:</strong> your earliest start date and how long the work takes.</li>
<li><strong>Terms:</strong> how changes are priced, the deposit and payment schedule, and any guarantee.</li>
<li><strong>How to accept:</strong> one action, and what happens after it.</li>
</ol>

<h2 id="lines">Line items a client can check</h2>
<p>Clients compare quotes line by line and ask about anything they can&rsquo;t picture. Name the work, give the quantity and its unit, and say what the price covers.</p>
<table><thead><tr><th>Vague</th><th>Clear</th></tr></thead><tbody>
<tr><td>Bathroom works</td><td>Remove the existing bath, basin and WC, and take away the waste</td></tr>
<tr><td>Tiling</td><td>Wall tiling to full height, 22 m&sup2;, tiles supplied by you</td></tr>
<tr><td>Materials</td><td>Plasterboard, adhesive, grout and fixings, itemised on request</td></tr>
<tr><td>Labour</td><td>Fitting: 3 days, two people</td></tr>
<tr><td>Website</td><td>Design and build of 5 page templates in WordPress, with 2 rounds of changes</td></tr>
</tbody></table>
<p>Three habits make lines easier to accept: use the client&rsquo;s words for rooms and features, put any allowance for something not yet chosen on its own labelled line, and give options as separate lines or sections instead of a note at the bottom.</p>

<h2 id="wording">Wording to copy</h2>
<p>Replace everything in square brackets.</p>
<blockquote><strong>Scope:</strong> This quotation covers [the work] at [address], as discussed on site on [date]. It is based on [the measurements, drawings or specification dated ...].</blockquote>
<blockquote><strong>Not included:</strong> [Decorating after the work], [moving furniture], and repairs to hidden defects found once work starts, which we will price and agree with you before doing them.</blockquote>
<blockquote><strong>Changes:</strong> Any change to the work described will be priced in writing and agreed with you before we do it.</blockquote>
<blockquote><strong>Timing:</strong> Earliest start [date]. The work takes about [5 working days].</blockquote>
<blockquote><strong>Payment:</strong> [25%] deposit to confirm the start date, balance within [7] days of completion by bank transfer.</blockquote>
<blockquote><strong>Tax (business clients):</strong> Prices are shown before VAT. VAT at 20% is added to the total.</blockquote>
<blockquote><strong>Validity:</strong> This quotation is valid until [date]. After that we may need to update the price.</blockquote>
<blockquote><strong>Accepting:</strong> To accept, reply to this email or sign and return the quote. We will confirm your start date within one working day.</blockquote>
<p>More acceptance wording, including a signature block, is in <a href="/quote-acceptance-template#seller-templates">quote acceptance wording</a>.</p>

<h2 id="example">Before and after: one quote rewritten</h2>
<p>The same kitchen job, quoted twice. The first version leaves the client to guess; the second answers the questions before they are asked. Prices are made up.</p>
<div class="doc">
<div class="doc-h"><span><b>BEFORE</b> one line</span><span>No number, no dates</span></div>
<table><tbody><tr><td>Kitchen refit, supply and fit</td><td class="n">&pound;8,400</td></tr></tbody></table>
<div class="doc-f">Payment on completion. The client can&rsquo;t tell whether VAT is included, what is in the price, when the work starts, or how long the price stands.</div>
</div>
<div class="doc">
<div class="doc-h"><span><b>QUOTATION</b> Q-2026-207</span><span>5 October 2026, valid until 4 November 2026</span></div>
<p class="qscope">Replace the kitchen at 3 Elm Road with the units, worktops and layout agreed on site on 2 October.</p>
<table><thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead><tbody>
<tr><td>Remove the existing kitchen and take away the waste</td><td class="n">1</td><td class="n">&pound;650.00</td><td class="n">&pound;650.00</td></tr>
<tr><td>Supply and fit 12 units, worktops and sink, as agreed</td><td class="n">1</td><td class="n">&pound;4,200.00</td><td class="n">&pound;4,200.00</td></tr>
<tr><td>Plumbing: sink, dishwasher and washing machine connections</td><td class="n">1</td><td class="n">&pound;580.00</td><td class="n">&pound;580.00</td></tr>
<tr><td>Electrics: 6 sockets, under-unit lights, hob and oven circuits, certificate</td><td class="n">1</td><td class="n">&pound;1,120.00</td><td class="n">&pound;1,120.00</td></tr>
<tr><td>Wall tiling between worktop and wall units (m&sup2;)</td><td class="n">6</td><td class="n">&pound;75.00</td><td class="n">&pound;450.00</td></tr>
<tr class="sub"><td colspan="3">Subtotal</td><td class="n">&pound;7,000.00</td></tr>
<tr class="sub"><td colspan="3">VAT 20%</td><td class="n">&pound;1,400.00</td></tr>
<tr class="tot"><td colspan="3">Total including VAT</td><td class="n">&pound;8,400.00</td></tr>
</tbody></table>
<div class="doc-f"><p><strong>Not included:</strong> decorating, appliances, and hidden defects found when the old units come out (priced and agreed before any work).</p><p><strong>Timing and payment:</strong> start 9 November, about 8 working days; &pound;1,000 deposit to book, balance within 7 days of completion.</p><p><strong>To accept:</strong> reply &ldquo;accepted&rdquo; to the email this quote came with.</p></div>
</div>

<h2 id="check">Check before you send</h2>
<ul>
<li>The quote number, the date and the valid-until date are filled in.</li>
<li>Every line has a quantity and a unit, and the lines add up to the subtotal.</li>
<li>Tax is shown, or the quote says you are not VAT registered.</li>
<li>The exclusions name the things this client is likely to assume.</li>
<li>There is one way to accept, written as an instruction.</li>
<li>The PDF reads well on a phone, and the client&rsquo;s name is spelled correctly.</li>
</ul>
<p>Then send it the same day if you can, with the total and the valid-until date in the email itself: <a href="/how-to-send-a-quote-to-a-client">quote email templates</a>. The price behind the lines is worked out in <a href="/blog/how-to-price-a-job-quote">how to price a job quote</a>.</p>`,
    faq: [
      { q: 'What should a professional quote include?', a: 'A quote number, the date and a valid-until date, your details and the client\u2019s, a one-line scope, priced lines with quantities, what is not included, tax and the total, timing, how changes are priced, payment terms and how to accept.' },
      { q: 'Should I itemise a quote or give one price?', a: 'Itemise. A single figure gives the client nothing to check, so the only thing they can compare is the total. Priced lines show what the money buys and let the client drop or change one item instead of turning down the whole quote.' },
      { q: 'How long should a quote be valid for?', a: 'Choose a period that matches how quickly your costs move, such as 30 days, or 14 to 21 days if your material prices change often, and write the actual date on the quote.' },
      { q: 'Should I send a quote as a PDF or a Word document?', a: 'Send a PDF. It looks the same on every phone and computer and the client cannot change the figures by accident. Keep the editable version for yourself.' },
      { q: 'How do I make a quote look professional?', a: 'Use your business name and contact details, a quote number, clear dates, a clean table of priced lines, and send it as a PDF rather than a Word file. Keep the wording plain and specific.' }
    ],
    cta: { title: 'Write the quote in the quote maker', text: 'Free quotation maker: quote number, priced lines, VAT, a valid-until date and your terms, downloaded as a PDF. No signup.', href: '/#tool', label: 'Open the quote maker' },
    related: [
      ['/blog/what-is-a-quotation-in-business', 'Guide', 'What is a quotation in business?'],
      ['/blog/how-to-price-a-job-quote', 'Pricing', 'How to price a job quote'],
      ['/how-to-send-a-quote-to-a-client', 'Templates', 'How to send a quote by email']
    ]
  }
};

// Old URLs that competed with stronger pages for the same query.
const REDIRECTS = {
  '/blog/how-to-write-quote-email': '/how-to-send-a-quote-to-a-client',
  '/blog/quote-template-construction': '/quote-template-builder',
  '/blog/contractor-quotation-guide': '/quote-template-contractor',
  '/blog/free-quote-template-guide': '/',
  '/how-to-write-a-quote-for-plumbing': '/quote-template-plumber',
  '/how-to-quote-for-cleaning-services': '/quote-template-cleaner',
  '/how-to-write-a-quote-for-construction': '/quote-template-builder',
  '/how-to-quote-for-web-design': '/quote-template-web-designer',
  '/how-to-quote-for-landscaping': '/quote-template-landscaper',
  // 2026-10-07 consolidation: thin or duplicate pages merged into the page that ranks.
  '/blog/tradesman-quote-template': '/quote-template-contractor',
  '/blog/free-quote-generator-netherlands-guide': '/free-quote-generator-netherlands',
  '/quote-template-carpenter': '/quote-template-contractor',
  '/quote-template-roofer': '/how-to-write-a-roofing-quote',
  '/free-quote-generator-usa': '/',
  '/contractor-quote-template.docx': '/templates/contractor-quote-template.docx',
  '/tradesman-quote-template.docx': '/templates/tradesman-quote-template.docx',
  // 2026-10-09: "Crawled - currently not indexed" with 0 impressions in 16 months. Its table and
  // definitions now open the convert guide, which shows the same job as a quote and as invoices.
  '/blog/quote-vs-invoice-difference': '/how-to-convert-a-quote-to-an-invoice',
  // 2026-10-09: "URL is unknown to Google", 0 impressions in 16 months. Its schedule and four scripts repeated the
  // follow-up section of the send-quote guide (859 impressions in 90 days); its "what not to do" list moved there.
  '/blog/how-to-follow-up-on-a-quote': '/how-to-send-a-quote-to-a-client#follow-up'
};

module.exports = { PROFESSION_GUIDES, HOWTO_CONTENT, BLOG_CONTENT, REDIRECTS };
