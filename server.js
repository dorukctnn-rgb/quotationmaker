const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const SITE_URL = process.env.SITE_URL || 'https://getquotationmaker.com';
const GUMROAD_LINK = process.env.GUMROAD_LINK || 'https://dorukctn.gumroad.com/l/quotepro';
const users = {};

const PROFESSIONS = [
  { slug: 'plumber', label: 'Plumbers', h1: 'Free Plumber Quote Template', desc: 'Create professional plumbing quotes instantly. Include call-out fee, parts, labour and VAT. Free PDF download, no signup.', intro: 'Generate professional plumbing quotes in seconds. Include call-out charges, parts, labour hours and applicable taxes. Clients see a clean PDF — you get paid faster.' },
  { slug: 'electrician', label: 'Electricians', h1: 'Free Electrician Quote Template', desc: 'Electrician quote generator. Include materials, labour and VAT. Free PDF, no signup required.', intro: 'Professional quote template for electricians. Bill for materials, labour hours, call-out fees and VAT. Download PDF instantly.' },
  { slug: 'contractor', label: 'Contractors', h1: 'Free Contractor Quote Template', desc: 'Contractor quote generator. Professional quotes with labour, materials and tax. Free PDF download.', intro: 'Create contractor quotes instantly. Itemise labour, materials, equipment hire and taxes. Win more jobs with professional quotes.' },
  { slug: 'web-designer', label: 'Web Designers', h1: 'Free Web Design Quote Template', desc: 'Web design quote generator. Quote for design, development and ongoing maintenance. Free PDF.', intro: 'Quote for web design projects professionally. Include design, development, hosting setup and ongoing retainer fees.' },
  { slug: 'photographer', label: 'Photographers', h1: 'Free Photography Quote Template', desc: 'Photography quote generator. Quote for shoots, editing and licensing. Free PDF download.', intro: 'Professional photography quote template. Include shoot days, editing hours, travel and licensing fees.' },
  { slug: 'consultant', label: 'Consultants', h1: 'Free Consulting Quote Template', desc: 'Consulting quote generator. Quote for consulting services and retainers. Free PDF.', intro: 'Create professional consulting quotes. Include daily rate, project fee, expenses and payment terms.' },
  { slug: 'landscaper', label: 'Landscapers', h1: 'Free Landscaping Quote Template', desc: 'Landscaping quote generator. Quote for design, planting and maintenance. Free PDF.', intro: 'Professional landscaping quotes. Include design, planting, materials and ongoing maintenance fees.' },
  { slug: 'cleaner', label: 'Cleaning Services', h1: 'Free Cleaning Service Quote Template', desc: 'Cleaning quote generator. Quote for one-off and recurring cleaning jobs. Free PDF.', intro: 'Quote for cleaning services professionally. Include hourly rate, materials and recurring schedule pricing.' },
  { slug: 'mechanic', label: 'Auto Mechanics', h1: 'Free Auto Repair Quote Template', desc: 'Auto repair quote generator. Include parts, labour and diagnostics. Free PDF download.', intro: 'Professional auto repair quotes. Include parts, labour hours, diagnostics and applicable taxes.' },
  { slug: 'roofer', label: 'Roofers', h1: 'Free Roofing Quote Template', desc: 'Roofing quote generator. Quote for materials, labour and scaffolding. Free PDF.', intro: 'Create professional roofing quotes. Include materials, labour, scaffolding and waste removal costs.' },
  { slug: 'painter', label: 'Painters & Decorators', h1: 'Free Painting Quote Template', desc: 'Painting and decorating quote generator. Include materials, prep and labour. Free PDF.', intro: 'Professional painting quotes. Include surface prep, materials, labour hours and number of coats.' },
  { slug: 'builder', label: 'Builders', h1: 'Free Builder Quote Template', desc: 'Builder quote generator. Quote for construction and renovation projects. Free PDF.', intro: 'Create detailed builder quotes. Include materials, labour, subcontractors and project timeline.' },
  { slug: 'graphic-designer', label: 'Graphic Designers', h1: 'Free Graphic Design Quote Template', desc: 'Graphic design quote generator. Quote for design projects and revisions. Free PDF.', intro: 'Professional graphic design quotes. Include project scope, revisions, file formats and licensing.' },
  { slug: 'hvac', label: 'HVAC Technicians', h1: 'Free HVAC Quote Template', desc: 'HVAC quote generator. Quote for installation, repair and maintenance. Free PDF.', intro: 'Quote for HVAC services professionally. Include unit cost, installation, labour and annual maintenance.' },
  { slug: 'carpenter', label: 'Carpenters', h1: 'Free Carpentry Quote Template', desc: 'Carpentry quote generator. Quote for custom woodwork and fitting. Free PDF.', intro: 'Professional carpentry quotes. Include materials, bespoke fabrication, fitting and finishing.' },
  { slug: 'flooring', label: 'Flooring Installers', h1: 'Free Flooring Quote Template', desc: 'Flooring quote generator. Quote for supply and installation. Free PDF download.', intro: 'Quote for flooring installation. Include materials per m², underlay, fitting and waste removal.' },
  { slug: 'it-support', label: 'IT Support', h1: 'Free IT Support Quote Template', desc: 'IT support quote generator. Quote for setup, repair and support contracts. Free PDF.', intro: 'Professional IT support quotes. Include hourly rate, call-out fee, parts and support contract pricing.' },
  { slug: 'architect', label: 'Architects', h1: 'Free Architecture Quote Template', desc: 'Architecture quote generator. Quote for design, planning and project management. Free PDF.', intro: 'Create professional architecture quotes. Include feasibility, design, planning submission and site management fees.' },
  { slug: 'wedding-planner', label: 'Wedding Planners', h1: 'Free Wedding Planning Quote Template', desc: 'Wedding planning quote generator. Quote for planning, coordination and on-the-day services. Free PDF.', intro: 'Professional wedding planning quotes. Include planning hours, supplier coordination, venue visits and on-the-day management.' },
  { slug: 'personal-trainer', label: 'Personal Trainers', h1: 'Free Personal Training Quote Template', desc: 'Personal trainer quote generator. Quote for sessions and programmes. Free PDF.', intro: 'Create professional personal training quotes. Include session rate, programme length, assessments and nutrition plans.' }
];

const COUNTRIES = [
  { slug: 'uk', label: 'UK', fullName: 'United Kingdom', currency: 'GBP', symbol: '£', tax: 'VAT', taxRate: 20 },
  { slug: 'usa', label: 'USA', fullName: 'United States', currency: 'USD', symbol: '$', tax: 'Sales Tax', taxRate: 0 },
  { slug: 'canada', label: 'Canada', fullName: 'Canada', currency: 'CAD', symbol: 'CA$', tax: 'GST/HST', taxRate: 5 },
  { slug: 'australia', label: 'Australia', fullName: 'Australia', currency: 'AUD', symbol: 'AU$', tax: 'GST', taxRate: 10 },
  { slug: 'germany', label: 'Germany', fullName: 'Germany', currency: 'EUR', symbol: '€', tax: 'MwSt', taxRate: 19 },
  { slug: 'france', label: 'France', fullName: 'France', currency: 'EUR', symbol: '€', tax: 'TVA', taxRate: 20 },
  { slug: 'india', label: 'India', fullName: 'India', currency: 'INR', symbol: '₹', tax: 'GST', taxRate: 18 },
  { slug: 'uae', label: 'UAE', fullName: 'United Arab Emirates', currency: 'AED', symbol: 'AED', tax: 'VAT', taxRate: 5 },
  { slug: 'singapore', label: 'Singapore', fullName: 'Singapore', currency: 'SGD', symbol: 'S$', tax: 'GST', taxRate: 9 },
  { slug: 'netherlands', label: 'Netherlands', fullName: 'Netherlands', currency: 'EUR', symbol: '€', tax: 'BTW', taxRate: 21 },
  { slug: 'new-zealand', label: 'New Zealand', fullName: 'New Zealand', currency: 'NZD', symbol: 'NZ$', tax: 'GST', taxRate: 15 },
  { slug: 'south-africa', label: 'South Africa', fullName: 'South Africa', currency: 'ZAR', symbol: 'R', tax: 'VAT', taxRate: 15 }
];

const BLOG_POSTS = [
  {
    slug: 'how-to-write-a-professional-quote',
    title: 'How to Write a Professional Quote: Complete Guide 2026',
    desc: 'Learn how to write a professional business quote that wins jobs. Includes what to include, how to price, validity dates and free template.',
    date: '2026-01-10', readTime: '8 min read', category: 'Guide',
    content: `<h2>What is a business quote?</h2>
<p>A business quote (also called a quotation or estimate) is a document sent to a potential client before work begins. It states the proposed price, scope of work, and terms. If the client accepts, the quote becomes the basis for the job — and you then raise an invoice when payment is due.</p>
<h2>What to include in a professional quote</h2>
<ul>
<li><strong>Your business name, address and contact details</strong></li>
<li><strong>Client name and project address</strong></li>
<li><strong>A unique quote number</strong> — for tracking and reference</li>
<li><strong>Quote date</strong> — when the quote was prepared</li>
<li><strong>Validity date</strong> — how long the price is guaranteed</li>
<li><strong>Itemised list of work</strong> — each service, quantity and rate</li>
<li><strong>Applicable tax</strong> — VAT, GST or sales tax</li>
<li><strong>Any discounts applied</strong></li>
<li><strong>Total amount</strong></li>
<li><strong>Payment terms and notes</strong></li>
</ul>
<h2>How to price your quote correctly</h2>
<p>Underpricing is one of the biggest mistakes freelancers and tradespeople make. When preparing your quote, include all costs: materials, labour, travel time, consumables, and a margin for unexpected complications. A common rule of thumb for tradespeople is to add 15-20% contingency to material costs.</p>
<h2>Setting a validity date</h2>
<p>Always include a validity date — the date until which your quoted price is guaranteed. This protects you from being held to a price months after material costs have risen. For most trades and services, 30 days is standard. For larger projects where material prices fluctuate, 14 days is safer.</p>
<h2>Quote vs estimate: what is the difference?</h2>
<p>A quote is a fixed price — once accepted, you are committed to that price. An estimate is an approximation — the final cost may vary. Make it clear to your client which one you are providing. Most clients prefer a fixed quote for budget certainty.</p>
<h2>How to follow up on a sent quote</h2>
<p>If you have not heard back within 3-5 days, send a brief follow-up email. Reference the quote number and ask if they have any questions. Most clients do not respond to the first quote due to workload — a polite follow-up significantly increases your win rate.</p>`
  },
  {
    slug: 'quote-vs-invoice-difference',
    title: 'Quote vs Invoice: What is the Difference?',
    desc: 'Confused about the difference between a quote and an invoice? This guide explains when to use each, with examples for freelancers and tradespeople.',
    date: '2026-01-18', readTime: '5 min read', category: 'Guide',
    content: `<h2>The key difference</h2>
<p>A <strong>quote</strong> is sent before work begins to propose a price. An <strong>invoice</strong> is sent after work is complete to request payment. Both are essential business documents, but they serve completely different purposes.</p>
<h2>When to send a quote</h2>
<p>Send a quote when a client asks how much a job will cost. The quote gives them a clear breakdown of what they will pay before they commit. Once they accept the quote, you can begin work.</p>
<h2>When to send an invoice</h2>
<p>Send an invoice when the work is complete (or at an agreed billing milestone). The invoice requests payment based on the agreed price — often the same amount as the accepted quote.</p>
<h2>Can a quote become an invoice?</h2>
<p>Yes — and this is the most efficient workflow. Once a quote is accepted, you convert it directly to an invoice without re-entering all the details. Our PRO plan lets you do this in one click.</p>
<h2>Do quotes have legal standing?</h2>
<p>A quote itself is not legally binding until the client accepts it. Once accepted (in writing is best), it forms part of your contract with the client. Always keep a record of accepted quotes.</p>
<h2>Summary table</h2>
<p>Quote: sent before work begins, proposes a price, not a payment request. Invoice: sent after work is complete, requests payment, references the agreed amount. Both should have unique reference numbers for your records.</p>`
  },
  {
    slug: 'how-to-price-a-job-quote',
    title: 'How to Price a Job Quote: A Guide for Tradespeople and Freelancers',
    desc: 'Learn how to price your quotes correctly. Avoid underpricing, how to calculate materials and labour, and what margin to add.',
    date: '2026-01-26', readTime: '7 min read', category: 'Pricing',
    content: `<h2>The most common quoting mistake: underpricing</h2>
<p>Most freelancers and tradespeople consistently underprice their work, especially when starting out. They focus on winning the job rather than ensuring the price covers all costs and generates a sustainable profit. Here is how to price correctly.</p>
<h2>Step 1: Calculate your material costs</h2>
<p>List every material you will need for the job and get accurate prices. Do not guess. Add 10-15% to your material total to cover wastage, offcuts, and price fluctuations between quoting and purchasing.</p>
<h2>Step 2: Calculate your labour costs</h2>
<p>Estimate the hours the job will take — honestly. Then multiply by your hourly rate. Your hourly rate should cover your salary, business overheads (tools, vehicle, insurance, accounting), and a profit margin. A common formula: (desired annual salary + annual overheads) ÷ billable hours per year = minimum hourly rate.</p>
<h2>Step 3: Add contingency</h2>
<p>No job goes exactly to plan. Add 10-20% contingency for unexpected complications, additional materials, or extra time. This is especially important for building, renovation and plumbing work where hidden problems are common.</p>
<h2>Step 4: Add tax</h2>
<p>If you are VAT or GST registered, add the applicable tax to your quote total. Make it clear whether your quoted price is inclusive or exclusive of tax.</p>
<h2>Step 5: Check your profit margin</h2>
<p>Before sending, check your gross margin: (total price - total costs) ÷ total price. For most trades, aim for at least 20-30% gross margin. If your margin is lower, either your pricing is too low or your costs are too high.</p>`
  },
  {
    slug: 'what-is-a-quotation-in-business',
    title: 'What is a Quotation in Business? Definition, Types and Examples',
    desc: 'A complete guide to business quotations. What they are, the different types, what to include and when to use them.',
    date: '2026-02-03', readTime: '6 min read', category: 'Guide',
    content: `<h2>What is a quotation in business?</h2>
<p>A business quotation is a formal document sent by a supplier to a potential customer that specifies the price for goods or services. It outlines what will be provided, at what cost, under what terms, and for how long the price is valid.</p>
<h2>Types of business quotations</h2>
<ul>
<li><strong>Fixed price quote</strong> — the most common type. The price stated is the final price, regardless of how long the job takes or what materials cost.</li>
<li><strong>Estimate</strong> — an approximate price. The final cost may vary. Always make clear to your client whether you are providing a fixed quote or an estimate.</li>
<li><strong>Bid</strong> — used in competitive tendering. Multiple suppliers submit bids and the client selects based on price, quality or both.</li>
<li><strong>Proforma invoice</strong> — looks like an invoice but is actually a quote used in international trade before goods are shipped.</li>
</ul>
<h2>When is a quotation legally binding?</h2>
<p>A quote is not binding until the client formally accepts it. Once accepted, particularly in writing, it forms the basis of a contract. Keep records of all accepted quotes.</p>
<h2>Quotation vs proposal</h2>
<p>A quotation focuses on price. A proposal is a broader document that includes background, methodology, timeline and price. For simple services, a quote is sufficient. For complex or high-value projects, a full proposal may be expected.</p>`
  },
  {
    slug: 'how-to-write-quote-email',
    title: 'How to Send a Quote by Email: Templates and Best Practices',
    desc: 'Professional email templates for sending quotes to clients. First send, follow-up, and quote accepted confirmation examples.',
    date: '2026-02-11', readTime: '6 min read', category: 'Templates',
    content: `<h2>How to send a quote by email</h2>
<p>Always attach your quote as a PDF and include a brief, professional email. Keep it short — clients are busy. Your email should tell them what the attachment is, what it covers, and what to do next.</p>
<h2>Initial quote email template</h2>
<p><strong>Subject:</strong> Quote #Q-001 — [Service description] — [Your Company]</p>
<p>Hi [Client Name],</p>
<p>Thank you for getting in touch. Please find attached Quote #Q-001 for [brief description of work], totalling [amount including/excluding tax].</p>
<p>This quote is valid until [validity date]. If you have any questions or would like to discuss the scope, please do not hesitate to reply to this email.</p>
<p>To proceed, simply reply confirming your acceptance and we will arrange a start date.</p>
<p>Best regards,<br>[Your Name]</p>
<h2>Follow-up email template (5 days later)</h2>
<p><strong>Subject:</strong> Following up — Quote #Q-001</p>
<p>Hi [Client Name],</p>
<p>I wanted to follow up on Quote #Q-001 sent on [date]. Please let me know if you have any questions or if there is anything you would like adjusted.</p>
<p>Best regards,<br>[Your Name]</p>
<h2>Quote accepted confirmation template</h2>
<p><strong>Subject:</strong> Quote #Q-001 Accepted — Next Steps</p>
<p>Hi [Client Name],</p>
<p>Thank you for accepting Quote #Q-001. I will be in touch shortly to confirm the start date and any access requirements. Looking forward to working with you.</p>
<p>Best regards,<br>[Your Name]</p>`
  },
  {
    slug: 'quote-template-construction',
    title: 'Construction Quote Template: What to Include and How to Win Jobs',
    desc: 'A complete guide to construction quotes. What to include, how to price, and free template for builders, contractors and tradespeople.',
    date: '2026-02-19', readTime: '8 min read', category: 'Templates',
    content: `<h2>What makes a good construction quote?</h2>
<p>A professional construction quote gives clients confidence that you understand the scope of work and have priced it accurately. Vague or poorly structured quotes lose jobs — clients award work to contractors who demonstrate clarity and professionalism.</p>
<h2>What to include in a construction quote</h2>
<ul>
<li><strong>Project address</strong> — not just the client address</li>
<li><strong>Detailed scope of work</strong> — be specific about what is included and what is not</li>
<li><strong>Materials breakdown</strong> — list key materials and quantities where possible</li>
<li><strong>Labour costs</strong> — either as a total or broken down by trade</li>
<li><strong>Plant and equipment hire</strong> — if applicable</li>
<li><strong>Waste disposal</strong> — always include this, it is often forgotten</li>
<li><strong>VAT or applicable tax</strong></li>
<li><strong>Payment schedule</strong> — for larger jobs, include stage payments</li>
<li><strong>Validity date</strong> — 14-30 days is typical for construction due to material price volatility</li>
<li><strong>Exclusions</strong> — clearly state what is NOT included</li>
</ul>
<h2>How to handle variations</h2>
<p>Variations (additional work requested after the quote is accepted) should always be quoted separately and approved in writing before the additional work begins. Include a variation clause in your notes section.</p>
<h2>Stage payments for larger projects</h2>
<p>For projects over £5,000 (or your local equivalent), use stage payments: deposit on acceptance, interim payment at agreed milestones, and final payment on completion. This protects your cash flow and reduces risk.</p>`
  },
  {
    slug: 'how-to-follow-up-on-a-quote',
    title: 'How to Follow Up on a Quote Without Being Pushy',
    desc: 'Practical scripts and timing advice for following up on quotes. How to chase without annoying clients and improve your quote acceptance rate.',
    date: '2026-02-27', readTime: '6 min read', category: 'Tips',
    content: `<h2>Why most quotes are lost to silence</h2>
<p>Most unanswered quotes are not rejections — clients are busy, distracted, or waiting for internal approval. Studies suggest that following up at least once increases your quote acceptance rate by 30-40%. The key is timing and tone.</p>
<h2>When to follow up</h2>
<ul>
<li><strong>First follow-up:</strong> 3-5 business days after sending the quote</li>
<li><strong>Second follow-up:</strong> 7-10 days after the first follow-up, if no response</li>
<li><strong>Final follow-up:</strong> A few days before the validity date expires</li>
</ul>
<h2>What to say in your follow-up</h2>
<p>Keep it brief. Reference the quote number and ask if they have any questions. Never ask "did you get my quote?" — assume they did. Instead, ask if they need any clarification or if the scope needs adjusting.</p>
<h2>Using the validity date as leverage</h2>
<p>The validity date is your most powerful follow-up tool. A few days before it expires, send a reminder: "Quote #Q-001 is valid until [date] — please let me know if you would like to proceed or if you need any amendments." This creates urgency without pressure.</p>
<h2>When to walk away</h2>
<p>If a client has not responded after three follow-ups over three weeks, mark the quote as inactive and move on. Do not chase indefinitely — your time is better spent on new opportunities.</p>`
  },
  {
    slug: 'vat-on-quotes-explained',
    title: 'VAT on Quotes: Do You Charge VAT and How to Show It',
    desc: 'A complete guide to VAT on business quotes. When to charge VAT, how to display it on a quote, and VAT rates by country.',
    date: '2026-03-06', readTime: '7 min read', category: 'Tax',
    content: `<h2>Do you need to charge VAT on your quotes?</h2>
<p>You only charge VAT if you are VAT registered. In the UK, you must register for VAT when your taxable turnover exceeds £90,000. In the EU, thresholds vary by country. In Australia, you must register for GST when your turnover exceeds AU$75,000.</p>
<h2>How to show VAT on a quote</h2>
<p>Always show VAT as a separate line item, not hidden in the total. A clear breakdown shows: subtotal (excluding VAT), VAT amount (with rate), and total (including VAT). This is a legal requirement for VAT-registered businesses in most countries.</p>
<h2>Inclusive vs exclusive of VAT</h2>
<p>Make clear whether your quoted prices are VAT inclusive or exclusive. Most B2B quotes show prices exclusive of VAT. B2C quotes (to consumers) often show VAT-inclusive prices as consumers cannot reclaim VAT.</p>
<h2>VAT rates by country</h2>
<ul>
<li><strong>UK</strong> — 20% standard, 5% reduced, 0% zero-rated</li>
<li><strong>Germany</strong> — 19% standard, 7% reduced</li>
<li><strong>France</strong> — 20% standard, 10% reduced</li>
<li><strong>Australia (GST)</strong> — 10% flat rate</li>
<li><strong>Canada (GST)</strong> — 5% federal, plus provincial tax</li>
<li><strong>India (GST)</strong> — 5%, 12%, 18% or 28% depending on service</li>
<li><strong>UAE (VAT)</strong> — 5% standard rate</li>
</ul>
<h2>Quotes to international clients</h2>
<p>If you are quoting for services to a business client outside your country, you may not need to charge VAT at all (the "reverse charge" mechanism often applies in the EU). Always check with your accountant for cross-border transactions.</p>`
  },
  {
    slug: 'quote-acceptance-rate-tips',
    title: '7 Ways to Improve Your Quote Acceptance Rate',
    desc: 'Practical tips to win more jobs from your quotes. Proven techniques used by successful tradespeople and freelancers to increase conversions.',
    date: '2026-03-14', readTime: '7 min read', category: 'Tips',
    content: `<h2>1. Send quotes quickly</h2>
<p>Speed is your biggest advantage. Clients asking for quotes are often contacting multiple businesses. The first professional quote to arrive often wins. Aim to send quotes within 24 hours of a site visit or enquiry.</p>
<h2>2. Be specific — avoid vague descriptions</h2>
<p>"Supply and install materials" tells a client nothing. "Supply and install 15m² of Karndean luxury vinyl flooring, including removal of existing carpet and disposal" tells them exactly what they are getting. Specificity builds trust.</p>
<h2>3. Include a validity date</h2>
<p>A validity date creates urgency. Without one, clients can sit on quotes indefinitely. A 30-day validity date prompts action.</p>
<h2>4. Follow up</h2>
<p>At least 40% of accepted quotes require a follow-up. Send a brief, polite follow-up 3-5 days after sending if you have not heard back.</p>
<h2>5. Make it easy to accept</h2>
<p>Tell the client exactly what to do next: "Simply reply to this email to confirm acceptance." Remove friction from the decision.</p>
<h2>6. Include your terms clearly</h2>
<p>Payment terms, warranty, what is excluded — clients feel safer accepting a quote when they understand the full picture. Include this in your notes section.</p>
<h2>7. Look professional</h2>
<p>A clean, well-formatted PDF quote with your business details, a quote number, and clear line items projects professionalism. Clients equate a professional quote with professional work.</p>`
  },
  {
    slug: 'free-quote-template-guide',
    title: 'Free Quote Template: What to Use and How to Customise It',
    desc: 'A guide to free quote templates for freelancers and small businesses. What to look for, what to avoid, and how to customise a template to win more jobs.',
    date: '2026-03-22', readTime: '6 min read', category: 'Templates',
    content: `<h2>What makes a good quote template?</h2>
<p>The best quote templates are clean, professional and easy to complete quickly. They should require minimum customisation for each client while still looking personalised. Here is what a good template must include.</p>
<h2>Must-have elements</h2>
<ul>
<li>Your business details at the top (pre-filled if possible)</li>
<li>Client details section</li>
<li>Quote number and date fields</li>
<li>Validity date field</li>
<li>Line items table with description, quantity, rate and amount</li>
<li>Tax calculation</li>
<li>Discount field</li>
<li>Total in large, clear formatting</li>
<li>Notes and payment terms section</li>
</ul>
<h2>Word and Excel templates: the problem</h2>
<p>Most free quote templates are Word or Excel files. The problem: calculations are manual, formatting breaks when you edit, and they look generic. A purpose-built online quote generator solves all of these problems — calculations are automatic, formatting is professional, and your PDF looks the same every time.</p>
<h2>How to customise your template</h2>
<p>Add your business name and address once and it saves automatically. Choose an accent colour that matches your brand. Use the notes section to add standard terms you always include — payment terms, warranties, exclusions.</p>
<h2>Use a validity date</h2>
<p>The most overlooked feature of any quote template is the validity date. Always include one. It protects you from being held to old prices and creates urgency for the client to respond.</p>`
  }
];

const HOW_TO_PAGES = [
  { slug: 'how-to-write-a-quote-for-plumbing', title: 'How to Write a Quote for Plumbing Work', desc: 'Step-by-step guide to writing professional plumbing quotes. What to include, how to price call-out fees, parts and labour.' },
  { slug: 'how-to-quote-for-cleaning-services', title: 'How to Quote for Cleaning Services', desc: 'How to write a professional cleaning service quote. Hourly rates, flat fees, recurring schedules and what to include.' },
  { slug: 'how-to-write-a-quote-for-construction', title: 'How to Write a Quote for Construction', desc: 'Construction quote guide for builders and contractors. What to include, stage payments and how to handle variations.' },
  { slug: 'how-to-send-a-quote-to-a-client', title: 'How to Send a Quote to a Client', desc: 'The best way to send quotes to clients. Email templates, PDF best practices and follow-up strategies.' },
  { slug: 'how-to-convert-a-quote-to-an-invoice', title: 'How to Convert a Quote to an Invoice', desc: 'Step-by-step guide to converting an accepted quote into an invoice without re-entering data.' },
  { slug: 'how-to-quote-for-web-design', title: 'How to Quote for Web Design Projects', desc: 'Web design quoting guide. How to scope projects, price your services and include the right terms.' },
  { slug: 'how-to-write-a-roofing-quote', title: 'How to Write a Roofing Quote', desc: 'Roofing quote guide. Materials, labour, scaffolding, waste disposal and what to exclude.' },
  { slug: 'how-to-quote-for-landscaping', title: 'How to Quote for Landscaping Work', desc: 'Landscaping quote guide. How to price design, planting, materials and ongoing maintenance.' }
];

// ── ROUTES ──────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.render('index', {
    isPro: req.cookies.pro === 'true',
    professions: PROFESSIONS, countries: COUNTRIES,
    page: null, profession: null, country: null,
    siteUrl: SITE_URL, gumroadLink: GUMROAD_LINK
  });
});

PROFESSIONS.forEach(p => {
  app.get('/quote-template-' + p.slug, (req, res) => {
    res.render('profession', {
      isPro: req.cookies.pro === 'true',
      professions: PROFESSIONS, countries: COUNTRIES,
      profession: p, siteUrl: SITE_URL, gumroadLink: GUMROAD_LINK
    });
  });
});

COUNTRIES.forEach(c => {
  app.get('/free-quote-generator-' + c.slug, (req, res) => {
    res.render('country', {
      isPro: req.cookies.pro === 'true',
      professions: PROFESSIONS, countries: COUNTRIES,
      country: c, siteUrl: SITE_URL, gumroadLink: GUMROAD_LINK
    });
  });
});

app.get('/blog', (req, res) => {
  res.render('blog-index', { posts: BLOG_POSTS, howTo: HOW_TO_PAGES, siteUrl: SITE_URL, gumroadLink: GUMROAD_LINK });
});

BLOG_POSTS.forEach(post => {
  app.get('/blog/' + post.slug, (req, res) => {
    res.render('blog-post', {
      post,
      relatedPosts: BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3),
      siteUrl: SITE_URL, gumroadLink: GUMROAD_LINK
    });
  });
});

HOW_TO_PAGES.forEach(page => {
  app.get('/' + page.slug, (req, res) => {
    res.render('how-to', { page, professions: PROFESSIONS, siteUrl: SITE_URL, gumroadLink: GUMROAD_LINK });
  });
});

// ── PDF GENERATION ──────────────────────────────────────────

app.post('/generate-pdf', async (req, res) => {
  const { quoteData } = req.body;
  const isPro = req.cookies.pro === 'true';
  try {
    const chromium = require('@sparticuz/chromium');
    const puppeteer = require('puppeteer-core');
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const data = JSON.parse(quoteData);
    const html = buildQuoteHTML(data, isPro);
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '18mm', bottom: '18mm', left: '18mm', right: '18mm' } });
    await browser.close();
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="quote.pdf"' });
    res.send(pdf);
  } catch(err) {
    console.error('PDF error:', err.message);
    res.status(500).json({ error: 'PDF generation failed.' });
  }
});

function buildQuoteHTML(d, isPro) {
  const subtotal = (d.items||[]).reduce((s,i) => s + (parseFloat(i.qty||0) * parseFloat(i.rate||0)), 0);
  const discountAmt = d.discountType === 'percent'
    ? subtotal * (parseFloat(d.discount||0) / 100)
    : parseFloat(d.discount||0);
  const afterDiscount = subtotal - discountAmt;
  const taxAmt = afterDiscount * (parseFloat(d.taxRate||0) / 100);
  const total = afterDiscount + taxAmt;
  const sym = d.symbol || '$';
  const color = d.color || '#0f4c81';

  const rows = (d.items||[]).map(i => {
    const lt = parseFloat(i.qty||0) * parseFloat(i.rate||0);
    return `<tr>
      <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#1a1a1a">${i.desc||''}</td>
      <td style="padding:9px 8px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:13px;color:#555">${i.qty||0}</td>
      <td style="padding:9px 8px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;color:#555">${sym}${parseFloat(i.rate||0).toFixed(2)}</td>
      <td style="padding:9px 0 9px 8px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;font-weight:600;color:#1a1a1a">${sym}${lt.toFixed(2)}</td>
    </tr>`;
  }).join('');

  // WATERMARK — only on free plan
  const watermark = isPro ? '' : `
    <div style="text-align:center;margin-top:40px;padding-top:16px;border-top:1px solid #eee">
      <p style="font-size:10px;color:#aaa;margin:0">Created free at <strong style="color:${color}">GetQuotationMaker.com</strong> — <a href="https://getquotationmaker.com" style="color:${color}">Upgrade to PRO</a> to remove this</p>
    </div>`;

  const validUntil = d.validUntil ? `<div style="margin-bottom:6px"><div style="font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:.5px">Valid Until</div><div style="font-weight:700;font-size:13px;color:#e53e3e">${d.validUntil}</div></div>` : '';
  const discRow = discountAmt > 0 ? `<div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#e53e3e;border-top:1px solid #f0f0f0"><span>Discount${d.discountType==='percent'?' ('+d.discount+'%)':''}</span><span>-${sym}${discountAmt.toFixed(2)}</span></div>` : '';
  const taxRow = d.taxRate > 0 ? `<div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#666;border-top:1px solid #f0f0f0"><span>${d.taxLabel||'Tax'} (${d.taxRate}%)</span><span>${sym}${taxAmt.toFixed(2)}</span></div>` : '';

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;color:#1a1a1a;background:#fff}</style>
</head><body>
<div style="padding:36px;max-width:780px;margin:0 auto">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:20px;border-bottom:3px solid ${color}">
    <div>
      <div style="font-size:30px;font-weight:800;color:${color};letter-spacing:-0.5px">QUOTATION</div>
      <div style="font-size:12px;color:#999;margin-top:3px">#${d.quoteNumber||'Q-001'}</div>
    </div>
    <div style="text-align:right">
      <div style="font-weight:700;font-size:16px;color:#1a1a1a">${d.fromName||''}</div>
      <div style="font-size:12px;color:#666;margin-top:2px">${d.fromEmail||''}</div>
      <div style="font-size:12px;color:#666;white-space:pre-line">${(d.fromAddress||'').replace(/\n/g,'<br>')}</div>
    </div>
  </div>
  <div style="display:flex;justify-content:space-between;margin-bottom:24px">
    <div>
      <div style="font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Prepared For</div>
      <div style="font-weight:700;font-size:15px">${d.toName||''}</div>
      <div style="font-size:12px;color:#666">${d.toEmail||''}</div>
      <div style="font-size:12px;color:#666;white-space:pre-line">${(d.toAddress||'').replace(/\n/g,'<br>')}</div>
    </div>
    <div style="text-align:right">
      <div style="margin-bottom:8px">
        <div style="font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:.5px">Quote Date</div>
        <div style="font-weight:700;font-size:13px">${d.quoteDate||''}</div>
      </div>
      ${validUntil}
    </div>
  </div>
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
    <thead>
      <tr style="background:${color}">
        <th style="padding:10px 0;text-align:left;font-size:11px;font-weight:700;color:#fff;letter-spacing:.5px">DESCRIPTION</th>
        <th style="padding:10px 8px;text-align:center;font-size:11px;font-weight:700;color:#fff;letter-spacing:.5px">QTY</th>
        <th style="padding:10px 8px;text-align:right;font-size:11px;font-weight:700;color:#fff;letter-spacing:.5px">RATE</th>
        <th style="padding:10px 0 10px 8px;text-align:right;font-size:11px;font-weight:700;color:#fff;letter-spacing:.5px">AMOUNT</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div style="display:flex;justify-content:flex-end;margin-bottom:24px">
    <div style="min-width:230px">
      <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#666"><span>Subtotal</span><span>${sym}${subtotal.toFixed(2)}</span></div>
      ${discRow}${taxRow}
      <div style="display:flex;justify-content:space-between;padding:12px 0 5px;font-size:18px;font-weight:800;border-top:2px solid ${color};margin-top:4px">
        <span>Total</span><span style="color:${color}">${sym}${total.toFixed(2)}</span>
      </div>
    </div>
  </div>
  ${d.notes ? `<div style="background:#f8f9fa;border-left:4px solid ${color};padding:12px 16px;border-radius:0 6px 6px 0;margin-bottom:20px">
    <div style="font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Notes & Terms</div>
    <div style="font-size:12px;color:#555;line-height:1.6">${d.notes}</div>
  </div>` : ''}
  ${d.validUntil ? `<div style="background:#fff5f5;border:1px solid #fed7d7;border-radius:6px;padding:10px 14px;margin-bottom:20px">
    <p style="font-size:12px;color:#c53030;margin:0">This quotation is valid until <strong>${d.validUntil}</strong>. Prices may change after this date.</p>
  </div>` : ''}
  ${watermark}
</div></body></html>`;
}

// ── AUTH ────────────────────────────────────────────────────

app.post('/gumroad-webhook', (req, res) => {
  try {
    const { email, sale_timestamp } = req.body;
    if (email) { users[email.toLowerCase()] = { pro: true, since: sale_timestamp || new Date().toISOString() }; }
  } catch(e) {}
  res.sendStatus(200);
});

app.post('/activate-pro', (req, res) => {
  const { email } = req.body;
  if (email && users[email.toLowerCase()]?.pro) {
    res.cookie('pro', 'true', { maxAge: 365*24*60*60*1000, httpOnly: true });
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'No PRO purchase found.' });
  }
});

app.get('/activate', (req, res) => {
  res.render('activate', { isPro: req.cookies.pro === 'true', gumroadLink: GUMROAD_LINK });
});

// ── SEO ─────────────────────────────────────────────────────

app.get('/sitemap.xml', (req, res) => {
  const urls = [
    { loc: '', priority: '1.0', freq: 'daily' },
    { loc: '/blog', priority: '0.9', freq: 'weekly' },
    { loc: '/activate', priority: '0.3', freq: 'monthly' }
  ];
  PROFESSIONS.forEach(p => urls.push({ loc: '/quote-template-' + p.slug, priority: '0.9', freq: 'weekly' }));
  COUNTRIES.forEach(c => urls.push({ loc: '/free-quote-generator-' + c.slug, priority: '0.9', freq: 'weekly' }));
  BLOG_POSTS.forEach(p => urls.push({ loc: '/blog/' + p.slug, priority: '0.8', freq: 'monthly' }));
  HOW_TO_PAGES.forEach(p => urls.push({ loc: '/' + p.slug, priority: '0.8', freq: 'monthly' }));
  const xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    urls.map(u => `<url><loc>${SITE_URL}${u.loc}</loc><changefreq>${u.freq}</changefreq><priority>${u.priority}</priority></url>`).join('') +
    '</urlset>';
  res.set('Content-Type', 'application/xml').send(xml);
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`QuotationMaker running on ${PORT}`));
