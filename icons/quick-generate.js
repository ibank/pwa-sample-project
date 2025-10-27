#!/usr/bin/env node

/**
 * Quick icon generator using pure Node.js (no dependencies)
 * Creates PNG files from SVG using node-canvas or browser automation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const svgPath = path.join(__dirname, 'icon-source.svg');
const svgContent = fs.readFileSync(svgPath, 'utf-8');

console.log('🎨 PWA Icon Generator\n');

// Check for available tools
function checkTool(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const hasImageMagick = checkTool('convert') || checkTool('magick');
const hasInkscape = checkTool('inkscape');
const hasRsvgConvert = checkTool('rsvg-convert');

if (!hasImageMagick && !hasInkscape && !hasRsvgConvert) {
  console.log('❌ No SVG conversion tool found!\n');
  console.log('Please install one of the following:\n');
  console.log('Option 1 - ImageMagick (Recommended):');
  console.log('  macOS:  brew install imagemagick');
  console.log('  Linux:  sudo apt-get install imagemagick\n');
  console.log('Option 2 - Inkscape:');
  console.log('  macOS:  brew install inkscape');
  console.log('  Linux:  sudo apt-get install inkscape\n');
  console.log('Option 3 - rsvg-convert:');
  console.log('  macOS:  brew install librsvg');
  console.log('  Linux:  sudo apt-get install librsvg2-bin\n');
  console.log('Or use the browser-based generator:');
  console.log('  open icons/icon-generator.html\n');
  process.exit(1);
}

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' }
];

console.log('📦 Generating PNG icons...\n');

for (const { size, name } of sizes) {
  const outputPath = path.join(__dirname, name);

  try {
    if (hasImageMagick) {
      // ImageMagick method
      const cmd = checkTool('magick')
        ? `magick convert "${svgPath}" -resize ${size}x${size} -background none "${outputPath}"`
        : `convert "${svgPath}" -resize ${size}x${size} -background none "${outputPath}"`;
      execSync(cmd, { stdio: 'ignore' });
    } else if (hasInkscape) {
      // Inkscape method
      execSync(`inkscape "${svgPath}" --export-filename="${outputPath}" -w ${size} -h ${size}`, { stdio: 'ignore' });
    } else if (hasRsvgConvert) {
      // rsvg-convert method
      execSync(`rsvg-convert -w ${size} -h ${size} "${svgPath}" -o "${outputPath}"`, { stdio: 'ignore' });
    }

    console.log(`✅ ${name} (${size}x${size})`);
  } catch (error) {
    console.error(`❌ Failed to generate ${name}:`, error.message);
  }
}

// Generate favicon.ico from 32x32 PNG
try {
  const favicon32 = path.join(__dirname, 'favicon-32x32.png');
  const faviconIco = path.join(__dirname, '..', 'favicon.ico');

  if (hasImageMagick) {
    const cmd = checkTool('magick')
      ? `magick convert "${favicon32}" "${faviconIco}"`
      : `convert "${favicon32}" "${faviconIco}"`;
    execSync(cmd, { stdio: 'ignore' });
    console.log(`✅ favicon.ico (32x32)`);
  } else {
    console.log('ℹ️  favicon.ico: Rename favicon-32x32.png to favicon.ico manually');
  }
} catch (error) {
  console.error('⚠️  Could not generate favicon.ico');
}

console.log('\n🎉 Icon generation complete!\n');
console.log('Next steps:');
console.log('1. Verify icons in icons/ folder');
console.log('2. Refresh browser (Cmd+Shift+R / Ctrl+Shift+R)');
console.log('3. Check DevTools → Application → Manifest\n');
