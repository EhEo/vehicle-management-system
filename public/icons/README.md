# Vehicle Management System Icons

This directory contains the app icons for the Vehicle Management System PWA.

## Available Icons

### SVG Icons (Vector Format)
- `icon-72x72.svg` - 72x72 pixels
- `icon-96x96.svg` - 96x96 pixels  
- `icon-128x128.svg` - 128x128 pixels
- `icon-144x144.svg` - 144x144 pixels
- `icon-152x152.svg` - 152x152 pixels
- `icon-192x192.svg` - 192x192 pixels
- `icon-384x384.svg` - 384x384 pixels
- `icon-512x512.svg` - 512x512 pixels
- `vehicle-icon-master.svg` - Master design file

### Design Features
- **Theme**: Blue color scheme (#3b82f6) matching the app
- **Main Element**: Van/minibus (Kia Carnival style)
- **Style**: Clean, professional, and modern
- **Background**: White circle with subtle border
- **Management Elements**: Clipboard with checklist and wrench symbols
- **Compatibility**: Works well on both light and dark backgrounds

## Converting to PNG

### Option 1: Using the provided script
```bash
# Install dependencies
npm install sharp

# Run the conversion script
node scripts/generate-icons.js
```

### Option 2: Online converters
- [Convertio](https://convertio.co/svg-png/)
- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [SVG to PNG Converter](https://svgtopng.com/)

### Option 3: Command line tools
```bash
# Using Inkscape (if installed)
inkscape --export-png=icon-192x192.png --export-width=192 --export-height=192 icon-192x192.svg

# Using ImageMagick (if installed)
convert icon-192x192.svg -resize 192x192 icon-192x192.png
```

## Usage in PWA

The icons are already configured in `/public/manifest.json` and will be automatically used by browsers for:
- Home screen shortcuts
- App icons in browser tabs
- PWA installation prompts
- Splash screens

## Design Guidelines

If you need to modify the icons:
1. Maintain the blue color scheme (#3b82f6)
2. Keep the van/minibus as the central element
3. Ensure the design is simple and recognizable at small sizes
4. Test on both light and dark backgrounds
5. Use the master SVG file as the base for consistency

## File Structure
```
/public/icons/
├── README.md                 # This file
├── vehicle-icon-master.svg   # Master design file
├── icon-72x72.svg           # Individual size variants
├── icon-96x96.svg
├── icon-128x128.svg
├── icon-144x144.svg
├── icon-152x152.svg
├── icon-192x192.svg
├── icon-384x384.svg
├── icon-512x512.svg
└── [Generated PNG files]    # After conversion
```