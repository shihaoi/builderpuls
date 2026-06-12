import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "src/app/icon.svg"));
const sizes = [16, 32, 48];

const pngs = await Promise.all(
  sizes.map((size) => sharp(svg).resize(size, size).png().toBuffer()),
);

// Minimal ICO writer for PNG-embedded icons
function buildIco(images) {
  const count = images.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;
  const entries = images.map((buf, i) => {
    const size = sizes[i];
    const entry = {
      width: size === 256 ? 0 : size,
      height: size === 256 ? 0 : size,
      offset,
      size: buf.length,
    };
    offset += buf.length;
    return entry;
  });

  const total = offset;
  const out = Buffer.alloc(total);
  out.writeUInt16LE(0, 0);
  out.writeUInt16LE(1, 2);
  out.writeUInt16LE(count, 4);

  entries.forEach((e, i) => {
    const base = 6 + i * 16;
    out.writeUInt8(e.width, base);
    out.writeUInt8(e.height, base + 1);
    out.writeUInt8(0, base + 2);
    out.writeUInt8(0, base + 3);
    out.writeUInt16LE(1, base + 4);
    out.writeUInt16LE(32, base + 6);
    out.writeUInt32LE(e.size, base + 8);
    out.writeUInt32LE(e.offset, base + 12);
  });

  let pos = headerSize;
  pngs.forEach((buf) => {
    buf.copy(out, pos);
    pos += buf.length;
  });

  return out;
}

writeFileSync(join(root, "src/app/favicon.ico"), buildIco(pngs));

await sharp(svg)
  .resize(180, 180)
  .png()
  .toFile(join(root, "src/app/apple-icon.png"));

console.log("Generated favicon.ico and apple-icon.png");