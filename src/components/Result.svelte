<script lang="ts">
  import type { Place } from '../lib/astro';
  import { facts, instrument, starKind, visibility, type Sighting } from '../lib/describe';
  import { fmtDate, fmtNum, locale, t } from '../lib/i18n.svelte';
  import { arrivalDate, departureDate, starDesignation, starName, type Star } from '../lib/stars';
  import PlacePicker from './PlacePicker.svelte';

  interface Props {
    star: Star;
    others: Star[];
    birth: Date | null;
    place: Place | null;
    sighting: Sighting | null;
    onpickplace: (p: Place) => void;
    onpickstar: (s: Star) => void;
    onrestart: () => void;
    onshare: () => Promise<string>;
  }
  let { star, others, birth, place, sighting, onpickplace, onpickstar, onrestart, onshare }: Props = $props();

  let choosingPlace = $state(false);
  let shareStatus = $state('');
  let sharing = $state(false);

  const name = $derived(starName(star, locale.lang));
  const designation = $derived(star.proper ? starDesignation(star) : '');

  const story = $derived.by(() => {
    const tt = t();
    const lines = [tt.travel(fmtNum(star.ly, 1))];
    if (birth) {
      const arrival = arrivalDate(star, birth);
      const days = (arrival.getTime() - Date.now()) / 86400000;
      if (Math.abs(days) <= 30) lines.push(tt.arrivingNow);
      else if (days < 0) lines.push(tt.arrivedPast(fmtDate(arrival)));
      else lines.push(tt.arrivingFuture(fmtDate(arrival)));
    } else {
      lines.push(tt.departedShared(fmtDate(departureDate(star))));
    }
    return lines;
  });

  async function doShare() {
    sharing = true;
    try {
      shareStatus = await onshare();
    } finally {
      sharing = false;
    }
  }

  function pickPlace(p: Place) {
    choosingPlace = false;
    onpickplace(p);
  }
</script>

<article class="result">
  {#if birth}
    <button class="link back" type="button" onclick={onrestart}>{t().changeDate}</button>
  {:else}
    <p class="shared">{t().sharedIntro} <button class="link" type="button" onclick={onrestart}>{t().findYours}</button></p>
  {/if}

  <header>
    <h1 class="name">{name}</h1>
    {#if designation}<p class="designation">{designation}</p>{/if}
  </header>

  <div class="story">
    {#each story as line}<p>{line}</p>{/each}
  </div>

  <section>
    <h2>{t().tonightTitle}</h2>
    {#if place && !choosingPlace}
      <p class="place">
        {t().placeFrom(place.name)}
        <button class="link" type="button" onclick={() => (choosingPlace = true)}>{t().changePlace}</button>
      </p>
      {#if sighting}
        {#each sighting.lines as line}<p>{line}</p>{/each}
      {/if}
      <p>{visibility(star.mag)}</p>
    {:else}
      <p>{t().needPlace}</p>
      <PlacePicker onpick={pickPlace} />
    {/if}
  </section>

  <section>
    <h2>{t().aboutTitle}</h2>
    <p>{t().isA(name, starKind(star))}</p>
    {#each facts(star) as line}<p>{line}</p>{/each}
  </section>

  {#if others.length}
    <section>
      <h2>{t().othersTitle}</h2>
      <ul class="others">
        {#each others as o (o.id)}
          <li>
            <button type="button" class="other" onclick={() => onpickstar(o)}>
              <span class="other-name">{starName(o, locale.lang)}</span>
              <span class="other-meta">{t().lightYears(fmtNum(o.ly, 1))}, {instrument(o.mag)}</span>
            </button>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if birth}
    <div class="share">
      <button class="btn" type="button" onclick={doShare} disabled={sharing}>{t().share}</button>
      {#if shareStatus}<p role="status">{shareStatus}</p>{/if}
    </div>
  {/if}

  <p class="note">{t().precision}</p>
</article>

<style>
  .result {
    display: grid;
    gap: 2.25rem;
    max-width: 34rem;
  }
  .back {
    justify-self: start;
  }
  .shared {
    color: var(--muted);
  }
  header {
    display: grid;
    gap: 0.4rem;
  }
  .name {
    font-style: italic;
    font-size: clamp(3rem, 8vw, 5.5rem);
    color: var(--star);
    letter-spacing: -0.01em;
    view-transition-name: star-name;
  }
  .designation {
    color: var(--muted);
    font-family: var(--serif);
    font-size: 1.25rem;
  }
  .story {
    display: grid;
    gap: 0.75rem;
    font-size: 1.3rem;
    line-height: 1.5;
  }
  section {
    display: grid;
    gap: 0.75rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--rule);
  }
  h2 {
    font-size: 1.6rem;
  }
  .place {
    color: var(--muted);
  }
  .place .link {
    margin-left: 0.5rem;
  }
  .others {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
  }
  .other {
    all: unset;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    width: 100%;
    padding: 0.7rem 0;
    border-bottom: 1px solid var(--rule);
    cursor: pointer;
  }
  .other:hover .other-name {
    color: var(--star);
  }
  .other:focus-visible {
    outline: 2px solid var(--star);
  }
  .other-name {
    font-family: var(--serif);
    font-size: 1.2rem;
  }
  .other-meta {
    color: var(--muted);
    font-size: 0.95rem;
    text-align: right;
  }
  .share {
    display: grid;
    gap: 0.5rem;
    justify-items: start;
  }
  .share p {
    color: var(--muted);
  }
  .note {
    color: var(--muted);
    font-size: 0.9rem;
  }
</style>
