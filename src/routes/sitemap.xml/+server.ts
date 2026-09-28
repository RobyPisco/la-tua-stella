import { absolute, LANGS, PAGES } from '$lib/routes';

export const prerender = true;

/** Every page in every language, each listing its translations (hreflang). */
export function GET() {
  const urls = Object.values(PAGES).flatMap((paths) =>
    LANGS.map((lang) => {
      const alts = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${absolute(paths[l])}"/>`).join('');
      const xdef = `<xhtml:link rel="alternate" hreflang="x-default" href="${absolute(paths.en)}"/>`;
      return `<url><loc>${absolute(paths[lang])}</loc>${alts}${xdef}</url>`;
    }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
