import { bayer, genitive, properName } from './names';

export interface Star {
  id: number;
  hip: number;
  hd: number;
  gl: string;
  proper: string;
  bayer: string;
  flam: number;
  con: string;
  raH: number;   // J2000 right ascension, hours
  dec: number;   // J2000 declination, degrees
  ly: number;    // distance, light years
  mag: number;   // apparent visual magnitude
  ci: number;    // B-V colour index
  lum: number;   // luminosity, Sun = 1
  spect: string;
}

type Row = [number, number, number, string, string, string, number, string, number, number, number, number, number, number, string];

let catalog: Promise<Star[]> | undefined;

export function loadCatalog(): Promise<Star[]> {
  catalog ??= import('../data/near-stars.json').then((m) =>
    (m.default as unknown as Row[]).map(
      ([id, hip, hd, gl, proper, bayer, flam, con, raH, dec, ly, mag, ci, lum, spect]) => ({
        id, hip, hd, gl, proper, bayer, flam, con, raH, dec, ly, mag, ci, lum, spect,
      }),
    ),
  );
  return catalog;
}

/** Component letter of a multiple system ("Gl 820B" → " B"), to tell 61 Cygni A from B. */
function component(s: Star): string {
  const m = s.gl.match(/\d([A-D])$/);
  return m ? ` ${m[1]}` : '';
}

export function starName(s: Star, lang: string): string {
  if (s.proper) return properName(s.proper, lang);
  if (s.bayer && s.con) return `${bayer(s.bayer)} ${genitive(s.con)}${component(s)}`;
  if (s.flam && s.con) return `${s.flam} ${genitive(s.con)}${component(s)}`;
  if (s.gl) return s.gl.replace(/^Gl /, 'Gliese ').replace(/(\d)([A-D])$/, '$1 $2');
  if (s.hd) return `HD ${s.hd}`;
  if (s.hip) return `HIP ${s.hip}`;
  return `HYG ${s.id}`;
}

/** Secondary catalogue designation shown under a proper name. */
export function starDesignation(s: Star): string {
  if (s.bayer && s.con) return `${bayer(s.bayer)} ${genitive(s.con)}`;
  if (s.flam && s.con) return `${s.flam} ${genitive(s.con)}`;
  if (s.hd) return `HD ${s.hd}`;
  if (s.hip) return `HIP ${s.hip}`;
  return '';
}

export const YEAR_MS = 365.25 * 86400000;
export const NAKED_EYE = 6.5;

export function yearsBetween(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / YEAR_MS;
}

/**
 * The star whose light, leaving it at `birth`, reaches Earth closest to `now`.
 * Among stars within a tolerance of the right distance we prefer ones visible to the
 * naked eye, then the brightest; the tolerance widens where stars are scarce (young ages).
 */
export function findStars(stars: Star[], birth: Date, now = new Date()): { best: Star; others: Star[] } {
  const age = yearsBetween(birth, now);
  const byGap = [...stars].sort((a, b) => Math.abs(a.ly - age) - Math.abs(b.ly - age));

  let pool: Star[] = [];
  for (const tol of [0.5, 1, 2, 3]) {
    pool = byGap.filter((s) => Math.abs(s.ly - age) <= tol);
    if (pool.some((s) => s.mag <= NAKED_EYE)) break;
  }
  if (pool.length === 0) pool = byGap.slice(0, 5);

  // Visible stars first, then prefer the closest match, with brightness as a strong tie-breaker.
  const score = (s: Star) =>
    (s.mag <= NAKED_EYE ? 0 : 100) + Math.abs(s.ly - age) * 2 + s.mag * 0.5;
  const ranked = [...pool].sort((a, b) => score(a) - score(b));
  const best = ranked[0];
  const others = byGap
    .filter((s) => s !== best && Math.abs(s.ly - age) <= 1.5)
    .sort((a, b) => a.mag - b.mag)
    .slice(0, 6);
  return { best, others };
}

/** When the light that left the star at `birth` arrives on Earth. */
export function arrivalDate(star: Star, birth: Date): Date {
  return new Date(birth.getTime() + star.ly * YEAR_MS);
}

/** When the light reaching Earth `at` that moment left the star. */
export function departureDate(star: Star, at = new Date()): Date {
  return new Date(at.getTime() - star.ly * YEAR_MS);
}

export function starById(stars: Star[], id: number): Star | undefined {
  return stars.find((s) => s.id === id);
}
