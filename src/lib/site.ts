/**
 * Public address of the site, used for canonical links, hreflang, sitemap and social cards.
 * Includes the base path. Set VITE_SITE_URL at build time when the domain changes.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? 'https://robypisco.github.io/la-tua-stella').replace(/\/$/, '');
export const SITE_NAME = 'Sky of Your Day';
