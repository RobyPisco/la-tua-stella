<script lang="ts">
  import type { Lang } from '$lib/i18n.svelte';
  import { absolute, DEFAULT_LANG } from '$lib/routes';
  import { SITE_NAME } from '$lib/site';

  interface Props {
    title: string;
    description: string;
    lang: Lang;
    /** Path of this page in every language (without the base path). */
    alternates: Partial<Record<Lang, string>>;
    image?: string;
    jsonLd?: object[];
  }
  let { title, description, lang, alternates, image = '/og.png', jsonLd = [] }: Props = $props();

  const OG_LOCALE: Record<Lang, string> = { en: 'en_US', es: 'es_ES', it: 'it_IT' };
  const canonical = $derived(absolute(alternates[lang] ?? '/'));
  // "</" can't appear inside a <script> element.
  const ld = (o: object) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</` + 'script>';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  {#each Object.entries(alternates) as [l, path] (l)}
    <link rel="alternate" hreflang={l} href={absolute(path)} />
  {/each}
  {#if alternates[DEFAULT_LANG]}
    <link rel="alternate" hreflang="x-default" href={absolute(alternates[DEFAULT_LANG]!)} />
  {/if}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={absolute(image)} />
  <meta property="og:locale" content={OG_LOCALE[lang]} />
  <meta name="twitter:card" content="summary_large_image" />
  {#each jsonLd as o}
    {@html ld(o)}
  {/each}
</svelte:head>
