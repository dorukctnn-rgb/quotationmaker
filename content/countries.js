// Country quote generator pages. Tax facts were checked on official sources on 7 October 2026.
const a = (href, text) => '<a href="' + href + '" rel="nofollow noopener" target="_blank">' + text + '</a>';

const COUNTRIES = [
  {
    slug: 'uk', fullName: 'United Kingdom', label: 'UK', currency: 'GBP', symbol: '£', tax: 'VAT', taxRate: 20,
    title: 'Free Quote Generator UK: Make a Quote PDF in £ with VAT',
    desc: 'Free UK quote generator: create a quotation in pounds with VAT at 20% on its own line, a validity date and your terms, then download a PDF. No signup.',
    h1: 'Free quote generator for the UK',
    lead: 'Make a quotation in pounds with VAT shown on its own line, a validity date and your payment terms, then download it as a PDF. Set VAT to 0 if you are not VAT registered.',
    docName: 'quote or quotation',
    facts: [
      ['VAT rates', 'Standard 20%, reduced 5%, zero 0%', a('https://www.gov.uk/vat-rates', 'GOV.UK: VAT rates')],
      ['VAT registration', 'Required once taxable turnover goes over £90,000 in the last 12 months', a('https://www.gov.uk/register-for-vat', 'GOV.UK: register for VAT')],
      ['Prices for consumers', 'Must include VAT and other mandatory charges up front', a('https://www.gov.uk/government/publications/price-transparency-cma209/providing-clear-and-accurate-information-about-prices-summary', 'CMA price transparency guidance')],
      ['Quote or estimate', 'A quote is a promise to do the work at an agreed price; an estimate is a best guess', a('https://www.citizensadvice.org.uk/consumer/getting-home-improvements-done/problem-with-home-improvements/', 'Citizens Advice')],
      ['Contracts agreed at the customer’s home', 'Consumers generally have 14 days to cancel a services contract', a('https://www.legislation.gov.uk/uksi/2013/3134/regulation/30', 'Consumer Contracts Regulations 2013, reg. 30')]
    ],
    tips: '<p>Show each line excluding VAT, then the VAT and the total including VAT, and add your VAT number if you are registered. Homeowners should see the VAT-inclusive total first. Tradespeople can start from the <a href="/quote-template-contractor">UK tradesman quote template</a>, and decorators from the <a href="/quote-template-painter">painting and decorating quote template</a>.</p>'
  },
  {
    slug: 'canada', fullName: 'Canada', label: 'Canada', currency: 'CAD', symbol: 'CA$', tax: 'GST/HST', taxRate: 5,
    title: 'Free Quote Generator Canada: Quotes in CAD with GST/HST',
    desc: 'Free quote generator for Canada: create a quotation in Canadian dollars with GST or HST for your province, then download a PDF. No signup.',
    h1: 'Free quote generator for Canada',
    lead: 'Create a quotation in Canadian dollars and add GST or HST at the rate for your customer’s province, then download a PDF. The tool starts at the 5% federal GST rate.',
    docName: 'quote, quotation or estimate',
    facts: [
      ['GST (federal)', '5%', a('https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html', 'Canada Revenue Agency: GST/HST rates')],
      ['HST provinces', 'Ontario 13%; Nova Scotia 14% (from 1 April 2025); New Brunswick, Newfoundland and Labrador, Prince Edward Island 15%', a('https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html', 'Canada Revenue Agency')],
      ['GST-only provinces and territories', 'Alberta, British Columbia, Manitoba, Northwest Territories, Nunavut, Quebec, Saskatchewan, Yukon (QC, BC, SK and MB have their own separate provincial sales taxes)', a('https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html', 'Canada Revenue Agency')]
    ],
    tips: '<p>Set the tax rate to match where the work is supplied: 5% GST, or the HST rate for HST provinces. Where a provincial sales tax applies on top of GST, add it as a separate line in your notes or include it in the tax rate and rename the tax label, so the client sees what they are paying.</p>'
  },
  {
    slug: 'australia', fullName: 'Australia', label: 'Australia', currency: 'AUD', symbol: 'AU$', tax: 'GST', taxRate: 10,
    title: 'Free Quote Generator Australia: Quotes in AUD with GST',
    desc: 'Free quote generator for Australia: create a quotation in Australian dollars with GST at 10%, a validity date and terms, then download a PDF. No signup.',
    h1: 'Free quote generator for Australia',
    lead: 'Create a quotation in Australian dollars with GST at 10% on its own line, add your terms and a validity date, and download a PDF. Set GST to 0 if you are not registered for GST.',
    docName: 'quote or quotation',
    facts: [
      ['GST rate', '10% on most goods and services', a('https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/how-gst-works', 'Australian Taxation Office: how GST works')]
    ],
    tips: '<p>Put your ABN with your business details and say clearly whether prices include GST. Tradies can start from the <a href="/quote-template-contractor">contractor and tradesman quote template</a>, and body shops from the <a href="/quote-template-mechanic">panel beating and repair quote template</a>.</p>'
  },
  {
    slug: 'germany', fullName: 'Germany', label: 'Germany', currency: 'EUR', symbol: '€', tax: 'MwSt', taxRate: 19,
    title: 'Free Quote Generator Germany: Angebot PDF with 19% MwSt',
    desc: 'Free quote generator for Germany: create an Angebot (quotation) in euros with MwSt at 19% or 7%, then download a PDF. No signup.',
    h1: 'Free quote generator for Germany (Angebot)',
    lead: 'Create a quotation (Angebot) in euros with MwSt at the standard 19% or the reduced 7% rate, add your terms and a validity date, and download a PDF.',
    docName: 'Angebot (quotation); a Kostenvoranschlag is a cost estimate',
    facts: [
      ['Umsatzsteuer (MwSt)', 'Standard rate 19%, reduced rate 7%', a('https://www.gesetze-im-internet.de/ustg_1980/__12.html', 'UStG §12 (Federal Ministry of Justice law portal)')]
    ],
    tips: '<p>Most B2B clients in Germany compare net prices (netto), so show the net subtotal, the MwSt and the gross total (brutto). Write the document title in the language your client uses: the PDF heading reads "Quotation", so add "Angebot" to the quote number or notes if your client expects it.</p>'
  },
  {
    slug: 'france', fullName: 'France', label: 'France', currency: 'EUR', symbol: '€', tax: 'TVA', taxRate: 20,
    title: 'Free Quote Generator France: Devis PDF with TVA',
    desc: 'Free quote generator for France: create a devis (quotation) in euros with TVA at 20%, 10% or 5.5%, HT and TTC totals, then download a PDF.',
    h1: 'Free quote generator for France (devis)',
    lead: 'Create a devis in euros with the TVA rate that applies, showing the totals before tax (HT) and including tax (TTC), and download it as a PDF.',
    docName: 'devis',
    facts: [
      ['TVA rates', 'Normal 20%; reduced 10% and 5.5%; special 2.1%', a('https://www.economie.gouv.fr/entreprises/tout-savoir-tva', 'economie.gouv.fr: TVA')],
      ['When a devis is compulsory', 'Before building and home repair or maintenance work (for example plumbing, electrics, roofing, painting, masonry, glazing, locksmithing) and for several other services, including services à la personne of 100 € TTC or more per month', a('https://www.service-public.gouv.fr/particuliers/vosdroits/F31144', 'Service-Public.fr: devis')],
      ['What a building devis must show', 'Totals HT and TTC with the TVA rate, the hourly labour rate TTC, any call-out charge, how long the devis is valid, and whether the devis is free or paid', a('https://www.service-public.gouv.fr/particuliers/vosdroits/F31144', 'Service-Public.fr')],
      ['Once signed', 'An accepted devis binds the professional, for example when the client signs "bon pour travaux"', a('https://www.service-public.gouv.fr/particuliers/vosdroits/F31144', 'Service-Public.fr')]
    ],
    tips: '<p>Use the tax line for TVA so the PDF shows the HT subtotal, the TVA and the TTC total. Add your hourly labour rate TTC, any call-out fee, the validity period and "devis gratuit" (or the fee) in the notes, and leave space for the client to write "bon pour travaux", the date and a signature.</p>'
  },
  {
    slug: 'india', fullName: 'India', label: 'India', currency: 'INR', symbol: '₹', tax: 'GST', taxRate: 18,
    title: 'Free Quotation Maker India: GST Quotation PDF in ₹',
    desc: 'Free quotation maker for India: create a quotation in rupees with GST at 18% or 5%, your terms and a validity date, then download a PDF. No signup.',
    h1: 'Free quotation maker for India (GST)',
    lead: 'Make a quotation in rupees with GST on its own line, add your terms and a validity date, and download a PDF with the ₹ symbol. The tool starts at the 18% standard GST rate.',
    docName: 'quotation',
    facts: [
      ['GST rates (from 22 September 2025)', 'Standard rate 18% and merit rate 5%, with a special 40% rate for a small set of goods; nil and some special rates still apply', a('https://www.pib.gov.in/PressReleasePage.aspx?PRID=2163555', 'PIB: 56th GST Council meeting')]
    ],
    tips: '<p>If you are GST registered, add your GSTIN with your business details and the client’s GSTIN with theirs, and check the rate for your goods or services. Labour contractors can start from the <a href="/quote-template-contractor#labour-only">labour contractor quotation format</a>.</p>'
  },
  {
    slug: 'uae', fullName: 'United Arab Emirates', label: 'UAE', currency: 'AED', symbol: 'AED', tax: 'VAT', taxRate: 5,
    title: 'Free Quotation Maker UAE: Quotes in AED with 5% VAT',
    desc: 'Free quotation maker for the UAE: create a quotation in dirhams with VAT at 5%, your terms and a validity date, then download a PDF. No signup.',
    h1: 'Free quotation maker for the UAE',
    lead: 'Create a quotation in UAE dirhams with VAT at 5% on its own line, add your terms and a validity date, and download a PDF.',
    docName: 'quotation',
    facts: [
      ['VAT rate', 'Standard rate 5% (introduced 1 January 2018)', a('https://mof.gov.ae/en/public-finance/tax/value-added-tax-vat/', 'UAE Ministry of Finance: VAT')]
    ],
    tips: '<p>If you are VAT registered, add your TRN (tax registration number) with your business details and show the amount before VAT, the VAT and the total.</p>'
  },
  {
    slug: 'singapore', fullName: 'Singapore', label: 'Singapore', currency: 'SGD', symbol: 'S$', tax: 'GST', taxRate: 9,
    title: 'Free Quotation Maker Singapore: Quotes in SGD with 9% GST',
    desc: 'Free quotation maker for Singapore: create a quotation in Singapore dollars with GST at 9%, your terms and a validity date, then download a PDF.',
    h1: 'Free quotation maker for Singapore',
    lead: 'Create a quotation in Singapore dollars with GST at 9% on its own line, add your terms and a validity date, and download a PDF. Set GST to 0 if you are not GST registered.',
    docName: 'quotation',
    facts: [
      ['GST rate', '9%', a('https://www.iras.gov.sg/taxes/goods-services-tax-(gst)/basics-of-gst/current-gst-rates', 'IRAS: current GST rates')]
    ],
    tips: '<p>If you are GST registered, add your GST registration number and show the amount before GST, the GST and the total.</p>'
  },
  {
    slug: 'netherlands', fullName: 'Netherlands', label: 'Netherlands', currency: 'EUR', symbol: '€', tax: 'BTW', taxRate: 21,
    title: 'Free Quote Generator Netherlands: Offerte PDF with BTW',
    desc: 'Free quote generator for the Netherlands: make an offerte in euros with BTW at 21% or 9%, your KVK number, quote number and validity, then download a PDF.',
    h1: 'Free quote generator for the Netherlands (offerte)',
    lead: 'Make an offerte in euros with BTW at 21% or 9%, your KVK number, a quote number and a validity date, and download it as a PDF. Useful for ZZP’ers and small businesses quoting Dutch clients.',
    docName: 'offerte',
    facts: [
      ['BTW rates', 'General rate 21%, reduced rate 9%', a('https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/', 'Belastingdienst: btw-tarieven')],
      ['KVK number', 'Must appear on letters, quotes (offertes), invoices, your website and business emails', a('https://www.kvk.nl/over-het-handelsregister/kvk-nummer-alles-wat-je-moet-weten/', 'KVK: KVK-nummer')],
      ['In English', 'Business correspondence rules, including quotes', a('https://business.gov.nl/regulations/rules-business-correspondence/', 'Business.gov.nl')]
    ],
    tips: `<h3>What to put on an offerte</h3>
<ul>
<li>Your business name, address and KVK number, and your btw-identificatienummer if you charge BTW</li>
<li>The client’s name and address</li>
<li>An offertenummer (quote number) and date</li>
<li>How long the offer is valid (geldigheid), for example 30 days</li>
<li>A description of the work or goods, with quantities and prices</li>
<li>The BTW rate and amount, and the total including BTW</li>
<li>Payment terms (betalingstermijn) and how the client accepts</li>
</ul>
<h3>Numbering your quotes</h3>
<p>Give every offerte its own number and never reuse one. A year and a running number works well, for example 2026-031. Put the same number on the follow-up email and, once accepted, refer to it on the factuur (invoice), so the documents can be matched.</p>`
  },
  {
    slug: 'new-zealand', fullName: 'New Zealand', label: 'New Zealand', currency: 'NZD', symbol: 'NZ$', tax: 'GST', taxRate: 15,
    title: 'Free Quote Generator New Zealand: Quotes in NZD with GST',
    desc: 'Free quote generator for New Zealand: create a quote in New Zealand dollars with GST at 15%, your terms and a validity date, then download a PDF.',
    h1: 'Free quote generator for New Zealand',
    lead: 'Create a quote in New Zealand dollars with GST at 15% on its own line, add your terms and a validity date, and download a PDF. Set GST to 0 if you are not GST registered.',
    docName: 'quote or quotation',
    facts: [
      ['GST rate', '15%', a('https://www.ird.govt.nz/gst', 'Inland Revenue: GST')]
    ],
    tips: '<p>If you are GST registered, add your GST number and say whether prices include GST. Tradies can start from the <a href="/quote-template-contractor">contractor quote template</a>.</p>'
  },
  {
    slug: 'south-africa', fullName: 'South Africa', label: 'South Africa', currency: 'ZAR', symbol: 'R', tax: 'VAT', taxRate: 15,
    title: 'Free Quotation Maker South Africa: Quotes in Rand with VAT',
    desc: 'Free quotation maker for South Africa: create a quotation in rand with VAT at 15%, your terms and a validity date, then download a PDF. No signup.',
    h1: 'Free quotation maker for South Africa',
    lead: 'Create a quotation in rand with VAT at 15% on its own line, add your terms and a validity date, and download a PDF. Set VAT to 0 if you are not a VAT vendor.',
    docName: 'quotation',
    facts: [
      ['VAT rate', '15%. The planned increase to 15.5% from 1 May 2025 was reversed', a('https://www.sars.gov.za/types-of-tax/value-added-tax/', 'SARS: Value-Added Tax')]
    ],
    tips: '<p>If you are a registered VAT vendor, add your VAT number and show the amount before VAT, the VAT and the total. Body shops can start from the <a href="/quote-template-mechanic#panel-beating">panel beating quotation example</a>.</p>'
  }
];

module.exports = { COUNTRIES, COUNTRY_FACTS_CHECKED: '7 October 2026' };
