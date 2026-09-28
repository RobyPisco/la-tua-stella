<script lang="ts">
  import { onMount } from 'svelte';
  import { equatorialVector, horizonMatrix, toEnu, type Place } from '../lib/astro';
  import { starRgb } from '../lib/color';
  import { t } from '../lib/i18n.svelte';
  import { toScreen, watchOrientation, type Matrix3 } from '../lib/orientation';
  import { loadSky, type SkyCatalog } from '../lib/sky';
  import type { Target } from '../lib/sky';

  let { target, place, onclose }: { target: Target; place: Place; onclose: () => void } = $props();

  let dialog: HTMLDialogElement;
  let canvas: HTMLCanvasElement;
  let video: HTMLVideoElement;
  let guidance = $state('');
  let problem = $state('');
  let cameraOn = $state(false);
  let found = $state(false);
  let below = $state(false);

  const RAD = Math.PI / 180;
  const FOUND_DEG = 5;

  onMount(() => {
    dialog.showModal();
    let catalog: SkyCatalog | undefined;
    loadSky().then((c) => (catalog = c));

    // Earth-frame (east-north-up) positions, refreshed as the sky turns.
    let starsEnu: { v: [number, number, number]; mag: number; rgb: string }[] = [];
    let linesEnu: [number, number, number][][] = [];
    let targetEnu: [number, number, number] = [0, 0, 1];
    const refreshSky = () => {
      const m = horizonMatrix(new Date(), place);
      targetEnu = toEnu(m, equatorialVector(target.raH * 15, target.dec));
      below = targetEnu[2] < 0;
      if (catalog) {
        starsEnu = catalog.stars.filter((s) => s.mag < 4.8).map((s) => ({ v: toEnu(m, s.v), mag: s.mag, rgb: s.rgb }));
        linesEnu = catalog.lines.map((p) => p.map((v) => toEnu(m, v)));
      }
    };
    refreshSky();
    const skyTimer = setInterval(refreshSky, 5000);
    loadSky().then(refreshSky);

    // Orientation, smoothed to hide sensor jitter.
    let M: Matrix3 | null = null;
    const stop = watchOrientation(
      (m) => {
        if (!M) M = m;
        else for (let i = 0; i < 9; i++) M[i] += (m[i] - M[i]) * 0.2;
      },
      () => (problem = t().noCompass),
    );

    let wakeLock: WakeLockSentinel | undefined;
    navigator.wakeLock?.request('screen').then((w) => (wakeLock = w)).catch(() => {});

    let raf = 0;
    let lastText = 0;
    let buzzed = false;
    const [r, g, b] = starRgb(target.ci, 0.7);
    const rgb = `${r} ${g} ${b}`;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const dpr = Math.min(2, devicePixelRatio || 1);
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!M) return;

      const cx = w / 2, cy = h / 2;
      const f = Math.max(w, h) / 2 / Math.tan(33 * RAD);
      const project = (v: readonly number[]): [number, number] | null => {
        const s = toScreen(M!, v);
        if (s[2] > -0.05) return null; // behind the viewer
        return [cx + (f * s[0]) / -s[2], cy - (f * s[1]) / -s[2]];
      };

      // Horizon line and cardinal points.
      ctx.strokeStyle = 'rgb(190 205 235 / 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let pen = false;
      for (let az = 0; az <= 360; az += 3) {
        const p = project([Math.sin(az * RAD), Math.cos(az * RAD), 0]);
        if (!p) { pen = false; continue; }
        if (pen) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
        pen = true;
      }
      ctx.stroke();
      ctx.fillStyle = 'rgb(214 222 240 / 0.85)';
      ctx.font = '600 15px "Atkinson Hyperlegible Next Variable", system-ui, sans-serif';
      ctx.textAlign = 'center';
      t().cardinals.forEach((label, i) => {
        const p = project([Math.sin(i * 90 * RAD), Math.cos(i * 90 * RAD), -0.04]);
        if (p) ctx.fillText(label, p[0], p[1] + 12);
      });

      // Constellations and stars.
      ctx.strokeStyle = 'rgb(160 185 230 / 0.28)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const poly of linesEnu) {
        pen = false;
        for (const v of poly) {
          const p = project(v);
          if (!p) { pen = false; continue; }
          if (pen) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
          pen = true;
        }
      }
      ctx.stroke();
      for (const s of starsEnu) {
        const p = project(s.v);
        if (!p || p[0] < -10 || p[0] > w + 10 || p[1] < -10 || p[1] > h + 10) continue;
        ctx.fillStyle = `rgb(${s.rgb} / ${s.v[2] < 0 ? 0.3 : 0.9})`;
        ctx.beginPath();
        ctx.arc(p[0], p[1], Math.max(0.8, (5.5 - s.mag) * 0.9), 0, Math.PI * 2);
        ctx.fill();
      }

      // Where the phone points, and how far the star is from it.
      const look = [-M[2], -M[5], -M[8]];
      const dot = look[0] * targetEnu[0] + look[1] * targetEnu[1] + look[2] * targetEnu[2];
      const away = Math.acos(Math.max(-1, Math.min(1, dot))) / RAD;
      found = away < FOUND_DEG;
      if (found && !buzzed) { navigator.vibrate?.(80); buzzed = true; }
      if (away > FOUND_DEG * 2) buzzed = false;

      ctx.strokeStyle = found ? `rgb(${rgb})` : 'rgb(235 230 217 / 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.stroke();

      const p = project(targetEnu);
      const pulse = 0.5 + 0.5 * Math.sin(now / 400);
      if (p && p[0] > 0 && p[0] < w && p[1] > 0 && p[1] < h) {
        const glow = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 28);
        glow.addColorStop(0, `rgb(${rgb} / 1)`);
        glow.addColorStop(0.3, `rgb(${rgb} / 0.55)`);
        glow.addColorStop(1, `rgb(${rgb} / 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgb(${rgb} / 0.9)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 16 + pulse * 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgb(${rgb})`;
        ctx.font = 'italic 500 22px "Bodoni Moda Variable", Georgia, serif';
        ctx.fillText(target.label, p[0], p[1] - 34);
      } else {
        // Off screen: an arrow on a ring around the centre, pointing the way.
        const s = toScreen(M, targetEnu);
        const ang = Math.atan2(-s[1], s[0]);
        const R = Math.min(w, h) * 0.36;
        const ax = cx + Math.cos(ang) * R, ay = cy + Math.sin(ang) * R;
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(ang);
        ctx.fillStyle = `rgb(${rgb} / ${0.7 + pulse * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(22, 0);
        ctx.lineTo(-10, -15);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-10, 15);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Spoken-style directions, updated a few times a second at most.
      if (now - lastText > 400) {
        lastText = now;
        guidance = directions(look, away);
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(skyTimer);
      stop();
      wakeLock?.release().catch(() => {});
      stopCamera();
    };

    function directions(look: number[], away: number): string {
      const tt = t();
      if (away < FOUND_DEG) return tt.found;
      const lookAz = Math.atan2(look[0], look[1]) / RAD;
      const lookAlt = Math.asin(Math.max(-1, Math.min(1, look[2]))) / RAD;
      const starAz = Math.atan2(targetEnu[0], targetEnu[1]) / RAD;
      const starAlt = Math.asin(targetEnu[2]) / RAD;
      const dAz = ((starAz - lookAz + 540) % 360) - 180;
      const dAlt = starAlt - lookAlt;
      const horizontal = Math.abs(dAz) * Math.cos(starAlt * RAD);
      const move = Math.abs(dAlt) > horizontal
        ? (dAlt > 0 ? tt.raise : tt.lower)
        : (dAz > 0 ? tt.turnRight : tt.turnLeft);
      return `${move} ${tt.degreesAway(Math.round(away))}`;
    }
  });

  let stream: MediaStream | undefined;

  async function toggleCamera() {
    if (cameraOn) return stopCamera();
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      video.srcObject = stream;
      await video.play();
      cameraOn = true;
    } catch {
      problem = t().cameraDenied;
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach((tr) => tr.stop());
    stream = undefined;
    cameraOn = false;
  }

  function close() {
    dialog.close(); // fires the dialog's close event, which calls onclose
  }
</script>

<dialog bind:this={dialog} class="pointer" class:camera={cameraOn} onclose={onclose} aria-labelledby="pointer-title">
  <video bind:this={video} muted playsinline aria-hidden="true"></video>
  <canvas bind:this={canvas} aria-hidden="true"></canvas>

  <div class="top">
    <h2 id="pointer-title">{target.label}</h2>
    <p class="guidance" class:found aria-live="polite">{problem || guidance || t().pointHelp}</p>
    {#if below && !problem}<p class="hint">{t().belowNow}</p>{/if}
  </div>

  <div class="bottom">
    <p class="hint">{t().calibrate}</p>
    <div class="actions">
      <button type="button" class="btn ghost" onclick={toggleCamera}>{cameraOn ? t().cameraOff : t().cameraOnLabel}</button>
      <button type="button" class="btn" onclick={close}>{t().close}</button>
    </div>
  </div>
</dialog>

<style>
  .pointer {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    background: radial-gradient(circle at 50% 40%, #16264a, #070d1c);
    color: var(--ink);
    overflow: hidden;
  }
  .pointer::backdrop {
    background: #070d1c;
  }
  video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: none;
  }
  .camera video {
    display: block;
    filter: brightness(0.75);
  }
  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .top,
  .bottom {
    position: absolute;
    left: 0;
    right: 0;
    padding: max(1rem, env(safe-area-inset-top)) 1rem 1rem;
    display: grid;
    gap: 0.4rem;
    text-align: center;
    text-shadow: 0 1px 6px rgb(0 0 0 / 0.8);
  }
  .top {
    top: 0;
    background: linear-gradient(rgb(7 13 28 / 0.85), transparent);
  }
  .bottom {
    bottom: 0;
    padding-bottom: max(1.25rem, env(safe-area-inset-bottom));
    background: linear-gradient(transparent, rgb(7 13 28 / 0.85));
  }
  h2 {
    font-style: italic;
    font-size: 2rem;
    color: var(--star);
  }
  .guidance {
    font-size: 1.25rem;
    font-weight: 700;
  }
  .guidance.found {
    color: var(--star);
  }
  .hint {
    color: var(--muted);
    font-size: 0.9rem;
  }
  .actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .ghost {
    background: rgb(13 24 48 / 0.6);
    color: var(--ink);
    border: 1px solid var(--rule);
  }
</style>
