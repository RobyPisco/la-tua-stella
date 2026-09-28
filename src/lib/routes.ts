import { base } from '$app/paths';
import { SITE_URL } from './site';
import type { Lang } from './i18n.svelte';

/** Order of the language switcher: English first (the default, at the root). */
export const LANGS: Lang[] = ['en', 'es', 'it'];
export const DEFAULT_LANG: Lang = 'en';

/** Every page, with its path in each language. Slugs are localized for search. */
export const PAGES = {
  home: { en: '/', es: '/es/', it: '/it/' },
  poster: { en: '/star-map/', es: '/es/mapa-estelar/', it: '/it/mappa-stellare/' },
  moonHub: { en: '/moon/', es: '/es/luna/', it: '/it/luna/' },
  bornHub: { en: '/born-in/', es: '/es/nacidos-en/', it: '/it/nati-nel/' },
  starsHub: { en: '/stars/', es: '/es/estrellas/', it: '/it/stelle/' },
  terms: { en: '/terms/', es: '/es/condiciones/', it: '/it/condizioni/' },
} satisfies Record<string, Record<Lang, string>>;

const pad = (n: number) => String(n).padStart(2, '0');

/** Paths of generated pages, per language (without the base path). */
export const paths = {
  moonYear: (lang: Lang, y: number) => `${PAGES.moonHub[lang]}${y}/`,
  moonMonth: (lang: Lang, y: number, m: number) => `${PAGES.moonHub[lang]}${y}/${pad(m)}/`,
  born: (lang: Lang, y: number) => `${PAGES.bornHub[lang]}${y}/`,
  star: (lang: Lang, slug: string) => `${PAGES.starsHub[lang]}${slug}/`,
};

/** The same generated page in every language. */
export function alternatesOf(make: (lang: Lang) => string): Record<Lang, string> {
  return Object.fromEntries(LANGS.map((l) => [l, make(l)])) as Record<Lang, string>;
}

/** First year covered by the moon and birth-year pages. */
export const FIRST_YEAR = 1930;

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
  const first = pathname.slice(base.length).split('/')[1];
  return first === 'it' || first === 'es' ? first : 'en';
}
