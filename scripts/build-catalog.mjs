// Builds the compact star catalogs used by the app from the HYG database (CC BY-SA 4.0)
// and the d3-celestial constellation lines (BSD-3).
//   node scripts/build-catalog.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { colorIndex } from './spectral.mjs';

const RAW = new URL('./raw/', import.meta.url);
const OUT = new URL('../src/data/', import.meta.url);
const HYG_URL = 'https://raw.githubusercontent.com/astronexus/HYG-Database/main/hyg/CURRENT/hygdata_v41.csv';
const LINES_URL = 'https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/constellations.lines.json';

const PC_TO_LY = 3.261563777;
const NEAR_LY = 130;   // "your star" candidates: oldest people alive + margin
const SKY_MAG = 5.8;   // background sky: roughly what a dark site shows
const NEAR_MAG = 11.5; // fainter stars need a large telescope: not much of a gift

async function fetchRaw(name, url) {
  const file = new URL(name, RAW);
  if (!existsSync(file)) {
    mkdirSync(RAW, { recursive: true });
    console.log('downloading', url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: ${res.status}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return readFileSync(file, 'utf8');
}

function parseCsvLine(line) {
  const out = [];
  let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else q = false;
      } else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

const round = (x, d) => Math.round(x * 10 ** d) / 10 ** d;

const csv = (await fetchRaw('hyg.csv', HYG_URL)).split(/\r?\n/);
const head = parseCsvLine(csv[0]);
const col = Object.fromEntries(head.map((h, i) => [h, i]));

const near = [];
const sky = [];
for (let i = 1; i < csv.length; i++) {
  if (!csv[i]) continue;
  const c = parseCsvLine(csv[i]);
  if (c[col.id] === '0') continue; // the Sun
  const pc = +c[col.dist];
  const mag = +c[col.mag];
  const raH = +c[col.ra];
  const dec = +c[col.dec];
  // null = colour unknown: drawn neutral, no temperature claimed.
  const ci = colorIndex(c[col.ci], c[col.spect]);

  if (mag <= SKY_MAG) sky.push(round(raH * 15, 3), round(dec, 3), round(mag, 2), round(ci ?? 0.65, 2));

  if (!(pc > 0 && pc < 100000)) continue;
  const ly = pc * PC_TO_LY;
  if (ly > NEAR_LY || mag > NEAR_MAG) continue;
  near.push([
    +c[col.id],
    c[col.hip] ? +c[col.hip] : 0,
    c[col.hd] ? +c[col.hd] : 0,
    c[col.gl],
    c[col.proper],
    c[col.bayer],
    c[col.flam] ? +c[col.flam] : 0,
    c[col.con],
    round(raH, 6),
    round(dec, 5),
    round(ly, 3),
    round(mag, 2),
    ci === null ? null : round(ci, 3),
    round(+c[col.lum] || 0, 4),
    c[col.spect],
  ]);
}
near.sort((a, b) => a[10] - b[10]);

const lines = JSON.parse(await fetchRaw('lines.json', LINES_URL));
const constellations = {};
for (const f of lines.features) {
  constellations[f.id] = f.geometry.coordinates.map((seg) =>
    seg.flatMap(([lon, lat]) => [round(lon < 0 ? lon + 360 : lon, 3), round(lat, 3)]),
  );
}

mkdirSync(OUT, { recursive: true });
writeFileSync(new URL('near-stars.json', OUT), JSON.stringify(near));
writeFileSync(new URL('sky.json', OUT), JSON.stringify({ stars: sky, lines: constellations }));
console.log(`near stars: ${near.length}, sky stars: ${sky.length / 4}, constellations: ${Object.keys(constellations).length}`);
