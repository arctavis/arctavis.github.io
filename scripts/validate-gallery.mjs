#!/usr/bin/env node
/**
 * Verifies the two published Arctavis chapters against the local SVG assets,
 * original inscription IDs, metadata, gallery JavaScript and static HTML.
 * Uses Node.js built-ins; no network access or dependencies required.
 */
import { readFileSync, existsSync } from 'node:fs';

const chapters = [
  { label: 'Historical Genesis', start: 1, end: 15, artworks: 'data/artworks.json',
    inscriptions: 'data/inscriptions.json', page: 'index.html', js: 'gallery.js' },
  { label: 'Digital Fossils', start: 16, end: 30,
    artworks: 'data/digital-fossils/artworks.json',
    inscriptions: 'data/digital-fossils/inscriptions.json',
    page: 'digital-fossils.html', js: 'digital-fossils.js' },
];
const errors = [];
const seen = new Set();
const load = p => JSON.parse(readFileSync(p, 'utf8'));
const plain = v => String(v ?? '').trim().toLowerCase().replace(/\\s+/g, ' ');
const check = (ok, message) => { if (!ok) errors.push(message); };

for (const chapter of chapters) {
  const artworks = load(chapter.artworks);
  const inscriptions = load(chapter.inscriptions);
  const html = readFileSync(chapter.page, 'utf8');
  const js = readFileSync(chapter.js, 'utf8');
  const count = chapter.end - chapter.start + 1;
  check(artworks.length === count, `${chapter.label}: expected ${count} artworks, found ${artworks.length}`);
  check(inscriptions.length === count, `${chapter.label}: expected ${count} inscription records`);
  const byId = new Map(inscriptions.map(x => [x.id, x]));
  const cards = html.match(/<article\\s+class="card"/g) || [];
  check(cards.length === count, `${chapter.label}: expected ${count} static gallery cards, found ${cards.length}`);
  for (let idx = 0; idx < artworks.length; idx++) {
    const a = artworks[idx];
    const num = chapter.start + idx;
    const padded = String(num).padStart(3, '0');
    const image = `assets/art/${padded}.svg`;
    const record = byId.get(a.id);
    check(a.number === num, `${chapter.label}: unexpected artwork number at index ${idx}`);
    check(a.image === image, `#${padded}: invalid image path ${a.image}`);
    check(/^[0-9a-f]{64}i[0-9]+$/.test(a.id), `#${padded}: invalid inscription ID format`);
    check(!seen.has(a.id), `#${padded}: duplicate inscription ID`);
    seen.add(a.id);
    check(Boolean(record), `#${padded}: missing inscription record`);
    check(record && plain(record.meta?.name).includes(plain(a.title)),
      `#${padded}: inscription title differs from gallery title`);
    check(record && plain(record.meta?.name).includes('#' + padded),
      `#${padded}: inscription sequence number differs`);
    check(html.includes(`data-number="${num}"`), `#${padded}: missing static card`);
    check(html.includes(image), `#${padded}: missing static image reference`);
    check(js.includes(a.id), `#${padded}: missing gallery JavaScript data`);
    check(existsSync(image), `#${padded}: local SVG not found`);
    if (existsSync(image)) {
      const svg = readFileSync(image, 'utf8');
      check(/<svg(?:\\s|>)/i.test(svg), `#${padded}: file does not contain an SVG root`);
    }
    if (a.description != null && record?.meta?.description != null)
      check(a.description === record.meta.description, `#${padded}: description mismatch`);
  }
  console.log(`✓ ${chapter.label}: ${artworks.length} works checked`);
}
if (errors.length) {
  console.error('\n' + errors.map(e => '✗ ' + e).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`✓ All ${seen.size} published works pass metadata, inscription and asset checks`);
}
