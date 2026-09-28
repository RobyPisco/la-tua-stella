// B-V colour index from a spectral type, for stars whose catalogue colour is missing
// (main-sequence values after Pecaut & Mamajek 2013; subclass interpolated, default 5).
const ANCHORS = { O: [-0.33, -0.33], B: [-0.3, -0.16], A: [0, 0.15], F: [0.3, 0.44], G: [0.59, 0.68], K: [0.82, 1.15], M: [1.43, 1.83] };
const NEXT = { O: 'B', B: 'A', A: 'F', F: 'G', G: 'K', K: 'M', M: null };

/** Colour index for `spect`, or null when the type gives no class. */
export function ciFromSpect(spect) {
  const m = /^([OBAFGKM])\s*(\d(?:\.\d+)?)?/.exec(spect ?? '');
  if (!m) return null;
  const cls = m[1];
  const sub = m[2] === undefined ? 5 : +m[2];
  const [a0, a5] = ANCHORS[cls];
  const next = NEXT[cls] ? ANCHORS[NEXT[cls]][0] : 2.0;
  return sub <= 5 ? a0 + ((a5 - a0) * sub) / 5 : a5 + ((next - a5) * (sub - 5)) / 5;
}

/** Catalogue colour if present, else from the spectral type, else null (unknown). */
export function colorIndex(ciField, spect) {
  if (ciField !== '' && ciField !== undefined) return +ciField;
  return ciFromSpect(spect);
}
