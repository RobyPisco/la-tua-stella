<script lang="ts">
  import { base } from '$app/paths';
  import type { Lang } from '$lib/i18n.svelte';
  import { properName } from '$lib/names';
  import { PT } from '$lib/pageText';
  import { paths } from '$lib/routes';
  import Seo from '../Seo.svelte';

  interface Entry {
    id: number;
    proper: string;
    mag: number;
    con: string;
    slug: string;
  }
  interface Data {
    lang: Lang;
    list: Entry[];
    brightest: Entry[];
    alternates: Record<Lang, string>;
  }
  let { data }: { data: Data } = $props();

  const lang = $derived(data.lang);
  const p = $derived(PT[lang]);
  const sorted = $derived(
    [...data.list].sort((a, b) => properName(a.proper, lang).localeCompare(properName(b.proper, lang), lang)),
  );
</script>

<Seo title={p.starsHubTitle} description={p.starsHubDescription} {lang} alternates={data.alternates} image={`/og/${lang}/starsHub.png`} />

<article class="doc">
  <header>
    <h1>{p.starsHubH1}</h1>
    <p class="lead">{p.starsHubLead}</p>
  </header>

  <section>
    <h2>{p.brightestHeading}</h2>
    <ul class="grid-links wide">
      {#each data.brightest as s (s.id)}
        <li><a href={base + paths.star(lang, s.slug)}>{properName(s.proper, lang)}</a></li>
      {/each}
    </ul>
  </section>

  <section>
    <h2>{p.allHeading}</h2>
    <ul class="grid-links wide">
      {#each sorted as s (s.id)}
        <li><a href={base + paths.star(lang, s.slug)}>{properName(s.proper, lang)}</a></li>
      {/each}
    </ul>
  </section>
</article>

<style>
  .wide {
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  }
</style>
