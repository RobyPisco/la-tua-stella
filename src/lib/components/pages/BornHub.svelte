<script lang="ts">
  import { base } from '$app/paths';
  import type { Lang } from '$lib/i18n.svelte';
  import { PT } from '$lib/pageText';
  import { href, paths } from '$lib/routes';
  import Seo from '../Seo.svelte';

  interface Data {
    lang: Lang;
    years: number[];
    alternates: Record<Lang, string>;
  }
  let { data }: { data: Data } = $props();

  const lang = $derived(data.lang);
  const p = $derived(PT[lang]);
</script>

<Seo title={p.bornHubTitle} description={p.bornHubDescription} {lang} alternates={data.alternates} image={`/og/${lang}/bornHub.png`} />

<article class="doc">
  <header>
    <h1>{p.bornHubH1}</h1>
    <p class="lead">{p.bornHubLead}</p>
    <p><a class="btn" href={href('home', lang)}>{p.findStar}</a></p>
  </header>

  <section>
    <h2>{p.yearsHeading}</h2>
    <ul class="grid-links">
      {#each data.years as y (y)}
        <li><a href={base + paths.born(lang, y)}>{y}</a></li>
      {/each}
    </ul>
  </section>
</article>
