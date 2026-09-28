/** Offset (ms) of an IANA time zone from UTC at a given instant, from the browser's tz database. */
function offsetAt(instant: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(instant));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return asUtc - Math.floor(instant / 1000) * 1000;
}

/**
 * The instant at which the wall clock in `timeZone` showed this local date and time
 * (daylight saving included). Falls back to a longitude-based offset when the zone is unknown.
 */
export function zonedToUtc(y: number, m: number, d: number, hh: number, mm: number, timeZone?: string, lon = 0): Date {
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  if (!timeZone) return new Date(guess - Math.round(lon / 15) * 3600000);
  try {
    let off = offsetAt(guess, timeZone);
    off = offsetAt(guess - off, timeZone); // second pass settles DST transitions
    return new Date(guess - off);
  } catch {
    return new Date(guess - Math.round(lon / 15) * 3600000);
  }
}
