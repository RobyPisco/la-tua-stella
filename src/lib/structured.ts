import { KOFI_URL } from './brand';
import type { PageContent } from './content';
import type { Lang } from './i18n.svelte';
import { absolute, LANGS } from './routes';
import { SITE_NAME } from './site';

/** Stable ids: every page can point at the same site and publisher. */
const WEBSITE_ID = absolute('/#website');
const ORG_ID = absolute('/#organization');
export const WEBSITE_REF = { '@id': WEBSITE_ID };

/**
 * The site and who publishes it, on every home page: this is what Google reads for the
 * site name shown above the results (the <title>s no longer repeat it).
 */
export function siteJsonLd(): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: absolute('/'),
      name: SITE_NAME,
      alternateName: 'skyofyourday.com',
      inLanguage: LANGS,
      publisher: { '@id': ORG_ID },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE_NAME,
      url: absolute('/'),
      logo: { '@type': 'ImageObject', url: absolute('/icon-512.png'), width: 512, height: 512 },
      ...(KOFI_URL ? { sameAs: [KOFI_URL] } : {}),
    },
  ];
}

/** schema.org data for a free web tool and its questions, for rich results. */
export function toolJsonLd(c: PageContent, url: string, lang: Lang, category: string): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: c.title.split(' | ')[0],
      url,
      description: c.description,
      inLanguage: lang,
      applicationCategory: category,
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      publisher: { '@id': ORG_ID },
      isPartOf: WEBSITE_REF,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: c.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];
}

/** Breadcrumb trail for search results: [name, absolute URL] from the top. */
export function breadcrumbs(items: [string, string][]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
  };
}
