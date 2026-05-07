const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PDFDocument = require('pdfkit');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cookieParser());

const SITE_URL = process.env.SITE_URL || 'https://getquotationmaker.com';
const GUMROAD_LINK = process.env.GUMROAD_LINK || 'https://dorukctn.gumroad.com/l/quotepro';
const users = {};

const PROFESSIONS = [
  { slug: 'plumber', label: 'Plumbers', h1: 'Free Plumber Quote Template', desc: 'Create professional plumbing quotes instantly. Include call-out fee, parts, labour and VAT. Free PDF download, no signup.', intro: 'Generate professional plumbing quotes in seconds. Include call-out charges, parts, labour hours and applicable taxes.' },
  { slug: 'electrician', label: 'Electricians', h1: 'Free Electrician Quote Template', desc: 'Electrician quote generator. Include materials, labour and VAT. Free PDF, no signup required.', intro: 'Professional quote template for electricians. Bill for materials, labour hours, call-out fees and VAT.' },
  { slug: 'contractor', label: 'Contractors', h1: 'Free Contractor Quote Template', desc: 'Contractor quote generator. Professional quotes with labour, materials and tax. Free PDF download.', intro: 'Create contractor quotes instantly. Itemise labour, materials, equipment hire and taxes.' },
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
  { slug: 'how-to-write-a-professional-quote', title: 'How to Write a Professional Quote: Complete Guide 2026', desc: 'Learn how to write a professional business quote that wins jobs. Includes what to include, how to price, validity dates and free template.', date: '2026-01-10', readTime: '8 min read', category: 'Guide', content: '<h2>What is a business quote?</h2><p>A business quote (also called a quotation or estimate) is a document sent to a potential client before work begins. It states the proposed price, scope of work, and terms.</p><h2>What to include in a professional quote</h2><ul><li><strong>Your business name, address and contact details</strong></li><li><strong>Client name and project address</strong></li><li><strong>A unique quote number</strong></li><li><strong>Quote date and validity date</strong></li><li><strong>Itemised list of work</strong></li><li><strong>Applicable tax</strong></li><li><strong>Total amount and payment terms</strong></li></ul><h2>How to price your quote correctly</h2><p>Include all costs: materials, labour, travel time, consumables, and a margin for unexpected complications. Add 15-20% contingency to material costs.</p><h2>Setting a validity date</h2><p>Always include a validity date — the date until which your quoted price is guaranteed. For most trades and services, 30 days is standard.</p><h2>How to follow up on a sent quote</h2><p>If you have not heard back within 3-5 days, send a brief follow-up email. A polite follow-up significantly increases your win rate.</p>' },
  { slug: 'quote-vs-invoice-difference', title: 'Quote vs Invoice: What is the Difference?', desc: 'Confused about the difference between a quote and an invoice? This guide explains when to use each.', date: '2026-01-18', readTime: '5 min read', category: 'Guide', content: '<h2>The key difference</h2><p>A <strong>quote</strong> is sent before work begins to propose a price. An <strong>invoice</strong> is sent after work is complete to request payment.</p><h2>When to send a quote</h2><p>Send a quote when a client asks how much a job will cost. Once they accept the quote, you can begin work.</p><h2>When to send an invoice</h2><p>Send an invoice when the work is complete. The invoice requests payment based on the agreed price.</p><h2>Can a quote become an invoice?</h2><p>Yes — once a quote is accepted, you convert it directly to an invoice. Our PRO plan lets you do this in one click.</p>' },
  { slug: 'how-to-price-a-job-quote', title: 'How to Price a Job Quote: A Guide for Tradespeople and Freelancers', desc: 'Learn how to price your quotes correctly. Avoid underpricing, calculate materials and labour, and what margin to add.', date: '2026-01-26', readTime: '7 min read', category: 'Pricing', content: '<h2>The most common quoting mistake: underpricing</h2><p>Most freelancers and tradespeople consistently underprice their work. Here is how to price correctly.</p><h2>Step 1: Calculate your material costs</h2><p>List every material you will need. Add 10-15% for wastage and price fluctuations.</p><h2>Step 2: Calculate your labour costs</h2><p>Estimate the hours the job will take. Multiply by your hourly rate which should cover salary, overheads, and profit margin.</p><h2>Step 3: Add contingency</h2><p>Add 10-20% contingency for unexpected complications.</p><h2>Step 4: Add tax</h2><p>If VAT or GST registered, add the applicable tax to your quote total.</p><h2>Step 5: Check your profit margin</h2><p>Aim for at least 20-30% gross margin. If lower, your pricing is too low or costs too high.</p>' },
  { slug: 'what-is-a-quotation-in-business', title: 'What is a Quotation in Business? Definition, Types and Examples', desc: 'A complete guide to business quotations. What they are, the different types, what to include and when to use them.', date: '2026-02-03', readTime: '6 min read', category: 'Guide', content: '<h2>What is a quotation in business?</h2><p>A business quotation is a formal document sent by a supplier to a potential customer that specifies the price for goods or services.</p><h2>Types of business quotations</h2><ul><li><strong>Fixed price quote</strong> — the price stated is the final price</li><li><strong>Estimate</strong> — an approximate price that may vary</li><li><strong>Bid</strong> — used in competitive tendering</li><li><strong>Proforma invoice</strong> — used in international trade before goods are shipped</li></ul><h2>When is a quotation legally binding?</h2><p>A quote is not binding until the client formally accepts it. Once accepted in writing, it forms the basis of a contract.</p>' },
  { slug: 'how-to-write-quote-email', title: 'How to Send a Quote by Email: Templates and Best Practices', desc: 'Professional email templates for sending quotes to clients.', date: '2026-02-11', readTime: '6 min read', category: 'Templates', content: '<h2>Initial quote email template</h2><p><strong>Subject:</strong> Quote #Q-001 — [Service] — [Your Company]</p><p>Hi [Client Name], please find attached Quote #Q-001 for [description], totalling [amount]. This quote is valid until [date]. To proceed, simply reply confirming acceptance.</p><h2>Follow-up email template</h2><p><strong>Subject:</strong> Following up — Quote #Q-001</p><p>Hi [Client Name], I wanted to follow up on Quote #Q-001 sent on [date]. Please let me know if you have any questions.</p><h2>Quote accepted confirmation</h2><p><strong>Subject:</strong> Quote #Q-001 Accepted — Next Steps</p><p>Hi [Client Name], thank you for accepting Quote #Q-001. I will be in touch to confirm the start date. Looking forward to working with you.</p>' },
  { slug: 'quote-template-construction', title: 'Construction Quote Template: What to Include and How to Win Jobs', desc: 'A complete guide to construction quotes for builders, contractors and tradespeople.', date: '2026-02-19', readTime: '8 min read', category: 'Templates', content: '<h2>What makes a good construction quote?</h2><p>A professional construction quote gives clients confidence that you understand the scope and have priced it accurately.</p><h2>What to include</h2><ul><li>Project address</li><li>Detailed scope of work — what is included AND excluded</li><li>Materials breakdown</li><li>Labour costs</li><li>Waste disposal</li><li>VAT or applicable tax</li><li>Payment schedule for larger jobs</li><li>Validity date — 14-30 days</li></ul><h2>How to handle variations</h2><p>Additional work should always be quoted separately and approved in writing before starting.</p><h2>Stage payments for larger projects</h2><p>For projects over £5,000, use stage payments: deposit on acceptance, interim at milestones, final on completion.</p>' },
  { slug: 'how-to-follow-up-on-a-quote', title: 'How to Follow Up on a Quote Without Being Pushy', desc: 'Scripts and timing advice for following up on quotes to improve your acceptance rate.', date: '2026-02-27', readTime: '6 min read', category: 'Tips', content: '<h2>Why most quotes are lost to silence</h2><p>Most unanswered quotes are not rejections — clients are busy. Following up at least once increases your acceptance rate by 30-40%.</p><h2>When to follow up</h2><ul><li><strong>First:</strong> 3-5 business days after sending</li><li><strong>Second:</strong> 7-10 days after the first follow-up</li><li><strong>Final:</strong> A few days before the validity date expires</li></ul><h2>Using the validity date as leverage</h2><p>A few days before it expires: "Quote #Q-001 is valid until [date] — please let me know if you would like to proceed." This creates urgency without pressure.</p>' },
  { slug: 'vat-on-quotes-explained', title: 'VAT on Quotes: Do You Charge VAT and How to Show It', desc: 'A complete guide to VAT on business quotes. When to charge and how to display it.', date: '2026-03-06', readTime: '7 min read', category: 'Tax', content: '<h2>Do you need to charge VAT on your quotes?</h2><p>You only charge VAT if you are VAT registered. In the UK, you must register when taxable turnover exceeds £90,000.</p><h2>How to show VAT on a quote</h2><p>Always show VAT as a separate line item: subtotal (excluding VAT), VAT amount (with rate), and total (including VAT).</p><h2>VAT rates by country</h2><ul><li><strong>UK</strong> — 20% standard</li><li><strong>Germany</strong> — 19% standard</li><li><strong>France</strong> — 20% standard</li><li><strong>Australia (GST)</strong> — 10%</li><li><strong>Canada (GST)</strong> — 5% federal</li><li><strong>UAE (VAT)</strong> — 5%</li></ul>' },
  { slug: 'quote-acceptance-rate-tips', title: '7 Ways to Improve Your Quote Acceptance Rate', desc: 'Proven techniques to win more jobs from your quotes.', date: '2026-03-14', readTime: '7 min read', category: 'Tips', content: '<h2>1. Send quotes quickly</h2><p>The first professional quote to arrive often wins. Aim to send within 24 hours.</p><h2>2. Be specific</h2><p>Vague descriptions lose jobs. Specific line items build trust.</p><h2>3. Include a validity date</h2><p>Creates urgency. Without one, clients sit on quotes indefinitely.</p><h2>4. Follow up</h2><p>At least 40% of accepted quotes require a follow-up. Send one 3-5 days after sending.</p><h2>5. Make it easy to accept</h2><p>Tell the client exactly what to do: "Simply reply to confirm acceptance."</p><h2>6. Include clear terms</h2><p>Payment terms, warranty, exclusions — clients feel safer accepting a complete quote.</p><h2>7. Look professional</h2><p>A clean PDF with your business details and a quote number projects professionalism.</p>' },
  { slug: 'free-quote-template-guide', title: 'Free Quote Template: What to Use and How to Customise It', desc: 'A guide to free quote templates for freelancers and small businesses.', date: '2026-03-22', readTime: '6 min read', category: 'Templates', content: '<h2>What makes a good quote template?</h2><p>Clean, professional, and quick to complete. Minimum customisation per client while looking personalised.</p><h2>Must-have elements</h2><ul><li>Your business details (pre-filled)</li><li>Client details section</li><li>Quote number and date fields</li><li>Validity date field</li><li>Line items table with auto-calculations</li><li>Tax and discount fields</li><li>Total in clear formatting</li><li>Notes and payment terms section</li></ul><h2>Word and Excel templates: the problem</h2><p>Calculations are manual, formatting breaks when edited, and they look generic. A purpose-built online generator solves all of these problems.</p><h2>Always include a validity date</h2><p>The most overlooked feature of any quote template. Protects you from old prices and creates urgency.</p>' }
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
  res.render('index', { isPro: req.cookies.pro === 'true', professions: PROFESSIONS, countries: COUNTRIES, page: null, profession: null, country: null, siteUrl: SITE_URL, gumroadLink: GUMROAD_LINK });
});

PROFESSIONS.forEach(p => {
  app.get('/quote-template-' + p.slug, (req, res) => {
    res.render('profession', { isPro: req.cookies.pro === 'true', professions: PROFESSIONS, countries: COUNTRIES, profession: p, siteUrl: SITE_URL, gumroadLink: GUMROAD_LINK });
  });
});

COUNTRIES.forEach(c => {
  app.get('/free-quote-generator-' + c.slug, (req, res) => {
    res.render('country', { isPro: req.cookies.pro === 'true', professions: PROFESSIONS, countries: COUNTRIES, country: c, siteUrl: SITE_URL, gumroadLink: GUMROAD_LINK });
  });
});

app.get('/blog', (req, res) => {
  res.render('blog-index', { posts: BLOG_POSTS, howTo: HOW_TO_PAGES, siteUrl: SITE_URL, gumroadLink: GUMROAD_LINK });
});

BLOG_POSTS.forEach(post => {
  app.get('/blog/' + post.slug, (req, res) => {
    res.render('blog-post', { post, relatedPosts: BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3), siteUrl: SITE_URL, gumroadLink: GUMROAD_LINK });
  });
});

HOW_TO_PAGES.forEach(page => {
  app.get('/' + page.slug, (req, res) => {
    res.render('how-to', { page, professions: PROFESSIONS, siteUrl: SITE_URL, gumroadLink: GUMROAD_LINK });
  });
});

app.get('/activate', (req, res) => {
  res.render('activate', { isPro: req.cookies.pro === 'true', gumroadLink: GUMROAD_LINK });
});

// ── PDF GENERATION (PDFKit — no chromium needed) ─────────────

function currencySymbol(code) {
  const map = { USD:'$', GBP:'£', EUR:'€', CAD:'CA$', AUD:'AU$', INR:'₹', AED:'AED ', SGD:'S$', TRY:'₺', JPY:'¥', CHF:'CHF ', NZD:'NZ$', ZAR:'R', BRL:'R$', MXN:'MX$', SEK:'kr ', NOK:'kr ' };
  return map[code] || (code + ' ');
}

app.post('/generate-pdf', (req, res) => {
  try {
    const isPro = req.cookies.pro === 'true';
    let d = req.body || {};
    if (d.quoteData && typeof d.quoteData === 'string') {
      try { d = JSON.parse(d.quoteData); } catch(e) {}
    }

    const color = d.color || '#0f4c81';
    const sym = d.symbol || currencySymbol(d.currency || 'USD');
    const items = Array.isArray(d.items) ? d.items : [];

    const subtotal = items.reduce((s, i) => s + (parseFloat(i.qty||0) * parseFloat(i.rate||0)), 0);
    const discAmt = d.discountType === 'percent'
      ? subtotal * (parseFloat(d.discount||0) / 100)
      : parseFloat(d.discount||0);
    const afterDisc = subtotal - discAmt;
    const taxAmt = afterDisc * (parseFloat(d.taxRate||0) / 100);
    const total = afterDisc + taxAmt;

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const filename = 'quote-' + (d.quoteNumber || 'Q-001').replace(/[^a-z0-9-]/gi, '_') + '.pdf';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
    doc.pipe(res);

    // Header bar
    doc.rect(50, 45, 500, 3).fill(color);

    // Title
    doc.fontSize(26).fillColor(color).font('Helvetica-Bold').text('QUOTATION', 50, 58);
    doc.fontSize(10).fillColor('#888').font('Helvetica').text('#' + (d.quoteNumber || 'Q-001'), 50, 90);

    // From (right side)
    doc.fontSize(12).fillColor('#111').font('Helvetica-Bold').text(d.fromName || '', 300, 58, { width: 250, align: 'right' });
    doc.fontSize(9).fillColor('#666').font('Helvetica')
      .text(d.fromEmail || '', 300, 75, { width: 250, align: 'right' })
      .text((d.fromAddress || '').replace(/\n/g, ', '), 300, 88, { width: 250, align: 'right' });

    // Bill To / Dates
    let y = 130;
    doc.rect(50, y, 500, 1).fill('#e5e7eb');
    y += 15;

    doc.fontSize(9).fillColor('#888').font('Helvetica-Bold').text('PREPARED FOR', 50, y);
    doc.fontSize(12).fillColor('#111').font('Helvetica-Bold').text(d.toName || '', 50, y + 14);
    doc.fontSize(9).fillColor('#666').font('Helvetica')
      .text(d.toEmail || '', 50, y + 30)
      .text((d.toAddress || '').replace(/\n/g, ', '), 50, y + 44, { width: 220 });

    doc.fontSize(9).fillColor('#888').font('Helvetica-Bold').text('QUOTE DATE', 380, y, { width: 170, align: 'right' });
    doc.fontSize(11).fillColor('#111').font('Helvetica').text(d.quoteDate || '', 380, y + 14, { width: 170, align: 'right' });

    if (d.validUntil) {
      doc.fontSize(9).fillColor('#888').font('Helvetica-Bold').text('VALID UNTIL', 380, y + 34, { width: 170, align: 'right' });
      doc.fontSize(11).fillColor('#dc2626').font('Helvetica-Bold').text(d.validUntil, 380, y + 48, { width: 170, align: 'right' });
    }

    // Items table
    y += 90;
    doc.rect(50, y, 500, 24).fill(color);
    doc.fillColor('#fff').fontSize(9).font('Helvetica-Bold')
      .text('DESCRIPTION', 60, y + 8)
      .text('QTY', 330, y + 8, { width: 40, align: 'right' })
      .text('RATE', 378, y + 8, { width: 70, align: 'right' })
      .text('AMOUNT', 455, y + 8, { width: 85, align: 'right' });

    y += 30;
    items.forEach((item, idx) => {
      const qty = parseFloat(item.qty || 0);
      const rate = parseFloat(item.rate || 0);
      const amt = qty * rate;
      if (idx % 2 === 0) doc.rect(50, y - 4, 500, 20).fill('#f9fafb');
      doc.fillColor('#111').fontSize(10).font('Helvetica')
        .text(item.desc || '', 60, y, { width: 260 })
        .text(String(qty), 330, y, { width: 40, align: 'right' })
        .text(sym + rate.toFixed(2), 378, y, { width: 70, align: 'right' })
        .text(sym + amt.toFixed(2), 455, y, { width: 85, align: 'right' });
      y += 22;
    });

    // Totals
    y += 10;
    doc.rect(50, y, 500, 1).fill('#e5e7eb');
    y += 12;

    doc.fontSize(10).fillColor('#666').font('Helvetica')
      .text('Subtotal', 350, y, { width: 100, align: 'right' });
    doc.fillColor('#111').text(sym + subtotal.toFixed(2), 455, y, { width: 85, align: 'right' });
    y += 18;

    if (discAmt > 0) {
      doc.fillColor('#dc2626')
        .text('Discount' + (d.discountType === 'percent' ? ' (' + d.discount + '%)' : ''), 350, y, { width: 100, align: 'right' });
      doc.text('-' + sym + discAmt.toFixed(2), 455, y, { width: 85, align: 'right' });
      y += 18;
    }

    if (parseFloat(d.taxRate || 0) > 0) {
      doc.fillColor('#666')
        .text((d.taxLabel || 'Tax') + ' (' + d.taxRate + '%)', 350, y, { width: 100, align: 'right' });
      doc.fillColor('#111').text(sym + taxAmt.toFixed(2), 455, y, { width: 85, align: 'right' });
      y += 18;
    }

    doc.rect(350, y, 200, 2).fill(color);
    y += 8;
    doc.fontSize(14).fillColor('#111').font('Helvetica-Bold').text('TOTAL', 350, y, { width: 100, align: 'right' });
    doc.fillColor(color).text(sym + total.toFixed(2), 455, y, { width: 85, align: 'right' });

    // Notes
    if (d.notes) {
      y += 45;
      doc.rect(50, y, 4, 40).fill(color);
      doc.fontSize(9).fillColor('#888').font('Helvetica-Bold').text('NOTES & TERMS', 62, y);
      doc.fontSize(10).fillColor('#333').font('Helvetica').text(d.notes, 62, y + 14, { width: 470 });
    }

    // Valid until warning
    if (d.validUntil) {
      y += (d.notes ? 60 : 45);
      doc.rect(50, y, 500, 28).fill('#fff5f5');
      doc.fontSize(9).fillColor('#c53030').font('Helvetica')
        .text('⚠  This quotation is valid until ' + d.validUntil + '. Prices may change after this date.', 60, y + 10, { width: 480 });
    }

    // Watermark
    if (!isPro) {
      doc.fontSize(8).fillColor('#bbb').font('Helvetica')
        .text('Created free at GetQuotationMaker.com — Upgrade to PRO to remove this', 50, 790, { width: 500, align: 'center' });
    }

    doc.end();
  } catch(err) {
    console.error('PDF error:', err);
    res.status(500).json({ error: err.message });
  }
});

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
    urls.map(u => '<url><loc>' + SITE_URL + u.loc + '</loc><changefreq>' + u.freq + '</changefreq><priority>' + u.priority + '</priority></url>').join('') + '</urlset>';
  res.set('Content-Type', 'application/xml').send(xml);
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: ' + SITE_URL + '/sitemap.xml\n');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log('QuotationMaker running on ' + PORT));
