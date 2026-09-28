import { error } from '@sveltejs/kit';
import { NEAR } from '$lib/server/catalog';
import { png, yearImage } from '$lib/server/og';
import { BUILT, bornEntries, THIS_YEAR } from '$lib/server/pages';
import { findStars, starName } from '$lib/stars';
import { FIRST_YEAR } from '$lib/routes';

export const prerender = true;

export const entries = () => bornEntries();

export function GET({ params }) {
  const year = Number(params.year);
  if (!(year >= FIRST_YEAR && year <= THIS_YEAR)) error(404);
  // The star of mid-year (or of today, for the current year).
  const birth = new Date(Math.min(Date.UTC(year, 6, 1), BUILT.getTime()));
  const { best } = findStars(NEAR, birth, BUILT);
  return png(yearImage(year, starName(best, 'en'), best.raH * 15, best.dec, best.ci));
}
