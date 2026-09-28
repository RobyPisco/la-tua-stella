import { error } from '@sveltejs/kit';
import type { Lang } from '../i18n.svelte';
import { moonMonth, quarters } from '../moon';
import { PT } from '../pageText';
import { alternatesOf, FIRST_YEAR, PAGES, paths } from '../routes';
import { findStars } from '../stars';
import { zonedToUtc } from '../timezone';
import { NAMED, NEAR, SLUGS, namedById, namedBySlug, visibility } from './catalog';

/** The build date: pages are regenerated weekly, so "now" stays close to the truth. */
export const BUILT = new Date();
export const THIS_YEAR = BUILT.getUTCFullYear();
/** Moon pages run a year ahead, for people looking up upcoming full moons. */
export const MOON_LAST_YEAR = THIS_YEAR + 1;

const years = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

function yearParam(raw: string, last: number): number {
  const y = Number(raw);
  if (!Number.isInteger(y) || y < FIRST_YEAR || y > last || String(y) !== raw) error(404);
  return y;
}

// --- Moon ------------------------------------------------------------------------------

export const moonYearEntries = () => years(FIRST_YEAR, MOON_LAST_YEAR).map((y) => ({ year: String(y) }));
export const moonMonthEntries = () =>
  years(FIRST_YEAR, MOON_LAST_YEAR).flatMap((y) => years(1, 12).map((m) => ({ year: String(y), month: String(m).padStart(2, '0') })));

export function moonHub(lang: Lang) {
  return {
    lang,
    years: years(FIRST_YEAR, MOON_LAST_YEAR),
    alternates: PAGES.moonHub,
  };
}

export function moonYear(lang: Lang, rawYear: string) {
  const year = yearParam(rawYear, MOON_LAST_YEAR);
  const tz = PT[lang].moonTz;
  const all = quarters(zonedToUtc(year, 1, 1, 0, 0, tz), zonedToUtc(year + 1, 1, 1, 0, 0, tz));
  const months = years(1, 12).map((month) => {
    const inMonth = all.filter((e) => {
      const m = Number(new Intl.DateTimeFormat('en', { timeZone: tz, month: 'numeric' }).format(e.time));
      return m === month;
    });
    return {
      month,
      fulls: inMonth.filter((e) => e.phase === 'full').map((e) => e.time.toISOString()),
      news: inMonth.filter((e) => e.phase === 'new').map((e) => e.time.toISOString()),
    };
  });
  return {
    lang,
    year,
    months,
    prev: year > FIRST_YEAR ? year - 1 : null,
    next: year < MOON_LAST_YEAR ? year + 1 : null,
    hasBornPage: year <= THIS_YEAR,
    alternates: alternatesOf((l) => paths.moonYear(l, year)),
  };
}

export function moonMonthPage(lang: Lang, rawYear: string, rawMonth: string) {
  const year = yearParam(rawYear, MOON_LAST_YEAR);
  const month = Number(rawMonth);
  if (!/^\d\d$/.test(rawMonth) || month < 1 || month > 12) error(404);
  const mm = moonMonth(year, month, PT[lang].moonTz);
  const prev = month > 1 ? { y: year, m: month - 1 } : year > FIRST_YEAR ? { y: year - 1, m: 12 } : null;
  const next = month < 12 ? { y: year, m: month + 1 } : year < MOON_LAST_YEAR ? { y: year + 1, m: 1 } : null;
  return {
    lang,
    year,
    month,
    firstWeekday: mm.firstWeekday,
    days: mm.days.map((d) => ({ ...d, event: d.event ? { phase: d.event.phase, time: d.event.time.toISOString() } : null })),
    events: mm.events.map((e) => ({ phase: e.phase, time: e.time.toISOString() })),
    prev,
    next,
    alternates: alternatesOf((l) => paths.moonMonth(l, year, month)),
  };
}

// --- Birth years -------------------------------------------------------------------------

export const bornEntries = () => years(FIRST_YEAR, THIS_YEAR).map((y) => ({ year: String(y) }));

export function bornHub(lang: Lang) {
  return { lang, years: years(FIRST_YEAR, THIS_YEAR).reverse(), alternates: PAGES.bornHub };
}

export function bornYear(lang: Lang, rawYear: string) {
  const year = yearParam(rawYear, THIS_YEAR);
  const rows = years(1, 12).flatMap((month) => {
    const birth = new Date(Date.UTC(year, month - 1, 15, 12));
    if (birth > BUILT) return [];
    const { best } = findStars(NEAR, birth, BUILT);
    const named = namedById(best.id);
    return [{
      month,
      star: best,
      slug: named ? SLUGS.get(named.id)![lang] : null,
      arrival: new Date(birth.getTime() + best.ly * 365.25 * 86400000).toISOString(),
    }];
  });
  const age = THIS_YEAR - year;
  return {
    lang,
    year,
    rows,
    typicalLy: Math.max(1, age),
    prev: year > FIRST_YEAR ? year - 1 : null,
    next: year < THIS_YEAR ? year + 1 : null,
    alternates: alternatesOf((l) => paths.born(l, year)),
  };
}

// --- Named stars -------------------------------------------------------------------------

export const starEntries = (lang: Lang) => NAMED.map((s) => ({ slug: SLUGS.get(s.id)![lang] }));

export function starsHub(lang: Lang) {
  const list = NAMED.map((s) => ({ id: s.id, proper: s.proper, mag: s.mag, con: s.con, slug: SLUGS.get(s.id)![lang] }));
  return {
    lang,
    list,
    brightest: [...list].sort((a, b) => a.mag - b.mag).slice(0, 24),
    alternates: PAGES.starsHub,
  };
}

export function starPage(lang: Lang, slug: string) {
  const star = namedBySlug(lang, slug);
  if (!star) error(404);
  const slugs = SLUGS.get(star.id)!;
  // Stars within reach of a human lifetime are someone's birth-year star.
  const birthYear = star.ly > 0 && star.ly < THIS_YEAR - FIRST_YEAR ? Math.round(THIS_YEAR - star.ly) : null;
  const sameCon = NAMED.filter((s) => s.con === star.con && s.id !== star.id)
    .sort((a, b) => a.mag - b.mag)
    .slice(0, 12)
    .map((s) => ({ proper: s.proper, slug: SLUGS.get(s.id)![lang] }));
  return {
    lang,
    star,
    departed: star.ly > 0 && star.ly < 5000 ? Math.round(BUILT.getUTCFullYear() - star.ly) : null,
    birthYear,
    visibility: visibility(star, THIS_YEAR),
    sameCon,
    alternates: alternatesOf((l) => paths.star(l, slugs[l])),
  };
}
