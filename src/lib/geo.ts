import type { Place } from './astro';

const KEY = 'place';

export function savedPlace(): Place | null {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return p && typeof p.lat === 'number' && typeof p.lon === 'number' ? p : null;
  } catch {
    return null;
  }
}

export function savePlace(p: Place) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}

export function currentPosition(name: string): Promise<Place> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject(new Error('unsupported'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        name,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
      reject,
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 3600000 },
    );
  });
}

interface GeoResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
}

/** City search via Open-Meteo's free geocoding API (no key, CORS enabled). */
export async function searchCity(query: string, lang: string, signal?: AbortSignal): Promise<Place[]> {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', query);
  url.searchParams.set('count', '6');
  url.searchParams.set('language', lang);
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`geocoding ${res.status}`);
  const data: { results?: GeoResult[] } = await res.json();
  return (data.results ?? []).map((r) => ({
    lat: r.latitude,
    lon: r.longitude,
    name: [r.name, r.admin1 !== r.name ? r.admin1 : undefined, r.country].filter(Boolean).join(', '),
    timeZone: r.timezone,
  }));
}

/**
 * A rough guess at where the visitor is, from the browser's time zone, used only to draw
 * a plausible sky before they tell us their location.
 */
export function guessPlace(): Place {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  const lon = -new Date().getTimezoneOffset() / 4;
  const south = /^(Australia|Antarctica|Pacific\/(Auckland|Fiji|Tongatapu)|America\/(Argentina|Santiago|Sao_Paulo|Montevideo|Asuncion|Lima|La_Paz)|Africa\/(Johannesburg|Maputo|Harare|Windhoek|Lusaka)|Indian\/)/.test(tz);
  return { lat: south ? -33 : 42, lon, name: '', timeZone: tz };
}
