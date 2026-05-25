const fs = require('fs');
let s = fs.readFileSync('server.js', 'utf8');

const idx = s.indexOf('// Watermark');
if (idx === -1) { console.log('Not found!'); process.exit(1); }

// Watermark blogunu bul ve degistir
const endIdx = s.indexOf('doc.end();', idx);
const before = s.substring(0, idx);
const after = s.substring(endIdx);

const newWatermark = `// Watermark
    if (!isPro) {
      doc.save();
      doc.translate(297, 420);
      doc.rotate(-45);
      doc.fontSize(80).fillColor('#cccccc').font('Helvetica-Bold')
        .text('FREE VERSION', -250, -40, { width: 500, align: 'center' });
      doc.restore();
      doc.fontSize(9).fillColor('#aaaaaa').font('Helvetica')
        .text('Remove watermark: GetQuotationMaker.com/pricing', 50, 790, { width: 500, align: 'center' });
    }

    `;

fs.writeFileSync('server.js', before + newWatermark + after, 'utf8');
console.log('Watermark updated!');
