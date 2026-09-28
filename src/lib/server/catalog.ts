import named from './named-stars.json';
import near from '../../data/near-stars.json';
import { starPosition, sunAltitude } from '../astro';
import type { Lang } from '../i18n.svelte';
import { properName } from '../names';
import { LANGS } from '../routes';
import { colour, type Star } from '../stars';

export interface NamedStar {
  id: number;
  proper: string;
  raH: number;
  dec: number;
  ly: number;
  mag: number;
  ci: number;
  ciKnown: boolean;
  lum: number;
  spect: string;
  con: string;
  bayer: string;
  flam: number;
  gl: string;
  hip: number;
  hd: number;
}

export const NAMED: NamedStar[] = (named as (Omit<NamedStar, 'ci' | 'ciKnown'> & { ci: number | null })[]).map(
  (s) => ({ ...s, ...colour(s.ci) }),
);

const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** URL slug of each named star in each language (Italian uses the traditional name). */
export const SLUGS: Map<number, Record<Lang, string>> = (() => {
  const out = new Map<number, Record<Lang, string>>();
  for (const lang of LANGS) {
    const count = new Map<string, number>();
    for (const s of NAMED) count.set(slugify(properName(s.proper, lang)), (count.get(slugify(properName(s.proper, lang))) ?? 0) + 1);
    for (const s of NAMED) {
      let slug = slugify(properName(s.proper, lang));
      if ((count.get(slug) ?? 0) > 1) slug += `-${s.hip || s.id}`;
      const entry = out.get(s.id) ?? ({} as Record<Lang, string>);
      entry[lang] = slug;
      out.set(s.id, entry);
    }
  }
  return out;
})();

export function namedBySlug(lang: Lang, slug: string): NamedStar | undefined {
  return NAMED.find((s) => SLUGS.get(s.id)?.[lang] === slug);
}

/** Nearby stars for birth-year matching, same shape as the client catalogue. */
type Row = [number, number, number, string, string, string, number, string, number, number, number, number, number | null, number, string];
export const NEAR: Star[] = (near as unknown as Row[]).map(
  ([id, hip, hd, gl, proper, bayer, flam, con, raH, dec, ly, mag, ci, lum, spect]) => ({
    id, hip, hd, gl, proper, bayer, flam, con, raH, dec, ly, mag, lum, spect, ...colour(ci),
  }),
);

const NAMED_BY_ID = new Map(NAMED.map((s) => [s.id, s]));
export function namedById(id: number): NamedStar | undefined {
  return NAMED_BY_ID.get(id);
}

export interface Visibility {
  /** Months (1–12) when the star stands well up in the evening sky. */
  months: number[];
  circumpolar: boolean;
  never: boolean;
  low: boolean;
}

/**
 * Visibility from latitude 42° N (Rome, New York, Tokyo, Barcelona…), at 22:00 local mean
 * solar time on the 15th of each month.
 */
export function visibility(s: { raH: number; dec: number }, year: number): Visibility {
  const lat = 42;
  const maxAlt = 90 - Math.abs(lat - s.dec);
  const minAlt = s.dec - (90 - lat); // lowest point, below the pole
  if (maxAlt < 0) return { months: [], circumpolar: false, never: true, low: false };
  if (maxAlt < 15) return { months: [], circumpolar: false, never: false, low: true };
  const place = { lat, lon: 0, name: '' };
  const months: number[] = [];
  for (let m = 1; m <= 12; m++) {
    const t = new Date(Date.UTC(year, m - 1, 15, 22));
    if (sunAltitude(t, place) > -12) continue;
    if (starPosition(s.raH, s.dec, t, place).alt >= 25) months.push(m);
  }
  return { months, circumpolar: minAlt > 5, never: false, low: false };
}
