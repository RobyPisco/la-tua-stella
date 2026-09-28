import { error } from '@sveltejs/kit';
import { moonMonth } from '$lib/moon';
import { moonImage, png } from '$lib/server/og';
import { moonMonthEntries } from '$lib/server/pages';

export const prerender = true;

export const entries = () => moonMonthEntries().map(({ year, month }) => ({ ym: `${year}-${month}` }));

export function GET({ params }) {
  const [year, month] = params.ym.split('-').map(Number);
  if (!year || !(month >= 1 && month <= 12)) error(404);
  return png(moonImage(moonMonth(year, month, 'UTC')));
}
