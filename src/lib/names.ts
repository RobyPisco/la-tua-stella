// IAU constellations: genitive (used in Bayer/Flamsteed names), Italian phrase
// after "costellazione", English name.
export const CONSTELLATIONS: Record<string, [gen: string, it: string, en: string]> = {
  And: ['Andromedae', "di Andromeda", 'Andromeda'],
  Ant: ['Antliae', 'della Macchina Pneumatica', 'Antlia'],
  Aps: ['Apodis', "dell'Uccello del Paradiso", 'Apus'],
  Aqr: ['Aquarii', "dell'Acquario", 'Aquarius'],
  Aql: ['Aquilae', "dell'Aquila", 'Aquila'],
  Ara: ['Arae', "dell'Altare", 'Ara'],
  Ari: ['Arietis', "dell'Ariete", 'Aries'],
  Aur: ['Aurigae', "dell'Auriga", 'Auriga'],
  Boo: ['Boötis', 'del Boote', 'Boötes'],
  Cae: ['Caeli', 'del Bulino', 'Caelum'],
  Cam: ['Camelopardalis', 'della Giraffa', 'Camelopardalis'],
  Cnc: ['Cancri', 'del Cancro', 'Cancer'],
  CVn: ['Canum Venaticorum', 'dei Cani da Caccia', 'Canes Venatici'],
  CMa: ['Canis Majoris', 'del Cane Maggiore', 'Canis Major'],
  CMi: ['Canis Minoris', 'del Cane Minore', 'Canis Minor'],
  Cap: ['Capricorni', 'del Capricorno', 'Capricornus'],
  Car: ['Carinae', 'della Carena', 'Carina'],
  Cas: ['Cassiopeiae', 'di Cassiopea', 'Cassiopeia'],
  Cen: ['Centauri', 'del Centauro', 'Centaurus'],
  Cep: ['Cephei', 'di Cefeo', 'Cepheus'],
  Cet: ['Ceti', 'della Balena', 'Cetus'],
  Cha: ['Chamaeleontis', 'del Camaleonte', 'Chamaeleon'],
  Cir: ['Circini', 'del Compasso', 'Circinus'],
  Col: ['Columbae', 'della Colomba', 'Columba'],
  Com: ['Comae Berenices', 'della Chioma di Berenice', 'Coma Berenices'],
  CrA: ['Coronae Australis', 'della Corona Australe', 'Corona Australis'],
  CrB: ['Coronae Borealis', 'della Corona Boreale', 'Corona Borealis'],
  Crv: ['Corvi', 'del Corvo', 'Corvus'],
  Crt: ['Crateris', 'della Coppa', 'Crater'],
  Cru: ['Crucis', 'della Croce del Sud', 'Crux'],
  Cyg: ['Cygni', 'del Cigno', 'Cygnus'],
  Del: ['Delphini', 'del Delfino', 'Delphinus'],
  Dor: ['Doradus', 'del Dorado', 'Dorado'],
  Dra: ['Draconis', 'del Drago', 'Draco'],
  Equ: ['Equulei', 'del Cavallino', 'Equuleus'],
  Eri: ['Eridani', "dell'Eridano", 'Eridanus'],
  For: ['Fornacis', 'della Fornace', 'Fornax'],
  Gem: ['Geminorum', 'dei Gemelli', 'Gemini'],
  Gru: ['Gruis', 'della Gru', 'Grus'],
  Her: ['Herculis', 'di Ercole', 'Hercules'],
  Hor: ['Horologii', "dell'Orologio", 'Horologium'],
  Hya: ['Hydrae', "dell'Idra", 'Hydra'],
  Hyi: ['Hydri', "dell'Idra Maschio", 'Hydrus'],
  Ind: ['Indi', "dell'Indiano", 'Indus'],
  Lac: ['Lacertae', 'della Lucertola', 'Lacerta'],
  Leo: ['Leonis', 'del Leone', 'Leo'],
  LMi: ['Leonis Minoris', 'del Leone Minore', 'Leo Minor'],
  Lep: ['Leporis', 'della Lepre', 'Lepus'],
  Lib: ['Librae', 'della Bilancia', 'Libra'],
  Lup: ['Lupi', 'del Lupo', 'Lupus'],
  Lyn: ['Lyncis', 'della Lince', 'Lynx'],
  Lyr: ['Lyrae', 'della Lira', 'Lyra'],
  Men: ['Mensae', 'della Mensa', 'Mensa'],
  Mic: ['Microscopii', 'del Microscopio', 'Microscopium'],
  Mon: ['Monocerotis', "dell'Unicorno", 'Monoceros'],
  Mus: ['Muscae', 'della Mosca', 'Musca'],
  Nor: ['Normae', 'del Regolo', 'Norma'],
  Oct: ['Octantis', "dell'Ottante", 'Octans'],
  Oph: ['Ophiuchi', "dell'Ofiuco", 'Ophiuchus'],
  Ori: ['Orionis', "di Orione", 'Orion'],
  Pav: ['Pavonis', 'del Pavone', 'Pavo'],
  Peg: ['Pegasi', 'di Pegaso', 'Pegasus'],
  Per: ['Persei', 'di Perseo', 'Perseus'],
  Phe: ['Phoenicis', 'della Fenice', 'Phoenix'],
  Pic: ['Pictoris', 'del Pittore', 'Pictor'],
  Psc: ['Piscium', 'dei Pesci', 'Pisces'],
  PsA: ['Piscis Austrini', 'del Pesce Australe', 'Piscis Austrinus'],
  Pup: ['Puppis', 'della Poppa', 'Puppis'],
  Pyx: ['Pyxidis', 'della Bussola', 'Pyxis'],
  Ret: ['Reticuli', 'del Reticolo', 'Reticulum'],
  Sge: ['Sagittae', 'della Freccia', 'Sagitta'],
  Sgr: ['Sagittarii', 'del Sagittario', 'Sagittarius'],
  Sco: ['Scorpii', 'dello Scorpione', 'Scorpius'],
  Scl: ['Sculptoris', 'dello Scultore', 'Sculptor'],
  Sct: ['Scuti', 'dello Scudo', 'Scutum'],
  Ser: ['Serpentis', 'del Serpente', 'Serpens'],
  Sex: ['Sextantis', 'del Sestante', 'Sextans'],
  Tau: ['Tauri', 'del Toro', 'Taurus'],
  Tel: ['Telescopii', 'del Telescopio', 'Telescopium'],
  Tri: ['Trianguli', 'del Triangolo', 'Triangulum'],
  TrA: ['Trianguli Australis', 'del Triangolo Australe', 'Triangulum Australe'],
  Tuc: ['Tucanae', 'del Tucano', 'Tucana'],
  UMa: ['Ursae Majoris', "dell'Orsa Maggiore", 'Ursa Major'],
  UMi: ['Ursae Minoris', "dell'Orsa Minore", 'Ursa Minor'],
  Vel: ['Velorum', 'delle Vele', 'Vela'],
  Vir: ['Virginis', 'della Vergine', 'Virgo'],
  Vol: ['Volantis', 'del Pesce Volante', 'Volans'],
  Vul: ['Vulpeculae', 'della Volpetta', 'Vulpecula'],
};

const GREEK: Record<string, string> = {
  Alp: 'α', Bet: 'β', Gam: 'γ', Del: 'δ', Eps: 'ε', Zet: 'ζ', Eta: 'η', The: 'θ',
  Iot: 'ι', Kap: 'κ', Lam: 'λ', Mu: 'μ', Nu: 'ν', Xi: 'ξ', Omi: 'ο', Pi: 'π',
  Rho: 'ρ', Sig: 'σ', Tau: 'τ', Ups: 'υ', Phi: 'φ', Chi: 'χ', Psi: 'ψ', Ome: 'ω',
};
const SUPERSCRIPT = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

// Traditional Italian forms of the best-known proper names.
const PROPER_IT: Record<string, string> = {
  Arcturus: 'Arturo', Sirius: 'Sirio', Procyon: 'Procione', Pollux: 'Polluce',
  Castor: 'Castore', Regulus: 'Regolo', Polaris: 'Stella Polare',
  "Barnard's Star": 'Stella di Barnard', "Kapteyn's Star": 'Stella di Kapteyn',
  "Luyten's Star": 'Stella di Luyten', "Van Maanen's Star": 'Stella di van Maanen',
  "Teegarden's Star": 'Stella di Teegarden',
};

export function bayer(code: string): string {
  const [base, idx] = code.split('-');
  const letter = GREEK[base] ?? base;
  return idx ? letter + [...idx].map((d) => SUPERSCRIPT[+d]).join('') : letter;
}

export function properName(name: string, lang: string): string {
  return lang === 'it' ? (PROPER_IT[name] ?? name) : name;
}

export function constellationName(con: string, lang: string): string {
  const c = CONSTELLATIONS[con];
  if (!c) return con;
  return lang === 'it' ? c[1] : c[2];
}

export function genitive(con: string): string {
  return CONSTELLATIONS[con]?.[0] ?? con;
}
