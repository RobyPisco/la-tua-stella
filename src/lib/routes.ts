import { base } from '$app/paths';
import { SITE_URL } from './site';
import type { Lang } from './i18n.svelte';

export const LANGS: Lang[] = ['en', 'it'];
export const DEFAULT_LANG: Lang = 'en';

/** Every page, with its path in each language. Slugs are localized for search. */
export const PAGES = {
  home: { en: '/', it: '/it/' },
  poster: { en: '/star-map/', it: '/it/mappa-stellare/' },
} satisfies Record<string, Record<Lang, string>>;

export type PageId = keyof typeof PAGES;

/** Link inside the site (with the deployment's base path). */
export function href(page: PageId, lang: Lang): string {
  return base + PAGES[page][lang];
}

/** Absolute URL, for canonical, hreflang and sharing. */
export function absolute(path: string): string {
  return SITE_URL + path;
}

export function langFromPath(pathname: string): Lang {
  const p = pathname.slice(base.length);
  return p === '/it' || p.startsWith('/it/') ? 'it' : 'en';
}
