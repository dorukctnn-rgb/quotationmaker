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

  mechanic: `
<h2>What goes on an auto repair quote</h2>
<p>A clear repair estimate protects the shop and the customer. Many places, including several US states, require a written estimate before paid repair work starts, so it's good practice everywhere. List:</p>
<ul>
<li><strong>Vehicle details:</strong> make, model, year, registration or VIN, and mileage.</li>
<li><strong>Reported problem and diagnosis:</strong> what the customer described and what you found.</li>
<li><strong>Parts:</strong> each part with part number or description, OEM or aftermarket, quantity and price.</li>
<li><strong>Labour:</strong> hours per job multiplied by your hourly rate. Book time from a labour guide keeps quotes consistent.</li>
<li><strong>Diagnostics, shop supplies and disposal fees:</strong> shown as separate lines rather than hidden in labour.</li>
<li><strong>Tax, total and validity:</strong> parts prices move, so a short validity such as 7 or 14 days is common.</li>
<li><strong>Authorisation:</strong> a line for the customer to approve the work, and a note that anything extra found during the repair will be quoted before it's done.</li>
</ul>
<h2>Example: brake repair quote</h2>
<table><thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>
<tr><td>Front brake pads (ceramic)</td><td>1 set</td><td>$68.00</td><td>$68.00</td></tr>
<tr><td>Front brake discs</td><td>2</td><td>$54.00</td><td>$108.00</td></tr>
<tr><td>Labour: replace pads and discs</td><td>1.6 h</td><td>$110.00</td><td>$176.00</td></tr>
<tr><td>Brake fluid top-up and disposal</td><td>1</td><td>$15.00</td><td>$15.00</td></tr>
<tr><td colspan="3"><strong>Subtotal</strong></td><td><strong>$367.00</strong></td></tr>
</tbody></table>
<p>Add your local sales tax or VAT on top. If you quote customers in the UK, show the total including VAT. The quote tool above lets you set the tax rate and a validity date.</p>`,

  contractor: `
<h2>Contractor quotation format</h2>
<p>A contractor quotation should let the client compare your price line by line against other bids. The format that works best splits the job into stages, with labour and materials shown separately:</p>
<ol>
<li><strong>Project and site details:</strong> address, a short description of the work, and the date of your site visit.</li>
<li><strong>Itemised work:</strong> each stage or task with quantity, unit (m&sup2;, linear metre, day), rate and amount.</li>
<li><strong>Materials:</strong> either itemised or as an allowance, with who supplies what.</li>
<li><strong>Exclusions:</strong> for example permits, skip hire, making good after other trades, or unforeseen structural work.</li>
<li><strong>Stage payments:</strong> for example 20% deposit, 40% at first fix, 40% on completion.</li>
<li><strong>Variations:</strong> how changes requested during the job are priced and approved (in writing, before the work).</li>
<li><strong>Validity, start date and duration.</strong></li>
</ol>
<h2>Labour contractor quotation format (labour only)</h2>
<p>When the client supplies materials, quote labour by unit of work so the price scales with the job:</p>
<table><thead><tr><th>Work item</th><th>Unit</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>
<tr><td>Brickwork, 230 mm wall</td><td>m&sup2;</td><td>42</td><td>$38</td><td>$1,596</td></tr>
<tr><td>Internal plastering</td><td>m&sup2;</td><td>120</td><td>$14</td><td>$1,680</td></tr>
<tr><td>Floor tiling</td><td>m&sup2;</td><td>35</td><td>$22</td><td>$770</td></tr>
<tr><td colspan="4"><strong>Total labour</strong></td><td><strong>$4,046</strong></td></tr>
</tbody></table>
<p>State clearly that materials, scaffolding and equipment hire are excluded (or list what you provide), and who is responsible for site clean-up.</p>`,

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
  'how-to-send-a-quote-to-a-client': `
<p>How you send a quote affects whether it gets accepted. The goal is a quote the client can understand in a minute, forward to whoever approves spending, and accept without calling you.</p>
<h2>1. Send a PDF, not a Word file or a message</h2>
<p>A PDF looks the same on every device and can't be edited by accident. Name it clearly, for example <code>Quote-Q-2026-031_Acme-Kitchen.pdf</code>. A price in a WhatsApp message is easy to lose and hard to approve.</p>
<h2>2. Send it quickly</h2>
<p>Send the quote while the conversation is fresh, ideally within a day of the site visit or call. Speed signals that you're organised, and clients often choose whoever answered first.</p>
<h2>3. Write a short covering email</h2>
<p><strong>Subject:</strong> <em>Quote Q-2026-031: kitchen refit, 14 Elm Road (valid until 30 Oct)</em></p>
<blockquote>Hi Sarah,<br><br>Thanks for showing me the kitchen on Tuesday. Please find attached our quote for the refit, totalling &pound;8,450 including VAT.<br><br>It covers removal of the old units, new electrics to the island, fitting of the units you chose and tiling. Plastering of the back wall is not included.<br><br>We can start on 3 November, and the work takes about two weeks. The quote is valid until 30 October. To go ahead, just reply "accepted" or sign the attached PDF.<br><br>Any questions, call me on 07700 900123.<br><br>Best,<br>Tom</blockquote>
<h2>4. Make accepting easy</h2>
<p>Tell the client exactly how to say yes: reply to the email, sign the PDF, or pay the deposit. See our <a href="/blog/quote-acceptance-rate-tips">quote acceptance wording</a> for templates you can give clients.</p>
<h2>5. Follow up on a schedule</h2>
<p>If you haven't heard back, follow up after 3&ndash;5 days with something useful, such as a question about timing. Send a second follow-up a few days before the quote expires.</p>
<blockquote>Hi Sarah, just checking the quote came through OK. We still have the 3 November start free if you'd like it. Happy to adjust anything. Tom</blockquote>
<h2>Checklist before you hit send</h2>
<ul>
<li>Client name and address are correct</li>
<li>Every line item is specific, with quantities</li>
<li>Tax is shown correctly (including VAT for UK consumers)</li>
<li>Exclusions and assumptions are listed</li>
<li>Validity date, start date and payment terms are stated</li>
<li>Your contact details are on the PDF, not only in the email</li>
</ul>`,

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
<p>Create the quote here, then build the matching invoice with the same details in our sister tool, <a href="https://getinvoicemaker.com/">GetInvoiceMaker</a>. It's also free and needs no signup.</p>`
};

const BLOG_CONTENT = {
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
</ul>`,

  'vat-on-quotes-explained': `
<p>If you are VAT registered, your quotes should show VAT so the client knows the real cost. If you aren't registered, you must not add VAT. That's the rule in the UK and in most VAT countries.</p>
<h2>How to show VAT on a quote</h2>
<ul>
<li>List each item at its price <strong>excluding VAT</strong>.</li>
<li>Show the <strong>subtotal</strong>, the <strong>VAT rate and amount</strong>, and the <strong>total including VAT</strong>.</li>
<li>Include your VAT registration number.</li>
</ul>
<p>Example: labour &pound;1,800 + materials &pound;1,200 = &pound;3,000; VAT at 20% = &pound;600; total &pound;3,600.</p>
<h2>Quoting consumers versus businesses</h2>
<p>Businesses usually reclaim VAT, so they compare net prices. Consumers pay the full amount, and in the UK prices given to consumers should include VAT. For homeowners, lead with the VAT-inclusive total.</p>
<h2>Reduced and zero rates</h2>
<p>Some work carries a reduced or zero rate. In the UK, for example, the installation of certain energy-saving materials in homes is currently zero-rated. Check the rules for your trade, and show each rate separately if a quote mixes them.</p>
<h2>What if you register for VAT after quoting?</h2>
<p>If you become VAT registered before the work is invoiced, you may have to charge VAT even if the quote didn't show it. That's a good reason to note on quotes that "prices exclude VAT, which will be added if applicable".</p>`,

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
<p>End with one clear action: "Reply 'accepted' to book your start date." See our <a href="/blog/quote-acceptance-rate-tips">quote acceptance wording</a>.</p>
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
  '/how-to-quote-for-landscaping': '/quote-template-landscaper'
};

module.exports = { PROFESSION_GUIDES, HOWTO_CONTENT, BLOG_CONTENT, REDIRECTS };
