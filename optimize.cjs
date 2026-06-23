const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');

async function optimizeImages() {
  const files = fs.readdirSync(imagesDir);
  
  for (const file of files) {
    if (file.toLowerCase().endsWith('.png')) {
      const inputPath = path.join(imagesDir, file);
      const webpFilename = file.substring(0, file.lastIndexOf('.')) + '.webp';
      const outputPath = path.join(imagesDir, webpFilename);
      
      console.log(`Processing ${file}...`);
      
      try {
        await sharp(inputPath)
          .resize(500, 500, {
            fit: 'cover',
            withoutEnlargement: true
          })
          .webp({ quality: 80 })
          .toFile(outputPath);
          
        console.log(`Saved optimized ${webpFilename}`);
        
        fs.unlinkSync(inputPath);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
  console.log('All new images optimized!');
}

optimizeImages();
