import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Relative base: works on GitHub Pages under any repo name and on a local server.
  base: './',
  build: { chunkSizeWarningLimit: 600 },
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'La tua stella',
        short_name: 'La tua stella',
        description: 'Find the star whose light left it the day you were born.',
        theme_color: '#0d1830',
        background_color: '#0d1830',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'],
        // Star names need Latin and Greek; other scripts load on demand.
        globIgnores: ['**/*-{cyrillic,cyrillic-ext,vietnamese,math,symbols}-*.woff2', 'og.png'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/geocoding-api\.open-meteo\.com\//,
            handler: 'NetworkFirst',
            options: { cacheName: 'geocoding', expiration: { maxEntries: 50 } },
          },
        ],
      },
    }),
  ],
});
