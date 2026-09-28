<script lang="ts">
  import { CONTENT } from '$lib/content';
  import { locale } from '$lib/i18n.svelte';
  import { absolute, PAGES } from '$lib/routes';
  import { toolJsonLd } from '$lib/structured';
  import PageContent from './PageContent.svelte';
  import PosterEditor from './PosterEditor.svelte';
  import Seo from './Seo.svelte';

  const c = $derived(CONTENT.poster[locale.lang]);
</script>

<Seo
  title={c.title}
  description={c.description}
  lang={locale.lang}
  alternates={PAGES.poster}
  jsonLd={toolJsonLd(c, absolute(PAGES.poster[locale.lang]), locale.lang, 'DesignApplication')}
/>
<PosterEditor />
<PageContent content={c} />
