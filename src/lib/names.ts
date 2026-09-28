// IAU constellations: genitive (used in Bayer/Flamsteed names), Italian phrase after
// "costellazione", English name, Spanish phrase after "constelación".
export const CONSTELLATIONS: Record<string, [gen: string, it: string, en: string, es: string]> = {
  And: ['Andromedae', "di Andromeda", 'Andromeda', 'de Andrómeda'],
  Ant: ['Antliae', 'della Macchina Pneumatica', 'Antlia', 'de la Máquina Neumática'],
  Aps: ['Apodis', "dell'Uccello del Paradiso", 'Apus', 'del Ave del Paraíso'],
  Aqr: ['Aquarii', "dell'Acquario", 'Aquarius', 'de Acuario'],
  Aql: ['Aquilae', "dell'Aquila", 'Aquila', 'del Águila'],
  Ara: ['Arae', "dell'Altare", 'Ara', 'del Altar'],
  Ari: ['Arietis', "dell'Ariete", 'Aries', 'de Aries'],
  Aur: ['Aurigae', "dell'Auriga", 'Auriga', 'de Auriga'],
  Boo: ['Boötis', 'del Boote', 'Boötes', 'del Boyero'],
  Cae: ['Caeli', 'del Bulino', 'Caelum', 'del Cincel'],
  Cam: ['Camelopardalis', 'della Giraffa', 'Camelopardalis', 'de la Jirafa'],
  Cnc: ['Cancri', 'del Cancro', 'Cancer', 'de Cáncer'],
  CVn: ['Canum Venaticorum', 'dei Cani da Caccia', 'Canes Venatici', 'de los Perros de Caza'],
  CMa: ['Canis Majoris', 'del Cane Maggiore', 'Canis Major', 'del Can Mayor'],
  CMi: ['Canis Minoris', 'del Cane Minore', 'Canis Minor', 'del Can Menor'],
  Cap: ['Capricorni', 'del Capricorno', 'Capricornus', 'de Capricornio'],
  Car: ['Carinae', 'della Carena', 'Carina', 'de la Quilla'],
  Cas: ['Cassiopeiae', 'di Cassiopea', 'Cassiopeia', 'de Casiopea'],
  Cen: ['Centauri', 'del Centauro', 'Centaurus', 'del Centauro'],
  Cep: ['Cephei', 'di Cefeo', 'Cepheus', 'de Cefeo'],
  Cet: ['Ceti', 'della Balena', 'Cetus', 'de la Ballena'],
  Cha: ['Chamaeleontis', 'del Camaleonte', 'Chamaeleon', 'del Camaleón'],
  Cir: ['Circini', 'del Compasso', 'Circinus', 'del Compás'],
  Col: ['Columbae', 'della Colomba', 'Columba', 'de la Paloma'],
  Com: ['Comae Berenices', 'della Chioma di Berenice', 'Coma Berenices', 'de la Cabellera de Berenice'],
  CrA: ['Coronae Australis', 'della Corona Australe', 'Corona Australis', 'de la Corona Austral'],
  CrB: ['Coronae Borealis', 'della Corona Boreale', 'Corona Borealis', 'de la Corona Boreal'],
  Crv: ['Corvi', 'del Corvo', 'Corvus', 'del Cuervo'],
  Crt: ['Crateris', 'della Coppa', 'Crater', 'de la Copa'],
  Cru: ['Crucis', 'della Croce del Sud', 'Crux', 'de la Cruz del Sur'],
  Cyg: ['Cygni', 'del Cigno', 'Cygnus', 'del Cisne'],
  Del: ['Delphini', 'del Delfino', 'Delphinus', 'del Delfín'],
  Dor: ['Doradus', 'del Dorado', 'Dorado', 'del Dorado'],
  Dra: ['Draconis', 'del Drago', 'Draco', 'del Dragón'],
  Equ: ['Equulei', 'del Cavallino', 'Equuleus', 'del Caballito'],
  Eri: ['Eridani', "dell'Eridano", 'Eridanus', 'de Erídano'],
  For: ['Fornacis', 'della Fornace', 'Fornax', 'del Horno'],
  Gem: ['Geminorum', 'dei Gemelli', 'Gemini', 'de Géminis'],
  Gru: ['Gruis', 'della Gru', 'Grus', 'de la Grulla'],
  Her: ['Herculis', 'di Ercole', 'Hercules', 'de Hércules'],
  Hor: ['Horologii', "dell'Orologio", 'Horologium', 'del Reloj'],
  Hya: ['Hydrae', "dell'Idra", 'Hydra', 'de la Hidra'],
  Hyi: ['Hydri', "dell'Idra Maschio", 'Hydrus', 'de la Hidra Macho'],
  Ind: ['Indi', "dell'Indiano", 'Indus', 'del Indio'],
  Lac: ['Lacertae', 'della Lucertola', 'Lacerta', 'del Lagarto'],
  Leo: ['Leonis', 'del Leone', 'Leo', 'de Leo'],
  LMi: ['Leonis Minoris', 'del Leone Minore', 'Leo Minor', 'del León Menor'],
  Lep: ['Leporis', 'della Lepre', 'Lepus', 'de la Liebre'],
  Lib: ['Librae', 'della Bilancia', 'Libra', 'de Libra'],
  Lup: ['Lupi', 'del Lupo', 'Lupus', 'del Lobo'],
  Lyn: ['Lyncis', 'della Lince', 'Lynx', 'del Lince'],
  Lyr: ['Lyrae', 'della Lira', 'Lyra', 'de la Lira'],
  Men: ['Mensae', 'della Mensa', 'Mensa', 'de la Mesa'],
  Mic: ['Microscopii', 'del Microscopio', 'Microscopium', 'del Microscopio'],
  Mon: ['Monocerotis', "dell'Unicorno", 'Monoceros', 'del Unicornio'],
  Mus: ['Muscae', 'della Mosca', 'Musca', 'de la Mosca'],
  Nor: ['Normae', 'del Regolo', 'Norma', 'de la Escuadra'],
  Oct: ['Octantis', "dell'Ottante", 'Octans', 'del Octante'],
  Oph: ['Ophiuchi', "dell'Ofiuco", 'Ophiuchus', 'de Ofiuco'],
  Ori: ['Orionis', "di Orione", 'Orion', 'de Orión'],
  Pav: ['Pavonis', 'del Pavone', 'Pavo', 'del Pavo'],
  Peg: ['Pegasi', 'di Pegaso', 'Pegasus', 'de Pegaso'],
  Per: ['Persei', 'di Perseo', 'Perseus', 'de Perseo'],
  Phe: ['Phoenicis', 'della Fenice', 'Phoenix', 'del Fénix'],
  Pic: ['Pictoris', 'del Pittore', 'Pictor', 'del Pintor'],
  Psc: ['Piscium', 'dei Pesci', 'Pisces', 'de Piscis'],
  PsA: ['Piscis Austrini', 'del Pesce Australe', 'Piscis Austrinus', 'del Pez Austral'],
  Pup: ['Puppis', 'della Poppa', 'Puppis', 'de la Popa'],
  Pyx: ['Pyxidis', 'della Bussola', 'Pyxis', 'de la Brújula'],
  Ret: ['Reticuli', 'del Reticolo', 'Reticulum', 'del Retículo'],
  Sge: ['Sagittae', 'della Freccia', 'Sagitta', 'de la Flecha'],
  Sgr: ['Sagittarii', 'del Sagittario', 'Sagittarius', 'de Sagitario'],
  Sco: ['Scorpii', 'dello Scorpione', 'Scorpius', 'de Escorpio'],
  Scl: ['Sculptoris', 'dello Scultore', 'Sculptor', 'del Escultor'],
  Sct: ['Scuti', 'dello Scudo', 'Scutum', 'del Escudo'],
  Ser: ['Serpentis', 'del Serpente', 'Serpens', 'de la Serpiente'],
  Sex: ['Sextantis', 'del Sestante', 'Sextans', 'del Sextante'],
  Tau: ['Tauri', 'del Toro', 'Taurus', 'de Tauro'],
  Tel: ['Telescopii', 'del Telescopio', 'Telescopium', 'del Telescopio'],
  Tri: ['Trianguli', 'del Triangolo', 'Triangulum', 'del Triángulo'],
  TrA: ['Trianguli Australis', 'del Triangolo Australe', 'Triangulum Australe', 'del Triángulo Austral'],
  Tuc: ['Tucanae', 'del Tucano', 'Tucana', 'del Tucán'],
  UMa: ['Ursae Majoris', "dell'Orsa Maggiore", 'Ursa Major', 'de la Osa Mayor'],
  UMi: ['Ursae Minoris', "dell'Orsa Minore", 'Ursa Minor', 'de la Osa Menor'],
  Vel: ['Velorum', 'delle Vele', 'Vela', 'de la Vela'],
  Vir: ['Virginis', 'della Vergine', 'Virgo', 'de Virgo'],
  Vol: ['Volantis', 'del Pesce Volante', 'Volans', 'del Pez Volador'],
  Vul: ['Vulpeculae', 'della Volpetta', 'Vulpecula', 'de la Zorra'],
};

const GREEK: Record<string, string> = {
  Alp: 'α', Bet: 'β', Gam: 'γ', Del: 'δ', Eps: 'ε', Zet: 'ζ', Eta: 'η', The: 'θ',
  Iot: 'ι', Kap: 'κ', Lam: 'λ', Mu: 'μ', Nu: 'ν', Xi: 'ξ', Omi: 'ο', Pi: 'π',
  Rho: 'ρ', Sig: 'σ', Tau: 'τ', Ups: 'υ', Phi: 'φ', Chi: 'χ', Psi: 'ψ', Ome: 'ω',
};
const SUPERSCRIPT = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

// Traditional forms of the best-known proper names.
const PROPER: Record<string, Record<string, string>> = {
  it: {
    Arcturus: 'Arturo', Sirius: 'Sirio', Procyon: 'Procione', Pollux: 'Polluce',
    Castor: 'Castore', Regulus: 'Regolo', Polaris: 'Stella Polare', Canopus: 'Canopo',
    "Barnard's Star": 'Stella di Barnard', "Kapteyn's Star": 'Stella di Kapteyn',
    "Luyten's Star": 'Stella di Luyten', "Van Maanen's Star": 'Stella di van Maanen',
    "Teegarden's Star": 'Stella di Teegarden',
  },
  es: {
    Arcturus: 'Arturo', Sirius: 'Sirio', Procyon: 'Proción', Pollux: 'Pólux',
    Castor: 'Cástor', Regulus: 'Régulo', Polaris: 'Estrella Polar', Canopus: 'Canopo',
    Aldebaran: 'Aldebarán', Spica: 'Espiga',
    "Barnard's Star": 'Estrella de Barnard', "Kapteyn's Star": 'Estrella de Kapteyn',
    "Luyten's Star": 'Estrella de Luyten', "Van Maanen's Star": 'Estrella de van Maanen',
    "Teegarden's Star": 'Estrella de Teegarden',
  },
};

export function bayer(code: string): string {
  const [base, idx] = code.split('-');
  const letter = GREEK[base] ?? base;
  return idx ? letter + [...idx].map((d) => SUPERSCRIPT[+d]).join('') : letter;
}

export function properName(name: string, lang: string): string {
  return PROPER[lang]?.[name] ?? name;
}

/** The constellation as it follows "costellazione" / "constelación" / "the constellation". */
export function constellationName(con: string, lang: string): string {
  const c = CONSTELLATIONS[con];
  if (!c) return con;
  return lang === 'it' ? c[1] : lang === 'es' ? c[3] : c[2];
}

/** The bare name, for tables and lists: "Cigno", "Cisne", "Cygnus". */
export function constellationPlain(con: string, lang: string): string {
  return constellationName(con, lang).replace(/^(?:(?:di|della|dello|delle|dei|del|de la|de los|de las|de) |dell['’])/, '');
}

export function genitive(con: string): string {
  return CONSTELLATIONS[con]?.[0] ?? con;
}
