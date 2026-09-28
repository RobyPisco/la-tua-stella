<script lang="ts">
  import { onMount } from 'svelte';
  import Sky from './components/Sky.svelte';
  import Result from './components/Result.svelte';
  import { nextDark, type Place } from './lib/astro';
  import { starCss } from './lib/color';
  import { sighting as computeSighting, type Sighting } from './lib/describe';
  import { guessPlace, savePlace, savedPlace } from './lib/geo';
  import { fmtTime, locale, setLang, t } from './lib/i18n.svelte';
  import { renderCard, share, shareUrl } from './lib/share';
  import { findStars, loadCatalog, starById, starName, type Star } from './lib/stars';

  let birthInput = $state(loadBirth());
  let birth = $state<Date | null>(null);
  let star = $state<Star | null>(null);
  let others = $state<Star[]>([]);
  let place = $state<Place | null>(savedPlace());
  let error = $state('');
  let busy = $state(false);
  let now = $state(new Date());

  const skyPlace = $derived(place ?? guessPlace());
  const introDate = $derived(nextDark(skyPlace, now));
  const sighting: Sighting | null = $derived(star && place ? computeSighting(star, place, now) : null);
  const target = $derived(star ? { raH: star.raH, dec: star.dec, ci: star.ci, label: starName(star, locale.lang) } : undefined);

  $effect(() => {
    document.documentElement.style.setProperty('--star', star ? starCss(star.ci, 0.85) : '#f6e2b4');
    document.title = star ? `${starName(star, locale.lang)} · ${t().title}` : t().title;
  });

  onMount(() => {
    const id = Number(new URL(location.href).searchParams.get('s'));
    if (id) {
      loadCatalog().then((stars) => {
        const s = starById(stars, id);
        if (s) star = s;
      });
    }
    // Keep the intro sky turning with the real sky.
    const timer = setInterval(() => { if (!star) now = new Date(); }, 60000);
    return () => clearInterval(timer);
  });

  function loadBirth(): string {
    try { return localStorage.getItem('birth') ?? ''; } catch { return ''; }
  }

  function transition(update: () => void) {
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(update);
    } else update();
  }

  async function find(e: SubmitEvent) {
    e.preventDefault();
    const d = new Date(`${birthInput}T12:00:00`);
    if (!birthInput || isNaN(d.getTime()) || d > new Date() || d.getFullYear() < 1900) {
      error = t().invalidDate;
      return;
    }
    error = '';
    busy = true;
    try { localStorage.setItem('birth', birthInput); } catch {}
    const stars = await loadCatalog();
    busy = false;
    const found = findStars(stars, d);
    transition(() => {
      now = new Date();
      birth = d;
      star = found.best;
      others = found.others;
      history.replaceState(null, '', location.pathname);
      scrollTo({ top: 0 });
    });
  }

  function restart() {
    transition(() => {
      star = null;
      birth = null;
      others = [];
      history.replaceState(null, '', location.pathname);
    });
  }

  function pickPlace(p: Place) {
    place = p;
    savePlace(p);
  }

  function pickStar(s: Star) {
    transition(() => {
      if (star) others = [star, ...others.filter((o) => o.id !== s.id)].sort((a, b) => a.mag - b.mag);
      star = s;
      scrollTo({ top: 0 });
    });
  }

  async function doShare(): Promise<string> {
    if (!star) return '';
    const name = starName(star, locale.lang);
    const url = shareUrl(star.id);
    let card: Blob | undefined;
    try {
      card = await renderCard({
        name,
        line: t().shareCardLine,
        sub: url.replace(/^https?:\/\//, '').replace(/\?.*$/, ''),
        target: target!,
        date: sighting?.when ?? now,
        place: skyPlace,
        facing: sighting?.facing ?? 180,
        cardinals: t().cardinals,
      });
    } catch {}
    const outcome = await share(t().shareText(name), url, card);
    return outcome === 'copied' ? t().shared : '';
  }
</script>

<div class="page" class:has-result={!!star}>
  <nav class="lang" aria-label="Language">
    <button type="button" class="link" aria-pressed={locale.lang === 'it'} onclick={() => setLang('it')}>Italiano</button>
    <button type="button" class="link" aria-pressed={locale.lang === 'en'} onclick={() => setLang('en')}>English</button>
  </nav>

  <main class="layout">
    <div class="text">
      {#if star}
        <Result
          {star}
          {others}
          {birth}
          {place}
          {sighting}
          onpickplace={pickPlace}
          onpickstar={pickStar}
          onrestart={restart}
          onshare={doShare}
        />
      {:else}
        <div class="intro">
          <h1>{t().title}</h1>
          <p class="lead">{t().lead}</p>
          <form class="finder" onsubmit={find} novalidate>
            <label for="birth">{t().birthLabel}</label>
            <div class="row">
              <input
                id="birth"
                class="field"
                type="date"
                min="1900-01-01"
                max={new Date().toISOString().slice(0, 10)}
                required
                bind:value={birthInput}
                aria-invalid={!!error}
                aria-describedby={error ? 'birth-error' : undefined}
              />
              <button class="btn" type="submit" disabled={busy}>{busy ? t().loading : t().find}</button>
            </div>
            {#if error}<p id="birth-error" class="error">{error}</p>{/if}
          </form>
          <p class="privacy">{t().privacy}</p>
        </div>
      {/if}
    </div>

    <div class="sky-col">
      <Sky
        date={sighting?.when ?? introDate}
        place={skyPlace}
        facing={sighting?.facing ?? 180}
        {target}
        caption={sighting?.best
          ? t().skyAt(fmtTime(sighting.when, place?.timeZone))
          : introDate === now ? t().skyNow : t().skyTonight}
      />
    </div>
  </main>

  <footer>
    <p>{t().credits}</p>
  </footer>
</div>

<style>
  .page {
    min-height: 100dvh;
    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: 1rem clamp(1rem, 4vw, 3rem) 2rem;
    gap: 1rem;
  }
  .lang {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    font-size: 0.95rem;
  }
  .lang [aria-pressed='true'] {
    color: var(--ink);
    text-decoration: none;
  }
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    gap: clamp(2rem, 5vw, 5rem);
    align-items: center;
    max-width: 78rem;
    width: 100%;
    margin: 0 auto;
  }
  .has-result .layout {
    align-items: start;
  }
  .has-result .sky-col {
    position: sticky;
    top: 1.5rem;
  }
  .text {
    view-transition-name: text;
  }
  .intro {
    display: grid;
    gap: 1.75rem;
    max-width: 32rem;
  }
  .intro h1 {
    font-size: clamp(2.8rem, 6.5vw, 5rem);
    letter-spacing: -0.015em;
  }
  .lead {
    font-size: 1.25rem;
    color: var(--ink);
    max-width: 30em;
  }
  .finder {
    display: grid;
    gap: 0.4rem;
  }
  .finder label {
    color: var(--muted);
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }
  .row input {
    flex: 1 1 11rem;
    color-scheme: dark;
  }
  .error {
    color: #ffb4a8;
  }
  .privacy {
    color: var(--muted);
    font-size: 0.95rem;
  }
  footer {
    max-width: 78rem;
    width: 100%;
    margin: 2rem auto 0;
    color: var(--muted);
    font-size: 0.85rem;
  }
  @media (max-width: 760px) {
    .layout {
      grid-template-columns: 1fr;
    }
    .has-result .sky-col {
      position: static;
      order: -1;
    }
    .sky-col {
      max-width: 30rem;
      width: 100%;
      margin: 0 auto;
    }
  }
</style>
