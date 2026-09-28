/**
 * Public counter for skyofyourday.com: how many sky maps have been made.
 *
 *   GET  /maps  → { count }       read the total
 *   POST /maps  → { count }       add one (sent by the poster editor after a download)
 *
 * No cookies, nothing stored about who counts: only the total. The rate limiter keys on the IP
 * for a minute in memory to stop scripted inflation; the IP is never written anywhere.
 */

interface Env {
  DB: D1Database;
  LIMITER: { limit(o: { key: string }): Promise<{ success: boolean }> };
}

// Minimal D1 types, so the worker needs no extra type package.
interface D1Database {
  prepare(sql: string): { bind(...v: unknown[]): { first<T>(): Promise<T | null> } };
}

const ORIGINS = ['https://skyofyourday.com', 'https://www.skyofyourday.com'];

function json(body: unknown, headers: Record<string, string>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const origin = req.headers.get('Origin') ?? '';
    const cors = {
      'Access-Control-Allow-Origin': ORIGINS.includes(origin) ? origin : ORIGINS[0],
      Vary: 'Origin',
    };

    if (url.pathname !== '/maps') return json({ error: 'not found' }, cors, 404);

    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: { ...cors, 'Access-Control-Allow-Methods': 'GET, POST', 'Access-Control-Max-Age': '86400' },
      });
    }

    if (req.method === 'GET') {
      const row = await env.DB.prepare('SELECT n FROM counters WHERE name = ?').bind('maps').first<{ n: number }>();
      return json({ count: row?.n ?? 0 }, { ...cors, 'Cache-Control': 'public, max-age=60' });
    }

    if (req.method === 'POST') {
      // Only the site itself counts: not other pages, not scripts without an Origin.
      if (!ORIGINS.includes(origin)) return json({ error: 'forbidden' }, cors, 403);
      const { success } = await env.LIMITER.limit({ key: req.headers.get('CF-Connecting-IP') ?? '' });
      if (!success) return json({ error: 'too many' }, cors, 429);
      const row = await env.DB.prepare(
        'INSERT INTO counters (name, n) VALUES (?, 1) ON CONFLICT(name) DO UPDATE SET n = n + 1 RETURNING n',
      ).bind('maps').first<{ n: number }>();
      return json({ count: row?.n ?? 0 }, { ...cors, 'Cache-Control': 'no-store' });
    }

    return json({ error: 'method not allowed' }, cors, 405);
  },
};
