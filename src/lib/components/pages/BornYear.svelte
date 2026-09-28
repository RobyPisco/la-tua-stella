<script lang="ts">
  import { base } from '$app/paths';
  import { instrument } from '$lib/describe';
  import type { Lang } from '$lib/i18n.svelte';
  import { fmtNum } from '$lib/i18n.svelte';
  import { constellationPlain } from '$lib/names';
  import { monthName, PT } from '$lib/pageText';
  import { absolute, href, PAGES, paths } from '$lib/routes';
  import { starName, type Star } from '$lib/stars';
  import { breadcrumbs } from '$lib/structured';
  import Seo from '../Seo.svelte';

  interface Data {
    lang: Lang;
    year: number;
    rows: { month: number; star: Star; slug: string | null; arrival: string }[];
    typicalLy: number;
    prev: number | null;
    next: number | null;
    alternates: Record<Lang, string>;
  }
  let { data }: { data: Data } = $props();

  const lang = $derived(data.lang);
  const p = $derived(PT[lang]);
  // The best-known star of the year: the brightest among the months.
  const headline = $derived([...data.rows].sort((a, b) => a.star.mag - b.star.mag)[0]);
</script>

<Seo
  title={p.bornTitle(data.year)}
  description={p.bornDescription(data.year, headline ? starName(headline.star, lang) : '', fmtNum(data.typicalLy))}
  {lang}
  alternates={data.alternates}
  jsonLd={[
    breadcrumbs([
      ['Sky of Your Day', absolute(PAGES.home[lang])],
      [p.bornHubH1, absolute(PAGES.bornHub[lang])],
      [String(data.year), absolute(paths.born(lang, data.year))],
    ]),
  ]}
/>

<article class="doc">
  <header>
    <ol class="crumbs">
      <li><a href={href('bornHub', lang)}>{p.bornHubH1}</a></li>
      <li aria-current="page">{data.year}</li>
    </ol>
    <h1>{p.bornH1(data.year)}</h1>
    <p class="lead">{p.bornLead(data.year, fmtNum(data.typicalLy))}</p>
  </header>

  <section>
    <table class="table">
      <thead>
        <tr>
          <th>{p.colMonth}</th>
          <th>{p.colStar}</th>
          <th>{p.colDistance}</th>
          <th class="hide-sm">{p.colConstellation}</th>
          <th class="hide-sm">{p.colSeen}</th>
        </tr>
      </thead>
      <tbody>
        {#each data.rows as r (r.month)}
          <tr>
            <td>{monthName(lang, r.month)}</td>
            <td>
              {#if r.slug}
                <a href={base + paths.star(lang, r.slug)}>{starName(r.star, lang)}</a>
              {:else}
                {starName(r.star, lang)}
              {/if}
            </td>
            <td>{p.lightYears(fmtNum(r.star.ly, 1))}</td>
            <td class="hide-sm">{constellationPlain(r.star.con, lang)}</td>
            <td class="hide-sm">{instrument(r.star.mag)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>

  <aside class="cta">
    <p>{p.exactDate}</p>
    <div class="actions">
      <a class="btn" href={href('home', lang)}>{p.findStar}</a>
      <a class="btn ghost" href={base + paths.moonYear(lang, data.year)}>{p.moonOfYear(data.year)}</a>
      <a class="btn ghost" href={href('poster', lang)}>{p.makePoster}</a>
    </div>
  </aside>

  <nav class="pager" aria-label={p.allYears}>
    {#if data.prev}<a href={base + paths.born(lang, data.prev)} rel="prev">← {data.prev}</a>{:else}<span></span>{/if}
    <a href={href('bornHub', lang)}>{p.allYears}</a>
    {#if data.next}<a href={base + paths.born(lang, data.next)} rel="next">{data.next} →</a>{:else}<span></span>{/if}
  </nav>
</article>
