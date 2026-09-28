import bodoniLatin from '@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-opsz-normal.woff2?url';
import bodoniLatinExt from '@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-ext-opsz-normal.woff2?url';
import bodoniItLatin from '@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-opsz-italic.woff2?url';
import bodoniItLatinExt from '@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-ext-opsz-italic.woff2?url';
import atkLatin from '@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2?url';
import atkLatinExt from '@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-ext-wght-normal.woff2?url';
import type { Format } from './poster';

const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

const FACES: [family: string, style: string, weight: string, url: string, range: string][] = [
  ['Bodoni Moda Variable', 'normal', '400 900', bodoniLatin, LATIN],
  ['Bodoni Moda Variable', 'normal', '400 900', bodoniLatinExt, LATIN_EXT],
  ['Bodoni Moda Variable', 'italic', '400 900', bodoniItLatin, LATIN],
  ['Bodoni Moda Variable', 'italic', '400 900', bodoniItLatinExt, LATIN_EXT],
  ['Atkinson Hyperlegible Next Variable', 'normal', '200 800', atkLatin, LATIN],
  ['Atkinson Hyperlegible Next Variable', 'normal', '200 800', atkLatinExt, LATIN_EXT],
];

let fontCss: Promise<string> | undefined;

function toDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

/** @font-face rules with the fonts inlined, so the SVG renders the same anywhere. */
function embeddedFonts(): Promise<string> {
  fontCss ??= Promise.all(
    FACES.map(async ([family, style, weight, url, range]) => {
      const data = await toDataUrl(await (await fetch(url)).blob());
      return `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};src:url(${data}) format('woff2');unicode-range:${range};}`;
    }),
  ).then((rules) => rules.join(''));
  return fontCss;
}

export async function standaloneSvg(svg: string): Promise<string> {
  const css = await embeddedFonts();
  return svg.replace(/(<svg[^>]*>)/, `$1<style>${css}</style>`);
}

/** Browsers cap canvas area (iOS Safari at about 16.7 million pixels). */
const MAX_PIXELS = 16_000_000;

export function outputSize(format: Format): [number, number] {
  let [w, h] = format.px;
  const scale = Math.min(1, Math.sqrt(MAX_PIXELS / (w * h)));
  return [Math.floor(w * scale), Math.floor(h * scale)];
}

async function renderCanvas(svg: string, format: Format): Promise<HTMLCanvasElement> {
  const full = await standaloneSvg(svg);
  const url = URL.createObjectURL(new Blob([full], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    const [w, h] = outputSize(format);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), type, quality),
  );
}

export async function renderPng(svg: string, format: Format): Promise<Blob> {
  return toBlob(await renderCanvas(svg, format), 'image/png');
}

const PAPER_MM: Record<string, [number, number]> = {
  a4: [210, 297],
  a3: [297, 420],
  '30x40': [300, 400],
  '50x70': [500, 700],
};

/** A print-ready PDF at the paper's exact size, with the poster as a high-quality JPEG. */
export async function renderPdf(svg: string, format: Format): Promise<Blob> {
  const [{ jsPDF }, canvas] = await Promise.all([import('jspdf'), renderCanvas(svg, format)]);
  const jpeg = new Uint8Array(await (await toBlob(canvas, 'image/jpeg', 0.95)).arrayBuffer());
  const [wmm, hmm] = PAPER_MM[format.id] ?? [210, 210 * format.ratio];
  const pdf = new jsPDF({ unit: 'mm', format: [wmm, hmm], orientation: 'portrait' });
  pdf.addImage(jpeg, 'JPEG', 0, 0, wmm, hmm, undefined, 'NONE');
  return pdf.output('blob');
}

export function download(blob: Blob, name: string) {
  const a = document.createElement('a');
  // A generic type makes browsers save the file: Firefox would open a PDF in a new tab and
  // people would leave the page (and never see what comes after the download).
  a.href = URL.createObjectURL(new Blob([blob], { type: 'application/octet-stream' }));
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
