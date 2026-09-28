import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ pages: 'build', assets: 'build', fallback: '404.html', strict: true }),
    // GitHub Pages serves the site under /la-tua-stella; a custom domain serves it at the root.
    // Absolute paths: the language is read from the URL after the base.
    paths: { base: process.env.BASE_PATH ?? '', relative: false },
    prerender: { handleHttpError: 'fail', handleMissingId: 'warn' },
    // Notice new deployments: the next navigation then loads the new version.
    version: { pollInterval: 5 * 60 * 1000 },
  },
};
