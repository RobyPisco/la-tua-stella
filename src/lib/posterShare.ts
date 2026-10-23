import type { Place } from './astro';

export interface PosterState {
  dateValue: string;
  time: string;
  where: Place;
  title: string;
  subtitle: string;
  themeId: string;
  fontId: string;
  formatId: string;
}

/** The poster's state, as query parameters: copying this address shares the exact same map. */
export function posterShareUrl(s: PosterState): string {
  const u = new URL(location.href);
  u.hash = '';
  const p = u.searchParams;
  p.set('d', s.dateValue);
  p.set('t', s.time);
  p.set('la', s.where.lat.toFixed(4));
  p.set('lo', s.where.lon.toFixed(4));
  if (s.where.timeZone) p.set('tz', s.where.timeZone); else p.delete('tz');
  if (s.where.name) p.set('pn', s.where.name); else p.delete('pn');
  if (s.title) p.set('ti', s.title); else p.delete('ti');
  if (s.subtitle) p.set('su', s.subtitle); else p.delete('su');
  p.set('th', s.themeId);
  p.set('fo', s.fontId);
  p.set('fm', s.formatId);
  return u.toString();
}

/** Reads a shared poster's state back out of the current URL, if it has one. */
export function posterStateFromUrl(): PosterState | null {
  const p = new URL(location.href).searchParams;
  const d = p.get('d'), t = p.get('t'), la = p.get('la'), lo = p.get('lo');
  if (!d || !t || !la || !lo) return null;
  return {
    dateValue: d,
    time: t,
    where: { lat: +la, lon: +lo, name: p.get('pn') ?? '', timeZone: p.get('tz') ?? undefined },
    title: p.get('ti') ?? '',
    subtitle: p.get('su') ?? '',
    themeId: p.get('th') ?? 'night',
    fontId: p.get('fo') ?? 'classic',
    formatId: p.get('fm') ?? 'a3',
  };
}
