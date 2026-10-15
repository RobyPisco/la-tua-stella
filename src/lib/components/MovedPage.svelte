<script lang="ts">
  import { base } from '$app/paths';
  import { absolute, PAGES, type PageId } from '$lib/routes';
  import { locale, t } from '$lib/i18n.svelte';
  import { SITE_NAME } from '$lib/site';

  /** The page this address now points to. */
  let { to }: { to: PageId } = $props();

  const path = $derived(PAGES[to][locale.lang]);
</script>

<!--
  A static host cannot answer with a 301, so this page does the next best thing: it declares the
  new address as canonical and sends the browser there at once, leaving a link for anyone (or
  anything) that does not follow the refresh. No "noindex" here on purpose: it would stop search
  engines from passing this address's standing on to the new one.
-->
<svelte:head>
  <title>{SITE_NAME}</title>
  <link rel="canonical" href={absolute(path)} />
  <meta http-equiv="refresh" content={`0; url=${base + path}`} />
</svelte:head>

<p class="moved">
  <a href={base + path}>{t().movedLink}</a>
</p>

<style>
  .moved {
    max-width: 34rem;
    margin: 4rem auto;
    text-align: center;
  }
</style>
