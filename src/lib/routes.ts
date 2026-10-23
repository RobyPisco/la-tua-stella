import { base } from '$app/paths';
import { SITE_URL } from './site';
import type { Lang } from './i18n.svelte';

/** Order of the language switcher: English first (the default, at the root). */
export const LANGS: Lang[] = ['en', 'es', 'it', 'de', 'fr', 'pt'];
export const DEFAULT_LANG: Lang = 'en';

/**
 * Every page, with its path in each language. Slugs are localized for search.
 * The poster sits at the root: it is the product, and "star map" is what people search for.
 * The star journey has its own page and leads to it.
 */
export const PAGES = {
  poster: { en: '/', es: '/es/', it: '/it/', de: '/de/', fr: '/fr/', pt: '/pt/' },
  star: {
    en: '/your-star/', es: '/es/tu-estrella/', it: '/it/la-tua-stella/',
    de: '/de/dein-stern/', fr: '/fr/ton-etoile/', pt: '/pt/a-tua-estrela/',
  },
  moonHub: { en: '/moon/', es: '/es/luna/', it: '/it/luna/', de: '/de/mond/', fr: '/fr/lune/', pt: '/pt/lua/' },
  bornHub: {
    en: '/born-in/', es: '/es/nacidos-en/', it: '/it/nati-nel/',
    de: '/de/geburtsjahr/', fr: '/fr/annee-de-naissance/', pt: '/pt/nascidos-em/',
  },
  starsHub: { en: '/stars/', es: '/es/estrellas/', it: '/it/stelle/', de: '/de/sterne/', fr: '/fr/etoiles/', pt: '/pt/estrelas/' },
  terms: {
    en: '/terms/', es: '/es/condiciones/', it: '/it/condizioni/',
    de: '/de/nutzungsbedingungen/', fr: '/fr/conditions/', pt: '/pt/termos/',
  },
  about: {
    en: '/about/', es: '/es/sobre-mi/', it: '/it/chi-sono/',
    de: '/de/ueber-mich/', fr: '/fr/a-propos/', pt: '/pt/sobre-mim/',
  },
} satisfies Record<string, Record<Lang, string>>;

/**
 * Where the poster used to live, before it moved to the root. These paths stay as pages that
 * point at the new address (canonical plus a redirect), so links and search results still work.
 * They are deliberately outside PAGES: they must not enter the sitemap.
 */
export const MOVED_POSTER: Record<Lang, string> = {
  en: '/star-map/', es: '/es/mapa-estelar/', it: '/it/mappa-stellare/',
  de: '/de/sternkarte/', fr: '/fr/carte-du-ciel/', pt: '/pt/mapa-estelar/',
};

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
  return (LANGS as string[]).includes(first) ? (first as Lang) : 'en';
}
