// One compact box under the intro of the pages that bring most of the search traffic (19 Nov 2026): a plain way into the quote maker with
// the example that fits the page. The box is drawn by views/partials/lead-cta.ejs, between the page's short answer and its contents list
// (or just above the article when it has neither), and nothing else on these pages changes: not the title, description, canonical, H1,
// headings, text, address or structured data.
//   key    the page's address path
//   href   where the button goes. A page that has the quote maker itself keeps the visitor there (preset: the example it loads in place).
//          The others go to the UK quote maker, which is also what the VAT guide's own button at the foot of the page does.
// Every example named here is a real preset (content/presets.js, or the page's own presets): content/lead-cta test checks it.
const UK = '/free-quote-generator-uk';

const LEAD_CTA = {
  '/blog/vat-on-quotes-explained': {
    title: 'Put VAT on a real quote',
    text: 'Open the UK quote maker with an example: prices before VAT, VAT at 20% on its own line and the total including VAT. Change the lines to yours, then download the PDF.',
    label: 'Open the UK quote maker', href: UK + '?preset=tradesman-uk#qtTool', example: 'tradesman-uk'
  },
  '/quote-acceptance-template': {
    title: 'Add this wording to a quote',
    text: 'Open the quote maker with the acceptance wording already in the terms box, add your lines and download the PDF.',
    label: 'Add acceptance wording to a quote', href: UK + '?preset=acceptance#qtTool', example: 'acceptance'
  },
  '/revised-quotation': {
    title: 'Try it on a quote of your own',
    text: 'Load rev. 2 of an example decorating quote into the quote maker below, with the changes listed in its notes, then change it to your job.',
    label: 'Load the revised example', href: '?preset=revision-v2#qtTool', example: 'revision-v2', inPage: true
  },
  '/quotation-confirmation': {
    title: 'See acceptance wording on a real quote',
    text: 'Open the quote maker with an example quote that has the acceptance wording in its terms. Change the lines to yours and download the PDF.',
    label: 'Open an example quote', href: UK + '?preset=tradesman-uk#qtTool', example: 'tradesman-uk'
  },
  '/blog/quote-acceptance-rate-tips': {
    title: 'Try these tips on a quote of your own',
    text: 'Open the example quote: itemised lines, a list of what is not included, a valid-until date and the acceptance wording are already in. Change it to your job and download the PDF.',
    label: 'Open the example quote', href: UK + '?preset=tradesman-uk#qtTool', example: 'tradesman-uk'
  }
};

const key = p => (String(p || '/').split(/[?#]/)[0].toLowerCase().replace(/\/+$/, '') || '/');
const leadCta = p => LEAD_CTA[key(p)] || null;

module.exports = { LEAD_CTA, leadCta };
