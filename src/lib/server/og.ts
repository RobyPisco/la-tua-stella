// Link preview images (Open Graph, 1200 × 630), rendered to PNG at build time.
// Star, birth-year and moon images carry no words, so one image serves every language.
import { Resvg } from '@resvg/resvg-js';
import sky from '../../data/sky.json';
import { starRgb } from '../color';
import { moonLitPath, type MoonMonth } from '../moon';

export const OG_W = 1200;
export const OG_H = 630;

// Relative to the project root, where the build runs.
const FONT_FILES = ['BodoniModa-Italic.ttf', 'BodoniModa-Regular.ttf', 'Atkinson-Medium.ttf'].map((f) => `src/lib/server/fonts/${f}`);
const SERIF = 'Bodoni Moda';
const SANS = 'Atkinson Hyperlegible Next';
const INK = '#f4efe2';
const MUTED = '#9aa6c4';
const BG = '#0c1630';

const RAD = Math.PI / 180;
const f1 = (n: number) => Math.round(n * 10) / 10;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The fonts have no Greek: Bayer letters are spelled out ("α Aurigae" → "Alpha Aurigae").
const GREEK: Record<string, string> = {
  α: 'Alpha', β: 'Beta', γ: 'Gamma', δ: 'Delta', ε: 'Epsilon', ζ: 'Zeta', η: 'Eta', θ: 'Theta',
  ι: 'Iota', κ: 'Kappa', λ: 'Lambda', μ: 'Mu', ν: 'Nu', ξ: 'Xi', ο: 'Omicron', π: 'Pi',
  ρ: 'Rho', σ: 'Sigma', τ: 'Tau', υ: 'Upsilon', φ: 'Phi', χ: 'Chi', ψ: 'Psi', ω: 'Omega',
};
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export const latinName = (s: string) =>
  s.replace(/[α-ω]/g, (c) => GREEK[c] ?? c).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (d) => [...d].map((c) => SUP.indexOf(c)).join(''));

export function png(svg: string): Response {
  // No defaultFontFamily: with it set, resvg-js ignores the font-family of every text.
  const out = new Resvg(svg, { font: { fontFiles: FONT_FILES, loadSystemFonts: false } })
    .render()
    .asPng();
  return new Response(new Uint8Array(out), { headers: { 'Content-Type': 'image/png' } });
}

function frame(body: string): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}">` +
    // Flat colours, no gradients: PNGs stay small (thousands of them are published).
    `<rect width="${OG_W}" height="${OG_H}" fill="${BG}"/>${body}` +
    `<text x="80" y="${OG_H - 56}" font-family="${SERIF}" font-style="italic" font-size="30" fill="${INK}">Sky of Your Day</text>` +
    `<text x="80" y="${OG_H - 26}" font-family="${SANS}" font-weight="500" font-size="18" letter-spacing="1.5" fill="${MUTED}">skyofyourday.com</text>` +
    '</svg>'
  );
}

/** Greedy line breaking on an estimated character width (no text measuring here). */
function wrap(text: string, size: number, maxW: number, em = 0.46): string[] {
  const perLine = Math.max(8, Math.floor(maxW / (size * em)));
  const lines: string[] = [];
  let cur = '';
  for (const word of text.split(/\s+/)) {
    if (cur && (cur + ' ' + word).length > perLine) {
      lines.push(cur);
      cur = word;
    } else cur = cur ? `${cur} ${word}` : word;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Largest size (down to `min`) at which the text fits in `maxLines` lines of `maxW`. */
function fit(text: string, max: number, min: number, maxW: number, maxLines: number, em?: number) {
  let size = max;
  let lines = wrap(text, size, maxW, em);
  while (size > min && lines.length > maxLines) {
    size -= 4;
    lines = wrap(text, size, maxW, em);
  }
  return { size, lines };
}

function textBlock(lines: string[], x: number, y: number, size: number, attrs: string, lead = 1.08): string {
  return lines
    .map((l, i) => `<text x="${x}" y="${f1(y + i * size * lead)}" font-size="${size}" ${attrs}>${esc(l)}</text>`)
    .join('');
}

// --- A circle of real sky around a point -----------------------------------------------------

const SKY = sky as unknown as { stars: number[]; lines: Record<string, number[][]> };

/**
 * Stereographic view of the sky within `field` degrees of (ra, dec), as seen looking up
 * (east on the left), clipped to a disc.
 */
function chart(cx: number, cy: number, R: number, ra0: number, dec0: number, field: number, target?: { ci: number }) {
  const s0 = Math.sin(dec0 * RAD);
  const c0 = Math.cos(dec0 * RAD);
  const scale = R / (2 * Math.tan((field * RAD) / 2));
  const project = (ra: number, dec: number): [number, number] | null => {
    const d = dec * RAD;
    const h = (ra - ra0) * RAD;
    const cosc = s0 * Math.sin(d) + c0 * Math.cos(d) * Math.cos(h);
    if (cosc < Math.cos((field * 1.25) * RAD)) return null;
    const k = (2 * scale) / (1 + cosc);
    return [cx - k * Math.cos(d) * Math.sin(h), cy - k * (c0 * Math.sin(d) - s0 * Math.cos(d) * Math.cos(h))];
  };
  const out: string[] = [
    `<clipPath id="clip"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>`,
    `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#15234a"/>`,
    '<g clip-path="url(#clip)">',
  ];
  const segs: string[] = [];
  for (const polylines of Object.values(SKY.lines)) {
    for (const line of polylines) {
      for (let i = 0; i + 3 < line.length; i += 2) {
        const a = project(line[i], line[i + 1]);
        const b = project(line[i + 2], line[i + 3]);
        if (a && b) segs.push(`M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`);
      }
    }
  }
  out.push(`<path d="${segs.join('')}" stroke="#8fa3d6" stroke-opacity="0.35" stroke-width="1.2" fill="none"/>`);
  const st = SKY.stars;
  for (let i = 0; i < st.length; i += 4) {
    // Stars fainter than 5.3 barely show at this size and weigh a lot in the PNG.
    if (st[i + 2] > 5.3) continue;
    const p = project(st[i], st[i + 1]);
    if (!p) continue;
    const r = Math.max(0.8, (6.4 - st[i + 2]) ** 1.35 * 0.55);
    const [cr, cg, cb] = starRgb(st[i + 3], 0.35);
    out.push(`<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(r)}" fill="rgb(${cr},${cg},${cb})"/>`);
  }
  if (target) {
    const [cr, cg, cb] = starRgb(target.ci, 0.8);
    const col = `rgb(${cr},${cg},${cb})`;
    out.push(`<circle cx="${cx}" cy="${cy}" r="26" fill="none" stroke="${col}" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="6" fill="${col}"/>`);
  }
  out.push('</g>', `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#6f7fa8" stroke-opacity="0.6" stroke-width="2"/>`);
  return out.join('');
}

const CHART = { cx: 890, cy: 300, R: 250 };
const LEFT = 80;
const TEXT_W = 560;

/** Tool and index pages: the page's title, in its language, beside a piece of sky. */
export function pageImage(title: string, sub: string, ra: number, dec: number): string {
  // Upright Bodoni runs wider than the italic: a larger width per character.
  const t = fit(title, 76, 44, TEXT_W, 4, 0.53);
  const top = 300 - ((t.lines.length - 1) * t.size * 1.08) / 2 - 20;
  return frame(
    chart(CHART.cx, CHART.cy, CHART.R, ra, dec, 34) +
      textBlock(t.lines, LEFT, top, t.size, `font-family="${SERIF}" fill="${INK}"`) +
      (sub ? textBlock(wrap(sub, 26, TEXT_W, 0.52).slice(0, 3), LEFT, top + t.lines.length * t.size * 1.08 + 26, 26, `font-family="${SANS}" font-weight="500" fill="${MUTED}"`, 1.3) : ''),
  );
}

/** A star: its name and the sky around it, the star circled in its real colour. */
export function starImage(name: string, sub: string, ra: number, dec: number, ci: number): string {
  const t = fit(latinName(name), 104, 52, TEXT_W, 2, 0.44);
  const top = 290 - ((t.lines.length - 1) * t.size) / 2;
  return frame(
    chart(CHART.cx, CHART.cy, CHART.R, ra, dec, 26, { ci }) +
      textBlock(t.lines, LEFT, top, t.size, `font-family="${SERIF}" font-style="italic" fill="${INK}"`, 1) +
      `<text x="${LEFT}" y="${f1(top + (t.lines.length - 1) * t.size + 62)}" font-family="${SANS}" font-weight="500" font-size="30" letter-spacing="1" fill="${MUTED}">${esc(sub)}</text>`,
  );
}

/** A birth year: the year, large, and the star of that year. */
export function yearImage(year: number, starName: string, ra: number, dec: number, ci: number): string {
  return frame(
    chart(CHART.cx, CHART.cy, CHART.R, ra, dec, 26, { ci }) +
      `<text x="${LEFT}" y="300" font-family="${SERIF}" font-size="190" fill="${INK}">${year}</text>` +
      `<text x="${LEFT + 6}" y="372" font-family="${SERIF}" font-style="italic" font-size="48" fill="${INK}" opacity="0.9">${esc(latinName(starName))}</text>`,
  );
}

/** A month of Moon phases: the calendar drawn with moons, and the year and month number. */
export function moonImage(m: MoonMonth): string {
  const size = 58;
  const gap = 12;
  const cols = 7;
  const x0 = 1200 - 80 - cols * size - (cols - 1) * gap;
  const rows = Math.ceil((m.firstWeekday + m.days.length) / cols);
  const y0 = 315 - (rows * (size + gap) - gap) / 2;
  const cells = m.days.map((d, i) => {
    const slot = m.firstWeekday + i;
    const cx = x0 + (slot % cols) * (size + gap) + size / 2;
    const cy = y0 + Math.floor(slot / cols) * (size + gap) + size / 2;
    const r = size / 2 - 3;
    const lit = d.lit > 0.005 ? `<path transform="translate(${f1(cx)} ${f1(cy)})" d="${moonLitPath(d.lit, d.angle, r)}" fill="${INK}"/>` : '';
    const ring = d.event ? `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${r + 4}" fill="none" stroke="${INK}" stroke-opacity="0.55" stroke-width="1.5"/>` : '';
    return `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" fill="#1e2d52" stroke="${INK}" stroke-opacity="0.2"/>${lit}${ring}`;
  });
  const mm = String(m.month).padStart(2, '0');
  return frame(
    cells.join('') +
      `<text x="${LEFT}" y="300" font-family="${SERIF}" font-size="170" fill="${INK}">${m.year}</text>` +
      `<text x="${LEFT + 8}" y="372" font-family="${SANS}" font-weight="500" font-size="44" letter-spacing="10" fill="${MUTED}">${mm}</text>`,
  );
}
