import type { PageServerLoad } from './$types';
import { starsHub } from '$lib/server/pages';

// Pure reference page: plain HTML, no JavaScript needed.
export const csr = false;

export const load: PageServerLoad = () => starsHub('fr');
