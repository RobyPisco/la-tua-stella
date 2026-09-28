<script lang="ts">
  import { base } from '$app/paths';
  import { facts, starKind, visibility as seeWith } from '$lib/describe';
  import { fmtNum, t, type Lang } from '$lib/i18n.svelte';
  import { constellationName, constellationPlain, properName } from '$lib/names';
  import { monthName, PT } from '$lib/pageText';
  import { absolute, FIRST_YEAR, href, PAGES, paths } from '$lib/routes';
  import type { NamedStar, Visibility } from '$lib/server/catalog';
  import { starDesignation } from '$lib/stars';
  import { breadcrumbs } from '$lib/structured';
  import Seo from '../Seo.svelte';

  interface Data {
    lang: Lang;
    star: NamedStar;
    departed: number | null;
    birthYear: number | null;
    visibility: Visibility;
    sameCon: { proper: string; slug: string }[];
    alternates: Record<Lang, string>;
  }
  let { data }: { data: Data } = $props();

  const lang = $derived(data.lang);
  const p = $derived(PT[lang]);
  const s = $derived(data.star);
  const name = $derived(properName(s.proper, lang));
  const designation = $derived(starDesignation(s));
  const kind = $derived(starKind(s));
  const lyText = $derived(fmtNum(s.ly, s.ly < 100 ? 1 : 0));
  const conName = $derived(constellationName(s.con, lang));
  const conPlain = $derived(constellationPlain(s.con, lang));

  const where = $derived.by(() => {
    const v = data.visibility;
    if (v.never) return `${p.fromLatitudes} ${p.neverVisible}`;
    if (v.low) return `${p.fromLatitudes} ${p.lowAlways}`;
    if (v.circumpolar) return `${p.fromLatitudes} ${p.circumpolar}`;
    const list = new Intl.ListFormat(lang, { type: 'conjunction' }).format(v.months.map((m) => monthName(lang, m)));
    return v.months.length ? `${p.fromLatitudes} ${p.bestMonths(list)}` : '';
  });

  // facts() ends with the distance line: drop it when the distance isn't known.
  const factLines = $derived(s.ly > 0 ? facts(s) : facts(s).slice(0, -1));
  const description = $derived(
    p.starDescription(name, kind, s.ly > 0 ? p.distanceShort(lyText, data.departed) : ''),
  );
</script>

<Seo
  title={p.starTitle(name)}
  {description}
  {lang}
  alternates={data.alternates}
  jsonLd={[
    breadcrumbs([
      ['Sky of Your Day', absolute(PAGES.home[lang])],
      [p.starsHubH1, absolute(PAGES.starsHub[lang])],
      [name, absolute(data.alternates[lang])],
    ]),
  ]}
/>

<article class="doc">
  <header>
    <ol class="crumbs">
      <li><a href={href('starsHub', lang)}>{p.starsHubH1}</a></li>
      <li aria-current="page">{name}</li>
    </ol>
    <h1 class="star-name">{name}</h1>
    {#if designation && designation !== name}<p class="designation">{designation}</p>{/if}
    <p class="lead">
      {t().isA(name, kind)}
      {#if s.ly > 0 && data.departed}{p.lightLeft(data.departed)}{:else if s.ly > 0}{p.lightLeftAncient(fmtNum(s.ly))}{:else}{p.unknownDistance}{/if}
    </p>
  </header>

  <section>
    <h2>{p.whereHeading}</h2>
    {#if where}<p>{where}</p>{/if}
    <p>{seeWith(s.mag)} {p.magnitude(fmtNum(s.mag, 2))}</p>
  </section>

  <section>
    <h2>{p.factsHeading}</h2>
    {#each factLines as line}<p>{line}</p>{/each}
    {#if data.birthYear}
      <p>
        {#if data.birthYear >= FIRST_YEAR}
          <a href={base + paths.born(lang, data.birthYear)}>{p.birthYearLink(data.birthYear)}</a>
        {:else}
          {p.birthYearLink(data.birthYear)}
        {/if}
      </p>
    {/if}
  </section>

  {#if data.sameCon.length}
    <section>
      <h2>{p.sameConstellation(lang === 'en' ? conPlain : conName)}</h2>
      <ul class="grid-links wide">
        {#each data.sameCon as o (o.slug)}
          <li><a href={base + paths.star(lang, o.slug)}>{properName(o.proper, lang)}</a></li>
        {/each}
      </ul>
    </section>
  {/if}

  <aside class="cta">
    <p>{p.bornCta}</p>
    <div class="actions">
      <a class="btn" href={href('home', lang)}>{p.findStar}</a>
      <a class="btn ghost" href={href('poster', lang)}>{p.makePoster}</a>
    </div>
  </aside>
</article>

<style>
  .star-name {
    font-style: italic;
  }
  .designation {
    font-family: var(--serif);
    font-size: 1.25rem;
    color: var(--muted);
  }
  .wide {
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  }
</style>
