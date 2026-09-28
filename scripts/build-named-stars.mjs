// Stars with an IAU proper name, for the star pages (server-side only).
//   node scripts/build-named-stars.mjs   (after build-catalog.mjs has fetched hyg.csv)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const lines = readFileSync(new URL('./raw/hyg.csv', import.meta.url), 'utf8').split(/\r?\n/);
const head = lines[0].split(',').map((h) => h.replace(/"/g, ''));
const col = Object.fromEntries(head.map((h, i) => [h, i]));
const round = (x, d) => Math.round(x * 10 ** d) / 10 ** d;

const stars = [];
for (let i = 2; i < lines.length; i++) {
  if (!lines[i]) continue;
  const c = lines[i].split(',').map((v) => v.replace(/^"|"$/g, ''));
  const proper = c[col.proper];
  if (!proper) continue;
  const pc = +c[col.dist];
  stars.push({
    id: +c[col.id],
    proper,
    raH: round(+c[col.ra], 6),
    dec: round(+c[col.dec], 5),
    ly: pc > 0 && pc < 100000 ? round(pc * 3.261563777, 2) : 0,
    mag: round(+c[col.mag], 2),
    ci: c[col.ci] === '' ? 0.65 : round(+c[col.ci], 3),
    lum: round(+c[col.lum] || 0, 3),
    spect: c[col.spect],
    con: c[col.con],
    bayer: c[col.bayer],
    flam: c[col.flam] ? +c[col.flam] : 0,
    gl: c[col.gl],
    hip: c[col.hip] ? +c[col.hip] : 0,
    hd: c[col.hd] ? +c[col.hd] : 0,
  });
}
stars.sort((a, b) => a.proper.localeCompare(b.proper));
const out = new URL('../src/lib/server/', import.meta.url);
mkdirSync(out, { recursive: true });
writeFileSync(new URL('named-stars.json', out), JSON.stringify(stars));
console.log(`named stars: ${stars.length}`);
