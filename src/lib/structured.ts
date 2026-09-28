import type { PageContent } from './content';
import type { Lang } from './i18n.svelte';
import { SITE_NAME } from './site';

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
      publisher: { '@type': 'Organization', name: SITE_NAME },
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
