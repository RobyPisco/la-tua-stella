import { error } from '@sveltejs/kit';
import { sitemapFiles, urlset, xmlResponse } from '$lib/server/sitemap';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => sitemapFiles().map(({ name }) => ({ name }));

export const GET: RequestHandler = ({ params }) => {
  const file = sitemapFiles().find((f) => f.name === params.name);
  if (!file) error(404);
  return xmlResponse(urlset(file.section, file.lang));
};
