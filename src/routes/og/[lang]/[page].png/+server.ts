import { error } from '@sveltejs/kit';
import { strings, type Lang } from '$lib/i18n.svelte';
import { PT } from '$lib/pageText';
import { LANGS } from '$lib/routes';
import { pageImage, png } from '$lib/server/og';

export const prerender = true;

/** Title in each language and the piece of sky behind it (RA, Dec in degrees). */
const PAGES: Record<string, { title: (l: Lang) => string; sub?: (l: Lang) => string; sky: [number, number] }> = {
  home: { title: (l) => strings[l].title, sky: [84, 2] },
  poster: { title: (l) => strings[l].posterHeading, sub: (l) => strings[l].posterIntro, sky: [305, 40] },
  moonHub: { title: (l) => PT[l].moonHubH1, sky: [62, 20] },
  bornHub: { title: (l) => PT[l].bornHubH1, sky: [282, 36] },
  starsHub: { title: (l) => PT[l].starsHubH1, sky: [170, 55] },
  terms: { title: (l) => strings[l].termsLink, sky: [15, 60] },
};

export const entries = () => LANGS.flatMap((lang) => Object.keys(PAGES).map((page) => ({ lang, page })));

export function GET({ params }) {
  const p = PAGES[params.page];
  const lang = params.lang as Lang;
  if (!p || !LANGS.includes(lang)) error(404);
  return png(pageImage(p.title(lang), p.sub?.(lang) ?? '', ...p.sky));
}
