import type { PageServerLoad } from './$types';
import { bornEntries, bornYear } from '$lib/server/pages';

// Pure reference page: plain HTML, no JavaScript needed.
export const csr = false;

export const entries = () => bornEntries();

export const load: PageServerLoad = ({ params }) => bornYear('es', params.year);
