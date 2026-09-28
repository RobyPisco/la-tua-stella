<script lang="ts">
  import { moonLitPath } from '$lib/moon';

  let { lit, angle, size = 28, label }: { lit: number; angle: number; size?: number; label?: string } = $props();
</script>

<svg class="moon" width={size} height={size} viewBox="-12 -12 24 24" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'}>
  <circle r="11" fill="var(--moon-dark, #1e2d52)" stroke="rgb(244 239 226 / 0.25)" stroke-width="0.6" />
  {#if lit > 0.005}<path d={moonLitPath(lit, angle, 11)} fill="var(--moon-lit, #f4efe2)" />{/if}
</svg>

<style>
  .moon {
    display: block;
    flex: none;
  }
</style>
