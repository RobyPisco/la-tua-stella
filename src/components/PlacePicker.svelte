<script lang="ts">
  import type { Place } from '../lib/astro';
  import { currentPosition, searchCity } from '../lib/geo';
  import { locale, t } from '../lib/i18n.svelte';

  let { onpick }: { onpick: (p: Place) => void } = $props();

  let query = $state('');
  let results: Place[] = $state([]);
  let status = $state('');
  let busy = $state(false);
  let controller: AbortController | undefined;

  async function locate() {
    busy = true;
    status = t().locating;
    try {
      onpick(await currentPosition(t().myPosition));
      status = '';
    } catch {
      status = t().locationDenied;
    } finally {
      busy = false;
    }
  }

  async function search(e: SubmitEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    controller?.abort();
    controller = new AbortController();
    try {
      results = await searchCity(q, locale.lang, controller.signal);
      status = results.length ? '' : t().noResults;
    } catch (err) {
      if ((err as Error).name !== 'AbortError') status = t().noResults;
    }
  }
</script>

<div class="picker">
  <button class="btn" type="button" onclick={locate} disabled={busy}>{t().useLocation}</button>
  <form class="search" onsubmit={search}>
    <label for="city">{t().searchCity}</label>
    <div class="row">
      <input id="city" class="field" type="search" autocomplete="address-level2" placeholder={t().searchPlaceholder} bind:value={query} />
      <button class="btn ghost" type="submit">{t().search}</button>
    </div>
  </form>
  {#if status}<p class="status" role="status">{status}</p>{/if}
  {#if results.length}
    <ul class="results">
      {#each results as r (r.name + r.lat)}
        <li><button type="button" class="link" onclick={() => onpick(r)}>{r.name}</button></li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .picker {
    display: grid;
    gap: 1rem;
    justify-items: start;
  }
  .search {
    display: grid;
    gap: 0.35rem;
    width: 100%;
  }
  label {
    color: var(--muted);
    font-size: 0.95rem;
  }
  .row {
    display: flex;
    gap: 0.5rem;
  }
  .row input {
    flex: 1;
    min-width: 0;
  }
  .ghost {
    background: transparent;
    color: var(--ink);
    border: 1px solid var(--rule);
  }
  @media (max-width: 760px) {
    .picker > .btn {
      width: 100%;
    }
  }
  .status {
    color: var(--muted);
    font-size: 0.95rem;
  }
  .results {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.4rem;
  }
  .results .link {
    color: var(--ink);
    text-align: left;
  }
</style>
