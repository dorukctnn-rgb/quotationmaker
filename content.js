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

  'how-to-convert-a-quote-to-an-invoice': `
<p>When a client accepts your quote, the invoice should match it exactly: the same line items, prices and tax, plus any variations the client agreed in writing. Here's how to convert one into the other cleanly.</p>
<h2>Step by step</h2>
<ol>
<li><strong>Confirm acceptance in writing.</strong> Keep the client's "accepted" email or signed quote with the job file.</li>
<li><strong>Copy the line items.</strong> Use the same descriptions, quantities and rates. Clients compare the two documents.</li>
<li><strong>Add agreed variations as separate lines,</strong> each referencing the written approval (for example "Variation 1: extra socket, approved by email 12 Oct").</li>
<li><strong>Deduct deposits already paid,</strong> as a negative line: "Less deposit received 3 Oct: &minus;&pound;1,690".</li>
<li><strong>Change the document type and number.</strong> Invoices have their own sequence (INV-), and should reference the quote number (Q-).</li>
<li><strong>Add the invoice date, due date and payment details.</strong> A quote has a validity date; an invoice has a due date.</li>
</ol>
<h2>Quote versus invoice fields</h2>
<table><thead><tr><th>Field</th><th>Quote</th><th>Invoice</th></tr></thead><tbody>
<tr><td>Number</td><td>Q-2026-031</td><td>INV-2026-058 (ref. Q-2026-031)</td></tr>
<tr><td>Date field</td><td>Valid until</td><td>Due date</td></tr>
<tr><td>Purpose</td><td>Offer, not yet binding</td><td>Request for payment</td></tr>
<tr><td>Payment details</td><td>Deposit terms</td><td>Bank details or payment link</td></tr>
</tbody></table>
<h2>Doing it in GetQuotationMaker</h2>
<p>With <a href="/#pricing">Pro</a> ($9 one-time), the quote maker downloads the same quote as an invoice PDF: same line items, tax and totals, with an invoice number, invoice date, due date and a reference to the quote number. On the free plan, build the matching invoice in our free sister tool, <a href="https://getinvoicemaker.com/">GetInvoiceMaker</a>, which also needs no signup.</p>`
};

const BLOG_CONTENT = {
  'quote-acceptance-rate-tips': `
<div class="note"><strong>Looking for the words to accept or confirm a quote?</strong> Copy the email and letter templates in our <a href="/quote-acceptance-template">quote acceptance wording guide</a>. This article is about the other side: getting more of the quotes you send accepted.</div>
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
<p>Follow up three to five days after sending, again a week later with something useful, and once more before the quote expires. Our <a href="/how-to-send-a-quote-to-a-client#follow-up">follow-up email templates</a> and <a href="/blog/how-to-follow-up-on-a-quote">follow-up guide</a> have wording for each step.</p>
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

  'quote-vs-invoice-difference': `
<p>A quote is an offer to do work for a stated price. An invoice is a request for payment after the work is done or goods are delivered. You send a quote before the job and an invoice after it.</p>
<table><thead><tr><th></th><th>Quote</th><th>Invoice</th></tr></thead><tbody>
<tr><td>When</td><td>Before work starts</td><td>After work is delivered (or at agreed milestones)</td></tr>
<tr><td>Purpose</td><td>Tells the client what it will cost</td><td>Asks the client to pay</td></tr>
<tr><td>Key date</td><td>Valid until</td><td>Payment due</td></tr>
<tr><td>Accounting</td><td>No accounting entry</td><td>Creates a receivable and, if registered, a tax liability</td></tr>
<tr><td>Binding?</td><td>Becomes binding once accepted</td><td>Records a debt that is owed</td></tr>
</tbody></table>
<h2>Quote, estimate or proposal?</h2>
<p>In the UK and many other places a <strong>quote</strong> is generally treated as a fixed price for the work described, while an <strong>estimate</strong> is an educated guess that can change. A <strong>proposal</strong> is broader: it explains your approach and often contains a quote. If your price might move, call it an estimate and say what could change it.</p>
<h2>Moving from one to the other</h2>
<p>Once a client accepts, your invoice should mirror the quote line by line, plus any agreed changes. See <a href="/how-to-convert-a-quote-to-an-invoice">how to convert a quote to an invoice</a>.</p>`,

  'how-to-follow-up-on-a-quote': `
<p>Many quotes that go unanswered aren't rejected. The client got busy, forwarded it to someone else, or is comparing prices. A well-timed follow-up wins a lot of that work back.</p>
<h2>When to follow up</h2>
<ul>
<li><strong>Day 1:</strong> send the quote with a clear next step.</li>
<li><strong>Day 3&ndash;5:</strong> check it arrived and offer to answer questions.</li>
<li><strong>A few days before it expires:</strong> remind them of the validity date and your availability.</li>
<li><strong>After it expires:</strong> one last note offering to re-quote if the timing changes.</li>
</ul>
<h2>Scripts you can use</h2>
<blockquote><strong>First follow-up:</strong> Hi Alex, just checking our quote for the bathroom came through OK. Happy to walk through any of the line items, or adjust the tiling allowance if you'd prefer a different finish.</blockquote>
<blockquote><strong>Before expiry:</strong> Hi Alex, a quick heads-up that our quote is valid until Friday. We can still hold the 14 November start date for you. Just reply and I'll book it in.</blockquote>
<blockquote><strong>After expiry:</strong> Hi Alex, I'll close this one off on my side. If the project comes back on, I'm happy to update the quote. Prices for materials may have changed, but I'll keep it as close as I can.</blockquote>
<h2>What not to do</h2>
<ul>
<li>Don't discount in the first follow-up. It teaches clients to wait.</li>
<li>Don't send "just checking in" with nothing else. Add something useful: a date, an option, an answer.</li>
<li>Don't follow up more than three times.</li>
</ul>
<p>Copy ready-made wording for every step in our <a href="/how-to-send-a-quote-to-a-client#follow-up">quote follow-up email templates</a>.</p>`,

  'vat-on-quotes-explained': `
<p>If you are VAT registered, your quotes should show VAT so the client knows the real cost. If you aren&rsquo;t registered, you must not add VAT. That applies in the UK and in most countries with a VAT or GST system.</p>
<h2>UK VAT rate and registration threshold</h2>
<ul>
<li>The standard rate of VAT is <strong>20%</strong>, with a reduced rate of 5% and a zero rate for some goods and services (<a href="https://www.gov.uk/vat-rates" rel="nofollow noopener" target="_blank">GOV.UK: VAT rates</a>).</li>
<li>You must register for VAT if your taxable turnover goes over <strong>&pound;90,000</strong> in the last 12 months, or you expect it to in the next 30 days. You can register voluntarily below that (<a href="https://www.gov.uk/register-for-vat" rel="nofollow noopener" target="_blank">GOV.UK: register for VAT</a>).</li>
</ul>
<h2>How to show VAT on a quote</h2>
<ul>
<li>List each item at its price <strong>excluding VAT</strong>.</li>
<li>Show the <strong>subtotal</strong>, the <strong>VAT rate and amount</strong>, and the <strong>total including VAT</strong>.</li>
<li>Include your VAT registration number. It is required on VAT invoices (<a href="https://www.gov.uk/guidance/vat-guide-notice-700" rel="nofollow noopener" target="_blank">VAT Notice 700</a>), so putting it on the quote keeps the two documents consistent.</li>
</ul>
<p>Example: labour &pound;1,800 + materials &pound;1,200 = &pound;3,000; VAT at 20% = &pound;600; total &pound;3,600.</p>
<p>A quote is not a VAT invoice. The client reclaims VAT, if they can, from the invoice you send once the work is done.</p>
<h2>Quoting consumers versus businesses</h2>
<p>Businesses that are VAT registered usually reclaim VAT, so they compare net prices. Consumers pay the full amount, and UK guidance says prices for consumers must include VAT and other mandatory charges up front (<a href="https://www.gov.uk/government/publications/price-transparency-cma209/providing-clear-and-accurate-information-about-prices-summary" rel="nofollow noopener" target="_blank">CMA price transparency guidance</a>). For homeowners, lead with the VAT-inclusive total.</p>
<h2>Reduced and zero rates</h2>
<p>Some work carries a reduced or zero rate. In the UK, for example, a zero rate applies to installing certain energy-saving materials in homes until 31 March 2027 (<a href="https://www.gov.uk/guidance/vat-on-energy-saving-materials-and-heating-equipment-notice-7086" rel="nofollow noopener" target="_blank">VAT Notice 708/6</a>). Check the rules for your trade, and show each rate separately if a quote mixes them.</p>
<h2>What if you register for VAT after quoting?</h2>
<p>If you become VAT registered before the work is invoiced, you may have to charge VAT even though the quote didn&rsquo;t show it. That&rsquo;s a good reason to note on quotes that "prices exclude VAT, which will be added if applicable", or to agree the position with your accountant first.</p>
<p class="src">Figures last checked 7 October 2026 on GOV.UK.</p>`,

  'how-to-price-a-job-quote': `
<p>Underpricing is the most common quoting mistake. It wins the job and loses the money. Build every price from the same four parts.</p>
<h2>1. Materials</h2>
<p>Cost every item, add a waste allowance (typically 5&ndash;15% depending on the material) and add delivery. Many trades add a handling margin on materials to cover ordering and collection time.</p>
<h2>2. Labour</h2>
<p>Estimate the hours honestly, including setup, cleanup and travel, and multiply by your rate. Your rate must cover more than wages: it has to pay for unbillable time such as quoting, admin and travel.</p>
<h2>3. Overheads</h2>
<p>Insurance, vehicle, tools, software, phone and accounting. Divide your annual overheads by your billable hours to get an overhead cost per hour, and make sure your rate covers it.</p>
<h2>4. Profit</h2>
<p>Profit is not the same as your wage. Add a margin on top, often 10&ndash;20%, so the business can absorb mistakes and invest.</p>
<h2>A worked example</h2>
<table><thead><tr><th>Part</th><th>Calculation</th><th>Amount</th></tr></thead><tbody>
<tr><td>Materials</td><td>&pound;900 + 10% waste + &pound;40 delivery</td><td>&pound;1,030</td></tr>
<tr><td>Labour</td><td>22 h &times; &pound;45</td><td>&pound;990</td></tr>
<tr><td>Overheads</td><td>22 h &times; &pound;9</td><td>&pound;198</td></tr>
<tr><td>Subtotal</td><td></td><td>&pound;2,218</td></tr>
<tr><td>Profit</td><td>15%</td><td>&pound;333</td></tr>
<tr><td><strong>Quote price (ex. VAT)</strong></td><td></td><td><strong>&pound;2,551</strong></td></tr>
</tbody></table>
<p>Round sensibly and present it in the <a href="/">quote tool</a> as clear line items rather than one number.</p>`,

  'what-is-a-quotation-in-business': `
<p>A quotation (or quote) is a document a business sends to a potential customer that sets out what it will provide and at what price, before any work is done. Once the customer accepts it, it usually forms the basis of the contract.</p>
<h2>What a quotation contains</h2>
<ul>
<li>Your business details and the customer's details</li>
<li>A quote number and date</li>
<li>A description of the goods or services, with quantities and prices</li>
<li>Tax, if you are registered</li>
<li>Terms: validity period, payment terms, exclusions</li>
</ul>
<h2>Types of quotation</h2>
<ul>
<li><strong>Fixed-price quote:</strong> one price for a defined scope.</li>
<li><strong>Itemised quote:</strong> a price for each part, so the customer can remove or change items.</li>
<li><strong>Estimate:</strong> an approximate price that may change, with the reasons it could change.</li>
<li><strong>Tender:</strong> a formal quote in response to a request for tender, often with a set format.</li>
</ul>
<h2>Is a quotation legally binding?</h2>
<p>A quote is an offer. Once the customer accepts it, you've generally agreed to do the work for that price, which is why validity dates, exclusions and variation terms matter. Rules differ by country, so treat large quotes like contracts.</p>
<p>Create one in our <a href="/">free quotation maker</a>.</p>`,

  'how-to-write-a-professional-quote': `
<p>A professional quote wins work because it's easy to understand and easy to accept. Follow these steps.</p>
<h2>1. Start with the client's problem</h2>
<p>Restate what they asked for in one or two lines. It shows you listened and frames everything that follows.</p>
<h2>2. Break the work into line items</h2>
<p>Show each task or product with a quantity and rate. Itemised quotes are trusted more than a single figure and let clients adjust scope instead of walking away.</p>
<h2>3. Be explicit about what's excluded</h2>
<p>Exclusions prevent most disputes: permits, making good, disposal, content, travel. If it isn't in the quote, say so.</p>
<h2>4. Show tax correctly</h2>
<p>If you're registered, show the subtotal, tax and total. Consumers should see the tax-inclusive price clearly.</p>
<h2>5. Add terms</h2>
<p>Include validity (30 days is common), start date and duration, deposit and payment schedule, and how changes are priced.</p>
<h2>6. Make accepting easy</h2>
<p>End with one clear action: "Reply 'accepted' to book your start date." See our <a href="/quote-acceptance-template">quote acceptance wording</a>.</p>
<h2>7. Send it fast and follow up</h2>
<p>Send within a day, then follow up after a few days. See <a href="/how-to-send-a-quote-to-a-client">how to send a quote to a client</a>.</p>`
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
  '/tradesman-quote-template.docx': '/templates/tradesman-quote-template.docx'
};

module.exports = { PROFESSION_GUIDES, HOWTO_CONTENT, BLOG_CONTENT, REDIRECTS };
