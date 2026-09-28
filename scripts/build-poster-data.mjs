// Builds the extra data the poster needs:
//   src/data/poster-stars.json  stars to magnitude 6.5, names for the brightest
//   src/data/constellations.json label position and localized names
//   static/milkyway.png         the Milky Way as an equirectangular brightness map
// Sources: HYG Database (CC BY-SA 4.0), d3-celestial (BSD-3-Clause).
//   node scripts/build-poster-data.mjs   (after scripts/build-catalog.mjs has fetched raw data)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { deflateSync, crc32 } from 'node:zlib';
import { colorIndex } from './spectral.mjs';

const RAW = new URL('./raw/', import.meta.url);
const DATA = new URL('../src/data/', import.meta.url);
const STATIC = new URL('../static/', import.meta.url);
const D3 = 'https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/';

async function raw(name, url) {
  const file = new URL(name, RAW);
  if (!existsSync(file)) {
    mkdirSync(RAW, { recursive: true });
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: ${res.status}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return readFileSync(file, 'utf8');
}

const round = (x, d) => Math.round(x * 10 ** d) / 10 ** d;
const ra360 = (lon) => (lon < 0 ? lon + 360 : lon);

// --- Stars -------------------------------------------------------------------------------
const lines = readFileSync(new URL('hyg.csv', RAW), 'utf8').split(/\r?\n/);
const head = lines[0].split(',').map((h) => h.replace(/"/g, ''));
const col = Object.fromEntries(head.map((h, i) => [h, i]));
const stars = [];
const names = [];
for (let i = 2; i < lines.length; i++) {
  if (!lines[i]) continue;
  const c = lines[i].split(',').map((v) => v.replace(/^"|"$/g, ''));
  const mag = +c[col.mag];
  if (!(mag <= 6.5)) continue;
  const ra = +c[col.ra] * 15, dec = +c[col.dec];
  const ci = colorIndex(c[col.ci], c[col.spect]) ?? 0.65;
  stars.push(round(ra, 3), round(dec, 3), round(mag, 2), round(ci, 2));
  if (mag < 1.6 && c[col.proper]) names.push([c[col.proper], round(ra, 3), round(dec, 3), round(mag, 2)]);
}

// --- Constellation labels ----------------------------------------------------------------
const cons = JSON.parse(await raw('constellations.json', D3 + 'constellations.json'));
const labels = {};
for (const f of cons.features) {
  const [lon, lat] = f.geometry.coordinates;
  const p = f.properties;
  labels[f.id] = [round(ra360(lon), 2), round(lat, 2), +p.rank, { la: p.la ?? p.name, it: p.it, en: p.en, es: p.es, de: p.de, fr: p.fr }];
}

mkdirSync(DATA, { recursive: true });
writeFileSync(new URL('poster-stars.json', DATA), JSON.stringify({ stars, names }));
writeFileSync(new URL('constellations.json', DATA), JSON.stringify(labels));

// --- Milky Way map -----------------------------------------------------------------------
// Each of the five nested brightness levels is scan-filled (even-odd) into an
// equirectangular grid: x = RA 0→360°, y = Dec +90→−90°. Summed, then blurred.
const W = 1440, H = 720;
const mw = JSON.parse(await raw('mw.json', D3 + 'mw.json'));
const acc = new Float32Array(W * H);
for (const [level, f] of mw.features.entries()) {
  const weight = [0.16, 0.2, 0.22, 0.2, 0.22][level];
  const layer = new Uint8Array(W * H);
  for (const poly of f.geometry.coordinates) {
    for (const ring of poly) {
      // Unwrap RA so the outline is continuous; the band's edges go all the way round the
      // sky, and those rings are closed through the north pole so even-odd still works.
      const pts = [];
      let prev = null;
      for (const [lon, lat] of ring) {
        let x = (ra360(lon) / 360) * W;
        if (prev !== null) while (x - prev > W / 2) x -= W;
        if (prev !== null) while (prev - x > W / 2) x += W;
        pts.push([x, ((90 - lat) / 180) * H]);
        prev = x;
      }
      const net = pts[pts.length - 1][0] - pts[0][0];
      if (Math.abs(net) > W / 2) {
        const last = pts[pts.length - 1];
        pts.push([last[0], -1], [pts[0][0], -1]);
      }
      const minX = Math.floor(Math.min(...pts.map((p) => p[0])));
      const maxX = Math.ceil(Math.max(...pts.map((p) => p[0])));
      const span = maxX - minX + 1;
      const own = new Uint8Array(span * H);
      for (let y = 0; y < H; y++) {
        const yc = y + 0.5;
        const xs = [];
        for (let k = 0; k < pts.length; k++) {
          const [x1, y1] = pts[k];
          const [x2, y2] = pts[(k + 1) % pts.length];
          if ((y1 <= yc && y2 > yc) || (y2 <= yc && y1 > yc)) xs.push(x1 + ((yc - y1) / (y2 - y1)) * (x2 - x1));
        }
        xs.sort((a, b) => a - b);
        for (let k = 0; k + 1 < xs.length; k += 2) {
          for (let x = Math.ceil(xs[k] - 0.5); x < xs[k + 1] - 0.5; x++) own[y * span + (x - minX)] = 1;
        }
      }
      // Fold the ring's own area back onto the sphere (OR), then combine rings even-odd.
      const folded = new Uint8Array(W * H);
      for (let y = 0; y < H; y++) {
        for (let i = 0; i < span; i++) {
          if (own[y * span + i]) folded[y * W + ((((i + minX) % W) + W) % W)] = 1;
        }
      }
      for (let i = 0; i < W * H; i++) layer[i] ^= folded[i];
    }
  }
  for (let i = 0; i < W * H; i++) acc[i] += layer[i] * weight;
}

// Separable box blur, three passes ≈ gaussian; wraps horizontally.
function blur(src, r) {
  const tmp = new Float32Array(W * H), out = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    let s = 0;
    for (let k = -r; k <= r; k++) s += src[y * W + ((k + W) % W)];
    for (let x = 0; x < W; x++) {
      tmp[y * W + x] = s / (2 * r + 1);
      s += src[y * W + ((x + r + 1) % W)] - src[y * W + ((x - r + W) % W)];
    }
  }
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      let s = 0, n = 0;
      for (let k = -r; k <= r; k++) {
        const yy = y + k;
        if (yy >= 0 && yy < H) { s += tmp[yy * W + x]; n++; }
      }
      out[y * W + x] = s / n;
    }
  }
  return out;
}
let img = acc;
for (let p = 0; p < 3; p++) img = blur(img, 3);
let max = 0;
for (const v of img) max = Math.max(max, v);
const gray = Buffer.alloc((W + 1) * H);
for (let y = 0; y < H; y++) {
  gray[y * (W + 1)] = 0; // PNG filter: none
  for (let x = 0; x < W; x++) gray[y * (W + 1) + 1 + x] = Math.round(255 * Math.min(1, img[y * W + x] / max) ** 0.8);
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td) >>> 0);
  return Buffer.concat([len, td, crc]);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 0; // 8-bit grayscale
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(gray, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);
writeFileSync(new URL('milkyway.png', STATIC), png);

console.log(`poster stars: ${stars.length / 4}, named: ${names.length}, constellations: ${Object.keys(labels).length}, milkyway.png: ${(png.length / 1024).toFixed(0)} KB`);
