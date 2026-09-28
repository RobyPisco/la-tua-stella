import type { Handle } from '@sveltejs/kit';
import { langFromPath } from '$lib/routes';

/** Each prerendered page declares its own language on <html>. */
export const handle: Handle = ({ event, resolve }) =>
  resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', langFromPath(event.url.pathname)) });
