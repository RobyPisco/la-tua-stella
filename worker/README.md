# sky-counter

Contatore pubblico delle mappe create, su `https://api.skyofyourday.com/maps`
(Cloudflare Worker + D1, piano gratuito). Il sito lo usa solo se in build c'è
`VITE_COUNTER_URL` (impostata in `.github/workflows/deploy.yml`): in sviluppo non conta nulla.

- `GET /maps` → `{ "count": n }`
- `POST /maps` → aggiunge 1; accettato solo con `Origin` del sito, max 10 al minuto per indirizzo.

Niente cookie e niente dati personali: nel database c'è solo il totale. Il limite per indirizzo
vive in memoria per un minuto e non viene salvato.

## Prima pubblicazione

```bash
cd worker
npx wrangler@4 login                  # una volta, apre il browser
npx wrangler@4 d1 create sky-counter  # copia database_id in wrangler.toml
npx wrangler@4 d1 execute sky-counter --remote --file schema.sql
npx wrangler@4 deploy                 # crea anche il record DNS di api.skyofyourday.com
```

Dopo modifiche al codice basta `npx wrangler@4 deploy`. Il sito non va ripubblicato.
