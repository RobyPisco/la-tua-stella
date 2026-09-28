import { MIN_ALT, maxAltitude, nextVisibleNight, tonight, type Place } from './astro';
import { temperature } from './color';
import { direction, fmtDate, fmtLat, fmtNum, fmtTime, t } from './i18n.svelte';
import { constellationName } from './names';
import { NAKED_EYE, type Star } from './stars';
import { locale } from './i18n.svelte';

export function visibility(mag: number): string {
  const s = t().see;
  if (mag < 2.5) return s.city;
  if (mag < 4.5) return s.suburb;
  if (mag <= NAKED_EYE) return s.dark;
  if (mag <= 9) return s.binoculars;
  return s.telescope;
}

export function instrument(mag: number): string {
  return mag <= NAKED_EYE ? t().nakedEye : mag <= 9 ? t().withBinoculars : t().withTelescope;
}

/** "a yellow star like the Sun, a giant, in the constellation Boötes" */
export function starKind(s: Star): string {
  const tt = t();
  const cls = s.spect.match(/[OBAFGKMWD]/)?.[0] ?? 'X';
  let kind = tt.kind[cls] ?? tt.kind.X;
  const lc = s.spect.match(/^[OBAFGKM][\d.\-/+]*\s*(Iab|Ia|Ib|III|II|IV|V|I)?/)?.[1];
  if (lc === 'I' || lc === 'Ia' || lc === 'Iab' || lc === 'Ib') kind = tt.supergiant(kind);
  else if (lc === 'II' || lc === 'III') kind = tt.giant(kind);
  return s.con ? `${kind}, ${tt.inConstellation(constellationName(s.con, locale.lang))}` : kind;
}

export function facts(s: Star): string[] {
  const tt = t();
  const out: string[] = [];
  if (s.lum > 1.5) out.push(tt.brighter(fmtNum(s.lum, s.lum < 10 ? 1 : 0)));
  else if (s.lum > 0 && s.lum < 0.67) out.push(tt.fainter(fmtNum(s.lum * 100, s.lum < 0.01 ? 2 : s.lum < 0.1 ? 1 : 0)));
  else if (s.lum > 0) out.push(tt.sunLike);
  if (s.ciKnown) out.push(tt.temp(fmtNum(Math.round(temperature(s.ci) / 100) * 100)));
  const km = s.ly * 9.4607e12;
  const km_s = new Intl.NumberFormat(locale.lang, { notation: 'compact', compactDisplay: 'long', maximumFractionDigits: 0 }).format(km);
  out.push(tt.distance(fmtNum(s.ly, 1), km_s));
  return out;
}

export interface Sighting {
  lines: string[];
  /** Moment to draw the sky at, and the direction to face. */
  when: Date;
  facing: number;
  best: boolean;
}

export function sighting(s: Star, place: Place, now = new Date()): Sighting {
  const tt = t();
  const tz = place.timeZone;
  if (maxAltitude(s.dec, place.lat) < MIN_ALT) {
    const lat = s.dec < 0
      ? tt.southOf(fmtLat(Math.min(90, s.dec + 90 - MIN_ALT)))
      : tt.northOf(fmtLat(Math.max(-90, s.dec - 90 + MIN_ALT)));
    return { lines: [tt.never(lat)], when: now, facing: s.dec < 0 ? 180 : 0, best: false };
  }
  const tn = tonight(s.raH, s.dec, s.mag, place, now);
  if (!tn.night) return { lines: [tt.noNight], when: now, facing: 180, best: false };
  if (tn.best && tn.window) {
    const fists = Math.max(1, Math.round(tn.best.alt / 10));
    const time = fmtTime(tn.best.time, tz);
    return {
      lines: [
        tn.best.alt > 75
          ? tt.overhead(time)
          : tt.lookAt(time, direction(tn.best.az), Math.round(tn.best.alt), tt.fists(fists)),
        tt.visibleBetween(fmtTime(tn.window.start, tz), fmtTime(tn.window.end, tz)),
      ],
      when: tn.best.time,
      facing: tn.best.alt > 75 ? 180 : tn.best.az,
      best: true,
    };
  }
  const back = nextVisibleNight(s.raH, s.dec, s.mag, place, now);
  const lines = [tt.notTonight];
  if (back) {
    const hour = Number(back.toLocaleString('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: tz }));
    lines.push(hour < 12 ? tt.backOnMorning(fmtDate(back, tz)) : tt.backOn(fmtDate(back, tz)));
  }
  return { lines, when: tn.night.start, facing: 180, best: false };
}
