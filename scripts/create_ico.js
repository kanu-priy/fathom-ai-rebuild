const fs = require('fs');
const path = require('path');

// Generate a valid 32x32 32-bit RGBA .ico file with Fathom blue gradient and white F mark
function generateFathomIco() {
  const width = 32;
  const height = 32;
  const bpp = 32;
  
  const headerSize = 6;
  const dirEntrySize = 16;
  const bmiHeaderSize = 40;
  const numPixels = width * height;
  const pixelDataSize = numPixels * 4; // 32-bit BGRA
  const maskRowSize = Math.floor((width + 31) / 32) * 4;
  const maskSize = maskRowSize * height;
  const imageSize = bmiHeaderSize + pixelDataSize + maskSize;
  const totalFileSize = headerSize + dirEntrySize + imageSize;

  const buf = Buffer.alloc(totalFileSize);

  // ICO Header
  buf.writeUInt16LE(0, 0); // reserved
  buf.writeUInt16LE(1, 2); // image type: 1 = ICO
  buf.writeUInt16LE(1, 4); // number of images: 1

  // Directory Entry
  buf.writeUInt8(width, 6);   // width (32)
  buf.writeUInt8(height, 7);  // height (32)
  buf.writeUInt8(0, 8);       // color count: 0 for 256+ colors
  buf.writeUInt8(0, 9);       // reserved
  buf.writeUInt16LE(1, 10);   // color planes: 1
  buf.writeUInt16LE(bpp, 12); // bits per pixel: 32
  buf.writeUInt32LE(imageSize, 14); // image size in bytes
  buf.writeUInt32LE(headerSize + dirEntrySize, 18); // offset to image data (22)

  // BITMAPINFOHEADER (offset 22)
  const bmiOffset = 22;
  buf.writeUInt32LE(bmiHeaderSize, bmiOffset); // biSize
  buf.writeInt32LE(width, bmiOffset + 4);       // biWidth
  buf.writeInt32LE(height * 2, bmiOffset + 8);   // biHeight (doubled for ICO: image + mask)
  buf.writeUInt16LE(1, bmiOffset + 12);          // biPlanes
  buf.writeUInt16LE(bpp, bmiOffset + 14);        // biBitCount
  buf.writeUInt32LE(0, bmiOffset + 16);          // biCompression: BI_RGB (0)
  buf.writeUInt32LE(pixelDataSize + maskSize, bmiOffset + 20); // biSizeImage
  buf.writeInt32LE(0, bmiOffset + 24);           // biXPelsPerMeter
  buf.writeInt32LE(0, bmiOffset + 28);           // biYPelsPerMeter
  buf.writeUInt32LE(0, bmiOffset + 32);          // biClrUsed
  buf.writeUInt32LE(0, bmiOffset + 36);          // biClrImportant

  // Pixel data starts at offset 62 (22 + 40)
  // Note: Windows DIB stores rows bottom-up!
  const pixelOffset = bmiOffset + bmiHeaderSize;

  for (let y = 0; y < height; y++) {
    // inverted y for bottom-up storage
    const actualY = height - 1 - y;
    for (let x = 0; x < width; x++) {
      const idx = pixelOffset + (y * width + x) * 4;

      // Rounded rectangle bounds (radius 6)
      const inRoundedRect =
        (actualY >= 2 && actualY <= 29 && x >= 2 && x <= 29) &&
        !((x < 6 && actualY < 6 && (x - 6) ** 2 + (actualY - 6) ** 2 > 16) ||
          (x > 25 && actualY < 6 && (x - 25) ** 2 + (actualY - 6) ** 2 > 16) ||
          (x < 6 && actualY > 25 && (x - 6) ** 2 + (actualY - 25) ** 2 > 16) ||
          (x > 25 && actualY > 25 && (x - 25) ** 2 + (actualY - 25) ** 2 > 16));

      if (!inRoundedRect) {
        // Transparent
        buf.writeUInt8(0, idx);     // B
        buf.writeUInt8(0, idx + 1); // G
        buf.writeUInt8(0, idx + 2); // R
        buf.writeUInt8(0, idx + 3); // A
        continue;
      }

      // Check if pixel is part of white "F" logo
      const inF =
        (x >= 9 && x <= 13 && actualY >= 8 && actualY <= 24) || // vertical stem
        (x >= 9 && x <= 23 && actualY >= 8 && actualY <= 12) || // top horizontal bar
        (x >= 9 && x <= 20 && actualY >= 14 && actualY <= 17);  // middle horizontal bar

      // Dot / accent
      const inDot = (x >= 21 && x <= 24 && actualY >= 21 && actualY <= 24);

      if (inF) {
        // Crisp White
        buf.writeUInt8(255, idx);     // B
        buf.writeUInt8(255, idx + 1); // G
        buf.writeUInt8(255, idx + 2); // R
        buf.writeUInt8(255, idx + 3); // A
      } else if (inDot) {
        // Light Blue accent
        buf.writeUInt8(250, idx);     // B
        buf.writeUInt8(165, idx + 1); // G
        buf.writeUInt8(96, idx + 2);  // R
        buf.writeUInt8(255, idx + 3); // A
      } else {
        // Blue to Indigo gradient (Fathom brand colors: #2563EB to #6366F1)
        const t = actualY / height;
        const r = Math.round(37 + (99 - 37) * t);
        const g = Math.round(99 + (102 - 99) * t);
        const b = Math.round(235 + (241 - 235) * t);

        buf.writeUInt8(b, idx);     // B
        buf.writeUInt8(g, idx + 1); // G
        buf.writeUInt8(r, idx + 2); // R
        buf.writeUInt8(255, idx + 3); // A
      }
    }
  }

  // Mask data (1 bit per pixel, 0 for opaque, 1 for transparent)
  const maskOffset = pixelOffset + pixelDataSize;
  buf.fill(0, maskOffset, totalFileSize);

  return buf;
}

const icoBuffer = generateFathomIco();

// Write to public/favicon.ico and app/favicon.ico
const publicIcoPath = path.join(__dirname, '..', 'public', 'favicon.ico');
const appIcoPath = path.join(__dirname, '..', 'app', 'favicon.ico');

fs.writeFileSync(publicIcoPath, icoBuffer);
fs.writeFileSync(appIcoPath, icoBuffer);

console.log('Successfully created favicon.ico at:', publicIcoPath, 'and', appIcoPath);
