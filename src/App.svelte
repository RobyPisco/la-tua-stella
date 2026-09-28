<script lang="ts">
  import { onMount } from 'svelte';
  import Sky from './components/Sky.svelte';
  import Result, { type Step } from './components/Result.svelte';
  import DateField from './components/DateField.svelte';
  import PosterEditor from './components/PosterEditor.svelte';
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
  let step = $state<Step>('date');
  let view = $state<'journey' | 'poster'>(new URL(location.href).searchParams.has('poster') ? 'poster' : 'journey');
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
        if (s) {
          star = s;
          step = 'star';
        }
      });
    }
    const onpop = () => (view = new URL(location.href).searchParams.has('poster') ? 'poster' : 'journey');
    addEventListener('popstate', onpop);
    // Keep the intro sky turning with the real sky.
    const timer = setInterval(() => { if (!star) now = new Date(); }, 60000);
    return () => {
      clearInterval(timer);
      removeEventListener('popstate', onpop);
    };
  });

  function openPoster() {
    transition(() => {
      view = 'poster';
      history.pushState(null, '', `${location.pathname}?poster`);
      scrollTo({ top: 0 });
    });
  }

  function closePoster() {
    transition(() => {
      view = 'journey';
      history.pushState(null, '', location.pathname);
      scrollTo({ top: 0 });
    });
  }

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
      step = 'star';
      history.replaceState(null, '', location.pathname);
      scrollTo({ top: 0 });
    });
  }

  function restart() {
    transition(() => {
      star = null;
      birth = null;
      others = [];
      step = 'date';
      history.replaceState(null, '', location.pathname);
    });
  }

  function go(s: Step) {
    transition(() => {
      step = s;
      scrollTo({ top: 0 });
    });
  }

  function jump(s: Step) {
    if (s === 'date') restart();
    else if (star) go(s);
  }

  const stepNames = $derived([
    ['date', star && !birth ? t().findYours : t().stepDate],
    ['star', t().stepStar],
    ['look', t().tonightTitle],
    ['more', t().aboutTitle],
  ] as [Step, string][]);

  function pickPlace(p: Place) {
    place = p;
    savePlace(p);
  }

  function pickStar(s: Star) {
    transition(() => {
      if (star) others = [star, ...others.filter((o) => o.id !== s.id)].sort((a, b) => a.mag - b.mag);
      star = s;
      step = 'star';
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

<div class="page step-{step}" class:has-result={!!star && view === 'journey'}>
  <nav class="lang" aria-label="Language">
    <button type="button" class="link" aria-pressed={locale.lang === 'it'} onclick={() => setLang('it')}>Italiano</button>
    <button type="button" class="link" aria-pressed={locale.lang === 'en'} onclick={() => setLang('en')}>English</button>
  </nav>

  {#if view === 'poster'}
    <main class="poster-view">
      <PosterEditor {birth} {place} hasStar={!!star} onplace={pickPlace} onback={closePoster} />
    </main>
  {:else}
  <main class="layout">
      <div class="text">
        <nav class="steps" aria-label={t().stepsLabel}>
          <ol>
            {#each stepNames as [id, label], i}
              <li>
                <button
                  type="button"
                  aria-current={step === id ? 'step' : undefined}
                  disabled={id !== 'date' && !star}
                  onclick={() => jump(id)}
                >
                  <span class="num">{i + 1}</span>
                  <span class="label">{label}</span>
                </button>
              </li>
            {/each}
          </ol>
        </nav>
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
            {step}
            ongo={go}
            onposter={openPoster}
          />
        {:else}
          <div class="intro">
            <h1>{t().title}</h1>
            <p class="lead">{t().lead}</p>
            <form class="finder" onsubmit={find} novalidate>
              <DateField bind:value={birthInput} invalid={!!error} describedby={error ? 'birth-error' : undefined} />
              {#if error}<p id="birth-error" class="error" role="alert">{error}</p>{/if}
              <button class="btn" type="submit" disabled={busy}>{busy ? t().loading : t().find}</button>
            </form>
            <p class="privacy">{t().privacy}</p>
          <button class="link other-date" type="button" onclick={openPoster}>{t().posterOther}</button>
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
  
  {/if}

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
    display: grid;
    gap: 2.5rem;
    align-content: start;
  }
  .steps ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1.25rem;
  }
  .steps button {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 2.75rem;
    color: var(--muted);
    font-size: 0.95rem;
    cursor: pointer;
  }
  .steps button:disabled {
    opacity: 0.45;
    cursor: default;
  }
  .steps button:focus-visible {
    outline: 2px solid var(--star);
    outline-offset: 2px;
  }
  .steps .num {
    display: grid;
    place-items: center;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    border: 1px solid var(--rule);
    font-size: 0.85rem;
    font-weight: 700;
  }
  .steps [aria-current='step'] {
    color: var(--ink);
  }
  .steps [aria-current='step'] .num {
    background: var(--star);
    border-color: var(--star);
    color: var(--night);
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
    gap: 1rem;
    justify-items: start;
  }
  .finder :global(.date) {
    width: 100%;
    max-width: 26rem;
  }
  .error {
    color: #ffb4a8;
  }
  .other-date {
    justify-self: start;
  }
  .poster-view {
    width: 100%;
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
    .page {
      padding-inline: 1rem;
    }
    .lang .link {
      padding: 0.5rem 0.25rem;
    }
    .layout {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .intro h1 {
      font-size: clamp(2.5rem, 12vw, 3.25rem);
    }
    .lead {
      font-size: 1.125rem;
    }
    .finder .btn {
      width: 100%;
    }
    .sky-col {
      max-width: 30rem;
      width: 100%;
      margin: 0 auto;
    }
    .steps ol {
      gap: 0.5rem;
    }
    .steps .label {
      display: none;
    }
    .steps [aria-current='step'] .label {
      display: inline;
    }
    /* One thing per screen: the sky only where it helps. */
    .step-date .sky-col,
    .step-more .sky-col {
      display: none;
    }
    /* On phones a result step reads top to bottom: steps, the star's name, the sky showing it,
       then the step's content. Flatten the two columns into one sequence to interleave them. */
    .has-result .layout {
      gap: 0;
    }
    .has-result .text,
    .has-result .text :global(.result) {
      display: contents;
    }
    .has-result .steps {
      order: 0;
      margin-bottom: 1rem;
    }
    .has-result .text :global(.result > *) {
      order: 3;
      margin-bottom: 1.75rem;
    }
    .has-result .text :global(.result > .shared),
    .has-result .text :global(.result > header) {
      order: 1;
      margin-bottom: 1rem;
    }
    .has-result .sky-col {
      position: static;
      order: 2;
      margin-bottom: 1.5rem;
    }
  }
</style>
