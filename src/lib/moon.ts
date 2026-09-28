import { Body, Illumination, MoonPhase, NextMoonQuarter, SearchMoonQuarter } from 'astronomy-engine';
import { zonedToUtc } from './timezone';

export type PhaseKey =
  | 'new' | 'waxingCrescent' | 'firstQuarter' | 'waxingGibbous'
  | 'full' | 'waningGibbous' | 'lastQuarter' | 'waningCrescent';

/** Quarter events, in the order astronomy-engine numbers them. */
export const QUARTERS: PhaseKey[] = ['new', 'firstQuarter', 'full', 'lastQuarter'];

export interface MoonEvent {
  phase: PhaseKey;
  time: Date;
}

export interface MoonDay {
  day: number;
  /** Ecliptic elongation from the Sun, 0–360°: 0 new, 180 full. */
  angle: number;
  /** Fraction of the disc lit, 0–1. */
  lit: number;
  phase: PhaseKey;
  /** A quarter falls on this (local) day. */
  event?: MoonEvent;
}

function between(angle: number): PhaseKey {
  if (angle < 90) return 'waxingCrescent';
  if (angle < 180) return 'waxingGibbous';
  if (angle < 270) return 'waningGibbous';
  return 'waningCrescent';
}

/** New, first quarter, full and last quarter moons from `from` until `to`. */
export function quarters(from: Date, to: Date): MoonEvent[] {
  const out: MoonEvent[] = [];
  let q = SearchMoonQuarter(from);
  while (q.time.date < to) {
    out.push({ phase: QUARTERS[q.quarter], time: q.time.date });
    q = NextMoonQuarter(q);
  }
  return out;
}

/** Local calendar date (y, m, d) of an instant in a time zone. */
export function localDate(t: Date, timeZone: string): [number, number, number] {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(t);
  const [y, m, d] = p.split('-').map(Number);
  return [y, m, d];
}

export interface MoonMonth {
  year: number;
  month: number;
  days: MoonDay[];
  events: MoonEvent[];
  /** Weekday of the 1st, Monday = 0. */
  firstWeekday: number;
}

/** The Moon for every day of a month, as seen at local noon in `timeZone`. */
export function moonMonth(year: number, month: number, timeZone: string): MoonMonth {
  const start = zonedToUtc(year, month, 1, 0, 0, timeZone);
  const end = month === 12 ? zonedToUtc(year + 1, 1, 1, 0, 0, timeZone) : zonedToUtc(year, month + 1, 1, 0, 0, timeZone);
  const events = quarters(start, end);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const days: MoonDay[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const noon = zonedToUtc(year, month, d, 12, 0, timeZone);
    const angle = MoonPhase(noon);
    const event = events.find((e) => {
      const [, em, ed] = localDate(e.time, timeZone);
      return em === month && ed === d;
    });
    days.push({
      day: d,
      angle,
      lit: Illumination(Body.Moon, noon).phase_fraction,
      phase: event?.phase ?? between(angle),
      event,
    });
  }
  const firstWeekday = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  return { year, month, days, events, firstWeekday };
}

/**
 * SVG path of the lit part of the Moon, centred on 0,0, as seen from the northern
 * hemisphere: lit on the right while waxing, on the left while waning.
 */
export function moonLitPath(lit: number, angle: number, r: number): string {
  const e = r * (2 * lit - 1);
  const side = angle < 180 ? 1 : -1;
  const sweepOuter = side > 0 ? 1 : 0;
  const sweepInner = (e > 0) === (side > 0) ? 1 : 0;
  const f = (n: number) => Math.round(n * 100) / 100;
  return `M0 ${f(-r)}A${f(r)} ${f(r)} 0 0 ${sweepOuter} 0 ${f(r)}A${f(Math.abs(e))} ${f(r)} 0 0 ${sweepInner} 0 ${f(-r)}Z`;
}
