# La tua stella · Your star

Da qualche parte nel cielo c'è una stella la cui luce è partita il giorno della tua nascita
e sta arrivando sulla Terra proprio adesso. Questo sito la trova, ti dice dove e quando
guardare stasera dal luogo in cui ti trovi e crea un'immagine da condividere.

Somewhere in the sky is a star whose light set out on the day you were born and is reaching
Earth right now. This site finds it, tells you where and when to look tonight from where you
are, and makes an image to share.

## Come funziona

- **Stelle:** HYG Database v4.1 (Hipparcos, Yale, Gliese), filtrato alle stelle entro
  130 anni luce e più luminose della magnitudine 11,5. Per ogni età si cerca la stella la cui
  distanza in anni luce è più vicina all'età, preferendo quelle visibili a occhio nudo.
- **Cielo:** proiezione stereografica centrata sullo zenit, disegnata su canvas con le stelle
  fino a magnitudine 5,8 e le figure delle costellazioni.
- **Posizioni e orari:** [Astronomy Engine](https://github.com/cosinekitty/astronomy)
  (precessione, nutazione, rifrazione, crepuscolo).
- **Luoghi:** geolocalizzazione del browser oppure ricerca città con l'API gratuita di
  [Open-Meteo](https://open-meteo.com/en/docs/geocoding-api).
- **Cercala col telefono:** su smartphone la bussola e i sensori di movimento
  (DeviceOrientation) mostrano il cielo nella direzione in cui punti, con indicazioni
  per arrivare alla stella, vibrazione quando la inquadri e fotocamera opzionale.
- Tutto il calcolo avviene nel browser: la data di nascita non lascia il dispositivo.

## Stack

Svelte 5 (runes) · TypeScript · Vite 8 · PWA installabile e offline (vite-plugin-pwa) ·
View Transitions API · Web Share API con immagine · Canvas 2D ·
DeviceOrientation, getUserMedia e Screen Wake Lock per la modalità telefono.

## Sviluppo

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # controllo tipi
npm run build      # dist/ pronto da pubblicare
npm run catalog    # rigenera src/data/*.json dal database HYG
```

Il deploy su GitHub Pages è automatico a ogni push su `main`
(`.github/workflows/deploy.yml`). La build usa percorsi relativi, quindi `dist/` funziona
anche copiata in una sottocartella di qualsiasi server (per esempio XAMPP).

## Licenze

- Codice: MIT.
- `src/data/near-stars.json` e `src/data/sky.json` derivano dall'[HYG Database](https://github.com/astronexus/HYG-Database)
  di David Nash, CC BY-SA 4.0, e sono distribuiti con la stessa licenza.
- Linee delle costellazioni: [d3-celestial](https://github.com/ofrohn/d3-celestial) di Olaf Frohn, BSD-3-Clause.
