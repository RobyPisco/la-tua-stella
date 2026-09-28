import { Body, Equator, Illumination, Observer } from 'astronomy-engine';
import { equatorialVector, horizonMatrix, toHorizon, type HorizonPos, type Place } from './astro';
import { starRgb } from './color';

// ---------------------------------------------------------------------------------------
// Data

interface PosterData {
  stars: { v: number[]; mag: number; ci: number }[];
  names: { name: string; v: number[]; mag: number }[];
  labels: { v: number[]; rank: number; names: Record<string, string> }[];
  lines: number[][][];
  milkyWay: ImageData;
}

let data: Promise<PosterData> | undefined;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function loadPosterData(): Promise<PosterData> {
  data ??= Promise.all([
    import('../data/poster-stars.json'),
    import('../data/constellations.json'),
    import('../data/sky.json'),
    loadImage(`${import.meta.env.BASE_URL}milkyway.png`),
  ]).then(([ps, cons, sky, mwImg]) => {
    const p = ps.default as { stars: number[]; names: [string, number, number, number][] };
    const stars: PosterData['stars'] = [];
    for (let i = 0; i < p.stars.length; i += 4) {
      stars.push({ v: equatorialVector(p.stars[i], p.stars[i + 1]), mag: p.stars[i + 2], ci: p.stars[i + 3] });
    }
    const names = p.names.map(([name, ra, dec, mag]) => ({ name, v: equatorialVector(ra, dec), mag }));
    const labels = Object.values(cons.default as unknown as Record<string, [number, number, number, Record<string, string>]>)
      .map(([ra, dec, rank, n]) => ({ v: equatorialVector(ra, dec), rank, names: n }));
    const lineData = (sky.default as unknown as { lines: Record<string, number[][]> }).lines;
    const lines = Object.values(lineData).flatMap((polys) =>
      polys.map((poly) => {
        const pts: number[][] = [];
        for (let i = 0; i < poly.length; i += 2) pts.push(equatorialVector(poly[i], poly[i + 1]));
        return pts;
      }),
    );
    const c = document.createElement('canvas');
    c.width = mwImg.width;
    c.height = mwImg.height;
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(mwImg, 0, 0);
    return { stars, names, labels, lines, milkyWay: ctx.getImageData(0, 0, c.width, c.height) };
  });
  return data;
}

// ---------------------------------------------------------------------------------------
// Styles and formats

export interface Theme {
  id: string;
  bg: string;
  disk: [string, string];     // radial gradient centre → edge
  diskStroke: string;
  glow: string | null;        // halo around the chart
  realColors: boolean;        // stars in their own colours, or all in `star`
  star: string;
  lines: string;
  labels: string;
  grid: string;
  text: string;
  muted: string;
  milkyWay: [number, number, number, number]; // rgb + max alpha
  moonLit: string;
  moonDark: string;
  planet: string;
  highlight: string | null;   // null: the star's own colour
}

export const THEMES: Theme[] = [
  {
    id: 'night', bg: '#0d1830', disk: ['#15264d', '#0a142b'], diskStroke: 'rgb(236 230 214 / 0.35)',
    glow: 'rgb(90 120 190 / 0.22)', realColors: true, star: '#fff', lines: 'rgb(200 215 245 / 0.34)',
    labels: 'rgb(200 212 238 / 0.7)', grid: 'rgb(200 215 245 / 0.13)', text: '#ece6d6', muted: '#a8b3cc',
    milkyWay: [200, 212, 245, 0.34], moonLit: '#f4efe2', moonDark: '#1e2d52', planet: '#ffe6b0', highlight: null,
  },
  {
    id: 'paper', bg: '#f1ece2', disk: ['#1d2a4d', '#121b35'], diskStroke: '#1d2440',
    glow: null, realColors: true, star: '#fff', lines: 'rgb(200 215 245 / 0.34)',
    labels: 'rgb(210 220 240 / 0.72)', grid: 'rgb(200 215 245 / 0.12)', text: '#1d2440', muted: '#5b6178',
    milkyWay: [200, 212, 245, 0.3], moonLit: '#f4efe2', moonDark: '#26345c', planet: '#ffe6b0', highlight: null,
  },
  {
    id: 'gold', bg: '#0a0d15', disk: ['#0e1320', '#0a0d15'], diskStroke: 'rgb(217 191 122 / 0.8)',
    glow: null, realColors: false, star: '#ecd9a2', lines: 'rgb(217 191 122 / 0.42)',
    labels: 'rgb(217 191 122 / 0.8)', grid: 'rgb(217 191 122 / 0.14)', text: '#dcc27f', muted: 'rgb(220 194 127 / 0.7)',
    milkyWay: [217, 191, 122, 0.2], moonLit: '#ecd9a2', moonDark: '#1a1f2c', planet: '#ecd9a2', highlight: '#fff3cf',
  },
  {
    id: 'white', bg: '#ffffff', disk: ['#ffffff', '#ffffff'], diskStroke: '#111',
    glow: null, realColors: false, star: '#111', lines: 'rgb(17 17 17 / 0.4)',
    labels: 'rgb(17 17 17 / 0.62)', grid: 'rgb(17 17 17 / 0.1)', text: '#111', muted: '#555',
    milkyWay: [40, 50, 80, 0.13], moonLit: '#fff', moonDark: '#222', planet: '#111', highlight: '#111',
  },
];

export interface Format {
  id: string;
  /** Height / width. */
  ratio: number;
  /** Pixels for the printable file. */
  px: [number, number];
  print: boolean;
}

export const FORMATS: Format[] = [
  { id: 'a4', ratio: 297 / 210, px: [2480, 3508], print: true },
  { id: 'a3', ratio: 420 / 297, px: [3508, 4961], print: true },
  { id: '30x40', ratio: 40 / 30, px: [3543, 4724], print: true },
  { id: '50x70', ratio: 70 / 50, px: [5906, 8268], print: true },
  { id: 'square', ratio: 1, px: [3000, 3000], print: false },
  { id: 'portrait45', ratio: 5 / 4, px: [2160, 2700], print: false },
  { id: 'phone', ratio: 2796 / 1290, px: [1290, 2796], print: false },
];

// ---------------------------------------------------------------------------------------
// Poster

export interface PosterOptions {
  lines: boolean;
  names: boolean;
  milkyWay: boolean;
  moonPlanets: boolean;
  grid: boolean;
  highlight: boolean;
  frame: boolean;
}

export interface PosterSpec {
  date: Date;
  place: Place;
  lang: string;
  theme: Theme;
  format: Format;
  options: PosterOptions;
  title: string;
  subtitle: string;
  dateLine: string;
  placeLine: string;
  starLine: string;
  credit: string;
  target?: { raH: number; dec: number; ci: number; label: string };
  planetNames: Record<string, string>;
  moonName: string;
}

export type Measure = (text: string, font: string) => number;

const RAD = Math.PI / 180;
const W = 1000;
const FONT_SERIF = "'Bodoni Moda Variable', 'Bodoni 72', Didot, Georgia, serif";
const FONT_SANS = "'Atkinson Hyperlegible Next Variable', system-ui, sans-serif";

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f1 = (n: number) => Math.round(n * 10) / 10;

export interface Layout {
  H: number;
  cx: number;
  cy: number;
  R: number;
  scale: number; // type scale relative to an A-series portrait
}

export function layout(format: Format): Layout {
  const H = Math.round(W * format.ratio);
  if (format.ratio > 1.9) {
    // Phone wallpaper: leave the top free for the clock.
    const R = W * 0.43;
    return { H, cx: W / 2, cy: H * 0.46, R, scale: 1.05 };
  }
  if (format.ratio < 1.2) {
    const R = format.ratio < 1.1 ? H * 0.3 : H * 0.32;
    return { H, cx: W / 2, cy: 60 + R, R, scale: 0.72 };
  }
  const R = Math.min(W * 0.4, H * 0.3);
  const cy = H * 0.075 + R;
  return { H, cx: W / 2, cy, R, scale: 1 };
}

/** Stereographic projection centred on the zenith; north up, east on the left. */
function projector(L: Layout) {
  return (p: HorizonPos): [number, number] => {
    const rho = L.R * Math.tan(((90 - p.alt) / 2) * RAD);
    const a = (p.az - 180) * RAD;
    return [L.cx + rho * Math.sin(a), L.cy + rho * Math.cos(a)];
  };
}

/** The Milky Way for this sky, as a transparent PNG covering the chart's bounding square. */
export function renderMilkyWay(spec: PosterSpec, tex: ImageData, size = 1200): string {
  const m = horizonMatrix(spec.date, spec.place);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const out = ctx.createImageData(size, size);
  const [r, g, b, amax] = spec.theme.milkyWay;
  const TW = tex.width, TH = tex.height, T = tex.data;
  const half = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // The image spans 1.01 chart radii each side, so the edge never shows a seam.
      const dx = ((x + 0.5 - half) / half) * 1.01, dy = ((y + 0.5 - half) / half) * 1.01;
      const rho = Math.hypot(dx, dy);
      if (rho > 1.01) continue;
      const alt = 90 - (2 * Math.atan(rho)) / RAD;
      const az = (Math.atan2(dx, dy) / RAD + 180) * RAD;
      const ca = Math.cos(alt * RAD);
      const h0 = ca * Math.cos(az), h1 = -ca * Math.sin(az), h2 = Math.sin(alt * RAD);
      // Horizontal → J2000 equatorial: inverse (transpose) of the rotation used in toHorizon.
      const v0 = m[0][0] * h0 + m[0][1] * h1 + m[0][2] * h2;
      const v1 = m[1][0] * h0 + m[1][1] * h1 + m[1][2] * h2;
      const v2 = m[2][0] * h0 + m[2][1] * h1 + m[2][2] * h2;
      let ra = Math.atan2(v1, v0) / RAD;
      if (ra < 0) ra += 360;
      const dec = Math.asin(Math.max(-1, Math.min(1, v2))) / RAD;
      // Bilinear sample, wrapping in RA.
      const u = (ra / 360) * TW - 0.5, w = ((90 - dec) / 180) * TH - 0.5;
      const x0 = Math.floor(u), y0 = Math.max(0, Math.min(TH - 2, Math.floor(w)));
      const fx = u - x0, fy = Math.max(0, Math.min(1, w - y0));
      const xa = ((x0 % TW) + TW) % TW, xb = (xa + 1) % TW;
      const s =
        (T[(y0 * TW + xa) * 4] * (1 - fx) + T[(y0 * TW + xb) * 4] * fx) * (1 - fy) +
        (T[((y0 + 1) * TW + xa) * 4] * (1 - fx) + T[((y0 + 1) * TW + xb) * 4] * fx) * fy;
      if (s < 2) continue;
      const i = (y * size + x) * 4;
      out.data[i] = r;
      out.data[i + 1] = g;
      out.data[i + 2] = b;
      out.data[i + 3] = Math.round(s * amax);
    }
  }
  ctx.putImageData(out, 0, 0);
  return canvas.toDataURL('image/png');
}

function fitSize(measure: Measure, text: string, font: (size: number) => string, size: number, max: number): number {
  let s = size;
  while (s > size * 0.45 && measure(text, font(s)) > max) s *= 0.94;
  return f1(s);
}

/** The whole poster as a standalone SVG document (fonts not embedded: see posterExport). */
export function buildPoster(spec: PosterSpec, d: PosterData, milkyWayHref: string | null, measure: Measure): string {
  const L = layout(spec.format);
  const th = spec.theme;
  const o = spec.options;
  const m = horizonMatrix(spec.date, spec.place);
  const project = projector(L);
  const k = L.R / 400; // chart scale relative to a 400-unit radius
  const out: string[] = [];
  // Unique ids: several posters may share one page (previews, thumbnails).
  const id = `p${Math.random().toString(36).slice(2, 8)}`;

  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${L.H}" width="${W}" height="${L.H}">`);
  out.push(`<metadata>Star positions: HYG Database (CC BY-SA 4.0). Constellations and Milky Way: d3-celestial (BSD-3-Clause). ${esc(spec.credit)}</metadata>`);
  out.push('<defs>');
  out.push(`<clipPath id="${id}-chart"><circle cx="${L.cx}" cy="${L.cy}" r="${L.R}"/></clipPath>`);
  out.push(`<radialGradient id="${id}-disk" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${th.disk[0]}"/><stop offset="1" stop-color="${th.disk[1]}"/></radialGradient>`);
  if (th.glow) out.push(`<radialGradient id="${id}-halo" cx="50%" cy="50%" r="50%"><stop offset="0.72" stop-color="${th.glow}"/><stop offset="1" stop-color="${th.bg}" stop-opacity="0"/></radialGradient>`);
  out.push(`<radialGradient id="${id}-shine"><stop offset="0" stop-color="#fff" stop-opacity="0.9"/><stop offset="0.35" stop-color="#fff" stop-opacity="0.25"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`);
  out.push('</defs>');
  out.push(`<rect width="${W}" height="${L.H}" fill="${th.bg}"/>`);
  if (o.frame) {
    const inset = 28;
    out.push(`<rect x="${inset}" y="${inset}" width="${W - 2 * inset}" height="${L.H - 2 * inset}" fill="none" stroke="${th.text}" stroke-opacity="0.45" stroke-width="1.5"/>`);
  }
  if (th.glow) out.push(`<circle cx="${L.cx}" cy="${L.cy}" r="${f1(L.R * 1.22)}" fill="url(#${id}-halo)"/>`);
  out.push(`<circle cx="${L.cx}" cy="${L.cy}" r="${L.R}" fill="url(#${id}-disk)"/>`);

  out.push('<g clip-path="url(#${id}-chart)">');
  if (o.milkyWay && milkyWayHref) {
    out.push(`<image href="${milkyWayHref}" x="${f1(L.cx - L.R * 1.01)}" y="${f1(L.cy - L.R * 1.01)}" width="${f1(L.R * 2.02)}" height="${f1(L.R * 2.02)}" preserveAspectRatio="none"/>`);
  }

  if (o.grid) {
    const g: string[] = [];
    for (const alt of [30, 60]) g.push(`<circle cx="${L.cx}" cy="${L.cy}" r="${f1(L.R * Math.tan(((90 - alt) / 2) * RAD))}"/>`);
    for (let az = 0; az < 360; az += 30) {
      const [x1, y1] = project({ alt: 80, az });
      const [x2, y2] = project({ alt: 0, az });
      g.push(`<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"/>`);
    }
    out.push(`<g fill="none" stroke="${th.grid}" stroke-width="${f1(1.2 * k)}" stroke-dasharray="${f1(4 * k)} ${f1(5 * k)}">${g.join('')}</g>`);
  }

  if (o.lines) {
    let path = '';
    for (const poly of d.lines) {
      let pen = false;
      for (const v of poly) {
        const h = toHorizon(m, v);
        if (h.alt < -3) { pen = false; continue; }
        const [x, y] = project(h);
        path += `${pen ? 'L' : 'M'}${f1(x)} ${f1(y)}`;
        pen = true;
      }
    }
    out.push(`<path d="${path}" fill="none" stroke="${th.lines}" stroke-width="${f1(1.3 * k)}" stroke-linejoin="round" stroke-linecap="round"/>`);
  }

  // Stars: faint ones as a single group, bright ones with a soft shine.
  const dots: string[] = [];
  const shines: string[] = [];
  for (const s of d.stars) {
    const h = toHorizon(m, s.v);
    if (h.alt < 0) continue;
    const [x, y] = project(h);
    const r = Math.max(0.55, (6.8 - s.mag) ** 1.4 * 0.3) * k;
    const fill = th.realColors ? `rgb(${starRgb(s.ci, 0.38).join(' ')})` : th.star;
    dots.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${Math.round(r * 100) / 100}" fill="${fill}"/>`);
    if (s.mag < 1.6 && th.id !== 'white') shines.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 3.4)}" fill="url(#${id}-shine)" opacity="0.5"/>`);
  }
  out.push(`<g>${shines.join('')}</g><g>${dots.join('')}</g>`);

  // Moon and planets are placed first so constellation names can keep clear of them.
  const occupied: [number, number, number][] = [];
  const bodiesSvg = o.moonPlanets ? bodies(spec, m, project, k, occupied) : '';

  if (o.names) {
    const cons: string[] = [];
    for (const l of d.labels) {
      const h = toHorizon(m, l.v);
      if (h.alt < 8) continue;
      const [x, y] = project(h);
      if (occupied.some(([bx, by, br]) => Math.hypot(bx - x, by - y) < br + 30 * k)) continue;
      const name = l.names[spec.lang] || l.names.la;
      const size = (l.rank === 1 ? 12.5 : 11) * k;
      cons.push(`<text x="${f1(x)}" y="${f1(y)}" font-size="${f1(size)}">${esc(name)}</text>`);
    }
    out.push(`<g font-family="${esc(FONT_SANS)}" fill="${th.labels}" text-anchor="middle" letter-spacing="${f1(1.2 * k)}">${cons.join('')}</g>`);
    const stars: string[] = [];
    for (const n of d.names) {
      const h = toHorizon(m, n.v);
      if (h.alt < 5) continue;
      const [x, y] = project(h);
      stars.push(`<text x="${f1(x + 7 * k)}" y="${f1(y - 6 * k)}" font-size="${f1(11.5 * k)}">${esc(n.name)}</text>`);
    }
    out.push(`<g font-family="${esc(FONT_SERIF)}" font-style="italic" fill="${th.labels}">${stars.join('')}</g>`);
  }

  out.push(bodiesSvg);

  if (o.highlight && spec.target) {
    const t = spec.target;
    const h = toHorizon(m, equatorialVector(t.raH * 15, t.dec));
    if (h.alt > 0) {
      const [x, y] = project(h);
      const color = th.highlight ?? `rgb(${starRgb(t.ci, 0.75).join(' ')})`;
      out.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(15 * k)}" fill="none" stroke="${color}" stroke-width="${f1(1.8 * k)}"/>`);
      out.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(3.2 * k)}" fill="${color}"/>`);
      const right = x < L.cx + L.R * 0.45;
      out.push(`<text x="${f1(x + (right ? 22 : -22) * k)}" y="${f1(y + 5 * k)}" text-anchor="${right ? 'start' : 'end'}" font-family="${esc(FONT_SERIF)}" font-style="italic" font-size="${f1(17 * k)}" fill="${color}">${esc(t.label)}</text>`);
    }
  }
  out.push('</g>');
  out.push(`<circle cx="${L.cx}" cy="${L.cy}" r="${L.R}" fill="none" stroke="${th.diskStroke}" stroke-width="${f1(1.6 * k)}"/>`);

  // Text block: measured first, then centred in the space between chart and credit line.
  const maxW = W * 0.8;
  const sc = L.scale;
  const serif = (s: number) => `400 ${s}px ${FONT_SERIF}`;
  const serifIt = (s: number) => `italic 400 ${s}px ${FONT_SERIF}`;
  const sans = (s: number) => `500 ${s}px ${FONT_SANS}`;
  type Line = { text: string; size: number; before: number; attrs: string };
  const block: Line[] = [];
  if (spec.title) {
    const size = fitSize(measure, spec.title, serif, 72 * sc, maxW);
    block.push({ text: spec.title, size, before: 0, attrs: `font-family="${esc(FONT_SERIF)}" fill="${th.text}"` });
  }
  if (spec.subtitle) {
    const size = fitSize(measure, spec.subtitle, serifIt, 34 * sc, maxW);
    block.push({ text: spec.subtitle, size, before: 40 * sc, attrs: `font-family="${esc(FONT_SERIF)}" font-style="italic" fill="${th.text}"` });
  }
  [spec.dateLine, spec.placeLine].filter(Boolean).forEach((text, i) => {
    const size = fitSize(measure, text, sans, 19 * sc, maxW);
    block.push({ text, size, before: (i === 0 ? 50 : 16) * sc, attrs: `font-family="${esc(FONT_SANS)}" letter-spacing="${f1(size * 0.14)}" fill="${th.muted}"` });
  });
  if (o.highlight && spec.starLine) {
    const size = fitSize(measure, spec.starLine, serifIt, 21 * sc, maxW);
    block.push({ text: spec.starLine, size, before: 30 * sc, attrs: `font-family="${esc(FONT_SERIF)}" font-style="italic" fill="${th.text}" opacity="0.85"` });
  }
  // Cap height ≈ 0.7 em: stack lines by their visible height.
  const height = block.reduce((h, l) => h + l.before + l.size * 0.72, 0);
  const top = L.cy + L.R + 40;
  const bottom = L.H - (o.frame ? 80 : 60);
  let y = Math.max(top, top + (bottom - top - height) / 2);
  for (const l of block) {
    y += l.before + l.size * 0.72;
    out.push(`<text x="${W / 2}" y="${f1(y)}" text-anchor="middle" font-size="${l.size}" ${l.attrs}>${esc(l.text)}</text>`);
  }
  if (spec.credit) {
    out.push(`<text x="${W / 2}" y="${f1(L.H - (o.frame ? 44 : 26))}" text-anchor="middle" font-family="${esc(FONT_SANS)}" font-size="${f1(11 * Math.max(0.8, sc))}" letter-spacing="1.5" fill="${th.muted}" opacity="0.7">${esc(spec.credit)}</text>`);
  }
  out.push('</svg>');
  return out.join('');
}

const PLANETS: [Body, string, number][] = [
  [Body.Mercury, 'Mercury', 2.6],
  [Body.Venus, 'Venus', 4],
  [Body.Mars, 'Mars', 3],
  [Body.Jupiter, 'Jupiter', 3.8],
  [Body.Saturn, 'Saturn', 3.3],
];

function bodyVector(body: Body, date: Date, obs: Observer): number[] {
  const eq = Equator(body, date, obs, false, true); // J2000, like the star catalogue
  return equatorialVector(eq.ra * 15, eq.dec);
}

function bodies(
  spec: PosterSpec,
  m: number[][],
  project: (p: HorizonPos) => [number, number],
  k: number,
  occupied: [number, number, number][],
): string {
  const th = spec.theme;
  const obs = new Observer(spec.place.lat, spec.place.lon, 0);
  const out: string[] = [];
  const label = (x: number, y: number, text: string, dy: number) =>
    `<text x="${f1(x)}" y="${f1(y + dy)}" text-anchor="middle" font-family="${esc(FONT_SANS)}" font-size="${f1(11 * k)}" letter-spacing="${f1(0.8 * k)}" fill="${th.labels}">${esc(text)}</text>`;

  for (const [body, key, size] of PLANETS) {
    const h = toHorizon(m, bodyVector(body, spec.date, obs));
    if (h.alt < 2) continue;
    const [x, y] = project(h);
    occupied.push([x, y, 14 * k]);
    out.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(size * k)}" fill="${th.planet}"/>`);
    out.push(label(x, y, spec.planetNames[key] ?? key, 20 * k));
  }

  // The Moon, drawn larger than life, lit from the Sun's direction.
  const mv = bodyVector(Body.Moon, spec.date, obs);
  const hm = toHorizon(m, mv);
  if (hm.alt > 2) {
    const [x, y] = project(hm);
    const sv = bodyVector(Body.Sun, spec.date, obs);
    const dot = sv[0] * mv[0] + sv[1] * mv[1] + sv[2] * mv[2];
    const toward = mv.map((c, i) => c + 0.03 * (sv[i] - dot * c));
    const [tx, ty] = project(toHorizon(m, toward));
    const angle = Math.atan2(ty - y, tx - x) / RAD;
    const frac = Illumination(Body.Moon, spec.date).phase_fraction;
    const r = 13 * k;
    occupied.push([x, y, r + 16 * k]);
    const e = r * (2 * frac - 1);
    const lit = `M0 ${f1(-r)}A${f1(r)} ${f1(r)} 0 0 1 0 ${f1(r)}A${f1(Math.abs(e))} ${f1(r)} 0 0 ${e > 0 ? 1 : 0} 0 ${f1(-r)}Z`;
    out.push(`<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(angle)})"><circle r="${f1(r)}" fill="${th.moonDark}" stroke="${th.moonLit}" stroke-opacity="0.35" stroke-width="${f1(0.8 * k)}"/><path d="${lit}" fill="${th.moonLit}"/></g>`);
    out.push(label(x, y, spec.moonName, r + 16 * k));
  }
  return out.join('');
}
