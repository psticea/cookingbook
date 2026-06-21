/* eslint-disable */
/**
 * Recipe-image thumbnail generator.
 *
 * For every JPG under public/images/recipes/<category>/<id>.jpg, this script
 * emits a small WebP thumbnail beside it as <id>.thumb.webp.
 *
 * The home-page <RecipeCard> loads the .thumb.webp variant and falls back to
 * the original JPG when the thumbnail is missing — so this step is optional
 * for local development and recommended before deploying.
 *
 * Usage:
 *   node scripts/generate-thumbnails.cjs
 *
 * Configure size + quality near the top of the file.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'public', 'images', 'recipes');
const THUMB_SIZE = 480;     // px on the longest side; cards display at ~200-300px
const THUMB_QUALITY = 72;   // webp quality (0-100) — 70-75 is the sweet spot
const FORCE = process.argv.includes('--force');

let sharp;
try {
  sharp = require('sharp');
} catch (err) {
  console.error('❌  `sharp` is required. Install it with:\n\n   npm install --save-dev sharp\n');
  process.exit(1);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.isFile() && /\.(jpe?g|png)$/i.test(entry.name) && !/\.thumb\.(webp|jpg)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  if (!fs.existsSync(ROOT)) {
    console.error(`❌  Folder not found: ${ROOT}`);
    process.exit(1);
  }

  const sources = walk(ROOT);
  if (sources.length === 0) {
    console.log('No source images found — nothing to do.');
    return;
  }

  let generated = 0;
  let skipped = 0;
  let totalIn = 0;
  let totalOut = 0;

  for (const src of sources) {
    const thumb = src.replace(/\.(jpe?g|png)$/i, '.thumb.webp');
    const srcStat = fs.statSync(src);
    totalIn += srcStat.size;

    if (!FORCE && fs.existsSync(thumb)) {
      const thumbStat = fs.statSync(thumb);
      if (thumbStat.mtimeMs >= srcStat.mtimeMs) {
        totalOut += thumbStat.size;
        skipped += 1;
        continue;
      }
    }

    try {
      await sharp(src)
        .resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover', position: 'centre' })
        .webp({ quality: THUMB_QUALITY })
        .toFile(thumb);
      generated += 1;
      totalOut += fs.statSync(thumb).size;
      const rel = path.relative(ROOT, thumb).replace(/\\/g, '/');
      console.log(`✓  ${rel}`);
    } catch (err) {
      console.error(`✗  Failed for ${src}: ${err.message}`);
    }
  }

  const inMb = (totalIn / 1024 / 1024).toFixed(2);
  const outMb = (totalOut / 1024 / 1024).toFixed(2);
  console.log(
    `\nDone — generated ${generated}, skipped ${skipped} (already up to date).`
  );
  console.log(`Source images: ${inMb} MB → thumbnails: ${outMb} MB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
