import type { PageServerLoad } from './$types';
import { moonYear, moonYearEntries } from '$lib/server/pages';

// Pure reference page: plain HTML, no JavaScript needed.
export const csr = false;

export const entries = () => moonYearEntries();

export const load: PageServerLoad = ({ params }) => moonYear('de', params.year);
