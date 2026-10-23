<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { CONTENT } from '$lib/content';
  import { locale } from '$lib/i18n.svelte';
  import { absolute, href, PAGES } from '$lib/routes';
  import { siteJsonLd, toolJsonLd } from '$lib/structured';
  import PageContent from './PageContent.svelte';
  import PosterEditor from './PosterEditor.svelte';
  import Seo from './Seo.svelte';

  const c = $derived(CONTENT.poster[locale.lang]);

  onMount(() => {
    // Stars shared before the poster moved to the root carry ?s=<id> on this address.
    // Hand those links on to the star page so they still open the star they named.
    const id = new URL(location.href).searchParams.get('s');
    if (id) goto(`${href('star', locale.lang)}?s=${encodeURIComponent(id)}`, { replaceState: true });
  });
</script>

<Seo
  title={c.title}
  description={c.description}
  lang={locale.lang}
  alternates={PAGES.poster}
  image={`/og/${locale.lang}/poster.png`}
  jsonLd={[
    ...siteJsonLd(),
    ...toolJsonLd(c, absolute(PAGES.poster[locale.lang]), locale.lang, 'DesignApplication'),
  ]}
/>
<PosterEditor />
<PageContent content={c} />
