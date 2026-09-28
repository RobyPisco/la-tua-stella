<script lang="ts">
  import { base } from '$app/paths';
  import type { Lang } from '$lib/i18n.svelte';
  import { monthName, PT } from '$lib/pageText';
  import { absolute, href, PAGES, paths } from '$lib/routes';
  import { breadcrumbs } from '$lib/structured';
  import Seo from '../Seo.svelte';

  interface Data {
    lang: Lang;
    year: number;
    months: { month: number; fulls: string[]; news: string[] }[];
    prev: number | null;
    next: number | null;
    hasBornPage: boolean;
    alternates: Record<Lang, string>;
  }
  let { data }: { data: Data } = $props();

  const lang = $derived(data.lang);
  const p = $derived(PT[lang]);
  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(lang, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: p.moonTz });
  const fulls = $derived(data.months.reduce((n, m) => n + m.fulls.length, 0));
  const blue = $derived(data.months.filter((m) => m.fulls.length > 1));
</script>

<Seo
  title={p.moonYearTitle(data.year)}
  description={p.moonYearDescription(data.year, fulls)}
  {lang}
  alternates={data.alternates}
  jsonLd={[
    breadcrumbs([
      ['Sky of Your Day', absolute(PAGES.home[lang])],
      [p.moonHubH1, absolute(PAGES.moonHub[lang])],
      [String(data.year), absolute(paths.moonYear(lang, data.year))],
    ]),
  ]}
/>

<article class="doc">
  <header>
    <ol class="crumbs">
      <li><a href={href('moonHub', lang)}>{p.moonHubH1.replace(/\?$/, '')}</a></li>
      <li aria-current="page">{data.year}</li>
    </ol>
    <h1>{p.moonYearH1(data.year)}</h1>
    <p class="lead">{p.moonYearLead(data.year, fulls)}</p>
    {#each blue as m}<p>{p.blueMoon(monthName(lang, m.month))}</p>{/each}
  </header>

  <section>
    <table class="table">
      <thead>
        <tr><th>{p.colMonth}</th><th>{p.colFull}</th><th>{p.colNew}</th></tr>
      </thead>
      <tbody>
        {#each data.months as m (m.month)}
          <tr>
            <td><a href={base + paths.moonMonth(lang, data.year, m.month)}>{monthName(lang, m.month)}</a></td>
            <td>{m.fulls.map(fmt).join(', ') || '–'}</td>
            <td>{m.news.map(fmt).join(', ') || '–'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <p class="note">{p.timeZoneNote}</p>
  </section>

  <aside class="cta">
    <p>{p.bornCta}</p>
    <div class="actions">
      <a class="btn" href={href('home', lang)}>{p.findStar}</a>
      {#if data.hasBornPage}
        <a class="btn ghost" href={base + paths.born(lang, data.year)}>{p.bornH1(data.year).split(':')[0]}</a>
      {/if}
    </div>
  </aside>

  <nav class="pager" aria-label={p.allYears}>
    {#if data.prev}<a href={base + paths.moonYear(lang, data.prev)} rel="prev">← {data.prev}</a>{:else}<span></span>{/if}
    <a href={href('moonHub', lang)}>{p.allYears}</a>
    {#if data.next}<a href={base + paths.moonYear(lang, data.next)} rel="next">{data.next} →</a>{:else}<span></span>{/if}
  </nav>
</article>
