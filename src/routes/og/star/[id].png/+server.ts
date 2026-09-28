import { error } from '@sveltejs/kit';
import { constellationPlain, properName } from '$lib/names';
import { NAMED, namedById } from '$lib/server/catalog';
import { png, starImage } from '$lib/server/og';

export const prerender = true;

export const entries = () => NAMED.map((s) => ({ id: String(s.id) }));

export function GET({ params }) {
  const s = namedById(Number(params.id));
  if (!s) error(404);
  // IAU name and Latin constellation: the same image for every language.
  return png(starImage(properName(s.proper, 'en'), s.con ? constellationPlain(s.con, 'en') : '', s.raH * 15, s.dec, s.ci));
}
