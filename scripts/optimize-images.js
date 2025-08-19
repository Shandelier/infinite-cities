const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, '..', 'public', 'images', 'urban');
const outputDir = path.join(inputDir, 'optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir);
const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function optimize() {
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!allowed.has(ext)) continue;
    const inputPath = path.join(inputDir, file);
    const base = path.basename(file, ext);
    const outputPath = path.join(outputDir, `${base}.webp`);
    try {
      await sharp(inputPath)
        .resize({ width: 1280, height: 720, fit: 'inside' })
        .toFormat('webp', { quality: 80 })
        .toFile(outputPath);
      console.log('Optimized', file, '->', outputPath);
    } catch (err) {
      console.error('Error processing', file, err);
    }
  }
}

optimize();
