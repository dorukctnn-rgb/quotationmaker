const fs = require('fs');
let s = fs.readFileSync('server.js', 'utf8');

s = s.replace(
  `    // Watermark
    if (!isPro) {
      doc.fontSize(8).fillColor('#bbb').font('Helvetica')
        .text('Created free at GetQuotationMaker.com â€" Upgrade to PRO to remove this', 50, 790, { width: 500, align: 'center' });
    }`,
  `    // Watermark
    if (!isPro) {
      doc.save();
      doc.translate(297, 420);
      doc.rotate(-45);
      doc.fontSize(72).fillColor('#e5e7eb').font('Helvetica-Bold')
        .text('FREE VERSION', -220, -40, { width: 440, align: 'center', opacity: 0.15 });
      doc.restore();
      doc.fontSize(8).fillColor('#999').font('Helvetica')
        .text('Created free at GetQuotationMaker.com - Upgrade to PRO to remove watermark', 50, 790, { width: 500, align: 'center' });
    }`
);

fs.writeFileSync('server.js', s, 'utf8');
console.log('Watermark updated!');