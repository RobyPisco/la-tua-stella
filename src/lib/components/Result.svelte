<script lang="ts" module>
  export type Step = 'date' | 'star' | 'look' | 'more';
</script>

<script lang="ts">
  import type { Place } from '../astro';
  import { facts, instrument, starKind, visibility, type Sighting } from '../describe';
  import { fmtDate, fmtNum, locale, t } from '../i18n.svelte';
  import { arrivalDate, departureDate, starDesignation, starName, type Star } from '../stars';
  import { orientationSupported, requestOrientation } from '../orientation';
  import PlacePicker from './PlacePicker.svelte';
  import Pointer from './Pointer.svelte';

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
    step: Step;
    ongo: (step: Step) => void;
    onposter: () => void;
  }
  let { star, others, birth, place, sighting, onpickplace, onpickstar, onrestart, onshare, step, ongo, onposter }: Props = $props();

  let choosingPlace = $state(false);
  let pointing = $state(false);
  let pointError = $state('');
  const canPoint = typeof window !== 'undefined' && orientationSupported();

  async function startPointing() {
    // iOS only grants sensor access from inside the tap that asks for it.
    const ok = await requestOrientation();
    pointError = ok ? '' : t().pointDenied;
    pointing = ok;
  }
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

<article class="result" class:compact={step !== 'star'}>
  {#if !birth && step === 'star'}
    <p class="shared">{t().sharedIntro}</p>
  {/if}

  <header>
    <h1 class="name">{name}</h1>
    {#if designation}<p class="designation">{designation}</p>{/if}
  </header>

  {#if step === 'star'}
    <div class="story">
      {#each story as line}<p>{line}</p>{/each}
    </div>
    <div class="step-nav">
      <button class="btn" type="button" onclick={() => ongo('look')}>{t().nextLook}</button>
      <button class="link" type="button" onclick={onrestart}>{birth ? t().changeDate : t().findYours}</button>
    </div>
  {:else if step === 'look'}
    <section>
      <h2>{t().tonightTitle}</h2>
      {#if place && !choosingPlace}
        <p class="place">
          <span>{t().placeFrom(place.name)}</span>
          <button class="link" type="button" onclick={() => (choosingPlace = true)}>{t().changePlace}</button>
        </p>
        {#if sighting}
          {#each sighting.lines as line}<p>{line}</p>{/each}
        {/if}
        <p>{visibility(star.mag)}</p>
        {#if canPoint}
          <div class="point">
            <button class="btn" type="button" onclick={startPointing}>{t().pointButton}</button>
            {#if pointError}<p role="alert">{pointError}</p>{/if}
          </div>
        {/if}
      {:else}
        <p>{t().needPlace}</p>
        <PlacePicker onpick={pickPlace} />
      {/if}
    </section>
    <div class="step-nav">
      <button class="btn" class:ghost={canPoint && !!place} type="button" onclick={() => ongo('more')}>{t().nextMore}</button>
      <button class="link" type="button" onclick={() => ongo('star')}>{t().back}</button>
    </div>
  {:else}
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

    <div class="step-nav">
      {#if birth}
        <button class="btn" type="button" onclick={onposter}>{t().posterCta}</button>
        <button class="btn ghost" type="button" onclick={doShare} disabled={sharing}>{t().share}</button>
      {:else}
        <button class="btn" type="button" onclick={onrestart}>{t().findYours}</button>
      {/if}
      <button class="link" type="button" onclick={() => ongo('look')}>{t().back}</button>
    </div>
    {#if shareStatus}<p class="status" role="status">{shareStatus}</p>{/if}
    <p class="note">{t().precision}</p>
  {/if}
</article>

{#if pointing && place}
  <Pointer
    target={{ raH: star.raH, dec: star.dec, ci: star.ci, label: name }}
    {place}
    onclose={() => (pointing = false)}
  />
{/if}

<style>
  .result {
    display: grid;
    gap: 2.25rem;
    max-width: 34rem;
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
  .compact .name {
    font-size: clamp(2.2rem, 5vw, 3.4rem);
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
  .place {
    display: flex;
    flex-wrap: wrap;
    column-gap: 0.75rem;
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
  @media (max-width: 760px) {
    .name {
      font-size: clamp(2.6rem, 13vw, 3.5rem);
    }
    .story {
      font-size: 1.15rem;
    }
    .other {
      flex-direction: column;
      align-items: start;
      gap: 0.1rem;
    }
    .other-meta {
      text-align: left;
    }
    .point .btn,
    .step-nav .btn {
      width: 100%;
    }
    .step-nav {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
    }
  }
  .step-nav {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem 1.5rem;
    padding-top: 0.5rem;
  }
  .ghost {
    background: transparent;
    color: var(--ink);
    border: 1px solid var(--rule);
  }
  .status {
    color: var(--muted);
  }
  .note {
    color: var(--muted);
    font-size: 0.9rem;
  }
</style>
