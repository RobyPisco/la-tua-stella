/** Effective temperature from B-V colour index (Ballesteros 2012). */
export function temperature(bv: number): number {
  const b = Math.min(2, Math.max(-0.4, bv));
  return 4600 * (1 / (0.92 * b + 1.7) + 1 / (0.92 * b + 0.62));
}

/** Blackbody colour of a temperature as perceived at night: desaturated towards white. */
export function starRgb(bv: number, saturation = 0.55): [number, number, number] {
  const t = temperature(bv) / 100;
  let r: number, g: number, b: number;
  if (t <= 66) {
    r = 255;
    g = 99.47 * Math.log(t) - 161.12;
    b = t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04;
  } else {
    r = 329.7 * (t - 60) ** -0.1332;
    g = 288.12 * (t - 60) ** -0.0755;
    b = 255;
  }
  const mix = (c: number) => Math.round(255 + (Math.min(255, Math.max(0, c)) - 255) * saturation);
  return [mix(r), mix(g), mix(b)];
}

export function starCss(bv: number, saturation?: number): string {
  const [r, g, b] = starRgb(bv, saturation);
  return `rgb(${r} ${g} ${b})`;
}
