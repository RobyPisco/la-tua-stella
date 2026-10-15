<script lang="ts">
  import { CONTENT } from '$lib/content';
  import { locale } from '$lib/i18n.svelte';
  import { absolute, PAGES } from '$lib/routes';
  import { toolJsonLd } from '$lib/structured';
  import PageContent from './PageContent.svelte';
  import Seo from './Seo.svelte';
  import StarApp from './StarApp.svelte';

  const c = $derived(CONTENT.star[locale.lang]);
</script>

<Seo
  title={c.title}
  description={c.description}
  lang={locale.lang}
  alternates={PAGES.star}
  image={`/og/${locale.lang}/star.png`}
  jsonLd={toolJsonLd(c, absolute(PAGES.star[locale.lang]), locale.lang, 'EducationalApplication')}
/>
<StarApp />
<PageContent content={c} />
