const fs = require('fs');
const path = require('path');

// This script generates PNG icons from SVG files
// To use this script, you'll need to install the required dependencies:
// npm install sharp (for SVG to PNG conversion)
// 
// Then run: node scripts/generate-icons.js

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

async function generatePNGIcons() {
  console.log('🚀 Starting icon generation...');
  
  // Check if sharp is available
  let sharp;
  try {
    sharp = require('sharp');
  } catch (error) {
    console.error('❌ Sharp is not installed. Please install it with: npm install sharp');
    console.log('📝 Alternatively, you can use online SVG to PNG converters or other tools.');
    console.log('📁 SVG files are available in:', iconsDir);
    return;
  }

  try {
    for (const size of iconSizes) {
      const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
      const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      
      if (fs.existsSync(svgPath)) {
        console.log(`🔄 Converting ${size}x${size} SVG to PNG...`);
        
        await sharp(svgPath)
          .png()
          .resize(size, size)
          .toFile(pngPath);
          
        console.log(`✅ Generated ${size}x${size} PNG icon`);
      } else {
        console.log(`⚠️  SVG file not found: ${svgPath}`);
      }
    }
    
    console.log('🎉 Icon generation completed!');
    console.log('📂 Generated PNG files in:', iconsDir);
    
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    console.log('📝 You can manually convert SVG files to PNG using online tools or other software.');
  }
}

// Alternative function to list available SVG files
function listAvailableIcons() {
  console.log('📋 Available SVG icon files:');
  console.log('=' .repeat(50));
  
  iconSizes.forEach(size => {
    const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
    const exists = fs.existsSync(svgPath);
    console.log(`${exists ? '✅' : '❌'} ${size}x${size}: ${svgPath}`);
  });
  
  console.log('=' .repeat(50));
  console.log('📝 To convert to PNG:');
  console.log('1. Install sharp: npm install sharp');
  console.log('2. Run: node scripts/generate-icons.js');
  console.log('3. Or use online converters like: https://convertio.co/svg-png/');
}

// Run the generator
if (require.main === module) {
  generatePNGIcons().catch(error => {
    console.error('Error:', error);
    listAvailableIcons();
  });
}

module.exports = { generatePNGIcons, listAvailableIcons };