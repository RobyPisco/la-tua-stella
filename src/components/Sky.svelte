<script lang="ts">
  import { onMount } from 'svelte';
  import type { Place } from '../lib/astro';
  import { loadSky, SkyRenderer, type Target } from '../lib/sky';
  import { t } from '../lib/i18n.svelte';

  interface Props {
    date: Date;
    place: Place;
    facing?: number;
    target?: Target;
    caption?: string;
  }
  let { date, place, facing = 180, target, caption }: Props = $props();

  let canvas: HTMLCanvasElement;
  let box: HTMLDivElement;
  let renderer: SkyRenderer | undefined = $state();
  let size = $state(0);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  // Animated state: the chart turns towards the target and the ring closes in on it.
  let shownFacing = 180;
  let reveal = 0;
  let revealFor: Target | undefined;

  onMount(() => {
    loadSky().then((c) => (renderer = new SkyRenderer(c)));
    const ro = new ResizeObserver(([e]) => (size = Math.floor(e.contentRect.width)));
    ro.observe(box);

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (renderer && size > 0) {
        if (target !== revealFor) { revealFor = target; reveal = 0; }
        if (reduced.matches) {
          shownFacing = facing;
          reveal = 1;
        } else {
          const diff = ((facing - shownFacing + 540) % 360) - 180;
          shownFacing += diff * Math.min(1, dt * 2.2);
          reveal = Math.min(1, reveal + dt / 1.8);
        }
        const dpr = Math.min(2, devicePixelRatio || 1);
        if (canvas.width !== size * dpr) {
          canvas.width = canvas.height = size * dpr;
        }
        const ctx = canvas.getContext('2d')!;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, size, size);
        renderer.draw(ctx, size, {
          date,
          place,
          facing: shownFacing,
          target,
          reveal,
          clock: reduced.matches ? 0 : now / 1000,
          cardinals: t().cardinals,
          belowHorizon: t().belowHorizon,
        });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  });
</script>

<figure class="sky">
  <div class="disc" bind:this={box}>
    <canvas bind:this={canvas} style:width="{size}px" style:height="{size}px" aria-hidden="true"></canvas>
  </div>
  {#if caption}<figcaption>{caption}</figcaption>{/if}
</figure>

<style>
  .sky {
    margin: 0;
    display: grid;
    gap: 0.5rem;
    justify-items: center;
  }
  .disc {
    width: 100%;
    aspect-ratio: 1;
  }
  canvas {
    display: block;
  }
  figcaption {
    color: var(--muted);
    font-size: 0.9rem;
    text-align: center;
  }
</style>
