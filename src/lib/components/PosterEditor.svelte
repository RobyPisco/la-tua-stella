<script lang="ts">
  import { onMount } from 'svelte';
  import { sunAltitude, type Place } from '../astro';
  import { KOFI_URL, SITE } from '../brand';
  import { guessPlace, savePlace, savedPlace } from '../geo';
  import { href } from '../routes';
  import { countMap, mapsCount } from '../counter';
  import { facts, starKind } from '../describe';
  import { fmtDate, fmtNum, fmtTime, locale, t } from '../i18n.svelte';
  import {
    buildPoster, FORMATS, loadPosterData, renderMilkyWay, THEMES,
    type PosterOptions, type PosterSpec,
  } from '../poster';
  import { download, renderPdf, renderPng, standaloneSvg } from '../posterExport';
  import { arrivalDate, findStars, loadCatalog, starName, type Star } from '../stars';
  import { zonedToUtc } from '../timezone';
  import DateField from './DateField.svelte';
  import PlacePicker from './PlacePicker.svelte';

  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  let dateValue = $state(iso(new Date()));
  let time = $state('22:00');
  let where = $state<Place>(guessPlace());
  let choosingPlace = $state(true);
  let title = $state(t().posterTitleDefault);
  let subtitle = $state('');
  let themeId = $state('night');
  let formatId = $state('a3');
  let options = $state<PosterOptions>({
    detail: 'balanced',
    lines: true, names: true, milkyWay: true, moonPlanets: true, grid: false, highlight: true, frame: false,
  });

  let svg = $state('');
  let status = $state('');
  let busy = $state(false);
  let downloaded = $state(false);
  let mapsMade = $state<number | null>(null);
  // One count per map: downloading the same map again, or in another file type, is not a new map.
  const counted = new Set<string>();
  let stars: Star[] = [];
  let catalogReady = $state(false);

  const theme = $derived(THEMES.find((x) => x.id === themeId)!);
  const format = $derived(FORMATS.find((x) => x.id === formatId)!);

  // The moment, as an instant: local wall-clock time at the chosen place.
  const instant = $derived.by(() => {
    if (!dateValue) return null;
    const [y, m, d] = dateValue.split('-').map(Number);
    const [hh, mm] = (time || '22:00').split(':').map(Number);
    return zonedToUtc(y, m, d, hh, mm, where.timeZone, where.lon);
  });

  const daylight = $derived(instant ? sunAltitude(instant, where) > -6 : false);

  const star = $derived.by(() => {
    if (!instant || !catalogReady) return null;
    return findStars(stars, instant).best;
  });

  function placeLine(p: Place): string {
    const coords = `${Math.abs(p.lat).toFixed(2)}° ${p.lat >= 0 ? 'N' : 'S'}  ${Math.abs(p.lon).toFixed(2)}° ${p.lon >= 0 ? 'E' : 'W'}`;
    if (!p.name || p.name === t().myPosition) return coords;
    const parts = p.name.split(', ');
    const short = parts.length > 2 ? `${parts[0]}, ${parts[parts.length - 1]}` : p.name;
    return `${short}   ${coords}`;
  }

  function starLine(s: Star, from: Date): string {
    const name = starName(s, locale.lang);
    const arrival = arrivalDate(s, from);
    const years = (arrival.getTime() - Date.now()) / (365.25 * 86400000);
    if (Math.abs(years) < 1) return t().posterStarNow(name);
    return years > 0 ? t().posterStarFuture(name, arrival.getFullYear()) : t().posterStarPast(name, arrival.getFullYear());
  }

  const spec: PosterSpec | null = $derived.by(() => {
    if (!instant) return null;
    const s = star;
    return {
      date: instant,
      place: where,
      lang: locale.lang,
      theme,
      format,
      options: { ...options },
      title,
      subtitle,
      dateLine: `${fmtDate(instant, where.timeZone)}, ${fmtTime(instant, where.timeZone)}`,
      placeLine: placeLine(where),
      starLine: s ? starLine(s, instant) : '',
      credit: SITE,
      target: s ? { raH: s.raH, dec: s.dec, ci: s.ci, label: starName(s, locale.lang) } : undefined,
      planetNames: t().planetNames,
      moonName: t().moon,
    };
  });

  // Text measuring with the page's own (already loaded) fonts.
  let measureCtx: CanvasRenderingContext2D | undefined;
  const measure = (text: string, font: string) => {
    measureCtx ??= document.createElement('canvas').getContext('2d')!;
    measureCtx.font = font;
    return measureCtx.measureText(text).width;
  };

  let mwCache = { key: '', url: '' };
  let timer: ReturnType<typeof setTimeout> | undefined;

  $effect(() => {
    const sp = spec;
    if (!sp) return;
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const d = await loadPosterData();
      const key = `${sp.date.getTime()}|${sp.place.lat}|${sp.place.lon}|${sp.theme.id}`;
      if (sp.options.milkyWay && mwCache.key !== key) mwCache = { key, url: renderMilkyWay(sp, d.milkyWay) };
      svg = buildPoster(sp, d, sp.options.milkyWay ? mwCache.url : null, measure);
    }, 120);
  });

  // Changing language opens another page: keep the choices for the session so nothing is lost.
  // The title is kept only if edited, otherwise it follows the language.
  const STATE_KEY = 'poster-editor';
  let restored = false;
  $effect(() => {
    const s = {
      dateValue, time, subtitle, themeId, formatId, options: { ...options },
      title: title === t().posterTitleDefault ? null : title,
    };
    if (!restored) return;
    try { sessionStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch {}
  });

  function restore() {
    try {
      const s = JSON.parse(sessionStorage.getItem(STATE_KEY) ?? 'null');
      if (!s) return;
      if (typeof s.dateValue === 'string') dateValue = s.dateValue;
      if (typeof s.time === 'string') time = s.time;
      if (typeof s.subtitle === 'string') subtitle = s.subtitle;
      if (typeof s.title === 'string') title = s.title;
      if (THEMES.some((x) => x.id === s.themeId)) themeId = s.themeId;
      if (FORMATS.some((x) => x.id === s.formatId)) formatId = s.formatId;
      if (s.options) options = { ...options, ...s.options };
    } catch {}
  }

  onMount(() => {
    mapsCount().then((n) => (mapsMade = n));
    restore();
    restored = true;
    // Arriving from "your star": start from that birth date and the place already chosen.
    try {
      const prefill = sessionStorage.getItem('poster-date');
      if (prefill) {
        dateValue = prefill;
        sessionStorage.removeItem('poster-date');
      }
    } catch {}
    const saved = savedPlace();
    if (saved) {
      where = saved;
      choosingPlace = false;
    }
    loadCatalog().then((s) => {
      stars = s;
      catalogReady = true;
    });
    Promise.all([
      document.fonts.load(`400 40px 'Bodoni Moda Variable'`),
      document.fonts.load(`italic 400 40px 'Bodoni Moda Variable'`),
      document.fonts.load(`500 20px 'Atkinson Hyperlegible Next Variable'`),
    ]).then(() => (svg = svg)); // re-measure once fonts are in
    return () => clearTimeout(timer);
  });

  function pickPlace(p: Place) {
    where = p;
    choosingPlace = false;
    savePlace(p);
  }

  function fileName(ext: string) {
    const slug = (title || 'sky').toLowerCase().normalize('NFD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
    return `${slug || 'sky'}-${dateValue}-${formatId}.${ext}`;
  }

  async function save(kind: 'png' | 'pdf' | 'svg') {
    if (!svg) return;
    busy = true;
    status = t().posterPreparing;
    try {
      if (kind === 'svg') {
        download(new Blob([await standaloneSvg(svg)], { type: 'image/svg+xml' }), fileName('svg'));
      } else {
        if (kind === 'png') download(await renderPng(svg, format), fileName('png'));
        else download(await renderPdf(svg, format), fileName('pdf'));
      }
      status = t().posterDone;
      downloaded = true;
      const key = JSON.stringify([dateValue, time, where.lat, where.lon, title, subtitle, themeId, options]);
      if (!counted.has(key)) {
        counted.add(key);
        countMap().then((n) => n !== null && (mapsMade = n));
      }
    } catch (e) {
      console.error(e);
      status = t().posterFailed;
    } finally {
      busy = false;
    }
  }

  // Poster and star facts stay in view while the controls scroll. When together they are taller
  // than the window, the column first scrolls until its bottom shows, then stays put.
  let stage: HTMLDivElement | undefined = $state();
  let stickTop = $state(24);
  $effect(() => {
    if (!stage) return;
    const el = stage;
    const fit = () => (stickTop = Math.min(24, window.innerHeight - el.offsetHeight - 24));
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener('resize', fit);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  });

  const optionKeys = ['milkyWay', 'lines', 'names', 'moonPlanets', 'highlight', 'grid', 'frame'] as const;
</script>

<section class="editor">
  <header class="head">
    <a class="link" href={href('home', locale.lang)}>{t().posterHome}</a>
    <h1>{t().posterHeading}</h1>
    <p class="intro">{t().posterIntro}</p>
  </header>

  <div class="stage" bind:this={stage} style:--stick-top="{stickTop}px">
    <div class="preview" role="img" aria-label={t().posterPreviewLabel}>
      <div class="paper" style:aspect-ratio="1 / {format.ratio}" style:--ratio={format.ratio}>
        {@html svg}
      </div>
    </div>

    {#if star}
      <section class="about" aria-live="polite">
        <h2>{starName(star, locale.lang)}</h2>
        <h3>{t().aboutTitle}</h3>
        <p>{t().isA(starName(star, locale.lang), starKind(star))}</p>
        {#each facts(star) as line}<p>{line}</p>{/each}
      </section>
    {/if}
  </div>

  <form class="controls" onsubmit={(e) => e.preventDefault()}>
    <fieldset>
      <legend>{t().posterMoment}</legend>
      <DateField bind:value={dateValue} legend={t().posterDateLegend} />
      <label class="time">
        <span>{t().posterTime}</span>
        <input class="field" type="time" bind:value={time} />
      </label>
      <p class="hint">{t().posterTimeHint}</p>
      {#if daylight}<p class="hint">{t().posterDaylight}</p>{/if}
    </fieldset>

    <fieldset>
      <legend>{t().posterPlace}</legend>
      {#if choosingPlace}
        <PlacePicker onpick={pickPlace} />
      {:else}
        <p class="place">
          <span>{where.name || placeLine(where)}</span>
          <button class="link" type="button" onclick={() => (choosingPlace = true)}>{t().changePlace}</button>
        </p>
      {/if}
    </fieldset>

    <fieldset>
      <legend>{t().posterWords}</legend>
      <label>
        <span>{t().posterTitleLabel}</span>
        <input class="field" type="text" maxlength="60" bind:value={title} />
      </label>
      <label>
        <span>{t().posterSubtitleLabel}</span>
        <input class="field" type="text" maxlength="90" placeholder={t().posterSubtitlePlaceholder} bind:value={subtitle} />
      </label>
    </fieldset>

    <fieldset>
      <legend>{t().posterStyle}</legend>
      <div class="themes">
        {#each THEMES as th (th.id)}
          <label class="theme" class:on={themeId === th.id}>
            <input type="radio" name="theme" value={th.id} bind:group={themeId} />
            <span class="swatch" style:background={th.bg}>
              <span style:background={th.disk[0]} style:border-color={th.diskStroke}></span>
            </span>
            <span>{t().themes[th.id]}</span>
          </label>
        {/each}
      </div>
      <label>
        <span>{t().posterFormat}</span>
        <select class="field" bind:value={formatId}>
          {#each FORMATS as f (f.id)}
            <option value={f.id}>{t().formats[f.id]}</option>
          {/each}
        </select>
      </label>
    </fieldset>

    <fieldset>
      <legend>{t().posterDetails}</legend>
      <div class="levels" role="radiogroup" aria-label={t().detailLabel}>
        <span class="levels-label">{t().detailLabel}</span>
        <div class="segmented">
          {#each ['essential', 'balanced', 'rich'] as const as level}
            <label class:on={options.detail === level}>
              <input type="radio" name="detail" value={level} bind:group={options.detail} />
              <span>{t().detailLevels[level]}</span>
            </label>
          {/each}
        </div>
      </div>
      <div class="checks">
        {#each optionKeys as key}
          <label class="check">
            <input type="checkbox" bind:checked={options[key]} />
            <span>{t().options[key]}</span>
          </label>
        {/each}
      </div>
    </fieldset>

    <fieldset>
      <legend>{t().posterDownload}</legend>
      <div class="downloads">
        <button class="btn" type="button" disabled={busy || !svg} onclick={() => save(format.print ? 'pdf' : 'png')}>
          {format.print ? t().dlPdf : t().dlPng}
        </button>
        <button class="btn ghost" type="button" disabled={busy || !svg} onclick={() => save(format.print ? 'png' : 'pdf')}>
          {format.print ? t().dlPng : t().dlPdf}
        </button>
        <button class="btn ghost" type="button" disabled={busy || !svg} onclick={() => save('svg')}>{t().dlSvg}</button>
      </div>
      {#if status}<p class="status" role="status">{status}</p>{/if}
      {#if mapsMade}<p class="count">{t().mapsMade(mapsMade, fmtNum(mapsMade))}</p>{/if}
      {#if format.print}<p class="hint">{t().posterPrintHint}</p>{/if}
      {#if downloaded && KOFI_URL}
        <div class="kofi">
          <p>{t().kofi}</p>
          <a class="btn ghost" href={KOFI_URL} target="_blank" rel="noopener">{t().kofiButton}</a>
        </div>
      {/if}
    </fieldset>
  </form>
</section>

<style>
  .editor {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    grid-template-areas: 'preview head' 'preview controls';
    gap: 2rem clamp(2rem, 5vw, 4.5rem);
    max-width: 78rem;
    width: 100%;
    margin: 0 auto;
    align-items: start;
  }
  .head {
    grid-area: head;
    display: grid;
    gap: 0.75rem;
    justify-items: start;
  }
  h1 {
    font-size: clamp(2.4rem, 5vw, 3.8rem);
  }
  .intro {
    color: var(--muted);
    max-width: 38rem;
  }
  .stage {
    grid-area: preview;
    align-self: start;
    position: sticky;
    top: var(--stick-top, 1.5rem);
    display: grid;
    gap: 2rem;
  }
  .preview {
    display: grid;
    place-items: center;
    padding: clamp(1rem, 3vw, 2.5rem);
    background: #131f3b;
    border-radius: 14px;
  }
  .paper {
    width: 100%;
    max-width: calc((100dvh - 7rem) / var(--ratio));
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.3), 0 18px 40px rgb(0 0 0 / 0.45);
    background: #0d1830;
  }
  .paper :global(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }
  .controls {
    grid-area: controls;
    display: grid;
    gap: 1.75rem;
  }
  fieldset {
    border: 0;
    border-top: 1px solid var(--rule);
    margin: 0;
    padding: 1.25rem 0 0;
    display: grid;
    gap: 0.9rem;
    min-width: 0;
  }
  legend {
    float: left;
    width: 100%;
    padding: 0;
    margin-bottom: 0.25rem;
    font-family: var(--serif);
    font-size: 1.45rem;
  }
  label {
    display: grid;
    gap: 0.3rem;
  }
  label > span {
    color: var(--muted);
    font-size: 0.95rem;
  }
  .time {
    max-width: 10rem;
  }
  .time input {
    color-scheme: dark;
  }
  .hint {
    color: var(--muted);
    font-size: 0.9rem;
  }
  .place {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.75rem;
  }
  select.field {
    appearance: none;
    padding-right: 2rem;
    background-image: linear-gradient(45deg, transparent 50%, var(--muted) 50%),
      linear-gradient(135deg, var(--muted) 50%, transparent 50%);
    background-position: calc(100% - 1.05rem) 55%, calc(100% - 0.7rem) 55%;
    background-size: 0.35rem 0.35rem;
    background-repeat: no-repeat;
  }
  .themes {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.6rem;
  }
  .theme {
    display: grid;
    justify-items: center;
    gap: 0.4rem;
    padding: 0.6rem 0.25rem;
    border: 1px solid var(--rule);
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.95rem;
  }
  .theme > span:last-child {
    color: var(--ink);
  }
  .theme.on {
    border-color: var(--star);
    box-shadow: inset 0 0 0 1px var(--star);
  }
  .theme input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  .theme:has(input:focus-visible) {
    outline: 2px solid var(--star);
    outline-offset: 2px;
  }
  .swatch {
    width: 2.6rem;
    height: 3.4rem;
    border-radius: 3px;
    display: grid;
    place-items: center;
    box-shadow: 0 0 0 1px rgb(255 255 255 / 0.15);
  }
  .swatch span {
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
    border: 1px solid;
  }
  .levels {
    display: grid;
    gap: 0.4rem;
  }
  .levels-label {
    color: var(--muted);
    font-size: 0.95rem;
  }
  .segmented {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border: 1px solid var(--rule);
    border-radius: 999px;
    padding: 0.25rem;
    gap: 0.25rem;
  }
  .segmented label {
    display: grid;
    place-items: center;
    min-height: 2.6rem;
    border-radius: 999px;
    cursor: pointer;
    color: var(--muted);
  }
  .segmented label.on {
    background: var(--star);
    color: var(--night);
    font-weight: 700;
  }
  .segmented label:has(input:focus-visible) {
    outline: 2px solid var(--star);
    outline-offset: 2px;
  }
  .segmented input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  .checks {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem 1rem;
  }
  .check {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    min-height: 2.5rem;
    cursor: pointer;
  }
  .check span {
    color: var(--ink);
    font-size: 1rem;
  }
  .check input {
    width: 1.25rem;
    height: 1.25rem;
    accent-color: var(--star);
    flex: none;
  }
  .downloads {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }
  .ghost {
    background: transparent;
    color: var(--ink);
    border: 1px solid var(--rule);
    text-decoration: none;
  }
  .about {
    display: grid;
    gap: 0.6rem;
  }
  .about h2 {
    margin: 0;
    font-style: italic;
    font-size: clamp(2.2rem, 4vw, 3.2rem);
  }
  .about h3 {
    margin: 0.75rem 0 0;
    font-family: var(--serif);
    font-weight: 400;
    font-size: 1.45rem;
  }
  .about p {
    margin: 0;
  }
  .status {
    color: var(--ink);
  }
  .count {
    font-family: var(--serif);
    font-style: italic;
    color: var(--muted);
  }
  .kofi {
    display: grid;
    gap: 0.6rem;
    justify-items: start;
    padding: 1rem;
    border: 1px solid var(--rule);
    border-radius: 12px;
  }
  @media (max-width: 860px) {
    .editor {
      grid-template-columns: 1fr;
      grid-template-areas: 'head' 'preview' 'controls';
    }
    .stage {
      position: static;
    }
    .preview {
      padding: 1rem;
    }
    .paper {
      max-width: calc(70dvh / var(--ratio));
    }
    .checks {
      grid-template-columns: 1fr;
    }
    .downloads .btn {
      width: 100%;
    }
  }
</style>
