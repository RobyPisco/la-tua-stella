import { mount } from 'svelte';
import '@fontsource-variable/bodoni-moda/opsz.css';
import '@fontsource-variable/bodoni-moda/opsz-italic.css';
import '@fontsource-variable/atkinson-hyperlegible-next';
import './app.css';
import App from './App.svelte';
import { locale } from './lib/i18n.svelte';
import { registerSW } from 'virtual:pwa-register';

// Pick up new deployments straight away instead of on the visit after.
registerSW({ immediate: true });

document.documentElement.lang = locale.lang;
export default mount(App, { target: document.getElementById('app')! });
