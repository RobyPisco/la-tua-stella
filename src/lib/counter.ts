/**
 * Public "maps made" counter (the worker in worker/). Off unless VITE_COUNTER_URL is set at
 * build time, so local development never inflates the real number.
 */
const API = (import.meta.env.VITE_COUNTER_URL ?? '').replace(/\/$/, '');

async function call(method: 'GET' | 'POST'): Promise<number | null> {
  if (!API) return null;
  try {
    const r = await fetch(`${API}/maps`, { method });
    if (!r.ok) return null;
    const { count } = await r.json();
    return typeof count === 'number' ? count : null;
  } catch {
    return null;
  }
}

export const mapsCount = () => call('GET');
export const countMap = () => call('POST');
