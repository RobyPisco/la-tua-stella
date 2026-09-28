<script lang="ts">
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import type { Lang } from '$lib/i18n.svelte';
  import { PT } from '$lib/pageText';
  import { absolute, paths } from '$lib/routes';
  import { SITE_NAME } from '$lib/site';
  import DateField from '../DateField.svelte';
  import Seo from '../Seo.svelte';

  interface Data {
    lang: Lang;
    years: number[];
    alternates: Record<Lang, string>;
  }
  let { data }: { data: Data } = $props();

  const lang = $derived(data.lang);
  const p = $derived(PT[lang]);
  let date = $state('');

  function show(e: SubmitEvent) {
    e.preventDefault();
    if (!date) return;
    const [y, m, d] = date.split('-').map(Number);
    if (y < data.years[0] || y > data.years[data.years.length - 1]) return;
    goto(`${base}${paths.moonMonth(lang, y, m)}#d${d}`);
  }
</script>

<Seo
  title={p.moonHubTitle}
  description={p.moonHubDescription}
  {lang}
  alternates={data.alternates}
  image={`/og/${lang}/moonHub.png`}
  jsonLd={[
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: p.moonHubH1,
      description: p.moonHubDescription,
      url: absolute(data.alternates[lang]),
      inLanguage: lang,
      isPartOf: { '@type': 'WebSite', name: SITE_NAME },
    },
  ]}
/>

<article class="doc">
  <header>
    <h1>{p.moonHubH1}</h1>
    <p class="lead">{p.moonHubLead}</p>
  </header>

  <form class="lookup" onsubmit={show}>
    <DateField bind:value={date} legend={p.dateLabel} />
    <button class="btn" type="submit">{p.lookUp}</button>
  </form>

  <section>
    <h2>{p.yearsHeading}</h2>
    <ul class="grid-links">
      {#each [...data.years].reverse() as y (y)}
        <li><a href={base + paths.moonYear(lang, y)}>{y}</a></li>
      {/each}
    </ul>
  </section>
</article>

<style>
  .lookup {
    display: grid;
    gap: 1rem;
    justify-items: start;
    max-width: 30rem;
  }
  .lookup :global(.date) {
    width: 100%;
  }
</style>
