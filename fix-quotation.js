const fs = require('fs');

// ── 1. server.js düzelt ──────────────────────────────────────
let s = fs.readFileSync('server.js', 'utf8');

// SITE_URL www ekle
s = s.replace(
  "const SITE_URL = process.env.SITE_URL || 'https://getquotationmaker.com';",
  "const SITE_URL = process.env.SITE_URL || 'https://www.getquotationmaker.com';"
);

// 3 yeni blog post ekle
const newBlogs = `,
  { slug: 'tradesman-quote-template', title: 'Tradesman Quote Template: Free Download for UK Tradespeople', desc: 'Free tradesman quote template for UK tradespeople. What to include, how to price labour and materials, and VAT rules.', date: '2026-05-20', readTime: '7 min read', category: 'Templates', content: '<h2>What is a tradesman quote?</h2><p>A tradesman quote is a written price proposal sent to a client before work begins. It details the scope of work, materials, labour costs, and any applicable VAT.</p><h2>What to include in a tradesman quote</h2><ul><li>Your name or business name and contact details</li><li>VAT registration number if VAT registered</li><li>Client name and site address</li><li>Quote number and date</li><li>Validity date - typically 30 days</li><li>Itemised breakdown: materials, labour hours, call-out fee</li><li>VAT at 20% if registered</li><li>Total amount</li><li>Payment terms</li></ul><h2>How to price a tradesman quote</h2><p>Calculate materials at cost plus 15-20% markup. Charge labour at your true hourly rate, which should cover your salary, insurance, tools, vehicle costs, and a profit margin. Add 10-15% contingency for complications.</p><h2>Tradesman quote vs estimate</h2><p>A quote is a fixed price. Once accepted, you must honour it. An estimate is approximate and can change. Always be clear which you are providing.</p><h2>Send your tradesman quote as a PDF</h2><p>A professional PDF quote wins more jobs than a handwritten price. Use our free generator to create and download your tradesman quote as PDF in seconds.</p>' },
  { slug: 'contractor-quotation-guide', title: 'Contractor Quotation: How to Write and Win More Jobs', desc: 'Complete guide to writing contractor quotations. What to include, stage payments, variations and how to follow up.', date: '2026-05-21', readTime: '8 min read', category: 'Templates', content: '<h2>Why your contractor quotation is costing you jobs</h2><p>Most contractors lose jobs not on price but on presentation. A professional detailed quotation builds client confidence. A vague email loses the job to a competitor who looks more professional.</p><h2>What every contractor quotation must include</h2><ul><li>Your company name, address and contact details</li><li>Registration and insurance details</li><li>Client name and project site address</li><li>Unique quotation number and issue date</li><li>Validity period - 30 days recommended</li><li>Detailed scope of work including what is NOT included</li><li>Materials breakdown with quantities</li><li>Labour costs by trade</li><li>Equipment hire or plant costs</li><li>Waste disposal</li><li>Applicable VAT or tax</li><li>Stage payment schedule for large projects</li><li>Payment terms</li></ul><h2>Stage payments for contractor quotations</h2><p>For projects over 5,000: deposit on acceptance 25%, progress payment at midpoint 50%, final on completion 25%. Always get stage payment milestones agreed in writing before starting.</p><h2>How to handle variations</h2><p>Any work outside the original scope must be quoted separately and approved in writing. State this clearly: Any additional works not listed above will be subject to a separate written quotation.</p>' },
  { slug: 'free-quote-generator-netherlands-guide', title: 'Free Quote Generator Netherlands: Create Dutch Offertes Instantly', desc: 'How to create professional Dutch business quotes with 21% BTW. Free generator for ZZP-ers and small businesses in the Netherlands.', date: '2026-05-22', readTime: '6 min read', category: 'Guide', content: '<h2>What is an offerte in the Netherlands?</h2><p>An offerte is a formal written price proposal sent to a potential client before work begins. Once accepted it forms the basis of a contract.</p><h2>Required elements of a Dutch offerte</h2><ul><li>Your business name and KVK number</li><li>BTW identification number if BTW registered</li><li>Client name and address</li><li>Offerte number and date</li><li>Geldigheid validity - typically 30 days</li><li>Itemised work description</li><li>BTW rate - 21% standard or 9% reduced</li><li>Total including BTW</li><li>Betalingstermijn payment terms</li></ul><h2>BTW rates in the Netherlands</h2><p>The standard BTW rate is 21%. A reduced rate of 9% applies to food, books, medicines, and some repair services. A 0% rate applies to exports.</p><h2>ZZP-ers and offertes</h2><p>As a ZZP-er, sending a professional offerte for every project protects you legally and projects professionalism. Our free generator creates BTW-compliant Dutch offertes in seconds.</p>' }`;

s = s.replace(
  /(\{ slug: 'free-quote-template-guide'[\s\S]*?\})\s*\];\s*(const HOW_TO_PAGES)/,
  '$1' + newBlogs + '\n];\n$2'
);

fs.writeFileSync('server.js', s, 'utf8');
console.log('OK server.js updated');

// ── 2. Tum EJS dosyalarindaki bozuk encoding karakterlerini duzelt ──
const ejsFiles = [
  'views/index.ejs',
  'views/profession.ejs',
  'views/country.ejs',
  'views/blog-post.ejs',
  'views/blog-index.ejs',
  'views/how-to.ejs',
  'views/activate.ejs'
];

ejsFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  // Bozuk UTF-8 karakterleri duzelt
  content = content
    .replace(/â€"/g, '-')
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â†'/g, '->')
    .replace(/â€¢/g, '-')
    .replace(/Â£/g, 'GBP ')
    .replace(/â‚¬/g, 'EUR ')
    .replace(/â‚¹/g, 'INR ')
    .replace(/Â©/g, '(c)')
    .replace(/Ã©/g, 'e');
  
  fs.writeFileSync(file, content, 'utf8');
  console.log('OK ' + file + ' encoding fixed');
});

console.log('\nAll done! Now run: node server.js');
