import type { PageServerLoad } from './$types';
import { starEntries, starPage } from '$lib/server/pages';

// Pure reference page: plain HTML, no JavaScript needed.
export const csr = false;

export const entries = () => starEntries('fr');

export const load: PageServerLoad = ({ params }) => starPage('fr', params.slug);
