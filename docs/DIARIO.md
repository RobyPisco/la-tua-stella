# Diario di progetto

Come è nato Sky of Your Day e perché è fatto così. Riassume le discussioni tra il titolare del
progetto e Claude (Claude Code) del 28 settembre 2026, giorno in cui il sito è nato ed è andato
online. Le decisioni operative sono anche in `CLAUDE.md`; qui c'è il ragionamento.

## 1. L'idea

- Obiettivo iniziale: "un progetto web per il mondo intero, piccolo ma funzionale, che tutti
  possano usare". Scartate le idee utili ma già viste (dividere spese, fusi orari, strumenti per
  musicisti, etichette di lavaggio). Riferimenti di gusto dichiarati: **lofiatc** e **suncalc**:
  una sola idea originale, dati veri del mondo, esperienza da guardare o ascoltare.
- Seconda tornata scartata: aerei sopra casa trasformati in musica, alba perpetua da webcam,
  terremoti come percussioni, il cielo di una data.
- Terza tornata: **"La tua stella"** (scelta), fulmini con tuono ritardato, "piove da qualche
  parte", "stessa linea" (parallelo/meridiano di casa tua).
- L'idea scelta: la luce di una stella lontana N anni luce è partita N anni fa; quindi per ogni
  età c'è una stella la cui luce è partita il giorno della tua nascita e arriva adesso.

## 2. Prima versione (stessa giornata)

- Svelte 5 + Vite, dati HYG (Hipparcos/Yale/Gliese), calcoli con Astronomy Engine, cielo vero
  disegnato su canvas, IT/EN, installabile, niente server: la data di nascita resta nel browser.
- Scelte di design: blu notte (non nero), Bodoni Moda + Atkinson Hyperlegible Next, e un solo
  accento: **il colore reale della stella** trovata.
- Algoritmo: si cercano le stelle entro ±0,5 anni luce dall'età (allargando se necessario),
  preferendo quelle visibili a occhio nudo. Per i bambini sotto i 4 anni la luce "arriverà":
  la stella più vicina (Proxima/Alfa Centauri) è a 4,2–4,4 anni luce.
- "Dove guardare stasera": prima ora comoda della sera in cui la stella è alta, non il suo
  massimo alle 3 di notte (feedback emerso guardando i risultati).
- Aggiunta su richiesta la modalità **"Cercala col telefono"**: cielo in realtà aumentata con
  bussola e sensori, guida a parole, vibrazione, fotocamera facoltativa.
- Feedback dell'utente dal telefono: impaginazione mobile scadente → rifatto tutto **a passi**
  (4 step) sia su mobile che desktop, data con tre campi invece del calendario nativo.

## 3. Il poster

- Spunto: un sito che vende mappe stellari da stampare. Obiettivo: farlo meglio e gratis.
- Differenze scelte: la stella di quel giorno evidenziata con la sua frase, Via Lattea vera
  (proiettata punto per punto da una mappa di luminosità), Luna con la fase reale, pianeti,
  4 stili, 7 formati, PDF/PNG/SVG in alta risoluzione, firma piccola del sito sul poster.
- Poi, su richiesta: **quantità di dettagli** (Essenziale / Equilibrata / Ricca) e un sistema che
  impedisce alle scritte di sovrapporsi.

## 4. Il ragionamento economico

- Richiesta: 100 € di budget, guadagno piccolo ma costante (idea iniziale: 1 € a mappa), SEO forte.
- Risposte oneste date:
  - 1 € a transazione non regge (commissioni 30–55%); il mercato vende a 5–40 €.
  - **Senza partita IVA non si può vendere in modo continuativo** in Italia. L'utente non ha e
    non può aprire la partita IVA e vuole essere **legale al 100%**.
- Modello scelto: **tutto gratis**, solo **donazioni volontarie** (Ko-fi collegato a PayPal)
  che non sbloccano nulla. Pubblicità e affiliazioni rimandate: sono reddito, e se continuative
  finiscono nella stessa zona grigia. Consigliata una consulenza al CAF (30–50 € del budget).
- Aspettative di traffico, corrette dopo un primo ottimismo: dominio nuovo, pochi mesi quasi a
  zero; scenario normale 1.000–5.000 visite/mese a 6 mesi, 5.000–20.000 a 12 mesi. Con le
  donazioni: poche decine di euro al mese all'inizio. Il progetto vale come prodotto di cui
  andare fieri, il guadagno è una conseguenza.
- Budget speso finora: 10,46 $ (dominio, un anno).

## 5. SEO

- Nome internazionale: **Sky of Your Day**, dominio **skyofyourday.com**.
- Migrazione a **SvelteKit** con pagine pre-generate: indirizzi per lingua con parole chiave,
  canonical, hreflang, dati strutturati, sitemap.
- Pagine generate con dati veri (non contenuti "vuoti"): fasi lunari di ogni mese dal 1930,
  "nati nel…" per anno, schede delle 464 stelle con nome IAU. Ricostruzione settimanale.
- Consiglio seguito: comprare il dominio **prima** di spingere sulla SEO, perché la fiducia di
  Google si accumula sul dominio. Comprato su Cloudflare (più economico); hosting su GitHub Pages,
  che reindirizza da solo i vecchi indirizzi github.io.
- Google Search Console configurata: sitemap letta, 3.680 pagine rilevate.

## 6. Cose imparate strada facendo

- Un service worker vecchio può bloccare per sempre gli utenti su una versione superata:
  risolto con un service worker "di congedo" allo stesso indirizzo, testato dal vivo.
- Con `paths.relative` di SvelteKit la lingua letta dall'URL si rompeva in fase di build.
- Il ritaglio del cerchio nel poster si era rotto per un apice sbagliato: trovato grazie a un
  PDF scaricato dall'utente.

## 7. Prossimi passi discussi

- Lingue: **spagnolo aggiunto** (inglese resta la lingua principale alla radice); poi tedesco,
  francese, portoghese.
- **Contatore pubblico** di visite o di mappe create, richiesto dall'utente: serve un piccolo
  servizio che conti (il sito è statico); deve mostrare solo numeri veri.
- Pagina Ko-fi da creare e collegare.
- Tra 2–3 settimane: leggere i dati di Search Console e decidere dove spingere.
- Richiedere l'indicizzazione delle pagine principali e aggiungere Bing Webmaster Tools.

## 8. La licenza dei poster (29 settembre)

- A casa l'utente aveva messo il sito sotto "tutti i diritti riservati" e scritto nelle condizioni
  d'uso che i poster non si possono rivendere.
- Problema segnalato: i poster sono disegnati con i dati HYG, che sono CC BY-SA 4.0. Quella licenza
  permette l'uso commerciale e chiede che le opere derivate restino sotto la stessa licenza: un
  divieto di rivendita dei poster sarebbe probabilmente inapplicabile e in contrasto con la licenza.
- Soluzione scelta: i poster generati sono dichiarati CC BY-SA 4.0 (con attribuzione stampata sul
  poster e nei metadati del file); restano riservati nome e marchio, codice, grafica del sito e testi.


## 9. La ristrutturazione (15 ottobre)

- Punto di partenza: l'utente trovava la **logica del sito confusa** e voleva rifare la grafica.
  Letto il codice, la grafica era la parte sana: il problema era l'architettura.
- **Due prodotti in un imbuto solo.** La radice — l'URL con più autorità — era spesa su
  "la stella la cui luce è partita il giorno della tua nascita", un concetto bellissimo che
  nessuno cerca; il poster, cioè il mercato vero ("star map", "mapa estelar"), stava un livello
  sotto. Invertiti: poster alla radice in sei lingue, percorso stella su slug propri.
  Fatto **adesso** proprio perché il dominio ha 17 giorni: spostare costa due settimane di
  indicizzazione, cioè niente. Fra sei mesi sarebbe costato traffico.
- GitHub Pages è statico: niente 301. I vecchi indirizzi restano come pagine con `canonical`
  verso la nuova posizione più un refresh, **senza `noindex`** (bloccherebbe il trasferimento
  dell'autorità), e fuori dalla sitemap.
- **Il percorso a 4 passi era un falso percorso:** il passo 1 non tornava indietro, chiamava
  `restart()` e cancellava il risultato. Ora la lista compare solo con un risultato ed elenca
  i tre passi reali.
- **Donazioni: 287 mappe, zero donazioni.** Chiesto di "forzare la mano" con il PDF a pagamento.
  Rifiutato per tre ragioni indipendenti, la terza decisiva: sarebbe una vendita (serve partita
  IVA), i poster sono CC BY-SA quindi il divieto di ridistribuzione non regge, e il file è già
  nel browser prima del pagamento — un cancello sarebbe teatro. Fatto invece quello che
  funziona: l'invito spostato **sotto i pulsanti** (stava sotto la piega su telefono, probabile
  causa vera dello zero), testo onesto e concreto, pannello Ko-fi dentro la pagina ma caricato
  **solo al clic**, così chi non dona non contatta mai terzi.
  Nota statistica detta all'utente: 0 su 287 è rumore, non segnale — allo 0,5% di conversione
  te ne aspetti 1,4, e la probabilità di osservarne zero è circa il 25%. E 287 mappe non sono
  287 persone: il contatore conta le mappe.
- **Search Console, il dato che decide tutto:** 11.046 pagine rilevate, 1.400 indicizzate.
  Delle 9.646 non indicizzate, **9.629 non sono mai state scaricate** contro sole 17 scartate
  dopo la lettura. Il limite è l'**autorità**, non la qualità. Conseguenza: aggiungere lingue
  o pagine adesso fa danno. La leva sono i link in entrata.
- Geografia: il blocco ispanofono (Spagna 14% + Argentina 10% + Messico 7%) vale **il doppio**
  dell'Italia (16%). Corretti sette "móvil" in `i18n.svelte.ts` e due in `content.ts` →
  "teléfono", neutro: l'America Latina pesa più della Spagna.
- Titoli allineati alle ricerche ("La mappa stellare del tuo cielo" invece di "Il poster del
  tuo cielo") e introduzione che chiude su gratis / senza registrazione / senza filigrana.
  **Attenzione al limite:** la scheda social taglia il sottotitolo a tre righe da ~41 caratteri
  (`og.ts`, `pageImage`). La prima versione da 148 caratteri veniva mozzata; accorciata a ~105
  e verificata guardando le PNG generate in italiano e tedesco.
- **Falso allarme da non ripetere:** il "soft 404" del Controllo URL in tempo reale su
  `/es/tu-estrella/` era una cilecca dello strumento — il sorgente servito era completo e
  corretto. Prima di allarmarsi, rifare il test.

## 10. Prossimi passi (dal 15 ottobre)

- Finire le richieste di indicizzazione: le sei radici, poi `/fr/ton-etoile/` e
  `/pt/a-tua-estrela/` (la quota giornaliera si esaurisce dopo poche richieste).
- **Far rileggere le traduzioni nuove in tedesco, francese e portoghese**: scritte senza
  madrelingua in tre giri successivi.
- Verificare dal telefono che l'invito Ko-fi si veda e che il pannello si apra.
- I **link in entrata** sono l'unica leva che sposta il numero che conta: Show HN, Product Hunt,
  subreddit di astronomia (link `nofollow`: il valore è indiretto, chi ti scopre lì ti linka dal
  proprio sito). Valutato un test TikTok in spagnolo, dieci video in due settimane, con la
  scadenza decisa prima di cominciare.
- Verifica falsificabile della ristrutturazione: a 4-6 settimane, `/` deve ricevere impression
  su query tipo "star map"/"mapa estelar" e i clic tornare almeno ai livelli di oggi. Se non
  succede nessuna delle due, la mossa non ha pagato e si torna indietro.
