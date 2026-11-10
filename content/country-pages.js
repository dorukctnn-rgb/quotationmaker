// Country pages, rebuilt 10 Nov 2026 (technical audit). Ten of the eleven country pages held 180 to 300 words and Google had not
// indexed them. Each entry below adds what only that country has: a worked example in its own currency and tax that loads into the
// tool, the local rules that change a quote (every one read on the official page linked beside it on 10 November 2026), the local
// words and numbers a client expects, and a short FAQ. The Netherlands page is a protected traffic page and has no entry.
// countries.js merges these entries into COUNTRIES; views/country.ejs draws them only when they exist.
const a = (href, text) => '<a href="' + href + '" rel="nofollow noopener" target="_blank">' + text + '</a>';

const CHECKED = '10 November 2026';

const round2 = n => Math.round(n * 100) / 100;
const num = n => n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });

// One set of items drives both the table on the page and the preset behind the "Load this example" button, so the two never differ.
function example({ key, label, currency, symbol, rate, taxLabel, items, notes, labels, validDays }) {
  const lines = items.map(it => ({ d: it[0], q: it[1], p: it[2], t: round2(it[1] * it[2]) }));
  const sub = round2(lines.reduce((s, l) => s + l.t, 0));
  const tax = round2(sub * rate / 100);
  const total = round2(sub + tax);
  const L = labels || ['Subtotal', taxLabel + ' at ' + rate + '%', 'Total'];
  const m = n => symbol + num(n);
  const html = '<table>\n<thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead>\n<tbody>\n' +
    lines.map(l => '<tr><td>' + l.d + '</td><td class="n">' + num(l.q) + '</td><td class="n">' + m(l.p) + '</td><td class="n">' + m(l.t) + '</td></tr>').join('\n') + '\n' +
    '<tr><td colspan="3">' + L[0] + '</td><td class="n">' + m(sub) + '</td></tr>\n' +
    '<tr><td colspan="3">' + L[1] + '</td><td class="n">' + m(tax) + '</td></tr>\n' +
    '<tr><td colspan="3"><strong>' + L[2] + '</strong></td><td class="n"><strong>' + m(total) + '</strong></td></tr>\n</tbody></table>';
  const preset = { label, currency, taxRate: rate, taxLabel, validDays: validDays || 30, items, notes };
  return { key, html, preset, sub, tax, total, m };
}
const loadBtn = (key, label) => '<p><button type="button" class="btn ghost" data-preset="' + key + '" style="cursor:pointer;font-size:13px;padding:9px 16px">' + label + '</button></p>';
const NEXT = '<p>Once the client says yes, use our <a href="/quote-acceptance-template">quote acceptance wording</a>, and see <a href="/quotation-confirmation">confirm a quotation</a> for the reply that settles the details. If clients are slow to answer, <a href="/blog/quote-acceptance-rate-tips">improve your quote acceptance rate</a>.</p>';

const E = {};

// --- United Kingdom ------------------------------------------------------------------------------------------------
{
  const ex = example({
    key: 'uk-bathroom', label: 'UK bathroom refit quote with VAT (example prices)', currency: 'GBP', symbol: '£', rate: 20, taxLabel: 'VAT',
    labels: ['Subtotal, excluding VAT', 'VAT at 20%', 'Total including VAT'],
    items: [['Strip out old suite and tiles, remove waste', 1, 450], ['First fix: plumbing and electrics', 1, 1900], ['Waterproofing and wall and floor tiling', 1, 1250], ['Sanitaryware and shower (supplied)', 1, 1100], ['Second fix, sealing and clean down', 1, 800]],
    notes: 'Scope: bathroom refit as described above.\nNot included: decoration, and any hidden faults found once the old suite is out (priced and agreed with you before we do them).\nPayment: 30% to order materials, balance on completion. Prices include VAT at 20%. Valid for 30 days.'
  });
  E.uk = {
    updated: '2026-11-10', checked: CHECKED,
    presets: { [ex.key]: ex.preset }, presetButtons: [{ key: ex.key, label: 'Bathroom refit with VAT' }],
    local: `
<h2 id="example">Example: a bathroom refit for a homeowner</h2>
<p>A VAT-registered builder quoting a homeowner shows each line before VAT, then the VAT and the total the homeowner pays. Prices are examples only.</p>
${ex.html}
${loadBtn(ex.key, 'Load this UK example into the quote maker')}

<h2 id="uk-rules">Rules that change a UK quote</h2>
<ul>
<li><strong>VAT on building work:</strong> most building work on houses and flats, including work by plumbers, plasterers and carpenters, is standard-rated at 20%. Building a new house or flat is zero-rated, and converting a building into homes or renovating an empty home can qualify for the 5% rate. See ${a('https://www.gov.uk/vat-builders', 'GOV.UK: VAT for builders')}.</li>
<li><strong>Domestic reverse charge:</strong> the charge applies to businesses registered for VAT in the UK whose work is reported within the Construction Industry Scheme, and it covers most building and construction services. Where it applies the supplier does not charge VAT. See ${a('https://www.gov.uk/guidance/vat-domestic-reverse-charge-for-building-and-construction-services', 'GOV.UK: VAT domestic reverse charge')}. For a CIS customer, the VAT line in the example above would not appear.</li>
<li><strong>Late payment:</strong> for business customers the statutory interest is 8% plus the Bank of England base rate, and you can add a fixed sum of £40, £70 or £100 by the size of the debt. A different rate in your contract replaces it, so write your payment terms on the quote. See ${a('https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt', 'GOV.UK: charging interest')} and ${a('https://www.gov.uk/late-commercial-payments-interest-debt-recovery/claim-debt-recovery-costs', 'GOV.UK: debt recovery costs')}.</li>
</ul>

<h2 id="uk-words">Words your UK client expects</h2>
<p>Tradespeople say "quote" for a fixed price and "estimate" for a guide, and homeowners know the difference from Citizens Advice, linked above. "Tender" is used for larger or public jobs. Put your VAT number on the quote if you are registered, your Gas Safe number on gas work, and say whether the price includes VAT. For trade-specific wording see the <a href="/quote-template-plumber">plumber</a>, <a href="/quote-template-builder">builder</a> and <a href="/quote-template-electrician">electrician</a> quote templates, and the <a href="/labour-quotation-format">labour quotation format</a> if you quote labour only.</p>
${NEXT}`,
    faq: [
      { q: 'Do I have to charge VAT on a quote in the UK?', a: 'Only if you are VAT registered. Registration is required once taxable turnover goes over £90,000 in the last 12 months. If you are registered, show each line before VAT, the VAT and the total including VAT; if you are not, set the VAT rate to 0 and do not mention VAT.' },
      { q: 'What is the VAT domestic reverse charge and does it change my quote?', a: 'It applies to most building and construction services supplied by a VAT-registered business to another VAT-registered business in the Construction Industry Scheme. The supplier does not charge VAT, so the quote shows no VAT line. Check the GOV.UK guidance for your job, because some supplies are excluded.' },
      { q: 'What interest can I charge if a business client pays a quote late?', a: 'The statutory rate is 8% plus the Bank of England base rate, plus a fixed sum of £40, £70 or £100 depending on the debt, unless your contract sets a different rate. State your payment terms on the quote so the client sees them before accepting.' },
      { q: 'Should a UK quote to a homeowner show the total with VAT?', a: 'Yes. Consumers must be shown prices including VAT, so lead with the VAT-inclusive total and show the VAT line beneath it.' }
    ]
  };
}

// --- Canada --------------------------------------------------------------------------------------------------------
{
  const ex = example({
    key: 'ca-bathroom', label: 'Canada bathroom renovation quote, Ontario HST (example prices)', currency: 'CAD', symbol: 'CA$', rate: 13, taxLabel: 'HST',
    labels: ['Subtotal before tax', 'HST at 13% (Ontario)', 'Total'],
    items: [['Demolition and disposal', 1, 900], ['Plumbing rough-in', 1, 1850], ['Waterproofing and tiling', 1, 2600], ['Vanity, toilet and fixtures', 1, 1900], ['Finishing labour', 1, 750]],
    notes: 'Tax: HST at 13% for work at an Ontario address. Our GST/HST registration number is shown above.\nNot included: permits, painting, and any hidden defects found once walls are opened.\nPayment: 25% deposit, balance on completion. Valid for 30 days.'
  });
  const sub = ex.sub;
  const row = (name, r) => '<tr><td>' + name + '</td><td class="n">' + r + '%</td><td class="n">CA$' + num(round2(sub * r / 100)) + '</td><td class="n">CA$' + num(round2(sub * (1 + r / 100))) + '</td></tr>';
  E.canada = {
    updated: '2026-11-10', checked: CHECKED,
    presets: { [ex.key]: ex.preset }, presetButtons: [{ key: ex.key, label: 'Bathroom renovation, Ontario HST' }],
    local: `
<h2 id="example">Example: a bathroom renovation, taxed at the HST rate</h2>
<p>The tax line depends on where the work is done. This quote is for a job at an Ontario address, so it carries 13% HST. Prices are examples only.</p>
${ex.html}
${loadBtn(ex.key, 'Load this Canadian example into the quote maker')}

<h2 id="same-job">The same job at other rates</h2>
<p>The same CA$${num(sub)} job, before tax, at the rates in the table above. Use the rate for the place where the work is supplied and check it with the Canada Revenue Agency's rate calculator.</p>
<table>
<thead><tr><th>Where the work is</th><th class="n">Rate</th><th class="n">Tax</th><th class="n">Total</th></tr></thead>
<tbody>
${row('Alberta (GST only)', 5)}
${row('Ontario (HST)', 13)}
${row('Nova Scotia (HST)', 14)}
${row('New Brunswick, Newfoundland and Labrador, Prince Edward Island (HST)', 15)}
</tbody></table>
<p>In British Columbia, Saskatchewan, Manitoba and Quebec, a separate provincial sales tax can apply on top of the 5% GST, so the tax line in the tool may need a combined rate and a renamed label.</p>

<h2 id="ca-rules">Rules that change a Canadian quote</h2>
<ul>
<li><strong>Who must collect:</strong> a small supplier is a business whose worldwide taxable revenue was CA$30,000 or less in a single calendar quarter and over the last four consecutive calendar quarters. Past that limit you must register and start collecting GST/HST; below it you can register voluntarily. See ${a('https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/rc4022/general-information-gst-hst-registrants.html', 'Canada Revenue Agency: General information for GST/HST registrants')}.</li>
<li><strong>Which rate:</strong> the rates in this page's tables come from the Canada Revenue Agency's list of GST/HST rates; the source links are in the facts table at the top of the page.</li>
</ul>

<h2 id="ca-words">Words your Canadian client expects</h2>
<p>"Quote", "quotation" and "estimate" are all used, and clients in Quebec may ask for the document in French. Show your GST/HST registration number if you are registered and say whether prices include tax. For trade wording see the <a href="/quote-template-contractor">contractor quote template</a> and the <a href="/quote-template-painter">painting quote template</a>.</p>
${NEXT}`,
    faq: [
      { q: 'Which tax rate goes on a quote in Canada?', a: 'The rate for the place where the work is supplied: 5% GST in a GST-only province, or the HST rate in an HST province (Ontario 13%; Nova Scotia 14%; New Brunswick, Newfoundland and Labrador and Prince Edward Island 15%). Check the CRA rate calculator for your case.' },
      { q: 'Do I have to charge GST/HST on a quote?', a: 'Once your worldwide taxable revenue passes CA$30,000 in a single calendar quarter or over four consecutive calendar quarters, you must register and collect. Below that you are a small supplier and may register voluntarily.' },
      { q: 'How do I show a provincial sales tax with GST on a quote?', a: 'Either add the provincial tax as its own line, or include it in the tax rate and rename the tax label, so the client can see what they pay. Keep the registration number for each tax on the quote.' },
      { q: 'Can I make a quote in French for a client in Quebec?', a: 'Yes. The tool builds the PDF from the text you type, so you can write the lines and terms in French. The headings on the PDF are in English.' }
    ]
  };
}

// --- Australia -----------------------------------------------------------------------------------------------------
{
  const ex = example({
    key: 'au-deck', label: 'Australian deck quote with GST (example prices)', currency: 'AUD', symbol: 'AU$', rate: 10, taxLabel: 'GST',
    labels: ['Subtotal, excluding GST', 'GST at 10%', 'Total including GST'],
    items: [['Site preparation and footings', 1, 1800], ['Timber decking and bearers, supplied', 1, 3400], ['Carpentry labour, 2 days, 2 people', 1, 2600], ['Stain and finish', 1, 650], ['Skip and waste removal', 1, 350]],
    notes: 'ABN: shown above. Prices include GST at 10%.\nNot included: council or certifier fees, balustrade, and any rock or services found in the footings (priced and agreed before we continue).\nPayment: 20% deposit, 50% when materials are on site, 30% on completion. Valid for 30 days.'
  });
  E.australia = {
    updated: '2026-11-10', checked: CHECKED,
    presets: { [ex.key]: ex.preset }, presetButtons: [{ key: ex.key, label: 'Deck build with GST' }],
    local: `
<h2 id="example">Example: a timber deck for a homeowner</h2>
<p>A GST-registered tradesperson quoting a homeowner shows the price before GST, the GST and the total including GST. Prices are examples only.</p>
${ex.html}
${loadBtn(ex.key, 'Load this Australian example into the quote maker')}

<h2 id="au-rules">Rules that change an Australian quote</h2>
<ul>
<li><strong>ABN:</strong> if the supplier does not quote an ABN, the person paying must withhold 47% of the payment and send it to the ATO, except for payments of AU$75 or less (before GST). A quote that carries your ABN lets the client pay you in full. See ${a('https://www.ato.gov.au/businesses-and-organisations/preparing-lodging-and-paying/business-activity-statements-bas/pay-as-you-go-payg-withholding', 'ATO: PAYG withholding')}.</li>
<li><strong>GST registration:</strong> you must register once your GST turnover reaches AU$75,000, measured over the current month and the previous 11 months, or when your projected turnover for the next 11 months is likely to reach it. See ${a('https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst', 'ATO: registering for GST')}.</li>
<li><strong>Tax invoice versus quote:</strong> a quote is not a tax invoice. If a customer asks for a tax invoice you must give one within 28 days, unless the sale is AU$82.50 or less including GST. The tax invoice you issue after the work is what a GST-registered buyer needs to claim a GST credit.</li>
<li><strong>Price statements:</strong> it is illegal to make false or misleading statements about the price of goods or services, so say what the price includes and excludes. See ${a('https://www.accc.gov.au/consumers/pricing/setting-prices-whats-allowed', 'ACCC: setting prices')}.</li>
<li><strong>Home building:</strong> state and territory laws set when a written contract is required for home building work and what it must say. Check your state's fair trading or building regulator before you quote a larger job.</li>
</ul>

<h2 id="au-words">Words your Australian client expects</h2>
<p>"Quote" is the usual word for a fixed price and "estimate" for a guide. Say whether the price includes GST, show your ABN, and add your licence number if your state requires one for the trade. For trade wording see the <a href="/quote-template-contractor">contractor quote template</a>, the <a href="/quote-template-mechanic">panel beating and repair quote template</a> and the <a href="/quote-template-electrician">electrician quote template</a>.</p>
${NEXT}`,
    faq: [
      { q: 'Do I need an ABN on a quote in Australia?', a: 'Yes, put it on every quote. If the person paying does not have your ABN when they pay you, they must withhold 47% of the payment (payments of AU$75 or less before GST are an exception).' },
      { q: 'When do I have to charge GST on a quote?', a: 'Once your GST turnover reaches AU$75,000, or you expect it to over the next 11 months. Before that you can register voluntarily. If you are not registered, set GST to 0 and do not call the document a tax invoice.' },
      { q: 'Is an Australian quote the same as a tax invoice?', a: 'No. A quote offers a price for work. A tax invoice is issued after the supply and lets a GST-registered buyer claim a GST credit; you must provide one within 28 days if asked, unless the sale is AU$82.50 or less including GST.' },
      { q: 'Should the price on an Australian quote include GST?', a: 'State clearly which it is, and make sure nothing the client has to pay is left out of the total. Showing the price before GST, the GST and the total including GST, as in the example, answers the question on its own.' }
    ]
  };
}

// --- Germany -------------------------------------------------------------------------------------------------------
{
  const ex = example({
    key: 'de-bad', label: 'Deutschland: Angebot Badsanierung mit 19 % MwSt (Beispielpreise)', currency: 'EUR', symbol: '€', rate: 19, taxLabel: 'MwSt',
    labels: ['Summe netto', 'MwSt 19 %', 'Gesamtbetrag brutto'],
    items: [['Arbeitskosten: Rückbau und Installation, Stunden', 30, 64], ['Arbeitskosten: Fliesenarbeiten, Stunden', 24, 58], ['Material: Sanitärobjekte und Armaturen', 1, 1680], ['Material: Fliesen und Kleber', 1, 940], ['Entsorgung', 1, 180]],
    notes: 'Arbeitskosten und Material sind getrennt ausgewiesen.\nDieses Angebot ist gültig bis [Datum]. Nicht enthalten: Malerarbeiten und Möbel.\nZahlung: 30 % bei Auftragserteilung, Rest nach Abnahme.'
  });
  const labour = round2(30 * 64 + 24 * 58);
  const labourGross = round2(labour * 1.19);
  const credit = round2(labourGross * 0.2);
  E.germany = {
    updated: '2026-11-10', checked: CHECKED,
    presets: { [ex.key]: ex.preset }, presetButtons: [{ key: ex.key, label: 'Badsanierung mit MwSt' }],
    local: `
<h2 id="example">Example: an Angebot for a bathroom renovation</h2>
<p>A quote to a homeowner that separates labour (Arbeitskosten) from material, with MwSt at 19%. Prices are examples only.</p>
${ex.html}
${loadBtn(ex.key, 'Load this German example into the quote maker')}
<p>Showing labour on its own line helps your customer. Under §35a of the income tax law, a homeowner can reduce income tax by 20% of the labour costs of renovation and maintenance work, up to a maximum reduction of €1,200 a year. In the example, labour is €${num(labour)} net, €${num(labourGross)} including MwSt, and 20% of that is €${num(credit)}. The reduction applies only to labour costs, and only if the customer receives an invoice and pays by transfer to your account. See ${a('https://www.gesetze-im-internet.de/estg/__35a.html', 'EStG §35a')}.</p>

<h2 id="de-rules">Rules that change a German quote</h2>
<ul>
<li><strong>Binding offer:</strong> someone who makes an offer is bound by it, unless they exclude that binding. A valid-until date ("gültig bis") limits how long the offer stays open, and the word "freibleibend" is the usual way to exclude binding. See ${a('https://www.gesetze-im-internet.de/bgb/__145.html', 'BGB §145')}.</li>
<li><strong>Kostenvoranschlag:</strong> if a contract is based on a cost estimate (Kostenanschlag) for which the contractor gave no guarantee, and the work cannot be finished without a substantial overrun, the customer can terminate and the contractor's claim is limited. The contractor must tell the customer promptly when an overrun is expected. See ${a('https://www.gesetze-im-internet.de/bgb/__649.html', 'BGB §649')}.</li>
<li><strong>Kleinunternehmer:</strong> a business whose total turnover did not exceed €25,000 in the previous calendar year and does not exceed €100,000 in the current year can use the small-business rule and does not charge Umsatzsteuer. The usual note on the quote is "Gemäß §19 UStG wird keine Umsatzsteuer berechnet". See ${a('https://www.gesetze-im-internet.de/ustg_1980/__19.html', 'UStG §19')}.</li>
</ul>

<h2 id="de-words">Words your German client expects</h2>
<p>An Angebot is an offer that binds you; a Kostenvoranschlag is an estimate. Say which one you give. Add an Angebotsnummer, the date, a validity date, your Steuernummer or USt-IdNr., and show Netto, MwSt and Brutto. Private customers expect the Brutto total first; businesses compare Netto. The PDF heading reads "Quotation", so add "Angebot" to the quote number if your client expects it. For a trade-specific layout see the <a href="/quote-template-contractor">contractor quote template</a>.</p>
${NEXT}`,
    faq: [
      { q: 'Is a Kostenvoranschlag binding in Germany?', a: 'Not as a price promise: it is an estimate. If the work cannot be done without a substantial overrun of an estimate you did not guarantee, the customer can terminate, and you must tell them promptly when you see an overrun coming. An Angebot, by contrast, binds you under §145 BGB unless you exclude that.' },
      { q: 'How long is an Angebot binding?', a: 'Until the date you give, and without a date for a reasonable time. Write "gültig bis [Datum]". Using "freibleibend" excludes the binding, but then the client cannot rely on the price.' },
      { q: 'Should I show labour separately on a German quote?', a: 'Yes, for private customers. A homeowner can reduce income tax by 20% of labour costs, up to €1,200 a year, if there is an invoice that shows labour and the payment goes to your account by transfer.' },
      { q: 'Do I charge MwSt if I am a Kleinunternehmer?', a: 'No. With turnover up to €25,000 in the previous year and under €100,000 in the current year you do not charge Umsatzsteuer; set the tax rate to 0 and add the note about §19 UStG.' }
    ]
  };
}

// --- France --------------------------------------------------------------------------------------------------------
{
  const ex = example({
    key: 'fr-salle-de-bain', label: 'France : devis rénovation salle de bain, TVA 10 % (prix d\'exemple)', currency: 'EUR', symbol: '€', rate: 10, taxLabel: 'TVA',
    labels: ['Total HT', 'TVA à 10 %', 'Total TTC'],
    items: [['Dépose et évacuation de l\'ancienne salle de bain', 1, 480], ['Plomberie : alimentation et évacuations', 1, 1350], ['Carrelage et faïence, fourniture et pose', 1, 1980], ['Douche et meuble vasque, fourniture', 1, 1420], ['Main d\'œuvre de finition (forfait)', 1, 770]],
    notes: 'Devis gratuit. Durée de validité : 3 mois.\nTravaux dans un logement achevé depuis plus de deux ans : le client certifie que les conditions du taux réduit de TVA sont remplies.\nBon pour accord : date, signature.'
  });
  E.france = {
    updated: '2026-11-10', checked: CHECKED,
    presets: { [ex.key]: ex.preset }, presetButtons: [{ key: ex.key, label: 'Salle de bain, TVA 10 %' }],
    local: `
<h2 id="example">Example: a devis for a bathroom renovation</h2>
<p>A devis for work in a home finished more than two years ago, with TVA at the reduced 10% rate and the totals HT (before tax) and TTC (including tax) that French customers expect. Prices are examples only.</p>
${ex.html}
${loadBtn(ex.key, 'Load this French example into the quote maker')}

<h2 id="fr-rules">Rules that change a French devis</h2>
<ul>
<li><strong>When a devis is compulsory:</strong> before building and repair work such as masonry, plumbing, electrics, roofing and painting, and for replacing or adding parts as a result. Without one, the professional can be fined up to €3,000 as a sole trader and up to €15,000 as a company. See ${a('https://www.service-public.gouv.fr/particuliers/vosdroits/F31144', 'Service-Public.fr: devis')}.</li>
<li><strong>What the devis must show:</strong> the date, your company name and address, the client's name, where the work is done, the exact nature of the work, each product and service with its unit price, unit and quantity, the hourly labour rate TTC, how the time is counted, travel costs, the totals HT and TTC with the TVA rate, how long the devis is valid, and whether it is free or paid (with the cost if paid). Same source.</li>
<li><strong>Reduced TVA on home work:</strong> in a home finished more than two years ago, the rate is 10% for improvement, transformation, fitting out and maintenance, and 5.5% for energy performance work. Since 1 March 2025 the client confirms the conditions with a mention on the devis or invoice, which can replace the separate attestation. See ${a('https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mes-autres-impots-et-taxes/tva-taux-reduit-pour-quels-travaux', 'economie.gouv.fr: TVA à taux réduit')}.</li>
<li><strong>Micro-entrepreneurs:</strong> a business under the franchise en base de TVA does not charge TVA and must write "TVA non applicable" with the legal reference. That reference changed with the recodification of the VAT rules from 1 September 2026, so check the current wording on ${a('https://entreprendre.service-public.gouv.fr/vosdroits/F23208', 'Entreprendre.Service-Public.fr')} before you update your model.</li>
</ul>

<h2 id="fr-words">Words your French client expects</h2>
<p>"Devis" is the document; "devis gratuit" means free of charge. The client accepts by writing "bon pour accord", the date and a signature. The tool's PDF heading reads "Quotation", so put "Devis" at the start of the quote number or the notes. Add your SIRET number, and for building trades your insurance details if your trade needs them. For trade-specific layout see the <a href="/quote-template-contractor">contractor quote template</a>.</p>
${NEXT}`,
    faq: [
      { q: 'Is a devis compulsory in France?', a: 'For building and repair work such as masonry, plumbing, electrics, roofing and painting, yes. Without a prior devis the professional faces a fine of up to €3,000 as a sole trader and up to €15,000 as a company. For other services it depends on the sector.' },
      { q: 'What must a French devis contain?', a: 'The date, your name and address, the client, the place of work, the exact work, each item with unit price and quantity, the hourly labour rate TTC, travel costs, the totals HT and TTC with the TVA rate, how long the devis is valid and whether it is free or paid.' },
      { q: 'Which TVA rate goes on a devis for work in a home?', a: 'In a home finished more than two years ago, 10% for improvement and maintenance work and 5.5% for energy performance work. The client certifies the conditions with a mention on the devis or the invoice.' },
      { q: 'What do I write on a devis if I am a micro-entrepreneur?', a: '"TVA non applicable" with the legal reference. Do not show any TVA. The reference changed with the VAT recodification from 1 September 2026, so use the wording on the Service-Public page for your situation.' }
    ]
  };
}

// --- India ---------------------------------------------------------------------------------------------------------
{
  const ex = example({
    key: 'in-painting', label: 'India: interior painting quotation with 18% GST (example prices)', currency: 'INR', symbol: '₹', rate: 18, taxLabel: 'GST',
    labels: ['Subtotal before GST', 'GST at 18% (CGST 9% + SGST 9%)', 'Total including GST'],
    items: [['Wall putty and primer, per sq ft', 1800, 14], ['Emulsion paint, 2 coats, per sq ft', 1800, 16], ['Ceiling paint, per sq ft', 650, 12], ['Door and window polish, per door or window', 6, 1800], ['Masking, furniture cover and clean up', 1, 3500]],
    notes: 'Quotation valid for 15 days. Prices are for the area stated and exclude furniture shifting and wall repairs.\nPayment: 30% advance, 40% after putty, 30% on completion.\nGSTIN: shown above.'
  });
  E.india = {
    updated: '2026-11-10', checked: CHECKED,
    presets: { [ex.key]: ex.preset }, presetButtons: [{ key: ex.key, label: 'Interior painting with GST' }],
    local: `
<h2 id="example">Example: an interior painting quotation</h2>
<p>A GST-registered painting contractor quoting a flat in the same state, with the 18% rate split into CGST and SGST. Rates per square foot and totals are examples only.</p>
${ex.html}
${loadBtn(ex.key, 'Load this Indian example into the quote maker')}

<h2 id="in-rules">Rules that change an Indian quotation</h2>
<ul>
<li><strong>CGST, SGST or IGST:</strong> for a supply inside one state the tax is split equally between central GST (CGST) and state GST (SGST), so 18% shows as 9% plus 9%. For a supply between states it is charged as integrated GST (IGST) at the full rate. The tool has one tax line, so use the full rate and name the split in the tax label or the notes.</li>
<li><strong>Who must register:</strong> registration is needed once aggregate turnover in a financial year passes ₹20 lakh for services or ₹40 lakh for goods in most states, with a lower limit of ₹10 lakh in special category states. See the ${a('https://www.pib.gov.in/FactsheetDetails.aspx?Id=148644', 'Press Information Bureau GST factsheet')} and check the current limits for your state.</li>
<li><strong>Which rate:</strong> the page above gives the standard 18% and the merit rate of 5% from 22 September 2025. The rate depends on the goods or service, so check it for yours or ask your accountant.</li>
</ul>

<h2 id="in-words">Words your Indian client expects</h2>
<p>A quotation (or "estimate") is not a tax invoice: the tax invoice follows once the work or supply is done. It is usual to show your GSTIN and the client's GSTIN, the validity period (15 days is common), and a total in rupees. In some trades the HSN or SAC code and the amount in words are also customary; confirm what your clients and accountant require. For labour contractors the full <a href="/labour-quotation-format">labour quotation format</a> has the fields, per-unit pricing and a template; for other trades see the <a href="/quote-template-contractor#labour-only">contractor template</a> and the <a href="/quote-template-painter">painting quote template</a>.</p>
${NEXT}`,
    faq: [
      { q: 'What GST rate goes on a quotation in India?', a: 'The rate depends on the goods or service. The standard rate is 18% and the merit rate is 5%, from 22 September 2025, with a special 40% rate for a small set of goods. Check the rate for your goods or service, or ask your accountant.' },
      { q: 'How do I show CGST and SGST on a quotation?', a: 'For a supply inside one state, write the total rate and its split, for example "GST 18% (CGST 9% + SGST 9%)", in the tax label. For a supply to another state it is IGST at the full rate.' },
      { q: 'Do I need a GSTIN on a quotation?', a: 'If you are registered, show your GSTIN with your business details and ask for the client\'s GSTIN if they are registered, so the tax invoice that follows is correct. Registration is needed above ₹20 lakh turnover for services or ₹40 lakh for goods in most states, with lower limits in special category states.' },
      { q: 'Is a quotation the same as a proforma or tax invoice?', a: 'No. A quotation offers a price before the work. A proforma invoice is a preview of the bill, and the tax invoice is the document raised for the supply that carries the GST.' }
    ]
  };
}

// --- United Arab Emirates ------------------------------------------------------------------------------------------
{
  const ex = example({
    key: 'ae-ac-maintenance', label: 'UAE: AC maintenance contract quotation with 5% VAT (example prices)', currency: 'AED', symbol: 'AED ', rate: 5, taxLabel: 'VAT',
    labels: ['Subtotal before VAT', 'VAT at 5%', 'Total including VAT'],
    items: [['Quarterly service visit, per unit (6 units, 4 visits)', 24, 85], ['Annual coil cleaning, per unit', 6, 180], ['Refrigerant top-up, per unit, only if needed (estimate)', 2, 250], ['24-hour call-out cover, per year', 1, 600]],
    notes: 'Quotation valid for 15 days. Prices in AED. Refrigerant top-up is an estimate and is charged only if needed.\nPayment: quarterly in advance. TRN: shown above.\nPlease reply with your Local Purchase Order (LPO) to confirm.'
  });
  E.uae = {
    updated: '2026-11-10', checked: CHECKED,
    presets: { [ex.key]: ex.preset }, presetButtons: [{ key: ex.key, label: 'AC maintenance contract with VAT' }],
    local: `
<h2 id="example">Example: an annual AC maintenance quotation</h2>
<p>A VAT-registered contractor quoting a villa owner for a year of service on six split units, in dirhams, with 5% VAT shown on its own line. Prices are examples only.</p>
${ex.html}
${loadBtn(ex.key, 'Load this UAE example into the quote maker')}

<h2 id="ae-rules">Rules that change a UAE quotation</h2>
<ul>
<li><strong>Who must register:</strong> mandatory VAT registration applies when taxable supplies and imports pass AED 375,000 over the previous 12 months or are expected to within the next 30 days; voluntary registration is possible above AED 187,500. An application is due within 30 days of the duty to register. See ${a('https://tax.gov.ae/en/taxes/Vat/vat.topics/registration.for.vat.aspx', 'Federal Tax Authority: registration for VAT')}.</li>
<li><strong>Tax invoice that follows:</strong> the Federal Tax Authority's invoice guidance asks for the words "Tax Invoice", your name, address and TRN, a sequential number, a description, the VAT rate and amounts in dirhams, issued within 14 calendar days of the supply. A quotation is not a tax invoice; check the current guide for details such as simplified invoices. See ${a('https://tax.gov.ae/Datafolder/Files/Pdf/2023/Knowledge%20Center%20Page/VAT11%20-%20Tax%20invoices%20En.pdf', 'Federal Tax Authority: tax invoices')}.</li>
</ul>

<h2 id="ae-words">Words your UAE client expects</h2>
<p>In commercial work the buyer often answers a quotation with a Local Purchase Order, or LPO, so ask for the LPO number and quote it on the invoice. Show your TRN if you are VAT registered, state the validity (7 to 30 days is common), and give the price before VAT, the VAT and the total in AED. Many clients also ask for your trade licence number. For trade wording see the <a href="/quote-template-hvac">HVAC quote template</a>, the <a href="/quote-template-contractor">contractor quote template</a> and, for labour-only fit-out and maintenance work, the <a href="/labour-quotation-format">labour quotation format</a>.</p>
${NEXT}`,
    faq: [
      { q: 'Do I need a TRN on a quotation in the UAE?', a: 'If you are VAT registered, put your Tax Registration Number on it so the client sees you charge VAT, and carry it onto the tax invoice, where the Federal Tax Authority requires it.' },
      { q: 'When must I register for VAT in the UAE?', a: 'When taxable supplies and imports pass AED 375,000 over the previous 12 months or are expected to within 30 days. Voluntary registration is possible above AED 187,500. Apply within 30 days of the duty arising.' },
      { q: 'What is an LPO?', a: 'A Local Purchase Order is the buyer\'s written order. It is common for a client to accept a quotation by sending an LPO, and the LPO number then goes on your invoice.' },
      { q: 'Is a UAE quotation a tax invoice?', a: 'No. A tax invoice follows the supply and carries the words "Tax Invoice", your TRN, an invoice number and the VAT amounts in dirhams. A quotation shows the price and the VAT you expect to charge.' }
    ]
  };
}

// --- Singapore -----------------------------------------------------------------------------------------------------
{
  const ex = example({
    key: 'sg-kitchen', label: 'Singapore: kitchen renovation quotation with 9% GST (example prices)', currency: 'SGD', symbol: 'S$', rate: 9, taxLabel: 'GST',
    labels: ['Subtotal before GST', 'GST at 9%', 'Total including GST'],
    items: [['Hacking and debris removal', 1, 1200], ['Wall and floor tiling, supply and lay, per sq m', 14, 62], ['Carpentry: base and wall cabinets, per metre', 4.5, 780], ['Plumbing and electrical points', 1, 950], ['Painting', 1, 700], ['Final cleaning', 1, 200]],
    notes: 'All prices are shown before GST; the total including GST is the amount payable.\nNot included: HDB or condominium permit fees, appliances and countertop upgrades.\nPayment: 30% on acceptance, 40% after carpentry, 30% on completion. Valid for 14 days.'
  });
  E.singapore = {
    updated: '2026-11-10', checked: CHECKED,
    presets: { [ex.key]: ex.preset }, presetButtons: [{ key: ex.key, label: 'Kitchen renovation with GST' }],
    local: `
<h2 id="example">Example: a kitchen renovation quotation</h2>
<p>An itemised quotation for a home renovation in Singapore dollars with 9% GST. Prices are examples only.</p>
${ex.html}
${loadBtn(ex.key, 'Load this Singapore example into the quote maker')}

<h2 id="sg-rules">Rules that change a Singapore quotation</h2>
<ul>
<li><strong>Quote the total including GST to the public:</strong> IRAS says a GST-registered business must display and quote prices inclusive of GST to the public, in written or verbal quotes, and failing to comply can lead to a fine of up to S$5,000. Show the GST-inclusive total as the amount payable, as in the example, and the GST on its own line. See ${a('https://www.iras.gov.sg/taxes/goods-services-tax-(gst)/basics-of-gst/invoicing-price-display-and-record-keeping/displaying-and-quoting-prices', 'IRAS: displaying and quoting prices')}.</li>
<li><strong>Who must register:</strong> registration is compulsory when annual taxable turnover goes over S$1 million, tested on the calendar year and on the expected next 12 months. Below that you may register voluntarily. See ${a('https://www.iras.gov.sg/taxes/goods-services-tax-(gst)/gst-registration-deregistration/do-i-need-to-register-for-gst', 'IRAS: do I need to register for GST')}.</li>
<li><strong>Renovation quotes:</strong> the consumer agency's guide for the renovation industry says prices quoted to consumers should be transparent, accurate, clear and itemised, with mandatory charges stated at the outset and estimates given for charges that cannot be worked out upfront. See ${a('https://www.ccs.gov.sg/consumer-protection/legislation-and-guidelines/fair-trading-practices-for-the-renovation-industry/', 'CCCS: fair trading practices for the renovation industry')}.</li>
</ul>

<h2 id="sg-words">Words your Singapore client expects</h2>
<p>"Quotation" is the usual word. Show your UEN, and your GST registration number if you are registered, split work by room or trade, and state what is not included, such as permit fees and appliances. A validity of 14 to 30 days is common. For trade wording see the <a href="/quote-template-contractor">contractor quote template</a> and the <a href="/quote-template-painter">painting quote template</a>.</p>
${NEXT}`,
    faq: [
      { q: 'Should a Singapore quotation show prices with or without GST?', a: 'To the public, a GST-registered business must quote prices inclusive of GST. Show the GST-inclusive total as the amount payable and the GST on its own line beneath the subtotal.' },
      { q: 'When must I register for GST in Singapore?', a: 'When annual taxable turnover goes over S$1 million, tested on the calendar year and on the expected next 12 months. Below that, registration is voluntary. The rate is 9%.' },
      { q: 'What should a renovation quotation in Singapore include?', a: 'Itemised prices by room or trade, mandatory charges stated up front, estimates for charges that cannot be fixed yet, what is not included (such as permit fees and appliances), the payment schedule and a validity date.' },
      { q: 'Do I need a UEN on a quotation?', a: 'It is usual to show your UEN with your business details, and your GST registration number if you are registered, so the client can identify you.' }
    ]
  };
}

// --- New Zealand ---------------------------------------------------------------------------------------------------
{
  const ex = example({
    key: 'nz-bathroom', label: 'New Zealand: bathroom renovation quote with 15% GST (example prices)', currency: 'NZD', symbol: 'NZ$', rate: 15, taxLabel: 'GST',
    labels: ['Subtotal, excluding GST', 'GST at 15%', 'Total including GST'],
    items: [['Remove old linings and fixtures', 1, 1100], ['Plumbing, supply and waste', 1, 2400], ['Waterproofing membrane and tiling, per sq m', 11, 210], ['Vanity, toilet and shower mixer, supplied and fitted', 1, 3150], ['Electrical: extractor fan and heated towel rail', 1, 1350], ['Painting and finishing', 1, 900]],
    notes: 'This is a quote for the work described, not an estimate. Prices include GST at 15%.\nNot included: consent fees, if required. Hidden damage found once linings are removed is priced and agreed with you before any extra work.\nPayment: 20% deposit, balance on completion. Valid for 30 days.'
  });
  E['new-zealand'] = {
    updated: '2026-11-10', checked: CHECKED,
    presets: { [ex.key]: ex.preset }, presetButtons: [{ key: ex.key, label: 'Bathroom renovation with GST' }],
    local: `
<h2 id="example">Example: a bathroom renovation quote</h2>
<p>A GST-registered builder quoting a homeowner for a job well under the NZ$30,000 written-contract limit explained below. Prices are examples only.</p>
${ex.html}
${loadBtn(ex.key, 'Load this New Zealand example into the quote maker')}

<h2 id="nz-rules">Rules that change a New Zealand quote</h2>
<ul>
<li><strong>Quote or estimate:</strong> the Government's consumer site describes an estimate as the provider's best guess of the cost, which can change but should generally stay within 10 to 15%, and a quote as an offer to do the job for a specified price. A large gap between an estimate and the final bill can be misleading conduct under the Fair Trading Act. A verbal quote counts the same as a written one, but get the details in writing. See ${a('https://www.consumerprotection.govt.nz/general-help/guide-to-buying-smart/quotes-and-estimates', 'Consumer Protection: quotes and estimates')}.</li>
<li><strong>Residential building work of NZ$30,000 or more (including GST):</strong> the Building Act requires a written contract, and before signing the contractor must give the prescribed checklist and a disclosure statement. If the contract is missing or lacks the minimum content, default clauses apply automatically. Splitting a job to stay under the limit does not help. See ${a('https://www.building.govt.nz/getting-started/your-rights-and-obligations/builder-and-designer-rights-and-obligations/contractors-do-your-homework/before-building-work-starts', 'Building Performance: before building work starts')}.</li>
<li><strong>Who must register for GST:</strong> you must register if your turnover was at least NZ$60,000 in the last 12 months or you expect it to be in the next 12 months, and also if you add GST to your prices. See ${a('https://www.ird.govt.nz/gst/registering-for-gst', 'Inland Revenue: registering for GST')}.</li>
</ul>

<h2 id="nz-words">Words your New Zealand client expects</h2>
<p>Say "quote" only for a fixed price; say "estimate" if it can change, and give the reason. Show your GST number if you are registered and state whether prices include GST. For trade wording see the <a href="/quote-template-contractor">contractor quote template</a> and the <a href="/quote-template-builder">builder quote template</a> for staged building work.</p>
${NEXT}`,
    faq: [
      { q: 'What is the difference between a quote and an estimate in New Zealand?', a: 'A quote is an offer to do the job for a specified price. An estimate is a best guess that can change, and the final bill should generally be within 10 to 15% of it. Use the word that matches what you mean.' },
      { q: 'Do I need a written contract for building work in New Zealand?', a: 'For residential building work of NZ$30,000 or more including GST, yes. Before signing you must give the client the prescribed checklist and a disclosure statement, and the contract must include the minimum content, or the Building Act default clauses apply.' },
      { q: 'Is a verbal quote binding in New Zealand?', a: 'The consumer protection guidance says there is no legal difference between a verbal and a written quote, but it recommends getting the details in writing. A written quote avoids arguments about what was agreed.' },
      { q: 'When must I register for GST in New Zealand?', a: 'When your turnover was at least NZ$60,000 in the last 12 months or you expect it to be in the next 12 months. You must also register if you add GST to your prices, whatever your turnover.' }
    ]
  };
}

// --- South Africa --------------------------------------------------------------------------------------------------
{
  const ex = example({
    key: 'za-electrical', label: 'South Africa: electrical upgrade quotation with 15% VAT (example prices)', currency: 'ZAR', symbol: 'R', rate: 15, taxLabel: 'VAT',
    labels: ['Subtotal excluding VAT', 'VAT at 15%', 'Total including VAT'],
    items: [['Distribution board, 24-way, supplied and installed', 1, 5200], ['Earth leakage and surge protection', 1, 2350], ['Labour: rewire two circuits, per day', 2, 1850], ['Testing and Certificate of Compliance (CoC)', 1, 950]],
    notes: 'The price includes the Certificate of Compliance on completion.\nNot included: making good to plaster and paint, and any faults found in the existing wiring (priced and agreed before work).\nPayment: 50% deposit, balance on completion. Valid for 14 days.'
  });
  E['south-africa'] = {
    updated: '2026-11-10', checked: CHECKED,
    presets: { [ex.key]: ex.preset }, presetButtons: [{ key: ex.key, label: 'Electrical upgrade with CoC' }],
    local: `
<h2 id="example">Example: a distribution board upgrade with a Certificate of Compliance</h2>
<p>A VAT-registered electrician quoting a homeowner in rand, with the Certificate of Compliance as its own line so the client sees it is included. Prices are examples only.</p>
${ex.html}
${loadBtn(ex.key, 'Load this South African example into the quote maker')}

<h2 id="za-rules">Rules that change a South African quotation</h2>
<ul>
<li><strong>VAT registration:</strong> from 1 April 2026 the compulsory registration threshold is R2.3 million of taxable supplies a year, up from R1 million, and the voluntary threshold is R120,000, up from R50,000. Check the current figures before you rely on them. See ${a('https://www.sars.gov.za/types-of-tax/value-added-tax/', 'SARS: Value-Added Tax')}.</li>
<li><strong>Certificate of Compliance:</strong> once electrical installation work is finished, a registered contractor issues a Certificate of Compliance (CoC) that certifies the installation against SANS 10142-1. Put the CoC on the quote so the client knows it is included, and quote a new or supplementary CoC when work changes an existing installation. See ${a('https://acts.co.za/news/blog/2025/11/doel-notice-electrical-installation-compliance-coc', 'Acts Online: the Department of Employment and Labour notice on compliance with the Electrical Installation Regulations')}.</li>
</ul>

<h2 id="za-words">Words your South African client expects</h2>
<p>"Quotation" and "quote" are both common, and "estimate" is used for repairs where the cost is not yet known. Show your VAT number if you are registered, say whether prices include VAT and give the total in rand. A validity of 7 to 30 days is common, since material prices move. For trade wording see the <a href="/quote-template-electrician">electrician quote template</a> and the <a href="/quote-template-mechanic#panel-beating">panel beating quotation example</a>.</p>
${NEXT}`,
    faq: [
      { q: 'When must I register for VAT in South Africa?', a: 'From 1 April 2026 the compulsory threshold is R2.3 million of taxable supplies in a 12-month period, and you can register voluntarily from R120,000. If you are not registered, set VAT to 0 on the quote.' },
      { q: 'Should an electrical quote in South Africa include a Certificate of Compliance?', a: 'List it as its own line. When electrical installation work is finished, a registered contractor issues a Certificate of Compliance, and new work on an existing installation may need a new or supplementary one.' },
      { q: 'Should a South African quote show prices with VAT?', a: 'State clearly which it is. A good layout shows the price excluding VAT, the VAT at 15% on its own line and the total including VAT.' },
      { q: 'How long should a quotation be valid in South Africa?', a: 'Seven to thirty days is common, and a shorter period makes sense when material prices change quickly. Write the actual valid-until date on the quotation, so the client knows how long the price holds.' }
    ]
  };
}

module.exports = { COUNTRY_PAGES: E, example, round2 };
