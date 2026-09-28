import type { PageServerLoad } from './$types';
import { moonHub } from '$lib/server/pages';

export const load: PageServerLoad = () => moonHub('es');
