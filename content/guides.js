// Long-form guide pages rendered with views/guide.ejs.
const { tpl } = require('./helpers');

const SEND_QUOTE = {
  slug: 'how-to-send-a-quote-to-a-client',
  title: 'How to Send a Quote to a Client: Email Templates & Examples',
  desc: 'Copy-ready emails for sending a quote to a client or customer: subject lines, 9 email templates, follow-ups, an acceptance reply and a pre-send checklist.',
  h1: 'How to send a quote to a client by email (templates to copy)',
  lead: 'Ready-to-send wording for emailing a quote to a customer or client: subject lines, nine emails for different situations, follow-ups and the reply to send once they accept. Make the quote PDF with our free quotation maker, attach it, and copy the email below.',
  updated: '2026-10-07',
  breadcrumb: 'Send a quote by email',
  jump: 'templates',
  cta: { href: '/#tool', label: 'Make the quote PDF first' },
  toc: [
    ['what-to-write', 'What to write in a quote email'],
    ['subject-lines', 'Quote email subject lines'],
    ['templates', '9 quote email templates'],
    ['follow-up', 'Follow-up emails'],
    ['accepted', 'When the client accepts'],
    ['attach', 'Attaching and naming the PDF'],
    ['checklist', 'Checklist before you send'],
    ['mistakes', 'Mistakes that lose jobs']
  ],
  answer: '<p><strong>The short answer:</strong> send the quote as a PDF attached to a short email. In the email itself, give the total (and say whether tax is included), what it covers, how long the price is valid and the one thing the client has to do to accept. Send it within a working day of the enquiry if you can, and follow up after three to five days if you hear nothing.</p>',
  content: `
<h2 id="what-to-write">What to write in a quote email</h2>
<p>A quote email has to work for someone reading it on a phone, and for the person they forward it to who never spoke to you. Five parts are enough:</p>
<ol>
<li><strong>A subject line that names the job and the quote number</strong>, for example <em>Quote Q-1042: kitchen refit, 14 Elm Road</em>. It makes the email easy to find three weeks later.</li>
<li><strong>One line of context:</strong> thank them for the visit, call or request.</li>
<li><strong>The headline:</strong> the total, whether tax is included, what it covers and the main thing it does not cover.</li>
<li><strong>Timing:</strong> the date the quote is valid until, your earliest start date and how long the work takes.</li>
<li><strong>One next step:</strong> exactly how to accept (reply "accepted", sign the PDF or pay the deposit) and a phone number for questions.</li>
</ol>
<p>The PDF carries the detail. The email carries the decision. This is how the two split:</p>
<table>
<thead><tr><th>Information</th><th>In the email</th><th>In the quote PDF</th></tr></thead>
<tbody>
<tr><td>Total, and whether tax is included</td><td>Yes</td><td>Yes</td></tr>
<tr><td>What the price covers</td><td>One or two lines</td><td>Itemised, with quantities and rates</td></tr>
<tr><td>Exclusions</td><td>The main one</td><td>The full list</td></tr>
<tr><td>Validity date</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Deposit and payment terms</td><td>Short version</td><td>Full terms</td></tr>
<tr><td>How to accept</td><td>Yes</td><td>Acceptance section with a signature line</td></tr>
<tr><td>Quote number, your business details, tax number</td><td>Quote number in the subject</td><td>Yes</td></tr>
</tbody></table>

<h2 id="subject-lines">Quote email subject lines</h2>
<p>Use the quote number and the job in every subject line. "Quotation attached" on its own gets lost in a busy inbox and is hard to search for.</p>
${tpl('subj', 'Subject lines you can copy', `Quote [Q-1042]: [kitchen refit] at [14 Elm Road]
Your quote for [service] from [Business name]
Quotation [Q-1042] for [Company name], valid until [date]
[Business name] quotation: [project], [total incl. VAT]
Revised quote [Q-1042 rev. 2]: [project]
Following up: quote [Q-1042] for [project]
Quote [Q-1042] is valid until [date]`)}

<h2 id="templates">9 quote email templates</h2>
<p>Replace everything in [square brackets]. Each template keeps the quote number, the total and the validity date in the body, so the client can decide without opening the attachment.</p>

${tpl('t1', '1. Standard quote email (works for most businesses)', `Subject: Quote [Q-1042] for [service or project]

Hi [Client name],

Thank you for asking us to quote for [short description of the job]. Please find attached quote [Q-1042].

The total is [£2,450 including VAT]. It covers [main items, for example supply and fitting of ...]. It does not include [main exclusion].

The quote is valid until [date]. We can start on [date] and the work will take about [duration].

To go ahead, just reply to this email to accept and we will confirm your start date. If you have any questions, call me on [phone].

Kind regards,
[Your name]
[Business name] | [phone] | [website]`)}

${tpl('t2', '2. After a site visit (trades and home improvement)', `Subject: Your quote for [bathroom refit], [site address]

Hi [Client name],

Thanks for showing me round on [day]. As promised, here is your quote for [the bathroom refit], attached as a PDF (ref. [Q-1042]).

Total: [£6,800 including VAT]
Includes: [strip-out, new suite, tiling to full height, plumbing and electrics, waste removal]
Not included: [supplying the tiles, which you said you would choose]
Start date: [3 November], about [8 working days]
Deposit: [20%] to book the start date, balance on completion

The price is fixed for the work described and is valid until [date]. If anything unexpected comes up once we start, I will price it and agree it with you before doing it.

To book the work, reply "accepted" or sign the acceptance section on the PDF. Any questions, call me on [phone].

Thanks,
[Your name]
[Business name]`, 'Listing what is included and not included in the email answers the questions that usually stall a homeowner&rsquo;s decision.')}

${tpl('t3', '3. Formal quotation email to a company', `Subject: Quotation [Q-1042]: [goods or services] for [Company name]

Dear [Name],

Further to your request of [date], please find attached our quotation [Q-1042] for [description].

Summary:
Total: [amount] excluding VAT ([amount] including VAT at [rate])
Delivery or lead time: [x working days from purchase order]
Payment terms: [30 days from invoice]
Validity: [30 days, until date]

The quotation is subject to the terms set out in the attached document. To proceed, please send a purchase order quoting reference [Q-1042], or reply to confirm acceptance.

I am happy to go through any of the items with you or your procurement team.

Yours sincerely,
[Your name]
[Job title], [Company name]
[Phone] | [Email]`, 'Business buyers compare prices excluding tax, so give both figures and ask for a purchase order.')}

${tpl('t4', '4. Short quote for a small job (price in the email)', `Subject: Quote for [replacing the kitchen tap]

Hi [Name],

Thanks for getting in touch. The price to [replace the kitchen mixer tap] is [£140] for labour plus [£85] for the tap you chose, so [£225] in total. The price is fixed and valid until [date].

I have attached the quote as a PDF for your records. I can do the job on [day and date] in the [morning]. Just reply "yes" and I will book you in.

Thanks,
[Your name], [phone]`)}

${tpl('t5', '5. Quote with options (good, better, best)', `Subject: Quote [Q-1042]: three options for [project]

Hi [Client name],

Thanks for your time on [day]. I have put three options in the attached quote so you can choose what suits your budget:

Option A, [Essential]: [what it includes], [price]
Option B, [Recommended]: [what it adds], [price]
Option C, [Premium]: [what it adds], [price]

All prices [include VAT] and are valid until [date]. I would suggest [Option B] for your [property or situation] because [reason], but any of them will do the job properly.

Reply with the option you would like and I will confirm dates.

Best regards,
[Your name]
[Business name] | [phone]`, 'Options change the client&rsquo;s question from "should I go ahead?" to "which one?". Put each option as its own section on the quote.')}

${tpl('t6', '6. Freelancer or project quote (deposit and milestones)', `Subject: Quote for [project name]

Hi [Client name],

Thanks for the brief. Attached is my quote [Q-1042] for [project].

Fixed fee: [amount], which includes [deliverables] and [two rounds of revisions].
Timeline: [x weeks] from the deposit, with [first milestone] by [date].
Payment: [50%] deposit to book, [50%] on delivery.
Not included: [hosting, stock images, copywriting].

The quote is valid until [date]. To get started, reply to confirm and I will send the deposit invoice.

Happy to have a quick call if you want to talk any of it through.

Best,
[Your name]
[Website or portfolio]`)}

${tpl('t7', '7. Revised quote (after changes or a price discussion)', `Subject: Revised quote [Q-1042 rev. 2]: [project]

Hi [Client name],

As discussed, I have revised the quote. The new total is [amount], down from [amount].

What changed: [for example, you will supply the paint, and the ceilings are no longer included].
What stays the same: [everything else in the original quote, including the start date].

The revised quote is attached and replaces the earlier version. It is valid until [date]. Reply "accepted" and I will book you in.

Thanks,
[Your name]`, 'When you lower a price, say what came out of the scope. A discount with nothing removed makes the first price look made up.')}

${tpl('t8', '8. Replying to a request for quotation (RFQ)', `Subject: RE: Request for quotation [RFQ reference], [Company name]

Dear [Name],

Thank you for inviting us to quote. Please find attached our quotation [Q-1042] in response to RFQ [reference].

We can supply [items or services] as specified, at a total of [amount] [excluding or including] [VAT or tax]. Lead time is [x days] from order, delivered to [location]. The quotation is valid for [x] days.

Where our offer differs from the specification, we have noted it on page [x] ([for example, an equivalent alternative brand]).

Please let me know if you need certificates, insurance documents or references to complete your evaluation.

Yours sincerely,
[Your name]
[Company name] | [registration number] | [phone]`)}

${tpl('t9', '9. Sending a quote by text or WhatsApp', `Hi [Name], it's [your name] from [business]. Your quote for [job] is [£480 incl. VAT], valid until [date]. I've emailed the PDF to [email] as well. Reply YES to book [day and date], or call me with any questions.`, 'Fine for small jobs, but always send the PDF by email too, so there is a written record of what was quoted.')}

<h2 id="follow-up">Follow-up emails</h2>
<p>Silence usually means the client is busy, waiting on someone else or comparing prices. A short follow-up with something useful in it wins a lot of that work back. A simple schedule:</p>
<table>
<thead><tr><th>When</th><th>What to send</th></tr></thead>
<tbody>
<tr><td>3 to 5 days after sending</td><td>Check it arrived and offer to answer questions</td></tr>
<tr><td>About a week later</td><td>Add something new: a date you can hold, an option, an answer</td></tr>
<tr><td>A few days before the validity date</td><td>Remind them of the date and your availability</td></tr>
<tr><td>After it expires</td><td>Close the loop politely and offer to re-quote</td></tr>
</tbody></table>

${tpl('f1', 'First follow-up', `Subject: Following up: quote [Q-1042] for [project]

Hi [Client name],

Just checking that the quote I sent on [date] came through OK. I am happy to go through any of the items, or adjust the scope if you would like to bring the price down.

I can still offer a start date of [date] if that suits.

Thanks,
[Your name]`)}

${tpl('f2', 'Second follow-up (add something useful)', `Subject: Quote [Q-1042]: a quick question

Hi [Client name],

One thing I wanted to check on the quote for [project]: would you prefer [option, finish or timing]? It may change the price slightly, so I wanted to ask before you decide.

If the timing isn't right yet, no problem. Let me know and I will keep your details on file.

Best,
[Your name]`)}

${tpl('f3', 'Before the quote expires', `Subject: Quote [Q-1042] is valid until [date]

Hi [Client name],

A quick reminder that the quote for [project] is valid until [date]. After that I may need to update the price for current material costs.

If you would like to go ahead, reply "accepted" and I will book in [start date].

Thanks,
[Your name]`)}

${tpl('f4', 'After it expires (closing the loop)', `Subject: Closing your quote [Q-1042]

Hi [Client name],

I haven't heard back about the quote for [project], so I'll assume the timing isn't right and close it off on my side.

If the project comes back on, just reply to this email and I'll send you an updated quote.

All the best,
[Your name]`)}
<p>More timing advice and what not to say: <a href="/blog/how-to-follow-up-on-a-quote">how to follow up on a quote without being pushy</a>.</p>

<h2 id="accepted">When the client accepts</h2>
<p>Confirm it in writing the same day, especially if they said yes on the phone. Restate the quote number and total, then give the next steps.</p>
${tpl('a1', 'Confirming a client’s acceptance', `Subject: Confirmed: quote [Q-1042] accepted

Hi [Client name],

Thank you for accepting quote [Q-1042] for [project] at [total]. This email confirms the work and the price exactly as quoted.

Next steps: [the deposit invoice for amount is attached]. Once it is paid, [start date] is booked. Anything outside the quote will be priced and agreed with you in writing before we do it.

Thanks again,
[Your name]`)}
<p>If your client asks how to accept, or you want wording for accepting a quote you have received, use our <a href="/quote-acceptance-template">quote acceptance wording templates</a>.</p>

<h2 id="attach">Attaching and naming the PDF</h2>
<ul>
<li><strong>Send a PDF, not a Word or Excel file.</strong> It looks the same on every phone and computer and can&rsquo;t be edited by accident.</li>
<li><strong>Name the file so it can be found:</strong> <code>Quote-Q-1042-Smith-bathroom.pdf</code>. Use the same quote number in the file name, the subject line and the PDF.</li>
<li><strong>One attachment.</strong> Put terms and the acceptance section inside the quote, not in separate files.</li>
<li><strong>Keep it small.</strong> A compressed logo keeps the PDF well under typical email size limits.</li>
<li><strong>Send from your business address</strong> and double-check the spelling of the client&rsquo;s email. If someone else approves spending, ask whether to copy them in.</li>
</ul>
<p>GetQuotationMaker creates the PDF in your browser. It doesn&rsquo;t send emails for you: download the PDF, then attach it in Gmail, Outlook or your phone&rsquo;s mail app.</p>

<h2 id="checklist">Checklist before you send</h2>
<ul>
<li>Client name, address and email are spelled correctly</li>
<li>Every line item is specific, with a quantity and rate</li>
<li>Tax is shown the way your client expects (UK consumers should see the VAT-inclusive total)</li>
<li>Exclusions and assumptions are listed</li>
<li>Validity date, start date and payment terms are stated</li>
<li>The quote says how to accept</li>
<li>Your contact details are on the PDF, not only in the email</li>
<li>The subject line, file name and PDF all show the same quote number</li>
</ul>

<h2 id="mistakes">Mistakes that lose jobs</h2>
<ul>
<li><strong>"Please find attached" and nothing else.</strong> If the client can&rsquo;t see the total without opening the PDF, many won&rsquo;t open it yet.</li>
<li><strong>No validity date.</strong> The quote stays open forever and you may have to honour old prices.</li>
<li><strong>No next step.</strong> "Let me know your thoughts" leaves the client with homework and no deadline.</li>
<li><strong>Discounting in the first follow-up.</strong> It teaches clients to wait for a lower price.</li>
<li><strong>Copy-paste slips.</strong> Another client&rsquo;s name or address in the email undoes the trust the quote builds.</li>
</ul>`,
  faq: [
    { q: 'Should I put the price in the email or only in the PDF?', a: 'Both. Put the total, and whether tax is included, in the body of the email, and the itemised breakdown in the PDF. Many clients read email on a phone first and decide whether to open the attachment from what the email says.' },
    { q: 'What is a good subject line for a quote email?', a: 'Include the quote number and the job, for example "Quote Q-1042: kitchen refit, 14 Elm Road". It tells the client what the email is about and makes it easy to find later. Add the validity date for formal quotations.' },
    { q: 'How soon should I send a quote after an enquiry?', a: 'As soon as you can, ideally the same or the next working day. Sending quickly shows you are organised, and the client is still thinking about the job.' },
    { q: 'Can I send a quote by WhatsApp or text message?', a: 'Yes for small jobs, but also email the PDF so there is a written record of the price, scope and validity date. Use the short text template above and mention that the PDF is in their inbox.' },
    { q: 'How do I follow up on a quote without being pushy?', a: 'Follow up three to five days after sending, then add something useful each time: a date you can hold, an option, or an answer to a likely question. Send a reminder a few days before the quote expires, and a short closing message after it does.' },
    { q: 'Should I send a quote as a PDF or a Word document?', a: 'Send a PDF. It looks the same on every device and the client cannot change the figures by accident. Keep the editable version for yourself.' },
    { q: 'Is a quote sent by email binding?', a: 'A quote is an offer. Once the client accepts it, it normally becomes the agreement for that work at that price, which is why the scope, exclusions and validity date matter. Rules vary by country, so take advice on large contracts. See our guide to quote acceptance wording for what the acceptance should say.' },
    { q: 'Can GetQuotationMaker email the quote for me?', a: 'No. It creates the quote PDF in your browser for free, without an account. You attach the PDF to an email yourself, which means the quote comes from your own address and lands in the client’s inbox like any other email from you.' }
  ],
  related: [
    ['/quote-acceptance-template', 'Quote acceptance wording templates'],
    ['/blog/how-to-follow-up-on-a-quote', 'How to follow up on a quote'],
    ['/blog/how-to-write-a-professional-quote', 'How to write a professional quote'],
    ['/quote-template-contractor', 'Contractor and tradesman quote template'],
    ['/blog/quote-acceptance-rate-tips', 'How to get more quotes accepted']
  ]
};

const ACCEPTANCE = {
  slug: 'quote-acceptance-template',
  title: 'Quote Acceptance Wording: Email & Letter Templates to Copy',
  desc: 'How to accept or confirm a quotation in writing: copy-ready acceptance emails and letters, accepting with changes, declining politely, and wording for your quotes.',
  h1: 'Quote acceptance wording: how to accept or confirm a quotation',
  lead: 'Copy-ready wording for accepting a quote by email or letter, confirming a quotation, accepting only part of it or with changes, and declining politely. Further down: what a business should put on its quotes so a client’s yes is clear.',
  updated: '2026-10-07',
  breadcrumb: 'Quote acceptance wording',
  jump: 'client-templates',
  cta: { href: '/?preset=acceptance#tool', label: 'Add acceptance wording to a quote' },
  toc: [
    ['what-to-include', 'What to include when you accept a quote'],
    ['client-templates', 'Templates for accepting a quote'],
    ['changes', 'Accepting part of a quote, or with changes'],
    ['decline', 'Declining or delaying'],
    ['seller-templates', 'For businesses: confirming acceptance'],
    ['clear-acceptance', 'Making acceptance unambiguous'],
    ['binding', 'Is accepting a quote binding?']
  ],
  answer: '<p><strong>To accept a quote, reply in writing and include:</strong> the quote number and date, the total you are accepting (and whether tax is included), a one-line description of the work, the start or delivery date you want, and your name. For example:</p><blockquote>We accept quotation Q-1042 dated 2 October for the kitchen refit at &pound;8,450 including VAT, on the terms set out in the quotation. Please confirm the start date.</blockquote>',
  content: `
<h2 id="what-to-include">What to include when you accept a quote</h2>
<ul>
<li><strong>The quote number and date</strong>, so there is no doubt which version you accepted.</li>
<li><strong>The total</strong>, and whether it includes VAT, GST or sales tax.</li>
<li><strong>What the work or order is</strong>, in a line, plus any option you chose.</li>
<li><strong>Timing:</strong> the start date, delivery date or deadline you are expecting.</li>
<li><strong>Your purchase order number</strong>, if your business uses them.</li>
<li><strong>Your name and position</strong>, and a signature on a letter.</li>
</ul>
<p>Accept the quote as written. If you want anything changed, say so and ask for a revised quote first, because changing the terms is not the same as accepting them (see <a href="#changes">accepting with changes</a>).</p>

<h2 id="client-templates">Templates for accepting a quote</h2>
<p>Replace everything in [square brackets]. Keep the quote number, date and total in every message.</p>

${tpl('c1', 'Quote acceptance email (formal)', `Subject: Acceptance of quotation [Q-1042]

Dear [Name],

Thank you for your quotation [Q-1042] dated [date]. We are pleased to accept it for [short description of the work] at the quoted total of [amount, including VAT], on the terms set out in the quotation.

Please confirm the start date and let us know if you need anything from us before work begins, such as a deposit or access arrangements.

Kind regards,
[Your name]
[Position, Company]
[Phone]`)}

${tpl('c2', 'Short reply to accept a quote', `Hi [Name], thanks for the quote. We accept quotation [Q-1042] for [amount]. Please go ahead and let us know the start date. Thanks, [Your name]`, 'Enough for a small job, as long as it names the quote and the amount.')}

${tpl('c3', 'Quotation acceptance letter', `[Your company name]
[Address]
[Date]

[Supplier name]
[Supplier address]

Dear [Name],

Re: Acceptance of quotation [Q-1042] dated [date]

We confirm our acceptance of your quotation [Q-1042] dated [date] for [description of goods or services], at a total price of [amount] [including or excluding] [VAT or tax].

This acceptance is made on the terms and conditions stated in the quotation. Our purchase order number is [PO number]. We would like the work to start on [date] [or: delivery by date].

Please confirm receipt of this letter and the agreed schedule.

Yours sincerely,

[Signature]
[Name]
[Position]
[Company]`, 'Use a signed letter for larger contracts or when your organisation needs a formal record.')}

${tpl('c4', 'Confirmation of quotation (putting a verbal yes in writing)', `Subject: Confirmation of quotation [Q-1042]

Dear [Name],

Further to our call today, I am writing to confirm that we accept quotation [Q-1042] dated [date] for [description] at [amount].

As agreed, the work will start on [date] and we will pay the [deposit of amount] by [date]. All other terms are as stated in the quotation.

Please reply to confirm you have received this.

Kind regards,
[Your name]`, 'A yes on the phone may count, but it is hard to prove. Confirm it in writing the same day.')}

${tpl('c5', 'Accepting a quote with a purchase order', `Subject: Purchase order [PO-5521] for quotation [Q-1042]

Dear [Name],

Please find attached purchase order [PO-5521], which accepts your quotation [Q-1042] dated [date] for [description], total [amount excluding VAT].

Please quote the PO number on your invoice and send it to [accounts email]. Delivery is required at [address] by [date].

Regards,
[Your name]
[Purchasing, Company]`)}

<h2 id="changes">Accepting part of a quote, or with changes</h2>
<p>If you change anything (the price, the scope, the dates or the terms), you are making a counter-offer rather than accepting. Nothing is agreed until the business confirms the change, so ask for a revised quote and accept that one.</p>

${tpl('c6', 'Accepting part of a quote', `Subject: Quotation [Q-1042]: items we would like to go ahead with

Dear [Name],

Thank you for quotation [Q-1042]. We would like to proceed with the following items only:
[Item 1], [amount]
[Item 2], [amount]

We will not be going ahead with [item 3] at this stage. Could you please send a revised quotation for these items so we can confirm acceptance in writing?

Kind regards,
[Your name]`)}

${tpl('c7', 'Accepting with changes (asking for a revised quote)', `Subject: Quotation [Q-1042]: changes before we accept

Dear [Name],

Thank you for your quotation [Q-1042]. We would like to go ahead, with the following changes:
[Change 1, for example a start date of 10 November instead of 3 November]
[Change 2, for example we will supply the tiles]

Could you send a revised quotation reflecting these points? We will confirm acceptance as soon as we receive it.

Kind regards,
[Your name]`)}

<h2 id="decline">Declining or delaying</h2>
${tpl('c8', 'Asking for more time (extending the validity date)', `Subject: Quotation [Q-1042]: can the price be held until [date]?

Hi [Name],

We would like to go ahead with quotation [Q-1042], but we need until [date] to [confirm the budget or get approval]. Would you be able to hold the quoted price until then?

Thanks,
[Your name]`)}

${tpl('c9', 'Declining a quote politely', `Subject: Quotation [Q-1042]

Hi [Name],

Thank you for taking the time to prepare quotation [Q-1042]. We have decided not to go ahead [at this time, or: with another supplier whose timing suits us better].

We appreciated the detail in your quote and will keep your details for future work.

Kind regards,
[Your name]`)}

<h2 id="seller-templates">For businesses: confirming a client&rsquo;s acceptance</h2>
<p>When a client accepts, reply the same day. It fixes the price, scope and date in writing and tells the client what happens next.</p>
${tpl('s1', 'Acknowledging a client’s acceptance', `Subject: Thank you, quotation [Q-1042] accepted

Hi [Client name],

Thank you for accepting quotation [Q-1042] dated [date]. This confirms the work and the total of [amount] exactly as quoted.

Next steps:
[The deposit invoice is attached, or: no deposit is needed]
Work starts on [date] at [address]
Any extra work will be quoted and agreed in writing before we do it

If anything changes on your side, just let me know.

Kind regards,
[Your name]
[Business name]`)}

${tpl('s2', 'Acceptance wording to put on your quote', `ACCEPTANCE
To accept this quotation, sign below and return it, or reply to the email it came with confirming acceptance. This quotation is valid until [date]. Work will be booked on receipt of acceptance [and the deposit of amount].

I/We accept this quotation and its terms.

Signed: ____________________   Date: ____________
Name and position: ____________________`, 'Paste it into the Notes &amp; terms box of the quote maker, or <a href="/?preset=acceptance#tool">open the quote maker with this wording already added</a>.')}

<h2 id="clear-acceptance">Making acceptance unambiguous (for the business sending the quote)</h2>
<p>Most disputes about whether a quote was accepted come from a quote that left something open. Before you send one, check that it has:</p>
<ul>
<li><strong>A unique quote number</strong>, and a new number or "rev. 2" on any revised version, which says it replaces the earlier one.</li>
<li><strong>A validity date.</strong> After it, the client can&rsquo;t hold you to the old price.</li>
<li><strong>The total including tax shown clearly.</strong> In the UK, prices for consumers must include VAT and other mandatory charges up front (<a href="https://www.gov.uk/government/publications/price-transparency-cma209/providing-clear-and-accurate-information-about-prices-summary" rel="nofollow noopener" target="_blank">CMA guidance on price transparency</a>).</li>
<li><strong>Scope and exclusions</strong>, so both sides know what "the work" means.</li>
<li><strong>Payment terms and any deposit.</strong></li>
<li><strong>How to accept</strong> (reply, sign or pay the deposit) and what happens after.</li>
</ul>
<p>Keep the accepted version exactly as it was. If the work changes later, price the change separately and get it agreed in writing before doing it.</p>
<p class="note">GetQuotationMaker creates a quote PDF that you send yourself. It doesn&rsquo;t collect online signatures or track acceptance, so put the acceptance wording in the Notes &amp; terms box and keep the client&rsquo;s reply or signed copy with the job.</p>

<h2 id="binding">Is accepting a quote binding?</h2>
<p>In general, a quote is an offer. When the client accepts it as written, before it expires, that normally forms an agreement on those terms: the business does the work described and the client pays the quoted price. A few points that commonly come up:</p>
<ul>
<li><strong>Changes are a counter-offer.</strong> Accepting "subject to" new terms isn&rsquo;t acceptance until the other side agrees.</li>
<li><strong>Expired quotes.</strong> After the validity date, the business can re-quote at current prices.</li>
<li><strong>Quote or estimate?</strong> In the UK, Citizens Advice describes a quote as "a promise to do work at an agreed price" and an estimate as "the trader&rsquo;s best guess" (<a href="https://www.citizensadvice.org.uk/consumer/getting-home-improvements-done/problem-with-home-improvements/" rel="nofollow noopener" target="_blank">Citizens Advice</a>).</li>
<li><strong>UK consumers agreeing at home.</strong> When a consumer agrees a contract away from the trader&rsquo;s premises, for example at their home, they generally have 14 days to cancel a services contract (<a href="https://www.legislation.gov.uk/uksi/2013/3134/regulation/30" rel="nofollow noopener" target="_blank">Consumer Contracts Regulations 2013, reg. 29&ndash;30</a>).</li>
</ul>
<p class="src">Sources last checked 7 October 2026. This is general information, not legal advice. Rules differ by country and contract type, so take advice on large or unusual contracts.</p>`,
  faq: [
    { q: 'How do I accept a quote by email?', a: 'Reply to the email the quote came with. Say that you accept, and include the quote number and date, the total, a short description of the work and the start date you want. For example: "We accept quotation Q-1042 dated 2 October for the kitchen refit at £8,450 including VAT. Please confirm the start date."' },
    { q: 'What is the wording to accept a quotation?', a: '"Thank you for your quotation [number] dated [date]. We are pleased to accept it for [work] at the quoted total of [amount], on the terms set out in the quotation. Please confirm the start date." Use the formal email or letter templates above for a full version.' },
    { q: 'How do I confirm a quotation?', a: 'If you agreed on the phone or in person, send an email the same day that names the quote number, date and total, says you accept it, and restates the start date and deposit. If you are the business, reply to the client’s acceptance to confirm the price, scope and next steps in writing.' },
    { q: 'What is the difference between accepting and confirming a quotation?', a: 'Accepting is the client agreeing to the quote. Confirming is putting an acceptance in writing, either the client confirming a verbal yes, or the business acknowledging that the quote has been accepted and setting out the next steps.' },
    { q: 'Can I accept only part of a quote?', a: 'You can ask to, but accepting only some items changes the offer. Tell the business which items you want and ask for a revised quote for those items, then accept the revised version.' },
    { q: 'Is a verbal acceptance of a quote enough?', a: 'It may count, but it is hard to prove what was agreed. Follow any verbal yes with a short written confirmation that names the quote number, date and total.' },
    { q: 'Does paying a deposit accept a quote?', a: 'If the quote says that paying the deposit accepts it, payment is normally treated as acceptance. Confirm it in writing anyway, so the quote number, price and start date are recorded.' },
    { q: 'What should a business send after a quote is accepted?', a: 'A same-day reply that thanks the client, confirms the quote number and total, and lists the next steps: deposit invoice, start date, and how extra work will be priced and agreed.' }
  ],
  related: [
    ['/how-to-send-a-quote-to-a-client', 'How to send a quote to a client (email templates)'],
    ['/blog/quote-acceptance-rate-tips', 'How to get more quotes accepted'],
    ['/how-to-convert-a-quote-to-an-invoice', 'Turning an accepted quote into an invoice'],
    ['/blog/what-is-a-quotation-in-business', 'What is a quotation in business?']
  ]
};

module.exports = { GUIDE_PAGES: [SEND_QUOTE, ACCEPTANCE] };
