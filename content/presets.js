// Example quotes that the tool can load with one click (?preset=key or data-preset buttons).
// Prices are illustrative examples, not market rates; users replace them with their own.
const ACCEPT_BLOCK = 'ACCEPTANCE\nTo accept this quotation, sign below and return it, or reply to the email it came with confirming acceptance. This quotation is valid until the date shown above.\n\nSigned: ____________________   Date: ____________\nName: ____________________';

const P = {
  'tradesman-uk': {
    label: 'UK tradesman quote with VAT (example prices)', currency: 'GBP', taxRate: 20, taxLabel: 'VAT', validDays: 30,
    items: [
      ['Labour: remove existing units and prepare walls (2 days)', 2, 320],
      ['Labour: installation and first fix (3 days)', 3, 320],
      ['Materials: timber, fixings, adhesives and sealants', 1, 485],
      ['Skip hire and waste removal', 1, 260],
      ['Making good and clean down on completion', 1, 140]
    ],
    notes: 'Scope: [describe the work, rooms and finishes].\nNot included: decorating, and any hidden defects found once work starts (these will be priced and agreed with you before we do them).\nPayment: 25% deposit to book the start date, balance within 7 days of completion by bank transfer.\nPrices are shown excluding VAT. VAT at 20% is added below and the total includes VAT.\nThis quote is valid for 30 days.\n\n' + ACCEPT_BLOCK
  },
  'contractor-us': {
    label: 'General contractor quote (example prices)', currency: 'USD', taxRate: 0, taxLabel: 'Sales tax', validDays: 30,
    items: [
      ['Site preparation and demolition', 1, 1200],
      ['Framing labor (hours)', 24, 65],
      ['Lumber and framing materials', 1, 1850],
      ['Drywall: supply, hang and finish (sq ft)', 640, 2.75],
      ['Dumpster rental and debris removal', 1, 450],
      ['Building permit (at cost)', 1, 300]
    ],
    notes: 'Scope: [describe the work].\nExcludes: [painting, appliances, work not listed above].\nPayment schedule: 30% deposit on signing, 40% at rough-in, 30% on completion.\nChange orders: changes to the scope will be priced in writing and signed before the work proceeds.\nThis quote is valid for 30 days. Enter your local sales tax rate above if it applies.\n\n' + ACCEPT_BLOCK
  },
  'labour-only': {
    label: 'Labour contractor quotation, labour only (example rates)', currency: 'INR', taxRate: 18, taxLabel: 'GST', validDays: 15,
    items: [
      ['Brickwork, 9 inch wall (labour only, per sq ft)', 450, 32],
      ['Internal plastering (labour only, per sq ft)', 1200, 18],
      ['Floor tiling (labour only, per sq ft)', 380, 28],
      ['Site cleaning and debris stacking', 1, 3500]
    ],
    notes: 'Labour only. Cement, sand, bricks, tiles, scaffolding, water and electricity to be provided by the client.\nQuantities are estimated; the final bill will use measured quantities at the rates above.\nPayment: 20% advance, then weekly running bills, balance on completion.\nGST shown at 18%; change the rate if a different rate applies to your work.\nValid for 15 days.'
  },
  'carpentry-uk': {
    label: 'Carpentry and joinery quote (example prices)', currency: 'GBP', taxRate: 20, taxLabel: 'VAT', validDays: 30,
    items: [
      ['Supply and hang internal doors (oak veneer), including hinges and handles', 5, 145],
      ['Fit new architrave and skirting, hall and landing (linear metres)', 38, 12],
      ['Fitted alcove cupboards in MDF, primed for painting', 2, 680],
      ['Collection of materials and waste removal', 1, 90]
    ],
    notes: 'Painting of new joinery is not included.\nPayment: 30% deposit to order materials, balance on completion.\nPrices exclude VAT; VAT at 20% is added below (set the rate to 0 if you are not VAT registered).\nValid for 30 days.\n\n' + ACCEPT_BLOCK
  },
  'painting-interior-uk': {
    label: 'Interior painting and decorating quote, UK (example prices)', currency: 'GBP', taxRate: 20, taxLabel: 'VAT', validDays: 30,
    items: [
      ['Living room: walls and ceiling, 2 coats emulsion, fill minor cracks', 1, 420],
      ['Hall, stairs and landing: walls, ceiling and woodwork', 1, 780],
      ['Bedroom 1: walls and ceiling, 2 coats emulsion', 1, 310],
      ['Doors and frames: sand, undercoat and satinwood topcoat', 6, 65],
      ['Paint and sundries: trade emulsion, satinwood, filler, caulk', 1, 265],
      ['Protection, dust sheets and daily clean-up', 1, 60]
    ],
    notes: 'Preparation: fill minor cracks and holes, sand and caulk where needed. Re-plastering and major repairs are not included.\nPaint: [brand and range], colours chosen by you before we start.\nPlease clear small items; we move and cover furniture.\nPayment: balance on completion, no deposit required.\nPrices exclude VAT; VAT at 20% is added below.\nThis quote is valid for 30 days.\n\n' + ACCEPT_BLOCK
  },
  'painting-exterior-us': {
    label: 'Exterior house painting quote (example prices)', currency: 'USD', taxRate: 0, taxLabel: 'Sales tax', validDays: 30,
    items: [
      ['Pressure wash exterior siding', 1, 350],
      ['Scrape, sand and spot-prime bare wood', 1, 480],
      ['Caulk gaps around windows and trim', 1, 220],
      ['Paint siding, 2 coats exterior acrylic (sq ft)', 2200, 1.6],
      ['Paint trim, fascia and front door', 1, 950],
      ['Paint and materials', 1, 780]
    ],
    notes: 'Start date depends on dry weather; we will confirm the day before.\nColours: [colour names and codes]. Two coats on siding, one coat on previously painted trim.\nNot included: rotten wood repair (priced separately if found).\nPayment: 25% deposit, balance on completion.\nValid for 30 days.\n\n' + ACCEPT_BLOCK
  },
  'painting-commercial': {
    label: 'Commercial repaint, priced per m² (example rates)', currency: 'GBP', taxRate: 20, taxLabel: 'VAT', validDays: 30,
    items: [
      ['Office walls: 2 coats contract matt (m²)', 640, 4.8],
      ['Ceilings: 1 coat (m²)', 310, 3.9],
      ['Doors and frames: satin finish', 24, 55],
      ['Out-of-hours working (evenings and weekends)', 1, 600]
    ],
    notes: 'Areas measured from drawings supplied; final account on re-measure.\nWork carried out out of hours to avoid disrupting staff.\nPayment: 30 days from invoice.\nPrices exclude VAT.\nValid for 30 days.'
  },
  'auto-brakes': {
    label: 'Brake repair estimate (example prices)', currency: 'USD', taxRate: 0, taxLabel: 'Sales tax', validDays: 14,
    items: [
      ['Front brake pads, ceramic (part no. [ ])', 1, 68],
      ['Front brake rotors', 2, 54],
      ['Labor: replace front pads and rotors (hours)', 1.6, 120],
      ['Brake fluid flush', 1, 89],
      ['Shop supplies and disposal', 1, 15]
    ],
    notes: 'Vehicle: [year, make, model]  VIN: [ ]  Mileage: [ ]\nConcern: grinding noise when braking.\nFinding: front pads worn to 2 mm, rotors scored.\nParts: aftermarket, [warranty].\nNo additional work will be done without your authorization.\nEstimate valid for 14 days.\n\nI authorize the repairs listed above.\nSigned: ____________________   Date: ____________'
  },
  'auto-service-uk': {
    label: 'Garage service and diagnosis quote, UK (example prices)', currency: 'GBP', taxRate: 20, taxLabel: 'VAT', validDays: 14,
    items: [
      ['Diagnostic check: engine management light, fault codes read and tested', 1, 60],
      ['Full service: engine oil and filter, air filter, cabin filter, checks', 1, 189],
      ['Spark plugs', 4, 9.5],
      ['Labour: replace spark plugs (hours)', 0.5, 78]
    ],
    notes: 'Vehicle: [make, model]  Reg: [ ]  Mileage: [ ]\nWe will contact you for approval before carrying out any work not listed on this quote.\nPrices exclude VAT; VAT at 20% is added below.\nValid for 14 days.'
  },
  'panel-beating': {
    label: 'Panel beating and body repair quotation (example prices)', currency: 'ZAR', taxRate: 15, taxLabel: 'VAT', validDays: 14,
    items: [
      ['Strip and refit rear bumper and tail lights', 1, 1450],
      ['Panel beat and repair left rear quarter panel', 1, 3800],
      ['Paint: prep, prime, base and clear coat, blend adjacent panels', 1, 4600],
      ['Paint materials', 1, 1350],
      ['Parts: left rear light assembly', 1, 2100]
    ],
    notes: 'Vehicle: [make, model]  Reg: [ ]  Insurance claim no.: [ ]\nHidden damage found after strip-down will be quoted and approved before repair.\nParts: [OEM or alternative], subject to availability.\nValid for 14 days.\n\nApproved by: ____________________   Date: ____________'
  },
  'roofing-uk': {
    label: 'Roofing quote, re-roof (example prices)', currency: 'GBP', taxRate: 20, taxLabel: 'VAT', validDays: 21,
    items: [
      ['Strip existing tiles and battens, dispose (m²)', 68, 18],
      ['Breathable membrane and new treated battens (m²)', 68, 16],
      ['Re-tile with new concrete interlocking tiles (m²)', 68, 34],
      ['Dry ridge system, supply and fit (linear metres)', 9, 42],
      ['Scaffolding, erect and dismantle (3 weeks)', 1, 1450],
      ['Skip hire', 2, 280]
    ],
    notes: 'Rotten rafters or other hidden defects found after strip-off are not included; we will price them and agree with you before carrying out the work.\nPayment: 20% deposit, balance on completion.\nPrices exclude VAT.\nValid for 21 days because material prices change.\n\n' + ACCEPT_BLOCK
  },
  'acceptance': {
    label: 'Acceptance wording added to Notes & terms',
    notes: ACCEPT_BLOCK.replace('This quotation is valid until the date shown above.', 'This quotation is valid until the date shown above. Work will be booked on receipt of acceptance.')
  },
  plumber: {
    label: 'Plumbing quote (example prices)', currency: 'GBP', taxRate: 0, taxLabel: 'VAT', validDays: 30,
    items: [
      ['Labour: replace kitchen mixer tap, fixed price', 1, 140],
      ['Kitchen mixer tap (customer choice)', 1, 85],
      ['Isolation valves', 2, 12],
      ['Visit fee (deducted if you go ahead)', 1, 0]
    ],
    notes: 'Price is fixed for the work described.\nMaking good to tiles or plaster is not included.\nGuarantee: 12 months on workmanship.\nPayment on completion. Valid for 30 days.'
  },
  electrician: {
    label: 'Electrical quote (example prices)', currency: 'GBP', taxRate: 0, taxLabel: 'VAT', validDays: 30,
    items: [
      ['Add double sockets to kitchen, chased and made good to plaster', 4, 95],
      ['Replace consumer unit with RCBO board', 1, 650],
      ['Testing and certification', 1, 120]
    ],
    notes: 'Decorating after chasing is not included.\nPayment: balance on completion. Valid for 30 days.'
  },
  'web-designer': {
    label: 'Website design quote (example prices)', currency: 'USD', taxRate: 0, taxLabel: 'Tax', validDays: 30,
    items: [
      ['Discovery workshop and sitemap', 1, 600],
      ['Design: 5 page templates, 2 rounds of revisions', 1, 2400],
      ['Development and CMS setup', 1, 3200],
      ['Content upload (client supplies copy and images)', 1, 450],
      ['Launch and 1 hour training', 1, 250]
    ],
    notes: 'Payment: 50% deposit, 25% on design sign-off, 25% before launch.\nNot included: domain, hosting, paid plugins, copywriting, stock images.\nOptional: maintenance at [amount] per month.\nValid for 30 days.'
  },
  photographer: {
    label: 'Photography quote (example prices)', currency: 'USD', taxRate: 0, taxLabel: 'Tax', validDays: 30,
    items: [
      ['Event coverage (hours)', 6, 150],
      ['Editing and colour correction, 300+ images', 1, 450],
      ['Online gallery for 12 months', 1, 0],
      ['Travel', 1, 60]
    ],
    notes: 'Licence: personal and social media use. Commercial licence priced separately.\nBooking fee: 30%, non-refundable within 30 days of the date. Balance 7 days before.\nValid for 30 days.'
  },
  consultant: {
    label: 'Consulting services quote (example prices)', currency: 'USD', taxRate: 0, taxLabel: 'Tax', validDays: 30,
    items: [
      ['Discovery interviews and data review (days)', 3, 1200],
      ['Analysis and recommendations report (days)', 4, 1200],
      ['Leadership workshop, half day on site', 1, 900],
      ['Travel expenses, billed at cost (cap)', 1, 600]
    ],
    notes: 'Deliverables: [report, workshop, presentation].\nAssumptions: client provides data and access to staff within 5 working days.\nPayment: 40% on signature, 60% on delivery.\nValid for 30 days.'
  },
  landscaper: {
    label: 'Landscaping quote (example prices)', currency: 'GBP', taxRate: 0, taxLabel: 'VAT', validDays: 30,
    items: [
      ['Clear site and dispose of green waste', 1, 380],
      ['Porcelain patio on full mortar bed (m²)', 24, 95],
      ['Lay new turf including topsoil preparation (m²)', 60, 14],
      ['Planting: shrubs and perennials, supply and plant', 1, 420],
      ['Skip hire', 1, 260]
    ],
    notes: 'Start date may move with the weather.\nAftercare: water new turf daily for 2 weeks.\nPayment: 25% deposit, balance on completion. Valid for 30 days.'
  },
  cleaner: {
    label: 'Cleaning service quote (example prices)', currency: 'GBP', taxRate: 0, taxLabel: 'VAT', validDays: 30,
    items: [
      ['Weekly domestic clean, 3 hours per visit (monthly, 4 visits)', 12, 20],
      ['Oven clean (one-off)', 1, 65],
      ['Inside windows (monthly add-on)', 1, 30]
    ],
    notes: 'Supplies: we bring our own products and equipment.\nCancellation: 24 hours notice, or the visit is charged.\nInvoiced monthly in arrears. Valid for 30 days.'
  },
  builder: {
    label: 'Building quote, rear extension (example prices)', currency: 'GBP', taxRate: 20, taxLabel: 'VAT', validDays: 30,
    items: [
      ['Groundworks and foundations', 1, 7800],
      ['Blockwork, brickwork and steel installation', 1, 11200],
      ['Roof structure and covering', 1, 6400],
      ['First and second fix (electrics and plumbing)', 1, 4900],
      ['Plastering and finishes', 1, 3600],
      ['Provisional sum: drainage alterations (subject to change)', 1, 1500]
    ],
    notes: 'Exclusions: planning and building control fees, structural engineer, party wall costs, kitchen supply.\nStage payments: 10% on start, then on completion of each stage.\nVariations priced and agreed in writing before work. Valid for 30 days.'
  },
  'graphic-designer': {
    label: 'Graphic design quote (example prices)', currency: 'USD', taxRate: 0, taxLabel: 'Tax', validDays: 30,
    items: [
      ['Logo design: 3 initial concepts, 2 rounds of revisions', 1, 1200],
      ['Brand guidelines (colours, type, usage), 8 pages', 1, 650],
      ['Business card and letterhead design', 1, 300]
    ],
    notes: 'Files: AI, SVG, PNG and PDF. Full rights transfer on final payment.\nExtra revision rounds at [rate] per hour.\nPayment: 50% deposit, 50% on delivery. Valid for 30 days.'
  },
  hvac: {
    label: 'HVAC installation quote (example prices)', currency: 'USD', taxRate: 0, taxLabel: 'Sales tax', validDays: 30,
    items: [
      ['Central air conditioner, 3 ton (model [ ])', 1, 3900],
      ['Installation labor', 1, 1800],
      ['Line set, pad and electrical disconnect', 1, 650],
      ['Remove and dispose of old unit', 1, 250],
      ['Permit and inspection (at cost)', 1, 180]
    ],
    notes: 'Manufacturer warranty: [x] years parts. Labor warranty: [x] year.\nOptional maintenance plan: [amount] per year.\nPayment: 50% deposit, balance on completion. Valid for 30 days.'
  },
  flooring: {
    label: 'Flooring installation quote (example prices)', currency: 'GBP', taxRate: 0, taxLabel: 'VAT', validDays: 30,
    items: [
      ['Luxury vinyl tile, supply (m², includes 10% waste)', 33, 32],
      ['Fitting LVT (m²)', 30, 18],
      ['Floor levelling compound and preparation (m²)', 30, 9],
      ['Door bars', 3, 15],
      ['Uplift and dispose of old carpet', 1, 80]
    ],
    notes: 'Price assumes a sound, dry subfloor.\nFurniture to be cleared before we arrive.\nPayment: materials deposit, balance on completion. Valid for 30 days.'
  },
  'it-support': {
    label: 'IT support quote (example prices)', currency: 'GBP', taxRate: 20, taxLabel: 'VAT', validDays: 30,
    items: [
      ['Set up new laptops: install, configure, migrate data', 6, 85],
      ['Email migration to new Microsoft 365 tenant (per user)', 12, 45],
      ['Monthly support contract (per user per month)', 12, 25]
    ],
    notes: 'Software licences billed separately.\nSupport hours: Mon to Fri, 9:00 to 17:30.\nPayment: 30 days from invoice. Valid for 30 days.'
  },
  architect: {
    label: 'Architectural services quote (example fees)', currency: 'GBP', taxRate: 20, taxLabel: 'VAT', validDays: 30,
    items: [
      ['Measured survey and existing drawings', 1, 950],
      ['Concept design: 2 options and 1 round of revisions', 1, 1800],
      ['Planning application drawings and submission', 1, 1600],
      ['Building regulations drawings', 1, 2200]
    ],
    notes: 'Not included: planning fees, structural engineer, party wall surveyor.\nFees invoiced at the end of each stage. Valid for 30 days.'
  },
  'wedding-planner': {
    label: 'Wedding planning quote (example prices)', currency: 'USD', taxRate: 0, taxLabel: 'Tax', validDays: 30,
    items: [
      ['Full planning package (12 months)', 1, 4500],
      ['Venue visits with the couple', 3, 150],
      ['On-the-day coordination (planner and assistant)', 1, 1200],
      ['Supplier booking and management', 1, 0]
    ],
    notes: 'Retainer: 30% to secure the date, balance in instalments before the wedding.\nTravel beyond [x] miles charged at cost. Valid for 30 days.'
  },
  'personal-trainer': {
    label: 'Personal training quote (example prices)', currency: 'GBP', taxRate: 0, taxLabel: 'VAT', validDays: 30,
    items: [
      ['Initial assessment and goal setting', 1, 50],
      ['1:1 training sessions, 60 minutes', 12, 45],
      ['Nutrition plan', 1, 60]
    ],
    notes: 'Sessions to be used within 8 weeks.\n24 hours notice to reschedule.\nPayment in advance. Valid for 30 days.'
  }
};

module.exports = { PRESETS: P };
