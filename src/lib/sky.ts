import { equatorialVector, horizonMatrix, sunAltitude, toHorizon, type HorizonPos, type Place } from './astro';
import { starRgb } from './color';

interface SkyData {
  stars: number[]; // flat [raDeg, dec, mag, ci, ...]
  lines: Record<string, number[][]>; // per constellation: polylines, flat [raDeg, dec, ...]
}

export interface SkyCatalog {
  stars: { v: number[]; mag: number; rgb: string }[];
  lines: number[][][]; // polylines of unit vectors
}

let sky: Promise<SkyCatalog> | undefined;

export function loadSky(): Promise<SkyCatalog> {
  sky ??= import('../data/sky.json').then(({ default: d }) => {
    const data = d as unknown as SkyData;
    const stars: SkyCatalog['stars'] = [];
    for (let i = 0; i < data.stars.length; i += 4) {
      const [ra, dec, mag, ci] = data.stars.slice(i, i + 4);
      const [r, g, b] = starRgb(ci, 0.45);
      stars.push({ v: equatorialVector(ra, dec), mag, rgb: `${r} ${g} ${b}` });
    }
    const lines = Object.values(data.lines).flatMap((polys) =>
      polys.map((p) => {
        const pts: number[][] = [];
        for (let i = 0; i < p.length; i += 2) pts.push(equatorialVector(p[i], p[i + 1]));
        return pts;
      }),
    );
    return { stars, lines };
  });
  return sky;
}

export interface Target {
  raH: number;
  dec: number;
  ci: number;
  label: string;
}

export interface SkyView {
  date: Date;
  place: Place;
  /** Azimuth shown at the bottom of the chart: the direction the viewer faces. */
  facing: number;
  target?: Target;
  /** 0..1 progress of the target reveal. */
  reveal: number;
  /** Seconds, drives the target's pulse. */
  clock: number;
  cardinals: string[];
  belowHorizon: string;
}

const RAD = Math.PI / 180;

export class SkyRenderer {
  private m: number[][] = [];
  private key = '';
  private sunAlt = -90;

  constructor(private catalog: SkyCatalog) {}

  private update(view: SkyView) {
    const key = `${view.date.getTime()}|${view.place.lat}|${view.place.lon}`;
    if (key === this.key) return;
    this.key = key;
    this.m = horizonMatrix(view.date, view.place);
    this.sunAlt = sunAltitude(view.date, view.place);
  }

  draw(ctx: CanvasRenderingContext2D, size: number, view: SkyView) {
    this.update(view);
    const R = size / 2 - Math.max(22, size * 0.06);
    const cx = size / 2, cy = size / 2;
    const scale = Math.max(0.7, size / 640);

    const project = (p: HorizonPos): [number, number, number] => {
      const rho = R * Math.tan(((90 - p.alt) / 2) * RAD);
      const a = (p.az - view.facing) * RAD;
      return [cx + rho * Math.sin(a), cy + rho * Math.cos(a), rho];
    };

    // Sky disc: darker at the zenith, a faint glow near the horizon, lighter in twilight.
    const twilight = Math.min(1, Math.max(0, (this.sunAlt + 18) / 18));
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    g.addColorStop(0, mixHex('#0a1428', '#3a5c8c', twilight));
    g.addColorStop(0.75, mixHex('#122143', '#5577a8', twilight));
    g.addColorStop(1, mixHex('#1f3560', '#8aa3c8', twilight));
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.clip();

    // Constellation figures.
    ctx.strokeStyle = 'rgb(160 185 230 / 0.2)';
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    for (const poly of this.catalog.lines) {
      let pen = false;
      for (const v of poly) {
        const h = toHorizon(this.m, v);
        if (h.alt < -5) { pen = false; continue; }
        const [x, y] = project(h);
        if (pen) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        pen = true;
      }
    }
    ctx.stroke();

    // Stars, fading as the sky brightens.
    const limit = 5.8 - twilight * 4.5;
    for (const s of this.catalog.stars) {
      if (s.mag > limit) continue;
      const h = toHorizon(this.m, s.v);
      if (h.alt < 0) continue;
      const [x, y] = project(h);
      const r = Math.max(0.55, (6.3 - s.mag) ** 1.3 * 0.36) * scale;
      const extinction = h.alt < 15 ? 0.4 + (h.alt / 15) * 0.6 : 1;
      const alpha = Math.min(1, 0.35 + (5.8 - s.mag) * 0.2) * extinction;
      ctx.fillStyle = `rgb(${s.rgb} / ${alpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Horizon ring and cardinal points.
    ctx.strokeStyle = 'rgb(190 205 235 / 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgb(214 222 240 / 0.8)';
    ctx.font = `600 ${Math.round(13 * scale)}px "Atkinson Hyperlegible Next Variable", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const rim = R + (size / 2 - R) / 2;
    view.cardinals.forEach((label, i) => {
      const a = (i * 90 - view.facing) * RAD;
      ctx.fillText(label, cx + rim * Math.sin(a), cy + rim * Math.cos(a));
    });

    if (view.target) this.drawTarget(ctx, view, project, R, scale);
  }

  private drawTarget(
    ctx: CanvasRenderingContext2D,
    view: SkyView,
    project: (p: HorizonPos) => [number, number, number],
    R: number,
    scale: number,
  ) {
    const t = view.target!;
    const h = toHorizon(this.m, equatorialVector(t.raH * 15, t.dec));
    const [r, g, b] = starRgb(t.ci, 0.7);
    const rgb = `${r} ${g} ${b}`;
    const ease = 1 - (1 - view.reveal) ** 3;
    const below = h.alt < 0;
    const [x, y] = below ? project({ alt: 0, az: h.az }) : project(h);

    ctx.save();
    // The ring closes in on the star during the reveal, then breathes slowly.
    const pulse = 0.5 + 0.5 * Math.sin(view.clock * 1.6);
    const ringR = (14 + (1 - ease) * R * 0.9 + pulse * 3) * scale;
    ctx.strokeStyle = `rgb(${rgb} / ${(0.35 + 0.5 * ease).toFixed(2)})`;
    ctx.lineWidth = 1.5 * scale;
    if (below) ctx.setLineDash([4 * scale, 4 * scale]);
    ctx.beginPath();
    ctx.arc(x, y, ringR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    if (!below) {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 12 * scale);
      glow.addColorStop(0, `rgb(${rgb} / ${ease.toFixed(2)})`);
      glow.addColorStop(0.25, `rgb(${rgb} / ${(0.6 * ease).toFixed(2)})`);
      glow.addColorStop(1, `rgb(${rgb} / 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 12 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgb(255 255 255 / ${ease.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(x, y, 2.4 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // Label, kept inside the chart and away from the rim.
    const label = below ? `${t.label} (${view.belowHorizon})` : t.label;
    ctx.globalAlpha = ease;
    ctx.font = `italic 500 ${Math.round(17 * scale)}px "Bodoni Moda Variable", Georgia, serif`;
    const w = ctx.measureText(label).width;
    const size = (R + Math.max(22, R * 0.06)) * 2;
    const onRight = x + 22 * scale + w < size - 8;
    ctx.textAlign = onRight ? 'left' : 'right';
    ctx.textBaseline = 'middle';
    const ly = Math.min(Math.max(y, 16), size - 16);
    ctx.fillStyle = `rgb(${rgb})`;
    ctx.fillText(label, onRight ? x + ringR + 8 * scale : x - ringR - 8 * scale, below ? ly + (y > size / 2 ? -26 : 26) * scale : ly);
    ctx.restore();
  }
}

function mixHex(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(' ')})`;
}
