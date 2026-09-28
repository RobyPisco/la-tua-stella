import { Body, Equator, Horizon, Observer, Rotation_EQJ_HOR } from 'astronomy-engine';

export interface Place {
  lat: number;
  lon: number;
  name: string;
  timeZone?: string;
}

export interface HorizonPos {
  alt: number; // degrees above the horizon
  az: number;  // degrees clockwise from north
}

const RAD = Math.PI / 180;

/** Unit vector in the J2000 equatorial frame. */
export function equatorialVector(raDeg: number, dec: number): [number, number, number] {
  const r = raDeg * RAD, d = dec * RAD;
  return [Math.cos(d) * Math.cos(r), Math.cos(d) * Math.sin(r), Math.sin(d)];
}

/** J2000 equatorial → horizontal (x north, y west, z up) rotation for a moment and place. */
export function horizonMatrix(date: Date, place: Place): number[][] {
  return Rotation_EQJ_HOR(date, new Observer(place.lat, place.lon, 0)).rot;
}

export function toHorizon(m: number[][], v: readonly number[]): HorizonPos {
  const x = m[0][0] * v[0] + m[1][0] * v[1] + m[2][0] * v[2];
  const y = m[0][1] * v[0] + m[1][1] * v[1] + m[2][1] * v[2];
  const z = m[0][2] * v[0] + m[1][2] * v[1] + m[2][2] * v[2];
  const az = Math.atan2(-y, x) / RAD;
  return { alt: Math.asin(Math.max(-1, Math.min(1, z))) / RAD, az: (az + 360) % 360 };
}

export function starPosition(raH: number, dec: number, date: Date, place: Place): HorizonPos {
  return toHorizon(horizonMatrix(date, place), equatorialVector(raH * 15, dec));
}

export function sunAltitude(date: Date, place: Place): number {
  const obs = new Observer(place.lat, place.lon, 0);
  const eq = Equator(Body.Sun, date, obs, true, true);
  return Horizon(date, obs, eq.ra, eq.dec, 'normal').altitude;
}

/** Minimum altitude that makes sense to look for a star (trees, buildings, haze). */
export const MIN_ALT = 10;

/** How dark the sky must be (Sun altitude) before a star of this magnitude shows up. */
export function darkness(mag: number): number {
  return mag < 1.5 ? -6 : mag < 4 ? -9 : -12;
}

export interface Tonight {
  night: { start: Date; end: Date } | null;
  best: (HorizonPos & { time: Date }) | null;
  window: { start: Date; end: Date } | null;
}

/**
 * The next dark period (or the current one, if it's already night) and when during it
 * the star stands highest above MIN_ALT.
 */
export function tonight(raH: number, dec: number, mag: number, place: Place, from = new Date(), stepMin = 10): Tonight {
  const dark = darkness(mag);
  const step = stepMin * 60000;
  const v = equatorialVector(raH * 15, dec);
  const samples: { t: Date; pos: HorizonPos }[] = [];
  let started = false;

  for (let i = 0; i <= (26 * 60) / stepMin; i++) {
    const t = new Date(from.getTime() + i * step);
    const isDark = sunAltitude(t, place) < dark;
    if (isDark) {
      started = true;
      samples.push({ t, pos: toHorizon(horizonMatrix(t, place), v) });
    } else if (started) break;
  }
  if (samples.length === 0) return { night: null, best: null, window: null };

  const night = { start: samples[0].t, end: samples[samples.length - 1].t };
  // Prefer the evening: the first moment the star is comfortably high, rather than its
  // highest point, which may come at 3 in the morning.
  const top = Math.max(...samples.map((s) => s.pos.alt));
  const enough = Math.max(MIN_ALT, Math.min(40, top - 5));
  const bi = samples.findIndex((s) => s.pos.alt >= enough);
  if (bi < 0) return { night, best: null, window: null };

  let a = bi, b = bi;
  while (a > 0 && samples[a - 1].pos.alt >= MIN_ALT) a--;
  while (b < samples.length - 1 && samples[b + 1].pos.alt >= MIN_ALT) b++;
  return {
    night,
    best: { time: samples[bi].t, ...samples[bi].pos },
    window: { start: samples[a].t, end: samples[b].t },
  };
}

/** Highest altitude the star ever reaches from this latitude. */
export function maxAltitude(dec: number, lat: number): number {
  return 90 - Math.abs(lat - dec);
}

/** First upcoming night (within a year) when the star can be seen, or null. */
export function nextVisibleNight(raH: number, dec: number, mag: number, place: Place, from = new Date()): Date | null {
  if (maxAltitude(dec, place.lat) < MIN_ALT) return null;
  for (let d = 3; d <= 366; d += 3) {
    const noon = new Date(from.getTime() + d * 86400000);
    const t = tonight(raH, dec, mag, place, noon, 30);
    if (t.best) return t.best.time;
  }
  return null;
}

/** Now, if it's already dark; otherwise about an hour after tonight's sky gets properly dark. */
export function nextDark(place: Place, from = new Date()): Date {
  if (sunAltitude(from, place) < -15) return from;
  for (let i = 1; i <= 26 * 6; i++) {
    const t = new Date(from.getTime() + i * 600000);
    if (sunAltitude(t, place) < -15) return new Date(t.getTime() + 3600000);
  }
  return from;
}
