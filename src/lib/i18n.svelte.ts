export type Lang = 'it' | 'en';

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'it' || saved === 'en') return saved;
  } catch {}
  return navigator.language.toLowerCase().startsWith('it') ? 'it' : 'en';
}

export const locale = $state({ lang: initialLang() });

export function setLang(lang: Lang) {
  locale.lang = lang;
  document.documentElement.lang = lang;
  try { localStorage.setItem('lang', lang); } catch {}
}

const DIRECTIONS = {
  it: ['nord', 'nord-est', 'est', 'sud-est', 'sud', 'sud-ovest', 'ovest', 'nord-ovest'],
  en: ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'],
};
const CARDINALS = { it: ['N', 'E', 'S', 'O'], en: ['N', 'E', 'S', 'W'] };

export const strings = {
  it: {
    title: 'Quale stella ha la tua età?',
    lead: 'La luce delle stelle viaggia per anni prima di arrivare fino a noi. Da qualche parte nel cielo ce n’è una la cui luce è partita il giorno della tua nascita e ti raggiunge proprio adesso.',
    birthLabel: 'La tua data di nascita',
    find: 'Trova la mia stella',
    invalidDate: 'Inserisci una data nel passato, dopo il 1900.',
    loading: 'Cerco tra le stelle…',
    changeDate: 'Cambia data',
    sharedIntro: 'Qualcuno ti ha mandato la sua stella.',
    findYours: 'Trova la tua',
    travel: (years: string) => `La luce di questa stella impiega ${years} anni ad arrivare sulla Terra.`,
    arrivedPast: (date: string) => `Quella partita il giorno della tua nascita è arrivata qui il ${date}.`,
    arrivingNow: 'Quella partita il giorno della tua nascita sta arrivando proprio in questi giorni.',
    arrivingFuture: (date: string) => `Quella partita il giorno della tua nascita arriverà il ${date}. Segnatelo.`,
    departedShared: (date: string) => `La luce che arriva da lei stasera è partita intorno al ${date}.`,
    tonightTitle: 'Dove guardare',
    placeFrom: (name: string) => `Da ${name}`,
    changePlace: 'Cambia luogo',
    needPlace: 'Per dirti dove guardare serve sapere da dove la cerchi.',
    useLocation: 'Usa la mia posizione',
    searchCity: 'Cerca una città',
    search: 'Cerca',
    searchPlaceholder: 'Es. Napoli, Buenos Aires, Tokyo',
    locating: 'Trovo la posizione…',
    locationDenied: 'Posizione non disponibile. Cerca la tua città qui sotto.',
    noResults: 'Nessuna città trovata con questo nome.',
    myPosition: 'la tua posizione',
    lookAt: (time: string, dir: string, alt: number, fists: string) =>
      `Verso le ${time} guarda a ${dir}, ${alt}° sopra l’orizzonte: ${fists} a braccio teso.`,
    overhead: (time: string) => `Verso le ${time} è quasi allo zenit: guarda dritto sopra la tua testa.`,
    fists: (n: number) => (n <= 1 ? 'circa un pugno' : `circa ${n} pugni`),
    visibleBetween: (a: string, b: string) => `È alta abbastanza per vederla dalle ${a} alle ${b}.`,
    notTonight: 'Stasera resta troppo bassa o si perde nella luce del Sole.',
    backOn: (date: string) => `Tornerà visibile la sera dal ${date} circa.`,
    backOnMorning: (date: string) => `Tornerà visibile dal ${date} circa, poco prima dell’alba.`,
    noNight: 'Da qui in questo periodo il cielo non diventa abbastanza buio.',
    never: (lat: string) => `Da qui non sale mai abbastanza sopra l’orizzonte. Per vederla bene bisogna trovarsi ${lat}.`,
    southOf: (lat: string) => `a sud del parallelo ${lat}`,
    northOf: (lat: string) => `a nord del parallelo ${lat}`,
    see: {
      city: 'Brilla abbastanza da vederla anche dal cielo di una città.',
      suburb: 'Si vede a occhio nudo lontano dalle luci più forti.',
      dark: 'Si vede a occhio nudo solo sotto un cielo buio, lontano dalla città.',
      binoculars: 'È troppo debole per l’occhio nudo: serve un binocolo.',
      telescope: 'È molto debole: serve un telescopio.',
    },
    skyAt: (time: string) => `Il cielo alle ${time}`,
    skyNow: 'Il cielo in questo momento',
    skyTonight: 'Il cielo di stanotte',
    belowHorizon: 'sotto l’orizzonte',
    aboutTitle: 'Com’è fatta',
    isA: (name: string, kind: string) => `${name} è ${kind}.`,
    kind: {
      O: 'una stella azzurra molto calda', B: 'una stella azzurra molto calda', A: 'una stella bianca',
      F: 'una stella bianco-gialla', G: 'una stella gialla come il Sole', K: 'una stella arancione',
      M: 'una stella rossa', W: 'una stella di Wolf-Rayet', D: 'una nana bianca', X: 'una stella',
    } as Record<string, string>,
    giant: (k: string) => k.replace(/^una stella/, 'una gigante'),
    supergiant: (k: string) => k.replace(/^una stella/, 'una supergigante'),
    inConstellation: (con: string) => `nella costellazione ${con}`,
    brighter: (n: string) => `Emette ${n} volte la luce del Sole.`,
    fainter: (pct: string) => `Emette circa il ${pct}% della luce del Sole.`,
    sunLike: 'Emette più o meno la stessa luce del Sole.',
    distance: (ly: string, km: string) => `Dista ${ly} anni luce: ${km} di chilometri.`,
    temp: (k: string) => `La sua superficie è a circa ${k} gradi.`,
    othersTitle: 'Altre stelle della tua età',
    lightYears: (n: string) => `${n} anni luce`,
    nakedEye: 'a occhio nudo',
    withBinoculars: 'col binocolo',
    withTelescope: 'col telescopio',
    share: 'Condividi la tua stella',
    shareText: (name: string) => `La luce di ${name} è partita il giorno della mia nascita e arriva adesso. Trova la tua stella:`,
    shareCardLine: 'La sua luce è partita il giorno della mia nascita.',
    shared: 'Link copiato.',
    precision: 'Le distanze delle stelle si conoscono con un margine che va da qualche settimana a qualche mese di luce: le date sono approssimate.',
    credits: 'Dati stellari: HYG Database (CC BY-SA 4.0). Costellazioni: d3-celestial. Calcoli astronomici: Astronomy Engine.',
    privacy: 'La tua data di nascita resta sul tuo dispositivo.',
    months: 'long' as const,
    directions: DIRECTIONS.it,
    cardinals: CARDINALS.it,
  },
  en: {
    title: 'Which star shares your age?',
    lead: 'Starlight travels for years before it reaches us. Somewhere in the sky there is a star whose light set out on the day you were born, and is reaching you right now.',
    birthLabel: 'Your date of birth',
    find: 'Find my star',
    invalidDate: 'Enter a date in the past, after 1900.',
    loading: 'Searching the stars…',
    changeDate: 'Change date',
    sharedIntro: 'Someone sent you their star.',
    findYours: 'Find yours',
    travel: (years: string) => `Light from this star takes ${years} years to reach Earth.`,
    arrivedPast: (date: string) => `The light that left it on the day you were born arrived here on ${date}.`,
    arrivingNow: 'The light that left it on the day you were born is arriving right about now.',
    arrivingFuture: (date: string) => `The light that left it on the day you were born will arrive on ${date}. Mark the date.`,
    departedShared: (date: string) => `The light reaching us from it tonight left around ${date}.`,
    tonightTitle: 'Where to look',
    placeFrom: (name: string) => `From ${name}`,
    changePlace: 'Change place',
    needPlace: 'To tell you where to look, I need to know where you’re looking from.',
    useLocation: 'Use my location',
    searchCity: 'Search for a city',
    search: 'Search',
    searchPlaceholder: 'E.g. Naples, Buenos Aires, Tokyo',
    locating: 'Finding your location…',
    locationDenied: 'Location unavailable. Search for your city below.',
    noResults: 'No city found with that name.',
    myPosition: 'your location',
    lookAt: (time: string, dir: string, alt: number, fists: string) =>
      `Around ${time}, look ${dir}, ${alt}° above the horizon: ${fists} at arm’s length.`,
    overhead: (time: string) => `Around ${time} it’s almost overhead: look straight up.`,
    fists: (n: number) => (n <= 1 ? 'about one fist' : `about ${n} fists`),
    visibleBetween: (a: string, b: string) => `It’s high enough to see from ${a} to ${b}.`,
    notTonight: 'Tonight it stays too low or is lost in the Sun’s glare.',
    backOn: (date: string) => `It will be back in the evening sky from around ${date}.`,
    backOnMorning: (date: string) => `It will be back from around ${date}, shortly before dawn.`,
    noNight: 'At this time of year the sky here never gets dark enough.',
    never: (lat: string) => `From here it never rises high enough. To see it well you need to be ${lat}.`,
    southOf: (lat: string) => `south of latitude ${lat}`,
    northOf: (lat: string) => `north of latitude ${lat}`,
    see: {
      city: 'Bright enough to see even from a city.',
      suburb: 'Visible to the naked eye away from the brightest lights.',
      dark: 'Visible to the naked eye only under a dark sky, away from town.',
      binoculars: 'Too faint for the naked eye: you’ll need binoculars.',
      telescope: 'Very faint: you’ll need a telescope.',
    },
    skyAt: (time: string) => `The sky at ${time}`,
    skyNow: 'The sky right now',
    skyTonight: 'Tonight’s sky',
    belowHorizon: 'below the horizon',
    aboutTitle: 'What it’s like',
    isA: (name: string, kind: string) => `${name} is ${kind}.`,
    kind: {
      O: 'a very hot blue star', B: 'a very hot blue star', A: 'a white star',
      F: 'a yellow-white star', G: 'a yellow star like the Sun', K: 'an orange star',
      M: 'a red star', W: 'a Wolf-Rayet star', D: 'a white dwarf', X: 'a star',
    } as Record<string, string>,
    giant: (k: string) => k.replace(/ star\b/, ' giant'),
    supergiant: (k: string) => k.replace(/ star\b/, ' supergiant'),
    inConstellation: (con: string) => `in the constellation ${con}`,
    brighter: (n: string) => `It gives off ${n} times as much light as the Sun.`,
    fainter: (pct: string) => `It gives off about ${pct}% of the Sun’s light.`,
    sunLike: 'It gives off about as much light as the Sun.',
    distance: (ly: string, km: string) => `It is ${ly} light years away: ${km} kilometres.`,
    temp: (k: string) => `Its surface is at about ${k} degrees.`,
    othersTitle: 'Other stars your age',
    lightYears: (n: string) => `${n} light years`,
    nakedEye: 'naked eye',
    withBinoculars: 'binoculars',
    withTelescope: 'telescope',
    share: 'Share your star',
    shareText: (name: string) => `The light from ${name} left it the day I was born and is arriving now. Find your star:`,
    shareCardLine: 'Its light set out the day I was born.',
    shared: 'Link copied.',
    precision: 'Star distances are known to within a few weeks to a few months of light travel, so the dates are approximate.',
    credits: 'Star data: HYG Database (CC BY-SA 4.0). Constellations: d3-celestial. Astronomy: Astronomy Engine.',
    privacy: 'Your date of birth never leaves your device.',
    months: 'long' as const,
    directions: DIRECTIONS.en,
    cardinals: CARDINALS.en,
  },
};

export function t() {
  return strings[locale.lang];
}

export function direction(az: number): string {
  return t().directions[Math.round(az / 45) % 8];
}

export function fmtDate(d: Date, timeZone?: string): string {
  return d.toLocaleDateString(locale.lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone });
}

export function fmtTime(d: Date, timeZone?: string): string {
  return d.toLocaleTimeString(locale.lang, { hour: '2-digit', minute: '2-digit', timeZone });
}

export function fmtNum(n: number, digits = 0): string {
  return n.toLocaleString(locale.lang, { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

export function fmtLat(lat: number): string {
  return `${Math.abs(Math.round(lat))}° ${lat >= 0 ? 'N' : 'S'}`;
}
