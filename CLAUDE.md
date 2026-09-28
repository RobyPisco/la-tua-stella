# Sky of Your Day — note per chi ci lavora

Sito: **https://skyofyourday.com** · Repository: `RobyPisco/la-tua-stella` · Lingua di lavoro con
l'utente: italiano.

## Cos'è

- **La tua stella**: dalla data di nascita trova la stella la cui luce è partita quel giorno e
  arriva ora; dove guardarla stasera; modalità "Cercala col telefono" (bussola + sensori).
- **Poster del cielo** (`/star-map/`, `/it/mappa-stellare/`): cielo vero di qualsiasi data/ora/luogo,
  Via Lattea, Luna, pianeti, 4 stili, 7 formati, PDF/PNG/SVG gratuiti.
- **Pagine SEO generate** (~3.700): fasi lunari per mese/anno dal 1930, "nati nel…" per anno,
  schede delle 464 stelle con nome IAU. In inglese (radice) e italiano (`/it/`).

## Vincoli decisi con l'utente (non cambiarli senza chiedere)

- L'utente **non ha e non può aprire partita IVA** e vuole essere **legale al 100%**: niente vendite,
  niente contenuti a pagamento, per ora niente pubblicità né affiliazioni. Solo **donazioni
  volontarie** (Ko-fi collegato a PayPal) che **non sbloccano nulla**. `KOFI_URL` in
  `src/lib/brand.ts` è vuota finché l'utente non crea la pagina. Consigliata verifica al CAF.
- Testi italiani **senza genere** dove possibile ("il giorno della tua nascita", non "quando sei nato").
- Design: blu notte, Bodoni Moda + Atkinson Hyperlegible Next; l'unico accento è il colore reale
  della stella (`--star`). Il sito è a passi (4 step), su mobile e desktop.
- Aspettative di traffico dette onestamente all'utente: poche migliaia di visite al mese a 6 mesi
  nello scenario normale; la SEO è lenta.

## Stack e comandi

SvelteKit 2 + adapter-static (tutto pre-generato) · Svelte 5 runes · TypeScript 6 (svelte-check
non supporta TS 7) · Vite 8 · astronomy-engine · jsPDF. Node 24.

```bash
npm ci
npm run dev       # sviluppo
npm run check     # tipi (deve restare a 0 errori, 0 warning)
npm run build     # build/ con tutte le pagine, ~1,5 min
npm run catalog   # rigenera i dati (scarica HYG e d3-celestial in scripts/raw/)
```

Su Windows con Git Bash, per provare il percorso di una sottocartella serve
`MSYS_NO_PATHCONV=1 BASE_PATH=/qualcosa npm run build` (altrimenti Git Bash converte il percorso).

## Dove sta cosa

- `src/lib/routes.ts` — pagine e slug per lingua, `paths.*` per le pagine generate, `FIRST_YEAR`.
- `src/lib/i18n.svelte.ts` — testi dell'interfaccia; la lingua viene dall'URL (layout).
- `src/lib/content.ts` — testi SEO di home e poster · `src/lib/pageText.ts` — testi pagine generate.
- `src/lib/server/` — dati e loader usati solo in build (stelle con nome, pagine generate).
- `src/lib/poster.ts` + `posterExport.ts` — SVG del poster, Via Lattea proiettata, export.
- `src/lib/components/pages/` — componenti delle pagine generate (senza JavaScript: `csr = false`).
- `scripts/` — costruzione dei dati da HYG (CC BY-SA 4.0) e d3-celestial (BSD-3).

## Pubblicazione

- GitHub Actions (`.github/workflows/deploy.yml`) pubblica su GitHub Pages a ogni push su `main`
  e **ogni lunedì** (età e anni restano aggiornati). Artifact con retention 1 giorno: lo spazio
  dell'account GitHub è già stato un problema con altri progetti.
- Dominio comprato su **Cloudflare Registrar** (rinnovo automatico). DNS su Cloudflare: 4 record A
  verso GitHub Pages + CNAME `www` → `robypisco.github.io`, tutti **"DNS only"** (nuvola grigia).
  Custom domain e HTTPS impostati nelle impostazioni Pages del repository; i vecchi URL
  `robypisco.github.io/la-tua-stella/...` fanno 301 verso il dominio.
- Variabili di build: `BASE_PATH` (vuota) e `VITE_SITE_URL=https://skyofyourday.com`: canonical,
  hreflang, sitemap e og:image derivano da lì.
- Google Search Console: proprietà Dominio verificata, sitemap `https://skyofyourday.com/sitemap.xml`
  inviata (3.680 pagine rilevate il 28/09/2026).

## Trappole già incontrate

- `static/sw.js` è un "kill switch" per il service worker della primissima versione
  (vite-plugin-pwa): **non rimuoverlo**, libera chi ha ancora quella versione in cache.
- `paths.relative: false` in `svelte.config.js`: con percorsi relativi `base` in SSR vale `..` e il
  riconoscimento della lingua dall'URL si rompe.
- Nei componenti niente API del browser all'inizializzazione (`window`, `document`, `localStorage`,
  `matchMedia`): le pagine sono renderizzate in build. Usare `onMount`.
- `vite preview` serve una cartella `dist/` vecchia se esiste: cancellarla.
- Nel poster gli id SVG sono unici per poster e il `clip-path` deve essere un template literal.

## Idee aperte

Altre lingue (es, de, fr, pt: ~1.840 pagine ciascuna) · link Ko-fi quando l'utente lo crea ·
l'editor del poster perde la data cambiando lingua · immagini di anteprima per pagina ·
analisi dei dati di Search Console dopo 2–3 settimane.
