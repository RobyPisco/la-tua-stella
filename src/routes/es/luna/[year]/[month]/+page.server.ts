import type { PageServerLoad } from './$types';
import { moonMonthEntries, moonMonthPage } from '$lib/server/pages';

// Pure reference page: plain HTML, no JavaScript needed.
export const csr = false;

export const entries = () => moonMonthEntries();

export const load: PageServerLoad = ({ params }) => moonMonthPage('es', params.year, params.month);
