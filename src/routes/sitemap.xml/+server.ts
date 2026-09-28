import type { Lang } from '$lib/i18n.svelte';
import { absolute, alternatesOf, LANGS, PAGES, paths } from '$lib/routes';
import { NAMED, SLUGS } from '$lib/server/catalog';
import { bornEntries, moonMonthEntries, moonYearEntries } from '$lib/server/pages';

export const prerender = true;

/** Every page in every language, each listing its translations (hreflang). */
export function GET() {
  const pages: Record<Lang, string>[] = [
    ...Object.values(PAGES),
    ...moonYearEntries().map(({ year }) => alternatesOf((l) => paths.moonYear(l, +year))),
    ...moonMonthEntries().map(({ year, month }) => alternatesOf((l) => paths.moonMonth(l, +year, +month))),
    ...bornEntries().map(({ year }) => alternatesOf((l) => paths.born(l, +year))),
    ...NAMED.map((s) => alternatesOf((l) => paths.star(l, SLUGS.get(s.id)![l]))),
  ];

  const urls = pages.flatMap((alts) => {
    const links =
      LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${absolute(alts[l])}"/>`).join('') +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${absolute(alts.en)}"/>`;
    return LANGS.map((lang) => `<url><loc>${absolute(alts[lang])}</loc>${links}</url>`);
  });

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    urls.join('\n') +
    '\n</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
