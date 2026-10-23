import { sitemapFiles, sitemapUrl, xmlResponse } from '$lib/server/sitemap';

export const prerender = true;

/** Sitemap index (the address already submitted to Search Console): one file per section and language. */
export function GET() {
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    sitemapFiles()
      .map(({ name }) => `<sitemap><loc>${sitemapUrl(name)}</loc></sitemap>`)
      .join('\n') +
    '\n</sitemapindex>\n';
  return xmlResponse(xml);
}
