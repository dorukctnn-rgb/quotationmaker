// Two how-to pages added 17 Oct 2026 from Search Console data (rendered with views/how-to.ejs):
// /quotation-confirmation  "confirm quotation", "confirmation of quotation", "confirmed quotation",
//                          "how to confirm a quotation" (184 impressions in 90 days, 171 of them on the
//                          acceptance-rate post at positions 10 to 23). The buyer's acceptance wording
//                          stays on /quote-acceptance-template; this page covers the confirmation step.
// /revised-quotation       "revised quotation", "revised quote" (positions 51 to 62 on pages that
//                          don't answer it).
// Every rule cited was read at its source on 17 October 2026.
const { tpl, escapeHtml } = require('./helpers');

const CHECKED = '17 October 2026';

// A fill-in box: what is typed replaces the matching [placeholder] in every template on the page
// (public/fill-templates.js). Nothing leaves the browser.
function fillBox(id, label, fields) {
  return '<div class="pcalc" id="' + id + '" data-fill role="group" aria-label="' + escapeHtml(label) + '"><div class="pc-grid">' +
    fields.map(f => '<label>' + f[0] + '<input type="' + (f[3] || 'text') + '" data-ph="' + escapeHtml(f[1]) + '"' +
      (f[2] ? ' placeholder="' + escapeHtml(f[2]) + '"' : '') + ' autocomplete="off"></label>').join('') +
    '</div></div>';
}

const CONFIRMATION = {
  slug: 'quotation-confirmation',
  title: 'Quotation Confirmation: Meaning, Steps and Email Templates',
  h1: 'How to confirm a quotation, and what happens next',
  desc: 'What a confirmed quotation means for buyer and supplier, the steps from accepted quote to confirmed order, and confirmation emails to fill in and copy.',
  lead: 'A quotation is confirmed when the customer has accepted it in writing and the supplier has confirmed the order on the quoted terms. This guide covers both sides: what each message should say, purchase orders, confirming part of a quote or with conditions, and emails you fill in once and copy.',
  breadcrumb: 'Quotation confirmation',
  published: '2026-10-17',
  updated: '2026-10-17',
  jump: ['templates', 'Fill in a confirmation email'],
  script: '/fill-templates.js',
  answer: `<p><strong>The short answer:</strong> a confirmed quotation is a quote the customer has accepted in writing and the supplier has acknowledged as an order. The customer confirms by replying to the quote, signing it or sending a purchase order that names the quote number, its date and the total. The supplier then sends an order confirmation that repeats those details and gives the next step, such as the deposit invoice or the start date. From then on the quote is the agreed price and scope, and any change is priced and agreed separately.</p>
<p>In sales software the word is narrower: in Odoo and Microsoft Dynamics 365, confirming a quotation turns it into a sales order.</p>`,
  toc: [
    ['meaning', 'What “confirm” means, depending on who says it'],
    ['steps', 'From accepted quote to confirmed order'],
    ['include', 'What a confirmation should include'],
    ['templates', 'Confirmation emails to fill in and copy'],
    ['documents', 'Quote, purchase order, order confirmation, invoice'],
    ['part', 'Confirming part of a quote, or with conditions'],
    ['writing', 'Why the confirmation should be in writing'],
    ['software', 'Confirming a quotation in sales software']
  ],
  content: `
<h2 id="meaning">What &ldquo;confirm&rdquo; means, depending on who says it</h2>
<p>The same word turns up in emails from both sides and in sales software, and it doesn&rsquo;t always mean the same step. Read it against who sent it:</p>
<table><thead><tr><th>What you see</th><th>Usually sent by</th><th>What it means</th></tr></thead><tbody>
<tr><td>&ldquo;Thank you, we have received your quotation&rdquo;</td><td>Customer</td><td>Receipt only. Nothing is agreed yet.</td></tr>
<tr><td>&ldquo;Can you confirm your quotation?&rdquo;</td><td>Customer</td><td>Asking whether the price, lead time and terms still stand before ordering</td></tr>
<tr><td>&ldquo;Please confirm the quotation&rdquo;</td><td>Supplier</td><td>Asking the customer to accept in writing</td></tr>
<tr><td>&ldquo;We confirm your quotation&rdquo; or &ldquo;we confirm our order&rdquo;</td><td>Customer</td><td>Acceptance of the quote as written</td></tr>
<tr><td>&ldquo;Order confirmation&rdquo;</td><td>Supplier</td><td>The supplier has the acceptance and has booked the order on the quoted terms</td></tr>
<tr><td>&ldquo;Confirmed&rdquo; as a status in sales software</td><td>The supplier&rsquo;s system</td><td>Usually that the quote has become a sales order (<a href="#software">details below</a>)</td></tr>
</tbody></table>
<p>A quotation is confirmed in the full sense once two of these exist: the customer&rsquo;s written acceptance and the supplier&rsquo;s order confirmation.</p>

<h2 id="steps">From accepted quote to confirmed order</h2>
<ol>
<li><strong>The customer accepts in writing,</strong> in the way the quote asks: a reply to the email, a signature on the acceptance section, a purchase order or the deposit. It should name the quote number and date. Wording for each case, including a formal letter, is in <a href="/quote-acceptance-template">quote acceptance wording</a>.</li>
<li><strong>The supplier checks it against the quote.</strong> Is it the latest version, before the valid-until date, with the option the customer chose and no new conditions? A purchase order should carry the same prices and the quote number. If anything doesn&rsquo;t match, settle it before confirming (see <a href="#part">part or conditional confirmations</a>).</li>
<li><strong>The supplier confirms the order the same day.</strong> The confirmation repeats the quote number, the total, what is included and the dates, and says what happens next: the deposit invoice, the start date or the delivery date.</li>
<li><strong>Both sides keep the confirmed version as it is.</strong> File the quote PDF exactly as it was sent, with the acceptance and the confirmation. If the work changes later, price the change as a variation and agree it in writing. Before anything is confirmed, a change means a <a href="/revised-quotation">revised quotation</a> instead.</li>
<li><strong>Then the work and the invoices.</strong> The invoice quotes the quote or purchase order number and lists agreed extras on their own lines (<a href="/how-to-convert-a-quote-to-an-invoice">turning the quote into an invoice</a>).</li>
</ol>

<h2 id="include">What a confirmation should include</h2>
<p>Whichever side sends it, someone who wasn&rsquo;t in the conversation should be able to see exactly what was agreed:</p>
<ul>
<li><strong>The quote number, its revision and its date</strong>, so there is no doubt which version was confirmed.</li>
<li><strong>What is confirmed:</strong> the whole quote, or the items or option chosen.</li>
<li><strong>The total</strong>, and whether it includes VAT, GST or sales tax.</li>
<li><strong>The purchase order number</strong>, if the customer uses them.</li>
<li><strong>Dates:</strong> the start date, or the delivery date and address.</li>
<li><strong>Deposit and payment terms</strong>, as quoted.</li>
<li><strong>Anything agreed after the quote was sent</strong>, with the date it was agreed. For more than a small change, send a revised quotation and confirm that instead.</li>
<li><strong>Which terms apply</strong>, normally the quotation&rsquo;s. This matters when a purchase order arrives with its own printed terms.</li>
<li><strong>Who is confirming</strong>, their position and the date.</li>
</ul>

<h2 id="templates">Confirmation emails to fill in and copy</h2>
<p>Type the details once and every email below fills in. Anything you leave empty stays as a highlighted placeholder to edit after copying. What you type stays in your browser: it isn&rsquo;t sent or saved.</p>
${fillBox('fill-confirm', 'Details for the confirmation emails', [
    ['Writing to', '[their name]', 'Sam Patel'],
    ['Your name', '[your name]', 'Chris Lee'],
    ['Customer', '[customer]', 'Brook Lane Ltd'],
    ['Supplier (who quoted)', '[supplier]', 'Acme Kitchens'],
    ['Quote number', '[quote number]', 'Q-1042'],
    ['Quote date', '[quote date]', '', 'date'],
    ['Work or goods', '[job]', 'staff kitchen refit'],
    ['Total, with tax wording', '[total]', '£8,450 incl. VAT'],
    ['Purchase order number', '[PO number]', 'PO-5521'],
    ['Start or delivery date', '[start date]', '', 'date'],
    ['Deposit', '[deposit]', '£2,112.50 (25%)'],
    ['Valid until', '[valid until]', '', 'date']
  ])}

<h2 id="supplier">For the business that sent the quote</h2>
${tpl('s1', 'Order confirmation after the customer accepts', `Subject: Order confirmation: quotation [quote number], [job]

Dear [their name],

Thank you for accepting quotation [quote number] dated [quote date]. This email confirms your order on the terms of that quotation.

Work or goods: [job]
Total: [total]
Your purchase order: [PO number]
Start or delivery: [start date]
Deposit: [deposit], invoice attached

Anything outside the quotation will be priced and agreed with you in writing before we do it. If any detail above is not what you expected, please tell us before [start date].

Kind regards,
[your name]
[supplier]`, 'Delete the purchase order or deposit line if it doesn&rsquo;t apply. If the purchase order came with its own terms, add a line such as &ldquo;We accept purchase order PO-5521 on the terms of quotation Q-1042.&rdquo;')}

${tpl('s2', 'Asking the customer to confirm the quotation', `Subject: Please confirm quotation [quote number] for [job]

Dear [their name],

Following our conversation, could you confirm in writing that you would like to go ahead with quotation [quote number] dated [quote date] for [job], at [total]?

A reply to this email is enough, for example: "We confirm quotation [quote number]." If your organisation uses purchase orders, please include the number. Once we have your confirmation, we will book [start date] and send the deposit invoice.

The quotation is valid until [valid until].

Kind regards,
[your name]
[supplier]`)}

${tpl('s3', 'Reconfirming a quotation when the customer asks if it still stands', `Subject: RE: Quotation [quote number]

Dear [their name],

Thank you for checking. We confirm that quotation [quote number] dated [quote date] for [job] stands as written: the total of [total], the scope, the lead time and the terms are unchanged.

The quotation is valid until [valid until]. To place the order, reply to this email or send your purchase order quoting [quote number].

Kind regards,
[your name]
[supplier]`, 'Only reconfirm a quote that really is unchanged. If the price, lead time or availability has moved, send a <a href="/revised-quotation">revised quotation</a> instead. If you are extending the valid-until date, put the new date in the email so the extension is in writing.')}

<h2 id="customer">For the customer who received it</h2>
${tpl('b1', 'Acknowledging a quotation you received (not accepting yet)', `Subject: RE: Quotation [quote number]

Dear [their name],

Thank you for quotation [quote number] dated [quote date] for [job]. We have received it and are reviewing it, and we expect to reply by [reply date].

This email confirms receipt only. We will confirm in writing if we decide to go ahead.

Kind regards,
[your name]
[customer]`)}

${tpl('b2', 'Asking the supplier to confirm the quotation before you order', `Subject: Quotation [quote number]: please confirm before we order

Dear [their name],

Before we place the order for [job], could you confirm the following for quotation [quote number] dated [quote date]:

1. The total of [total] still applies, and until what date
2. Delivery or start by [start date]
3. What the price includes, for example delivery, installation or disposal
4. The payment terms and any deposit

Once we have your confirmation, we will send our purchase order.

Kind regards,
[your name]
[customer]`)}

${tpl('b3', 'Confirming your order against a quotation', `Subject: Order: quotation [quote number], purchase order [PO number]

Dear [their name],

We confirm our order for [job] as set out in your quotation [quote number] dated [quote date], at [total], on the terms of the quotation.

Our purchase order number is [PO number]. Please quote it on your invoice. We need the work to start, or the goods to arrive, by [start date].

Please send your order confirmation with the confirmed date.

Kind regards,
[your name]
[customer]`, 'For a signed acceptance letter, accepting only part of a quote or accepting with changes, use the <a href="/quote-acceptance-template#client-templates">quote acceptance templates</a>.')}

<h2 id="documents">Quote, purchase order, order confirmation, invoice</h2>
<p>For a small job, two emails do the whole thing: the customer&rsquo;s reply accepting the quote and the supplier&rsquo;s reply confirming the order. Larger buyers add a purchase order, and some suppliers send a separate order confirmation document. In the order they usually happen:</p>
<table><thead><tr><th>Document</th><th>Sent by</th><th>When</th><th>What it does</th></tr></thead><tbody>
<tr><td>Quotation</td><td>Supplier</td><td>Before the sale</td><td>Offers stated work or goods at a stated price until a date</td></tr>
<tr><td>Acceptance</td><td>Customer</td><td>Before the quote expires</td><td>Agrees to the quote as written</td></tr>
<tr><td>Purchase order</td><td>Customer</td><td>When ordering</td><td>The buyer&rsquo;s own order, naming the quote, the items and the prices; its number goes on the invoice</td></tr>
<tr><td>Order confirmation</td><td>Supplier</td><td>After the acceptance or the purchase order</td><td>Confirms what was ordered, the price, the dates and which terms apply</td></tr>
<tr><td>Invoice</td><td>Supplier</td><td>After delivery, or at an agreed stage</td><td>Asks for payment, quoting the quote or purchase order number</td></tr>
</tbody></table>
<p>A purchase order that names the quote and matches it is the customer&rsquo;s acceptance. One that changes the prices, quantities or terms is a new offer, and the next section applies.</p>

<h2 id="part">Confirming part of a quote, or with conditions</h2>
<h3>Part of a quote</h3>
<p>If the quote offers options, or says items can be ordered separately, the customer can confirm the ones they want, and both confirmations should list them. Otherwise, confirming only some items changes the offer, and the supplier may need to price the smaller job differently. The clean route: the supplier sends a <a href="/revised-quotation">revised quotation</a> for the confirmed items, and the customer confirms that version.</p>
<h3>With conditions</h3>
<p>&ldquo;We confirm, subject to delivery by 1 November&rdquo;, or a purchase order with different payment terms, isn&rsquo;t a plain confirmation. Under the general common-law rule an acceptance has to match the offer exactly, so a reply that changes the terms doesn&rsquo;t accept it (the &ldquo;mirror image rule&rdquo;, <a href="https://www.law.cornell.edu/wex/mirror_image_rule" rel="nofollow noopener" target="_blank">Cornell LII</a>). Sales of goods in the US work differently: under <a href="https://www.law.cornell.edu/ucc/2/2-207" rel="nofollow noopener" target="_blank">UCC &sect; 2-207</a>, a written confirmation sent within a reasonable time can count as an acceptance even if it adds terms, and between merchants the extra terms become part of the contract unless the offer limited acceptance to its own terms, they materially alter it, or the other side objects in time.</p>
<p>Either way, the safe move is the same. If you are the supplier, answer the conditions in writing before you start: which you accept, which you don&rsquo;t, and which terms apply, for example &ldquo;We accept purchase order PO-5521 on the terms of quotation Q-1042. Delivery by 1 November is confirmed.&rdquo; If you are the customer and want changes, ask for a revised quotation and confirm that.</p>

<h2 id="writing">Why the confirmation should be in writing</h2>
<p>A yes on the phone may count, but it is hard to prove later which version, price and date were agreed. A written confirmation settles that, and in some cases the law expects one:</p>
<ul>
<li><strong>UK, consumer contracts agreed at home or at a distance.</strong> When a trader agrees a contract with a consumer away from the trader&rsquo;s premises, for example in the customer&rsquo;s home, the trader must give a copy of the signed contract or a confirmation of it, on paper or, if the consumer agrees, on another durable medium such as email. Contracts agreed at a distance, by phone, email or online, also need a confirmation on a durable medium. Either must arrive within a reasonable time, and no later than delivery of the goods or the start of the work, and include the information in Schedule 2 of the regulations, such as the cancellation information, unless that was already given on a durable medium (<a href="https://www.legislation.gov.uk/uksi/2013/3134/regulation/12" rel="nofollow noopener" target="_blank">Consumer Contracts Regulations 2013, reg. 12</a> and <a href="https://www.legislation.gov.uk/uksi/2013/3134/regulation/16" rel="nofollow noopener" target="_blank">reg. 16</a>). Off-premises contracts where the consumer pays &pound;42 or less are outside these rules (<a href="https://www.legislation.gov.uk/uksi/2013/3134/regulation/7" rel="nofollow noopener" target="_blank">reg. 7(4)</a>). For services, the consumer&rsquo;s cancellation period normally ends 14 days after the day the contract is entered into (<a href="https://www.legislation.gov.uk/uksi/2013/3134/regulation/30" rel="nofollow noopener" target="_blank">reg. 30</a>).</li>
<li><strong>US, sales of goods between businesses.</strong> A contract for goods of $500 or more generally needs something in writing to be enforced. Between merchants, a written confirmation received within a reasonable time counts against the business that receives it unless it objects in writing within 10 days (<a href="https://www.law.cornell.edu/ucc/2/2-201" rel="nofollow noopener" target="_blank">UCC &sect; 2-201</a>). If a confirmation you receive doesn&rsquo;t match what you agreed, reply in writing straight away.</li>
</ul>
<p class="src">Sources checked ${CHECKED}: legislation.gov.uk (Consumer Contracts Regulations 2013, shown as up to date to 17 October 2026) and the Cornell Legal Information Institute (UCC Article 2; Wex, reviewed November 2024). US states adopt the UCC with their own variations. General information, not legal advice: take advice on large or unusual contracts.</p>

<h2 id="software">Confirming a quotation in sales software</h2>
<p>In software, &ldquo;confirm&rdquo; is a button, and what it does depends on the product:</p>
<ul>
<li><strong>Odoo:</strong> &ldquo;Once a quotation has been confirmed, it officially turns into a sales order, which can then be invoiced and paid for&rdquo; (<a href="https://www.odoo.com/documentation/19.0/applications/sales/sales/sales_quotations/create_quotations.html" rel="nofollow noopener" target="_blank">Odoo 19 documentation</a>).</li>
<li><strong>Microsoft Dynamics 365 Supply Chain Management:</strong> confirming a sales quotation creates the sales order automatically (<a href="https://learn.microsoft.com/en-us/training/modules/work-with-order-to-cash-supply-chain-management/create-process-sales-orders" rel="nofollow noopener" target="_blank">Microsoft Learn</a>).</li>
<li><strong>Sage 200:</strong> the confirmation when you save a new quotation gives it its number and records the customer&rsquo;s order reference. It is a save step, not the customer&rsquo;s acceptance (<a href="https://desktophelp.sage.co.uk/sage200/professional/Content/SOP/ConfirmQuotation.htm" rel="nofollow noopener" target="_blank">Sage 200 help</a>).</li>
</ul>
<p>Whatever the software shows, the customer&rsquo;s written acceptance and your confirmation email are the record of what was agreed. GetQuotationMaker makes the quote PDF and doesn&rsquo;t track acceptance or confirmation, so keep both emails with the PDF.</p>
<p class="src">Help pages checked ${CHECKED}.</p>`,
  faq: [
    { q: 'What does a confirmed quotation mean?', a: 'A quote the customer has accepted in writing and the supplier has confirmed as an order, so the price, scope and dates are agreed. In sales software such as Odoo or Dynamics 365, confirming a quotation turns it into a sales order.' },
    { q: 'How do I confirm a quotation by email?', a: 'Reply to the email the quote came with. Name the quote number and its date, the total and whether tax is included, what you are ordering, your purchase order number if you use one, and the start or delivery date you need. Then ask the supplier for an order confirmation.' },
    { q: 'Is a purchase order the same as confirming a quotation?', a: 'A purchase order that names the quote and matches its prices is the customer’s acceptance, and the supplier then confirms the order. If the purchase order changes the prices, quantities or terms, it is a new offer until the supplier agrees to it.' },
    { q: 'Is a confirmed quotation legally binding?', a: 'Once a quote is accepted as written, before it expires, it normally becomes the agreement for that work at that price. A confirmation that adds conditions is usually a counter-offer until the other side agrees. Rules differ by country, so take advice on large contracts.' },
    { q: 'Can a confirmed quotation be cancelled or changed?', a: 'Only if both sides agree, or the contract or the law gives a right to cancel. In the UK, consumers who agree a services contract at home or at a distance can normally cancel within 14 days of agreeing it. Changes to the work after confirmation should be priced and agreed in writing.' },
    { q: 'What is the difference between acknowledging and confirming a quotation?', a: 'Acknowledging says the quote has arrived. Confirming says the customer accepts it or, from the supplier, that the order is booked. If you only mean receipt, say so in the email.' }
  ],
  related: [
    ['/quote-acceptance-template', 'Quote acceptance wording: emails and letters'],
    ['/revised-quotation', 'How to write and send a revised quotation'],
    ['/how-to-convert-a-quote-to-an-invoice', 'Turn a confirmed quote into an invoice'],
    ['/how-to-send-a-quote-to-a-client', 'How to send a quote by email'],
    ['/blog/what-is-a-quotation-in-business', 'What is a quotation in business?']
  ]
};

// The worked example: a decorating quote (the same lines as the painting-interior-uk preset), then rev. 2.
const ACCEPT_BLOCK = 'ACCEPTANCE\nTo accept this quotation, sign below and return it, or reply to the email it came with confirming acceptance. This quotation is valid until the date shown above.\n\nSigned: ____________________   Date: ____________\nName: ____________________';
const DECORATING_TERMS = 'Preparation: fill minor cracks and holes, sand and caulk where needed. Re-plastering and major repairs are not included.\nPaint: [brand and range], colours chosen by you before we start.\nPlease clear small items; we move and cover furniture.\nPayment: balance on completion, no deposit required.\nPrices exclude VAT; VAT at 20% is added below.\nThis quote is valid for 30 days.\n\n' + ACCEPT_BLOCK;
const REVISION_PRESETS = {
  'revision-v1': {
    label: 'Version 1 of the decorating quote (example prices)', currency: 'GBP', taxRate: 20, taxLabel: 'VAT', validDays: 30, number: 'Q-2026-118',
    items: [
      ['Living room: walls and ceiling, 2 coats emulsion, fill minor cracks', 1, 420],
      ['Hall, stairs and landing: walls, ceiling and woodwork', 1, 780],
      ['Bedroom 1: walls and ceiling, 2 coats emulsion', 1, 310],
      ['Doors and frames: sand, undercoat and satinwood topcoat', 6, 65],
      ['Paint and sundries: trade emulsion, satinwood, filler, caulk', 1, 265],
      ['Protection, dust sheets and daily clean-up', 1, 60]
    ],
    notes: DECORATING_TERMS
  },
  'revision-v2': {
    label: 'Rev. 2 of the decorating quote, with the changes listed (example prices)', currency: 'GBP', taxRate: 20, taxLabel: 'VAT', validDays: 30, number: 'Q-2026-118 rev. 2',
    items: [
      ['Living room: walls and ceiling, 2 coats emulsion, fill minor cracks', 1, 420],
      ['Hall, stairs and landing: walls, ceiling and woodwork', 1, 780],
      ['Doors and frames: sand, undercoat and satinwood topcoat', 8, 65],
      ['Paint and sundries: trade emulsion, satinwood, filler, caulk', 1, 225],
      ['Protection, dust sheets and daily clean-up', 1, 60]
    ],
    notes: 'This quotation replaces quotation Q-2026-118 dated [date of version 1].\nChanges from the previous version: bedroom 1 removed at your request; doors and frames increased from 6 to 8; paint and sundries reduced to £225 for the smaller area. Everything else is unchanged.\n\n' + DECORATING_TERMS
  }
};

const REVISED = {
  slug: 'revised-quotation',
  title: 'Revised Quotation: Meaning, Format and Email Templates',
  h1: 'How to write and send a revised quotation',
  desc: 'A revised quotation is a new version of a quote you already sent. What it means, how to number and date it, show what changes and email it.',
  lead: 'Change the quote without losing track of it: the same quote number with a revision, new dates, a line saying which version it replaces and a short list of what changed. Below: a worked example, emails you fill in once and copy, and the quote maker with both versions of the example.',
  breadcrumb: 'Revised quotation',
  published: '2026-10-17',
  updated: '2026-10-17',
  jump: ['templates', 'Fill in a revised quotation email'],
  heroLabel: 'Open the revised example in the quote maker',
  heroHref: '?preset=revision-v2#qtTool',
  preset: 'revision-v2',
  presetButtons: [{ key: 'revision-v1', label: 'Version 1' }, { key: 'revision-v2', label: 'Rev. 2 (revised)' }],
  presets: REVISION_PRESETS,
  script: '/fill-templates.js',
  answer: `<p><strong>The short answer:</strong> a revised quotation is a new version of a quote you have already sent, issued when the scope, quantities, price, dates or terms change before the client accepts. Keep the quote number and add a revision (Q-1042 rev. 2), date it the day you send it with a new valid-until date, say which version it replaces, and list what changed. In the covering email, give the new total next to the old one and the changes, so the client doesn&rsquo;t have to compare two PDFs.</p>`,
  toc: [
    ['when', 'When to revise, and when to start a new quote'],
    ['numbering', 'Numbering and dating a revision'],
    ['example', 'Worked example: version 1 and rev. 2'],
    ['templates', 'Revised quotation emails to fill in and copy'],
    ['price', 'Changing the price: lower, higher or a mistake'],
    ['accepted', 'If the client has already accepted'],
    ['records', 'Keeping the versions straight'],
    ['here', 'Making the revised quote here']
  ],
  content: `
<h2 id="when">When to revise, and when to start a new quote</h2>
<table><thead><tr><th>Situation</th><th>What to send</th></tr></thead><tbody>
<tr><td>The client asks for changes before deciding: more or less work, other materials, different dates</td><td>A revised quotation</td></tr>
<tr><td>You agree a lower price after talking it through</td><td>A revised quotation that says what came out of the scope</td></tr>
<tr><td>You spot a mistake in a quote you have sent</td><td>A revised quotation, as soon as you notice</td></tr>
<tr><td>The quote has expired and the client is ready now</td><td>A revision with new dates and current prices, or a new quote</td></tr>
<tr><td>A different job for the same client</td><td>A new quote with its own number</td></tr>
<tr><td>The client has already accepted and now wants changes</td><td>Not a revision: a priced variation, agreed in writing (<a href="#accepted">see below</a>)</td></tr>
</tbody></table>
<p>While the client is still deciding about the same job, revise the quote. A different job gets a new quote, and an agreed job gets variations.</p>

<h2 id="numbering">Numbering and dating a revision</h2>
<ul>
<li><strong>Keep the quote number and add the revision:</strong> Q-1042 rev. 2, Q-1042-R2 or Q-1042-B. The version you sent first is version 1, so the first revision is rev. 2 (some businesses call it rev. 1; either works if you stick to it). Use one style on the PDF, in the file name, in the email subject and in your records.</li>
<li><strong>Date it the day you send it</strong>, with its own valid-until date. A revision that keeps the old dates may expire before the client has read it.</li>
<li><strong>Say what it replaces</strong>, near the top or in the notes: &ldquo;This quotation replaces quotation Q-1042 dated 2 October 2026.&rdquo; Then there is no doubt which price is on offer.</li>
<li><strong>List the changes</strong> in two or three lines: &ldquo;Changes from the previous version: bedroom 1 removed; 8 doors instead of 6.&rdquo;</li>
<li><strong>Leave everything else alone.</strong> Same wording, same terms and the same unchanged lines, so the client can see that only the listed items moved.</li>
</ul>

<h2 id="example">Worked example: version 1 and rev. 2</h2>
<p>A decorator quotes for two rooms, the hall and six doors. The client decides to leave bedroom 1 for now and adds two more doors, so the paint allowance comes down. Names, prices and dates are made up to show the method.</p>
<div class="doc">
<div class="doc-h"><span><b>CHANGES</b> Q-2026-118, version 1 to rev. 2</span><span>6 October and 13 October 2026</span></div>
<table><thead><tr><th>Line</th><th class="n">Version 1</th><th class="n">Rev. 2</th><th class="n">Change</th></tr></thead><tbody>
<tr><td>Living room: walls and ceiling</td><td class="n">&pound;420.00</td><td class="n">&pound;420.00</td><td class="n">None</td></tr>
<tr><td>Hall, stairs and landing</td><td class="n">&pound;780.00</td><td class="n">&pound;780.00</td><td class="n">None</td></tr>
<tr><td>Bedroom 1: walls and ceiling</td><td class="n">&pound;310.00</td><td class="n">Removed</td><td class="n">&minus;&pound;310.00</td></tr>
<tr><td>Doors and frames at &pound;65 (6, then 8)</td><td class="n">&pound;390.00</td><td class="n">&pound;520.00</td><td class="n">+&pound;130.00</td></tr>
<tr><td>Paint and sundries</td><td class="n">&pound;265.00</td><td class="n">&pound;225.00</td><td class="n">&minus;&pound;40.00</td></tr>
<tr><td>Protection and daily clean-up</td><td class="n">&pound;60.00</td><td class="n">&pound;60.00</td><td class="n">None</td></tr>
<tr class="sub"><td>Subtotal</td><td class="n">&pound;2,225.00</td><td class="n">&pound;2,005.00</td><td class="n">&minus;&pound;220.00</td></tr>
<tr class="sub"><td>VAT 20%</td><td class="n">&pound;445.00</td><td class="n">&pound;401.00</td><td class="n">&minus;&pound;44.00</td></tr>
<tr class="tot"><td>Total</td><td class="n">&pound;2,670.00</td><td class="n">&pound;2,406.00</td><td class="n">&minus;&pound;264.00</td></tr>
</tbody></table>
</div>
<p>The revised quote the client receives:</p>
<div class="doc">
<div class="doc-h"><span><b>QUOTATION</b> Q-2026-118 rev. 2</span><span>13 October 2026, valid until 12 November 2026</span></div>
<p class="qscope">Interior decorating at 8 Linden Avenue. This quotation replaces quotation Q-2026-118 dated 6 October 2026.</p>
<table><thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead><tbody>
<tr><td>Living room: walls and ceiling, 2 coats emulsion, fill minor cracks</td><td class="n">1</td><td class="n">&pound;420.00</td><td class="n">&pound;420.00</td></tr>
<tr><td>Hall, stairs and landing: walls, ceiling and woodwork</td><td class="n">1</td><td class="n">&pound;780.00</td><td class="n">&pound;780.00</td></tr>
<tr><td>Doors and frames: sand, undercoat and satinwood topcoat</td><td class="n">8</td><td class="n">&pound;65.00</td><td class="n">&pound;520.00</td></tr>
<tr><td>Paint and sundries</td><td class="n">1</td><td class="n">&pound;225.00</td><td class="n">&pound;225.00</td></tr>
<tr><td>Protection, dust sheets and daily clean-up</td><td class="n">1</td><td class="n">&pound;60.00</td><td class="n">&pound;60.00</td></tr>
<tr class="sub"><td colspan="3">Subtotal</td><td class="n">&pound;2,005.00</td></tr>
<tr class="sub"><td colspan="3">VAT 20%</td><td class="n">&pound;401.00</td></tr>
<tr class="tot"><td colspan="3">Total including VAT</td><td class="n">&pound;2,406.00</td></tr>
</tbody></table>
<div class="doc-f"><p><strong>Changes from the previous version:</strong> bedroom 1 removed at your request; doors and frames increased from 6 to 8; paint and sundries reduced to &pound;225 for the smaller area.</p><p><strong>Unchanged:</strong> the start date, the payment terms and everything not listed above.</p></div>
</div>
<p>The email that goes with it puts &pound;2,406 next to the earlier &pound;2,670 and names the three changes, as in the first template below.</p>

<h2 id="templates">Revised quotation emails to fill in and copy</h2>
<p>Type the details once and every email below fills in. Anything you leave empty stays as a highlighted placeholder to edit after copying. What you type stays in your browser: it isn&rsquo;t sent or saved.</p>
${fillBox('fill-revised', 'Details for the revised quotation emails', [
    ['Writing to', '[their name]', 'Sam'],
    ['Your name', '[your name]', 'Chris Lee'],
    ['Your business', '[business]', 'Acme Decorating'],
    ['Quote number', '[quote number]', 'Q-2026-118'],
    ['Revision', '[revision]', 'rev. 2'],
    ['Date of the earlier version', '[earlier version date]', '', 'date'],
    ['Job', '[job]', 'decorating at 8 Linden Avenue'],
    ['New total', '[new total]', '£2,406 incl. VAT'],
    ['Previous total', '[previous total]', '£2,670 incl. VAT'],
    ['Valid until', '[valid until]', '', 'date']
  ])}

${tpl('r1', 'Revised quotation after the client asked for changes', `Subject: Revised quotation [quote number] [revision]: [job]

Hi [their name],

As discussed, I have revised the quotation for [job]. Quotation [quote number] [revision] is attached and replaces the version dated [earlier version date].

What changed:
[First change, for example bedroom 1 removed]
[Second change, for example 8 doors instead of 6]

The new total is [new total], previously [previous total]. Everything else is as before, including the start date and payment terms.

The revised quotation is valid until [valid until]. Reply to accept and I will confirm your start date.

Thanks,
[your name]
[business]`)}

${tpl('r2', 'After a price discussion: lower price, smaller scope', `Subject: Revised quotation [quote number] [revision]: [job]

Hi [their name],

Thanks for talking the price through. To bring it down, I have taken [item or option] out of the quote. Quotation [quote number] [revision] is attached at [new total], down from [previous total].

Still included: [main items]
No longer included: [what came out]

This version replaces the one dated [earlier version date] and is valid until [valid until]. Reply "accepted" and I will book you in.

Best regards,
[your name]
[business]`, 'Tie a lower price to a change in scope, materials or timing. A lower price for the same work invites the client to ask again.')}

${tpl('r3', 'Higher price: more work, or costs changed before acceptance', `Subject: Updated quotation [quote number] [revision]: [job]

Hi [their name],

I have updated the quotation for [job] because [reason, for example you asked for the ceilings to be included].

Quotation [quote number] [revision] is attached. The new total is [new total], up from [previous total]. The difference covers [what the extra pays for].

This version replaces the one dated [earlier version date] and is valid until [valid until]. If the new total doesn't work for you, I can suggest what to leave out.

Kind regards,
[your name]
[business]`, 'Before you raise a price the client hasn&rsquo;t accepted yet, read <a href="#price">changing the price</a>: in some countries a quote with a validity date binds you until that date.')}

${tpl('r4', 'Correcting a mistake in a quote you sent', `Subject: Corrected quotation [quote number] [revision]: [job]

Hi [their name],

I have found a mistake in the quotation I sent on [earlier version date]: [what was wrong, for example the doors were priced at £56 each instead of £65].

The corrected quotation [quote number] [revision] is attached and replaces the earlier one. The correct total is [new total], not [previous total]. Nothing else has changed.

Sorry for the confusion. The corrected quotation is valid until [valid until].

Kind regards,
[your name]
[business]`, 'Send it as soon as you notice, ideally before the client accepts. What happens if a consumer has already accepted is <a href="#price">below</a>.')}

${tpl('r5', 'Re-issuing an expired quote with current prices', `Subject: Updated quotation [quote number] [revision]: [job]

Hi [their name],

Thanks for coming back to us about [job]. The quotation dated [earlier version date] has expired, so I have re-issued it with current prices as quotation [quote number] [revision].

The total is now [new total], compared with [previous total] on the earlier quote. [The scope is unchanged, or list what changed].

The new quotation is valid until [valid until]. Reply to accept and I will confirm dates.

Kind regards,
[your name]
[business]`)}

${tpl('r6', 'Short version for a small job (text or email)', `Hi [their name], I've attached revised quote [quote number] [revision] for [job]: [new total] instead of [previous total], because [reason]. It replaces the earlier version and is valid until [valid until]. Reply YES to go ahead. [your name]`)}

<h2 id="price">Changing the price: lower, higher or a mistake</h2>
<ul>
<li><strong>Lower.</strong> Tie it to something that changed, such as the scope, the materials or the timing, and say what it was, as in the example above.</li>
<li><strong>Higher, before the client accepts.</strong> You can ask the client to accept a higher revised price, but whether the original quote binds you until its valid-until date depends on the country. In Germany, whoever makes an offer is bound by it unless they excluded that (<a href="https://www.gesetze-im-internet.de/bgb/__145.html" rel="nofollow noopener" target="_blank">BGB &sect; 145</a>), and an offer that sets a period for acceptance can be accepted within that period (<a href="https://www.gesetze-im-internet.de/bgb/__148.html" rel="nofollow noopener" target="_blank">&sect; 148</a>). In the Netherlands, an offer that states a period for acceptance can&rsquo;t be withdrawn (<a href="https://wetten.overheid.nl/jci1.3:c:BWBR0005289&amp;boek=6&amp;titeldeel=5&amp;afdeling=2&amp;artikel=219" rel="nofollow noopener" target="_blank">Dutch Civil Code, art. 6:219</a>). In the US, a merchant&rsquo;s signed written offer for goods that says it will be held open can&rsquo;t be withdrawn for that time, up to three months (<a href="https://www.law.cornell.edu/ucc/2/2-205" rel="nofollow noopener" target="_blank">UCC &sect; 2-205</a>). So set a validity period you can honour, and if you need a higher price before it ends, explain why and get the client&rsquo;s agreement to the revised quote.</li>
<li><strong>Higher, after the client accepts.</strong> The accepted price stands for the work described. Citizens Advice tells consumers that a trader can&rsquo;t charge more than the quote because the trader&rsquo;s own costs have gone up, and that extra work has to be explained and agreed to first (<a href="https://www.citizensadvice.org.uk/consumer/getting-home-improvements-done/problem-with-home-improvements/" rel="nofollow noopener" target="_blank">Citizens Advice</a>).</li>
<li><strong>A mistake.</strong> Correct it as soon as you see it, with a revised quotation that says what was wrong. If a consumer has already accepted, Citizens Advice says the trader can charge more than the quote only if the mistake was obvious; if it wasn&rsquo;t, the consumer can insist on the quoted price.</li>
</ul>
<p class="src">Sources checked ${CHECKED}: gesetze-im-internet.de (BGB), wetten.overheid.nl (Burgerlijk Wetboek Book 6, version in force from 16 July 2026), the Cornell Legal Information Institute (UCC Article 2) and Citizens Advice (England). General information, not legal advice.</p>

<h2 id="accepted">If the client has already accepted</h2>
<p>An accepted quote isn&rsquo;t revised: it is the agreement. Changes after that are variations, each priced on its own and agreed in writing before the work, then shown as separate lines on the invoice (<a href="/how-to-convert-a-quote-to-an-invoice#more-than-quoted">invoicing agreed extras</a>). If the change replaces most of the job, agree in writing with the client that a new quotation replaces the accepted one, and have them accept it.</p>
<p>Not sure whether the client&rsquo;s yes was a clear acceptance? See <a href="/quotation-confirmation">how to confirm a quotation</a>.</p>

<h2 id="records">Keeping the versions straight</h2>
<ul>
<li><strong>Keep every version</strong> as a PDF, named so they sort in order: <code>Quote-Q-2026-118-v1.pdf</code>, <code>Quote-Q-2026-118-rev2.pdf</code>.</li>
<li><strong>Reply in the same email thread</strong>, so the history is in one place for both of you.</li>
<li><strong>Check which version the client accepts.</strong> If they reply to an older email, confirm which revision they mean before you book the work.</li>
<li><strong>Put the accepted version&rsquo;s number on the invoice</strong>, for example &ldquo;Ref. quotation Q-2026-118 rev. 2&rdquo;.</li>
</ul>

<h2 id="here">Making the revised quote here</h2>
<p>The quote maker below has both versions of the example: load version 1, then rev. 2, and watch the preview change. For your own revision:</p>
<ol>
<li>Fill in the quote as it was, or load the example and replace its details.</li>
<li>Add the revision to the quote number, for example Q-2026-118 rev. 2. The quote date fills in as today; set the valid-until date.</li>
<li>Edit the lines that changed and leave the rest as they were.</li>
<li>Start the Notes &amp; terms box with &ldquo;This quotation replaces quotation [number] dated [date]&rdquo; and a short list of the changes.</li>
<li>Download the PDF and send it with one of the emails above.</li>
</ol>
<p>GetQuotationMaker doesn&rsquo;t keep your quotes: the PDF is built on our server when you press download, sent to you and not stored. Keep each version&rsquo;s PDF yourself.</p>`,
  faq: [
    { q: 'What is a revised quotation?', a: 'A new version of a quote you have already sent, issued when the scope, quantities, price, dates or terms change before the client accepts. It keeps the original quote number with a revision, has its own date and valid-until date, and says which version it replaces.' },
    { q: 'Should a revised quote have a new number?', a: 'Keep the original number and add a revision, such as Q-1042 rev. 2, so both versions stay linked. Use a new number only for a different job.' },
    { q: 'How do I write a revised quotation email?', a: 'Put the quote number and revision in the subject, say which version it replaces, list what changed, and give the new total next to the old one. End with the new valid-until date and how to accept.' },
    { q: 'Can I increase the price on a quote I have already sent?', a: 'Before the client accepts, you can send a revised quote at a higher price and ask them to accept it, but in some countries a quote with a validity date binds you until that date. After the client accepts, the quoted price stands unless they agree to pay more for extra work.' },
    { q: 'Can I revise a quote after the client has accepted it?', a: 'Not as a revision. The accepted quote is the agreement, so price each change as a variation and get it agreed in writing before doing the work.' }
  ],
  related: [
    ['/quotation-confirmation', 'How to confirm a quotation'],
    ['/how-to-send-a-quote-to-a-client', 'How to send a quote by email'],
    ['/quote-acceptance-template', 'Quote acceptance wording'],
    ['/how-to-convert-a-quote-to-an-invoice', 'Turn the accepted version into an invoice'],
    ['/blog/how-to-write-a-professional-quote', 'How to write a professional quote']
  ]
};

module.exports = { CONFIRM_REVISE_PAGES: [CONFIRMATION, REVISED] };
