import type { Place } from './astro';
import { starRgb } from './color';
import { loadSky, SkyRenderer, type Target } from './sky';

export function shareUrl(starId: number): string {
  const u = new URL(location.href);
  u.search = '';
  u.hash = '';
  u.searchParams.set('s', String(starId));
  return u.toString();
}

interface Card {
  name: string;
  line: string;
  sub: string;
  target: Target;
  date: Date;
  place: Place;
  facing: number;
  cardinals: string[];
}

/** A 1080×1350 portrait image: the sky with the star, its name and one line. */
export async function renderCard(c: Card): Promise<Blob> {
  await document.fonts.ready;
  const W = 1080, H = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0d1830';
  ctx.fillRect(0, 0, W, H);

  const renderer = new SkyRenderer(await loadSky());
  const S = 860;
  ctx.save();
  ctx.translate((W - S) / 2, 70);
  renderer.draw(ctx, S, {
    date: c.date, place: c.place, facing: c.facing, target: c.target,
    reveal: 1, clock: 0, cardinals: c.cardinals, belowHorizon: '',
  });
  ctx.restore();

  const [r, g, b] = starRgb(c.target.ci, 0.7);
  ctx.textAlign = 'center';
  ctx.fillStyle = `rgb(${r} ${g} ${b})`;
  ctx.font = 'italic 400 88px "Bodoni Moda Variable", Georgia, serif';
  fitText(ctx, c.name, W / 2, 1055, W - 120);
  ctx.fillStyle = '#ebe6d9';
  ctx.font = '400 38px "Atkinson Hyperlegible Next Variable", system-ui, sans-serif';
  fitText(ctx, c.line, W / 2, 1135, W - 120);
  ctx.fillStyle = '#a0abc4';
  ctx.font = '400 30px "Atkinson Hyperlegible Next Variable", system-ui, sans-serif';
  fitText(ctx, c.sub, W / 2, 1270, W - 120);

  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('toBlob'))), 'image/png'));
}

function fitText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, max: number) {
  let size = parseFloat(ctx.font.match(/(\d+)px/)![1]);
  while (ctx.measureText(text).width > max && size > 16) {
    size -= 2;
    ctx.font = ctx.font.replace(/\d+px/, `${size}px`);
  }
  ctx.fillText(text, x, y);
}

export type ShareOutcome = 'shared' | 'copied' | 'cancelled';

export async function share(text: string, url: string, card?: Blob): Promise<ShareOutcome> {
  const file = card && new File([card], 'la-mia-stella.png', { type: 'image/png' });
  try {
    if (file && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text: `${text} ${url}` });
      return 'shared';
    }
    if (navigator.share) {
      await navigator.share({ text, url });
      return 'shared';
    }
  } catch (e) {
    if ((e as Error).name === 'AbortError') return 'cancelled';
  }
  await navigator.clipboard.writeText(`${text} ${url}`);
  if (card) download(card, 'la-mia-stella.png');
  return 'copied';
}

function download(blob: Blob, name: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
