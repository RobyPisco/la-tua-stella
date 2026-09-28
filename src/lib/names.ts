// IAU constellations: genitive (used in Bayer/Flamsteed names), Italian phrase after
// "costellazione", English name, Spanish phrase after "constelación", German name (after
// "im Sternbild"), French phrase after "constellation", Portuguese phrase after "constelação".
export const CONSTELLATIONS: Record<string, [gen: string, it: string, en: string, es: string, de: string, fr: string, pt: string]> = {
  And: ['Andromedae', "di Andromeda", 'Andromeda', 'de Andrómeda', 'Andromeda', "d'Andromède", 'de Andrômeda'],
  Ant: ['Antliae', 'della Macchina Pneumatica', 'Antlia', 'de la Máquina Neumática', 'Luftpumpe', 'de la Machine pneumatique', 'da Máquina Pneumática'],
  Aps: ['Apodis', "dell'Uccello del Paradiso", 'Apus', 'del Ave del Paraíso', 'Paradiesvogel', "de l'Oiseau de paradis", 'da Ave-do-Paraíso'],
  Aqr: ['Aquarii', "dell'Acquario", 'Aquarius', 'de Acuario', 'Wassermann', 'du Verseau', 'de Aquário'],
  Aql: ['Aquilae', "dell'Aquila", 'Aquila', 'del Águila', 'Adler', "de l'Aigle", 'da Águia'],
  Ara: ['Arae', "dell'Altare", 'Ara', 'del Altar', 'Altar', "de l'Autel", 'do Altar'],
  Ari: ['Arietis', "dell'Ariete", 'Aries', 'de Aries', 'Widder', 'du Bélier', 'de Áries'],
  Aur: ['Aurigae', "dell'Auriga", 'Auriga', 'de Auriga', 'Fuhrmann', 'du Cocher', 'do Cocheiro'],
  Boo: ['Boötis', 'del Boote', 'Boötes', 'del Boyero', 'Bärenhüter', 'du Bouvier', 'do Boieiro'],
  Cae: ['Caeli', 'del Bulino', 'Caelum', 'del Cincel', 'Grabstichel', 'du Burin', 'do Cinzel'],
  Cam: ['Camelopardalis', 'della Giraffa', 'Camelopardalis', 'de la Jirafa', 'Giraffe', 'de la Girafe', 'da Girafa'],
  Cnc: ['Cancri', 'del Cancro', 'Cancer', 'de Cáncer', 'Krebs', 'du Cancer', 'de Câncer'],
  CVn: ['Canum Venaticorum', 'dei Cani da Caccia', 'Canes Venatici', 'de los Perros de Caza', 'Jagdhunde', 'des Chiens de chasse', 'dos Cães de Caça'],
  CMa: ['Canis Majoris', 'del Cane Maggiore', 'Canis Major', 'del Can Mayor', 'Großer Hund', 'du Grand Chien', 'do Cão Maior'],
  CMi: ['Canis Minoris', 'del Cane Minore', 'Canis Minor', 'del Can Menor', 'Kleiner Hund', 'du Petit Chien', 'do Cão Menor'],
  Cap: ['Capricorni', 'del Capricorno', 'Capricornus', 'de Capricornio', 'Steinbock', 'du Capricorne', 'de Capricórnio'],
  Car: ['Carinae', 'della Carena', 'Carina', 'de la Quilla', 'Kiel des Schiffs', 'de la Carène', 'da Quilha'],
  Cas: ['Cassiopeiae', 'di Cassiopea', 'Cassiopeia', 'de Casiopea', 'Kassiopeia', 'de Cassiopée', 'de Cassiopeia'],
  Cen: ['Centauri', 'del Centauro', 'Centaurus', 'del Centauro', 'Zentaur', 'du Centaure', 'do Centauro'],
  Cep: ['Cephei', 'di Cefeo', 'Cepheus', 'de Cefeo', 'Kepheus', 'de Céphée', 'de Cefeu'],
  Cet: ['Ceti', 'della Balena', 'Cetus', 'de la Ballena', 'Walfisch', 'de la Baleine', 'da Baleia'],
  Cha: ['Chamaeleontis', 'del Camaleonte', 'Chamaeleon', 'del Camaleón', 'Chamäleon', 'du Caméléon', 'do Camaleão'],
  Cir: ['Circini', 'del Compasso', 'Circinus', 'del Compás', 'Zirkel', 'du Compas', 'do Compasso'],
  Col: ['Columbae', 'della Colomba', 'Columba', 'de la Paloma', 'Taube', 'de la Colombe', 'da Pomba'],
  Com: ['Comae Berenices', 'della Chioma di Berenice', 'Coma Berenices', 'de la Cabellera de Berenice', 'Haar der Berenike', 'de la Chevelure de Bérénice', 'da Cabeleira de Berenice'],
  CrA: ['Coronae Australis', 'della Corona Australe', 'Corona Australis', 'de la Corona Austral', 'Südliche Krone', 'de la Couronne australe', 'da Coroa Austral'],
  CrB: ['Coronae Borealis', 'della Corona Boreale', 'Corona Borealis', 'de la Corona Boreal', 'Nördliche Krone', 'de la Couronne boréale', 'da Coroa Boreal'],
  Crv: ['Corvi', 'del Corvo', 'Corvus', 'del Cuervo', 'Rabe', 'du Corbeau', 'do Corvo'],
  Crt: ['Crateris', 'della Coppa', 'Crater', 'de la Copa', 'Becher', 'de la Coupe', 'da Taça'],
  Cru: ['Crucis', 'della Croce del Sud', 'Crux', 'de la Cruz del Sur', 'Kreuz des Südens', 'de la Croix du Sud', 'do Cruzeiro do Sul'],
  Cyg: ['Cygni', 'del Cigno', 'Cygnus', 'del Cisne', 'Schwan', 'du Cygne', 'do Cisne'],
  Del: ['Delphini', 'del Delfino', 'Delphinus', 'del Delfín', 'Delphin', 'du Dauphin', 'do Golfinho'],
  Dor: ['Doradus', 'del Dorado', 'Dorado', 'del Dorado', 'Goldfisch', 'de la Dorade', 'do Dourado'],
  Dra: ['Draconis', 'del Drago', 'Draco', 'del Dragón', 'Drache', 'du Dragon', 'do Dragão'],
  Equ: ['Equulei', 'del Cavallino', 'Equuleus', 'del Caballito', 'Füllen', 'du Petit Cheval', 'do Cavalo Menor'],
  Eri: ['Eridani', "dell'Eridano", 'Eridanus', 'de Erídano', 'Eridanus', "de l'Éridan", 'de Erídano'],
  For: ['Fornacis', 'della Fornace', 'Fornax', 'del Horno', 'Chemischer Ofen', 'du Fourneau', 'da Fornalha'],
  Gem: ['Geminorum', 'dei Gemelli', 'Gemini', 'de Géminis', 'Zwillinge', 'des Gémeaux', 'de Gêmeos'],
  Gru: ['Gruis', 'della Gru', 'Grus', 'de la Grulla', 'Kranich', 'de la Grue', 'do Grou'],
  Her: ['Herculis', 'di Ercole', 'Hercules', 'de Hércules', 'Herkules', "d'Hercule", 'de Hércules'],
  Hor: ['Horologii', "dell'Orologio", 'Horologium', 'del Reloj', 'Pendeluhr', "de l'Horloge", 'do Relógio'],
  Hya: ['Hydrae', "dell'Idra", 'Hydra', 'de la Hidra', 'Wasserschlange', "de l'Hydre", 'da Hidra'],
  Hyi: ['Hydri', "dell'Idra Maschio", 'Hydrus', 'de la Hidra Macho', 'Kleine Wasserschlange', "de l'Hydre mâle", 'da Hidra Macho'],
  Ind: ['Indi', "dell'Indiano", 'Indus', 'del Indio', 'Inder', "de l'Indien", 'do Índio'],
  Lac: ['Lacertae', 'della Lucertola', 'Lacerta', 'del Lagarto', 'Eidechse', 'du Lézard', 'do Lagarto'],
  Leo: ['Leonis', 'del Leone', 'Leo', 'de Leo', 'Löwe', 'du Lion', 'de Leão'],
  LMi: ['Leonis Minoris', 'del Leone Minore', 'Leo Minor', 'del León Menor', 'Kleiner Löwe', 'du Petit Lion', 'do Leão Menor'],
  Lep: ['Leporis', 'della Lepre', 'Lepus', 'de la Liebre', 'Hase', 'du Lièvre', 'da Lebre'],
  Lib: ['Librae', 'della Bilancia', 'Libra', 'de Libra', 'Waage', 'de la Balance', 'de Libra'],
  Lup: ['Lupi', 'del Lupo', 'Lupus', 'del Lobo', 'Wolf', 'du Loup', 'do Lobo'],
  Lyn: ['Lyncis', 'della Lince', 'Lynx', 'del Lince', 'Luchs', 'du Lynx', 'do Lince'],
  Lyr: ['Lyrae', 'della Lira', 'Lyra', 'de la Lira', 'Leier', 'de la Lyre', 'da Lira'],
  Men: ['Mensae', 'della Mensa', 'Mensa', 'de la Mesa', 'Tafelberg', 'de la Table', 'da Mesa'],
  Mic: ['Microscopii', 'del Microscopio', 'Microscopium', 'del Microscopio', 'Mikroskop', 'du Microscope', 'do Microscópio'],
  Mon: ['Monocerotis', "dell'Unicorno", 'Monoceros', 'del Unicornio', 'Einhorn', 'de la Licorne', 'do Unicórnio'],
  Mus: ['Muscae', 'della Mosca', 'Musca', 'de la Mosca', 'Fliege', 'de la Mouche', 'da Mosca'],
  Nor: ['Normae', 'del Regolo', 'Norma', 'de la Escuadra', 'Winkelmaß', 'de la Règle', 'do Esquadro'],
  Oct: ['Octantis', "dell'Ottante", 'Octans', 'del Octante', 'Oktant', "de l'Octant", 'do Oitante'],
  Oph: ['Ophiuchi', "dell'Ofiuco", 'Ophiuchus', 'de Ofiuco', 'Schlangenträger', "d'Ophiuchus", 'do Serpentário'],
  Ori: ['Orionis', "di Orione", 'Orion', 'de Orión', 'Orion', "d'Orion", 'de Órion'],
  Pav: ['Pavonis', 'del Pavone', 'Pavo', 'del Pavo', 'Pfau', 'du Paon', 'do Pavão'],
  Peg: ['Pegasi', 'di Pegaso', 'Pegasus', 'de Pegaso', 'Pegasus', 'de Pégase', 'de Pégaso'],
  Per: ['Persei', 'di Perseo', 'Perseus', 'de Perseo', 'Perseus', 'de Persée', 'de Perseu'],
  Phe: ['Phoenicis', 'della Fenice', 'Phoenix', 'del Fénix', 'Phoenix', 'du Phénix', 'da Fênix'],
  Pic: ['Pictoris', 'del Pittore', 'Pictor', 'del Pintor', 'Maler', 'du Peintre', 'do Pintor'],
  Psc: ['Piscium', 'dei Pesci', 'Pisces', 'de Piscis', 'Fische', 'des Poissons', 'de Peixes'],
  PsA: ['Piscis Austrini', 'del Pesce Australe', 'Piscis Austrinus', 'del Pez Austral', 'Südlicher Fisch', 'du Poisson austral', 'do Peixe Austral'],
  Pup: ['Puppis', 'della Poppa', 'Puppis', 'de la Popa', 'Achterdeck', 'de la Poupe', 'da Popa'],
  Pyx: ['Pyxidis', 'della Bussola', 'Pyxis', 'de la Brújula', 'Schiffskompass', 'de la Boussole', 'da Bússola'],
  Ret: ['Reticuli', 'del Reticolo', 'Reticulum', 'del Retículo', 'Netz', 'du Réticule', 'do Retículo'],
  Sge: ['Sagittae', 'della Freccia', 'Sagitta', 'de la Flecha', 'Pfeil', 'de la Flèche', 'da Flecha'],
  Sgr: ['Sagittarii', 'del Sagittario', 'Sagittarius', 'de Sagitario', 'Schütze', 'du Sagittaire', 'de Sagitário'],
  Sco: ['Scorpii', 'dello Scorpione', 'Scorpius', 'de Escorpio', 'Skorpion', 'du Scorpion', 'de Escorpião'],
  Scl: ['Sculptoris', 'dello Scultore', 'Sculptor', 'del Escultor', 'Bildhauer', 'du Sculpteur', 'do Escultor'],
  Sct: ['Scuti', 'dello Scudo', 'Scutum', 'del Escudo', 'Schild', "de l'Écu de Sobieski", 'do Escudo'],
  Ser: ['Serpentis', 'del Serpente', 'Serpens', 'de la Serpiente', 'Schlange', 'du Serpent', 'da Serpente'],
  Sex: ['Sextantis', 'del Sestante', 'Sextans', 'del Sextante', 'Sextant', 'du Sextant', 'do Sextante'],
  Tau: ['Tauri', 'del Toro', 'Taurus', 'de Tauro', 'Stier', 'du Taureau', 'de Touro'],
  Tel: ['Telescopii', 'del Telescopio', 'Telescopium', 'del Telescopio', 'Teleskop', 'du Télescope', 'do Telescópio'],
  Tri: ['Trianguli', 'del Triangolo', 'Triangulum', 'del Triángulo', 'Dreieck', 'du Triangle', 'do Triângulo'],
  TrA: ['Trianguli Australis', 'del Triangolo Australe', 'Triangulum Australe', 'del Triángulo Austral', 'Südliches Dreieck', 'du Triangle austral', 'do Triângulo Austral'],
  Tuc: ['Tucanae', 'del Tucano', 'Tucana', 'del Tucán', 'Tukan', 'du Toucan', 'do Tucano'],
  UMa: ['Ursae Majoris', "dell'Orsa Maggiore", 'Ursa Major', 'de la Osa Mayor', 'Großer Bär', 'de la Grande Ourse', 'da Ursa Maior'],
  UMi: ['Ursae Minoris', "dell'Orsa Minore", 'Ursa Minor', 'de la Osa Menor', 'Kleiner Bär', 'de la Petite Ourse', 'da Ursa Menor'],
  Vel: ['Velorum', 'delle Vele', 'Vela', 'de la Vela', 'Segel', 'des Voiles', 'das Velas'],
  Vir: ['Virginis', 'della Vergine', 'Virgo', 'de Virgo', 'Jungfrau', 'de la Vierge', 'de Virgem'],
  Vol: ['Volantis', 'del Pesce Volante', 'Volans', 'del Pez Volador', 'Fliegender Fisch', 'du Poisson volant', 'do Peixe Voador'],
  Vul: ['Vulpeculae', 'della Volpetta', 'Vulpecula', 'de la Zorra', 'Fuchs', 'du Petit Renard', 'da Raposa'],
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
  de: {
    Arcturus: 'Arktur', Procyon: 'Prokyon', Polaris: 'Polarstern', Canopus: 'Kanopus',
    "Barnard's Star": 'Barnards Pfeilstern', "Kapteyn's Star": 'Kapteyns Stern',
    "Luyten's Star": 'Luytens Stern', "Van Maanen's Star": 'Van Maanens Stern',
    "Teegarden's Star": 'Teegardens Stern',
  },
  fr: {
    Regulus: 'Régulus', Polaris: 'Étoile polaire', Aldebaran: 'Aldébaran', Betelgeuse: 'Bételgeuse',
    Vega: 'Véga', Altair: 'Altaïr', Antares: 'Antarès', Deneb: 'Deneb', Achernar: 'Achernar',
    "Barnard's Star": 'Étoile de Barnard', "Kapteyn's Star": 'Étoile de Kapteyn',
    "Luyten's Star": 'Étoile de Luyten', "Van Maanen's Star": 'Étoile de van Maanen',
    "Teegarden's Star": 'Étoile de Teegarden',
  },
  pt: {
    Arcturus: 'Arcturo', Sirius: 'Sírius', Procyon: 'Prócion', Pollux: 'Pólux',
    Regulus: 'Régulo', Polaris: 'Estrela Polar', Aldebaran: 'Aldebarã', Spica: 'Espiga',
    "Barnard's Star": 'Estrela de Barnard', "Kapteyn's Star": 'Estrela de Kapteyn',
    "Luyten's Star": 'Estrela de Luyten', "Van Maanen's Star": 'Estrela de van Maanen',
    "Teegarden's Star": 'Estrela de Teegarden',
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

const COLUMN: Record<string, number> = { it: 1, en: 2, es: 3, de: 4, fr: 5, pt: 6 };

/** The constellation as it follows "costellazione" / "constelación" / "the constellation". */
export function constellationName(con: string, lang: string): string {
  const c = CONSTELLATIONS[con];
  if (!c) return con;
  return c[COLUMN[lang] ?? 2];
}

/** The bare name, for tables and lists: "Cigno", "Cisne", "Cygnus". */
export function constellationPlain(con: string, lang: string): string {
  return constellationName(con, lang).replace(
    // Elided forms first, or "de l'Aigle" would lose only "de ".
    /^(?:dell['’]|de l['’]|d['’]|(?:di|della|dello|delle|dei|del|de la|de los|de las|de|du|des|do|da|dos|das) )/,
    '',
  );
}

export function genitive(con: string): string {
  return CONSTELLATIONS[con]?.[0] ?? con;
}
