<script lang="ts">
  import { fmtNum, t } from '../i18n.svelte';

  /** The public count of maps made; a link when `href` is given (home → poster editor). */
  let { n, href }: { n: number; href?: string } = $props();
</script>

<svelte:element this={href ? 'a' : 'p'} class="maps" {href}>
  <strong>{fmtNum(n)}</strong>
  <span>{t().mapsMadeLabel(n)}</span>
</svelte:element>

<style>
  .maps {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
    padding: 0.5rem 1.15rem 0.5rem 0.95rem;
    border: 1px solid var(--rule);
    border-radius: 999px;
    background: rgb(246 226 180 / 0.06);
    color: var(--muted);
    text-decoration: none;
    justify-self: start;
    width: fit-content;
  }
  a.maps:hover {
    border-color: var(--star);
    color: var(--ink);
  }
  strong {
    font-family: var(--serif);
    font-weight: 400;
    font-size: 2.1rem;
    line-height: 1;
    color: var(--star);
  }
  span {
    font-size: 0.95rem;
    line-height: 1.25;
  }
</style>
