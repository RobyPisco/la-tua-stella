<script lang="ts">
  import { base } from '$app/paths';
  import type { Lang } from '$lib/i18n.svelte';
  import type { PhaseKey } from '$lib/moon';
  import { monthName, PT } from '$lib/pageText';
  import { absolute, href, PAGES, paths } from '$lib/routes';
  import { breadcrumbs } from '$lib/structured';
  import Seo from '../Seo.svelte';
  import MoonIcon from './MoonIcon.svelte';

  interface Data {
    lang: Lang;
    year: number;
    month: number;
    firstWeekday: number;
    days: { day: number; angle: number; lit: number; phase: PhaseKey; event: { phase: PhaseKey; time: string } | null }[];
    events: { phase: PhaseKey; time: string }[];
    prev: { y: number; m: number } | null;
    next: { y: number; m: number } | null;
    alternates: Record<Lang, string>;
  }
  let { data }: { data: Data } = $props();

  const lang = $derived(data.lang);
  const p = $derived(PT[lang]);
  const tz = $derived(p.moonTz);
  const mName = $derived(monthName(lang, data.month));
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(lang, { day: 'numeric', month: 'long', timeZone: tz });
  const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: tz });
  const when = (iso: string) => p.at(fmtDate(iso), fmtTime(iso)) + (tz === 'UTC' ? ' UTC' : '');

  const firstFull = $derived(data.events.find((e) => e.phase === 'full'));
  const firstNew = $derived(data.events.find((e) => e.phase === 'new'));
  const title = $derived(p.moonMonthTitle(mName, data.year));
  const description = $derived(
    p.moonMonthDescription(mName, data.year, firstFull ? when(firstFull.time) : '', firstNew ? when(firstNew.time) : ''),
  );
  const summary = $derived(
    data.events
      .filter((e) => e.phase === 'full' || e.phase === 'new')
      .map((e) => `${p.phase[e.phase]}: ${when(e.time)}`)
      .join('. ') + '.',
  );
  const monthLabel = (y: number, m: number) => `${monthName(lang, m)} ${y}`;
</script>

<Seo
  {title}
  {description}
  {lang}
  alternates={data.alternates}
  image={`/og/moon/${data.year}-${String(data.month).padStart(2, '0')}.png`}
  jsonLd={[
    breadcrumbs([
      ['Sky of Your Day', absolute(PAGES.home[lang])],
      [p.moonHubH1, absolute(PAGES.moonHub[lang])],
      [String(data.year), absolute(paths.moonYear(lang, data.year))],
      [mName, absolute(paths.moonMonth(lang, data.year, data.month))],
    ]),
  ]}
/>

<article class="doc moon-month">
  <header>
    <ol class="crumbs">
      <li><a href={href('moonHub', lang)}>{p.moonHubH1.replace(/\?$/, '')}</a></li>
      <li><a href={base + paths.moonYear(lang, data.year)}>{data.year}</a></li>
      <li aria-current="page">{mName}</li>
    </ol>
    <h1>{p.moonMonthH1(mName, data.year)}</h1>
    <p class="lead">{summary}</p>
  </header>

  <section aria-labelledby="calendar">
    <h2 id="calendar" class="sr-only">{p.moonMonthH1(mName, data.year)}</h2>
    <ol class="calendar" style:--offset={data.firstWeekday}>
      {#each p.weekdays as wd}<li class="wd" aria-hidden="true">{wd}</li>{/each}
      {#each data.days as d (d.day)}
        <li id="d{d.day}" class="day" class:event={!!d.event} style:grid-column-start={d.day === 1 ? data.firstWeekday + 1 : undefined}>
          <span class="num">{d.day}</span>
          <MoonIcon lit={d.lit} angle={d.angle} size={34} />
          <span class="phase">{p.phase[d.phase]}</span>
          <span class="lit">{p.litShare(Math.round(d.lit * 100))}</span>
        </li>
      {/each}
    </ol>
    <p class="note">{p.timeZoneNote}</p>
  </section>

  <section>
    <h2>{p.keyMoments}</h2>
    <ul class="events">
      {#each data.events as e}
        <li>
          <MoonIcon lit={e.phase === 'new' ? 0 : e.phase === 'full' ? 1 : 0.5} angle={e.phase === 'lastQuarter' ? 270 : 90} size={26} />
          <span><strong>{p.phase[e.phase]}</strong> {when(e.time)}</span>
        </li>
      {/each}
    </ul>
  </section>

  <aside class="cta">
    <h2>{p.bornThisMonth}</h2>
    <p>{p.bornCta}</p>
    <p>{p.posterCta}</p>
    <div class="actions">
      <a class="btn" href={href('home', lang)}>{p.findStar}</a>
      <a class="btn ghost" href={href('poster', lang)}>{p.makePoster}</a>
    </div>
  </aside>

  <nav class="pager" aria-label={p.allYears}>
    {#if data.prev}<a href={base + paths.moonMonth(lang, data.prev.y, data.prev.m)} rel="prev">← {monthLabel(data.prev.y, data.prev.m)}</a>{:else}<span></span>{/if}
    <a href={base + paths.moonYear(lang, data.year)}>{data.year}</a>
    {#if data.next}<a href={base + paths.moonMonth(lang, data.next.y, data.next.m)} rel="next">{monthLabel(data.next.y, data.next.m)} →</a>{:else}<span></span>{/if}
  </nav>
</article>

<style>
  .calendar {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 0.4rem;
  }
  .wd {
    color: var(--muted);
    font-size: 0.85rem;
    padding: 0 0.25rem;
  }
  .day {
    display: grid;
    justify-items: start;
    gap: 0.3rem;
    padding: 0.6rem;
    border: 1px solid var(--rule);
    border-radius: 10px;
    min-height: 7.5rem;
    scroll-margin-top: 2rem;
  }
  .day.event {
    border-color: rgb(244 239 226 / 0.45);
  }
  .day:target {
    outline: 2px solid var(--star);
    outline-offset: 1px;
  }
  .num {
    font-family: var(--serif);
    font-size: 1.3rem;
    line-height: 1;
  }
  .phase {
    font-size: 0.85rem;
    line-height: 1.25;
  }
  .event .phase {
    font-weight: 700;
  }
  .lit {
    font-size: 0.78rem;
    color: var(--muted);
  }
  .events {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.75rem;
  }
  .events li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  @media (max-width: 720px) {
    .calendar {
      grid-template-columns: 1fr;
    }
    .wd {
      display: none;
    }
    .day {
      grid-column-start: auto !important;
      grid-template-columns: 2.2rem auto 1fr;
      align-items: center;
      min-height: 0;
      column-gap: 0.75rem;
    }
    .phase {
      font-size: 0.95rem;
    }
    .lit {
      grid-column: 3;
    }
  }
</style>
