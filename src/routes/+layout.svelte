<script lang="ts">
  import '@fontsource-variable/bodoni-moda/opsz.css';
  import '@fontsource-variable/bodoni-moda/opsz-italic.css';
  import '@fontsource-variable/atkinson-hyperlegible-next';
  import '../app.css';
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import { locale, t, type Lang } from '$lib/i18n.svelte';
  import { href, langFromPath, LANGS, PAGES, type PageId } from '$lib/routes';
  import { SITE_NAME } from '$lib/site';
  import { PT } from '$lib/pageText';

  let { children } = $props();

  // The language comes from the URL: set it before anything renders (server and client).
  locale.lang = langFromPath(page.url.pathname);
  $effect.pre(() => {
    locale.lang = langFromPath(page.url.pathname);
    document.documentElement.lang = locale.lang;
  });

  /** The same page in the other languages: pages declare them in their load data. */
  const alternates = $derived(
    (page.data.alternates as Partial<Record<Lang, string>> | undefined) ??
      (page.data.page ? PAGES[page.data.page as PageId] : undefined),
  );
  const LANG_NAMES: Record<Lang, string> = {
    en: 'English', es: 'Español', it: 'Italiano', de: 'Deutsch', fr: 'Français', pt: 'Português',
  };
</script>

<div class="shell">
  <header class="top">
    <a class="brand" href={href('home', locale.lang)}>{SITE_NAME}</a>
    <nav class="lang" aria-label="Language">
      {#each LANGS as l (l)}
        {#if alternates?.[l]}
          <a
            href={base + alternates[l]}
            hreflang={l}
            lang={l}
            aria-label={LANG_NAMES[l]}
            aria-current={l === locale.lang ? 'page' : undefined}
          ><span class="full">{LANG_NAMES[l]}</span><span class="short" aria-hidden="true">{l.toUpperCase()}</span></a>
        {/if}
      {/each}
    </nav>
  </header>

  <main>
    {@render children()}
  </main>

  <footer>
    <nav aria-label={t().footerNav}>
      <a href={href('home', locale.lang)}>{t().stepStar}</a>
      <a href={href('poster', locale.lang)}>{t().posterHeading}</a>
      <a href={href('moonHub', locale.lang)}>{PT[locale.lang].moonHubH1.replace(/\?$/, '')}</a>
      <a href={href('bornHub', locale.lang)}>{PT[locale.lang].bornHubH1}</a>
      <a href={href('starsHub', locale.lang)}>{PT[locale.lang].starsHubH1}</a>
    </nav>
    <p>{t().credits}</p>
    <p>{t().privacy} <a href={href('terms', locale.lang)}>{t().termsLink}</a></p>
  </footer>
</div>

<style>
  .shell {
    min-height: 100dvh;
    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: 1rem clamp(1rem, 4vw, 3rem) 2rem;
    gap: 1rem;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    max-width: 78rem;
    width: 100%;
    margin: 0 auto;
  }
  .brand {
    font-family: var(--serif);
    font-style: italic;
    font-size: 1.2rem;
    text-decoration: none;
    color: var(--ink);
  }
  .lang {
    display: flex;
    gap: 1rem;
    font-size: 0.95rem;
  }
  .lang a {
    color: var(--muted);
    text-underline-offset: 0.2em;
    text-decoration-color: var(--rule);
    padding: 0.5rem 0.25rem;
  }
  .lang a[aria-current='page'] {
    color: var(--ink);
    text-decoration: none;
  }
  .short {
    display: none;
  }
  /* Six languages don't fit next to the name on a phone: two-letter codes instead. */
  @media (max-width: 1100px) {
    .lang {
      gap: 0.6rem;
    }
    .full {
      display: none;
    }
    .short {
      display: inline;
      letter-spacing: 0.04em;
    }
  }
  main {
    min-width: 0;
  }
  footer {
    max-width: 78rem;
    width: 100%;
    margin: 3rem auto 0;
    padding-top: 1.5rem;
    border-top: 1px solid var(--rule);
    display: grid;
    gap: 0.5rem;
    color: var(--muted);
    font-size: 0.85rem;
  }
  footer nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    font-size: 0.95rem;
  }
  footer a {
    color: var(--ink);
  }
</style>
