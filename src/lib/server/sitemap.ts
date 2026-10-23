import type { Lang } from '$lib/i18n.svelte';
import { absolute, alternatesOf, LANGS, PAGES, paths } from '$lib/routes';
import { NAMED, SLUGS } from '$lib/server/catalog';
import { bornEntries, moonMonthEntries, moonYearEntries } from '$lib/server/pages';

/**
 * The sitemap is split by section and language, so Search Console shows how many pages
 * of each kind are indexed (e.g. moon months in Italian) instead of one big number.
 */
export const SECTIONS = {
  pages: () => Object.values(PAGES) as Record<Lang, string>[],
  moon: () => [
    ...moonYearEntries().map(({ year }) => alternatesOf((l) => paths.moonYear(l, +year))),
    ...moonMonthEntries().map(({ year, month }) => alternatesOf((l) => paths.moonMonth(l, +year, +month))),
  ],
  born: () => bornEntries().map(({ year }) => alternatesOf((l) => paths.born(l, +year))),
  stars: () => NAMED.map((s) => alternatesOf((l) => paths.star(l, SLUGS.get(s.id)![l]))),
} satisfies Record<string, () => Record<Lang, string>[]>;

export type Section = keyof typeof SECTIONS;

/** One file per section and language: "moon-it", "stars-en"… */
export const sitemapFiles = (): { name: string; section: Section; lang: Lang }[] =>
  (Object.keys(SECTIONS) as Section[]).flatMap((section) => LANGS.map((lang) => ({ name: `${section}-${lang}`, section, lang })));

export const sitemapUrl = (name: string) => absolute(`/sitemaps/${name}.xml`);

/** The pages of one section in one language, each listing its translations (hreflang). */
export function urlset(section: Section, lang: Lang): string {
  const urls = SECTIONS[section]().map((alts) => {
    const links =
      LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${absolute(alts[l])}"/>`).join('') +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${absolute(alts.en)}"/>`;
    return `<url><loc>${absolute(alts[lang])}</loc>${links}</url>`;
  });
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    urls.join('\n') +
    '\n</urlset>\n'
  );
}

export const xmlResponse = (xml: string) => new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
