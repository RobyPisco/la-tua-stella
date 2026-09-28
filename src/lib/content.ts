import type { Lang } from './i18n.svelte';

export interface PageContent {
  title: string;
  description: string;
  sections: { heading: string; paragraphs: string[] }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
}

/** Copy for search engines and curious readers: shown under each tool, prerendered. */
export const CONTENT: Record<'home' | 'poster', Record<Lang, PageContent>> = {
  home: {
    en: {
      title: 'Your Star: the star whose light left it the day you were born | Sky of Your Day',
      description:
        'Enter your birth date and find the star whose light set out the day you were born and is reaching Earth now. See where to look for it tonight. Free, no sign-up.',
      sections: [
        {
          heading: 'How it works',
          paragraphs: [
            'Light takes time to travel. From a star 40 light years away, the light you see tonight set out 40 years ago.',
            'So for every age there is a star at just the right distance: the light that left it on the day you were born is reaching Earth right about now. We search a catalogue of more than 4,000 nearby stars, built from the Hipparcos, Yale and Gliese catalogues, for the one that matches your date, and prefer stars you can see with your own eyes.',
            'Then we work out, for where you are, when it rises, how high it climbs and which way to face, and draw the real sky above you with your star in it. On a phone you can hold it up to the sky and follow the arrow.',
          ],
        },
      ],
      faqTitle: 'Questions',
      faq: [
        {
          q: 'Is it a real star?',
          a: 'Yes. Every star here is a real star with a measured distance. Nothing is invented or "named" for you: it is the star whose distance in light years matches your age.',
        },
        {
          q: 'How precise is the date?',
          a: 'Star distances come from parallax measurements. For nearby stars the uncertainty ranges from a few weeks to a few months of light travel, so the date is a close estimate rather than exact to the day.',
        },
        {
          q: 'What if my star is too faint to see?',
          a: 'We prefer stars visible to the naked eye. For some ages the closest match is faint: we tell you whether you need a dark sky, binoculars or a telescope, and list the other stars your age.',
        },
        {
          q: 'What about babies and young children?',
          a: 'The nearest star, Proxima Centauri, is 4.2 light years away. For children under four, the light that left a star on their birthday has not arrived yet: we show which star it is and the date its light will reach Earth.',
        },
        {
          q: 'Is it free? What happens to my data?',
          a: 'It is free, with no sign-up. Your date of birth is used only in your browser and is never sent anywhere. If you search for a city, only its name is sent to the Open-Meteo geocoding service.',
        },
      ],
    },
    es: {
      title: 'Tu estrella: la estrella cuya luz salió el día de tu nacimiento | Sky of Your Day',
      description:
        'Introduce tu fecha de nacimiento y descubre la estrella cuya luz salió el día de tu nacimiento y está llegando ahora a la Tierra. Te decimos dónde mirarla esta noche. Gratis, sin registro.',
      sections: [
        {
          heading: 'Cómo funciona',
          paragraphs: [
            'La luz tarda en viajar. De una estrella a 40 años luz, la luz que ves esta noche salió hace 40 años.',
            'Así que para cada edad hay una estrella a la distancia justa: la luz que salió de ella el día de tu nacimiento está llegando a la Tierra justo ahora. La buscamos entre más de 4.000 estrellas cercanas, en un catálogo construido con los datos del satélite Hipparcos y los catálogos Yale y Gliese, y preferimos las que se ven a simple vista.',
            'Después calculamos, desde donde estás, cuándo sale, cuánto sube y hacia dónde mirar, y dibujamos el cielo real sobre ti con tu estrella. Con el móvil puedes levantarlo hacia el cielo y seguir la flecha.',
          ],
        },
      ],
      faqTitle: 'Preguntas',
      faq: [
        {
          q: '¿Es una estrella real?',
          a: 'Sí. Cada estrella es una estrella real con una distancia medida. No inventamos nada ni "ponemos nombre" a una estrella: es aquella cuya distancia en años luz coincide con tu edad.',
        },
        {
          q: '¿Qué precisión tiene la fecha?',
          a: 'Las distancias de las estrellas se miden por paralaje. Para las estrellas cercanas el margen va de unas semanas a unos meses de viaje de la luz: la fecha es una estimación cercana, no exacta al día.',
        },
        {
          q: '¿Y si mi estrella es demasiado débil para verla?',
          a: 'Preferimos las estrellas visibles a simple vista. Para algunas edades la más cercana a la fecha es débil: te decimos si hace falta un cielo oscuro, unos prismáticos o un telescopio, y te mostramos las demás estrellas de tu edad.',
        },
        {
          q: '¿Y para bebés y niños pequeños?',
          a: 'La estrella más cercana, Próxima Centauri, está a 4,2 años luz. Para quien tiene menos de cuatro años, la luz que salió de una estrella el día de su nacimiento todavía no ha llegado: te mostramos cuál es y el día en que llegará.',
        },
        {
          q: '¿Es gratis? ¿Qué pasa con mis datos?',
          a: 'Es gratis y sin registro. Tu fecha de nacimiento se queda en tu navegador y no se envía a nadie. Si buscas una ciudad, solo su nombre se envía al servicio de geocodificación de Open-Meteo.',
        },
      ],
    },
    it: {
      title: 'La tua stella: la stella la cui luce è partita il giorno della tua nascita | Sky of Your Day',
      description:
        'Inserisci la data di nascita e scopri la stella la cui luce è partita il giorno della tua nascita e arriva sulla Terra adesso. Ti diciamo dove guardarla stasera. Gratis, senza registrazione.',
      sections: [
        {
          heading: 'Come funziona',
          paragraphs: [
            'La luce impiega tempo a viaggiare. Da una stella lontana 40 anni luce, la luce che vedi stasera è partita 40 anni fa.',
            'Per ogni età esiste quindi una stella alla distanza giusta: la luce partita da lei il giorno della tua nascita sta arrivando sulla Terra proprio adesso. La cerchiamo tra più di 4.000 stelle vicine, in un catalogo costruito dai dati dei satelliti Hipparcos e dai cataloghi Yale e Gliese, preferendo quelle che si vedono a occhio nudo.',
            'Poi calcoliamo, dal luogo in cui ti trovi, quando sorge, quanto sale e da che parte guardare, e disegniamo il cielo vero sopra di te con la tua stella. Dal telefono puoi alzarlo verso il cielo e seguire la freccia.',
          ],
        },
      ],
      faqTitle: 'Domande',
      faq: [
        {
          q: 'È una stella vera?',
          a: 'Sì. Ogni stella è una stella reale con una distanza misurata. Non inventiamo nulla e non "diamo un nome" a una stella: è quella la cui distanza in anni luce corrisponde alla tua età.',
        },
        {
          q: 'Quanto è precisa la data?',
          a: 'Le distanze delle stelle si misurano con la parallasse. Per le stelle vicine il margine va da qualche settimana a qualche mese di viaggio della luce: la data è una stima vicina, non esatta al giorno.',
        },
        {
          q: 'E se la mia stella è troppo debole per vederla?',
          a: 'Preferiamo le stelle visibili a occhio nudo. Per alcune età la più vicina alla data è debole: ti diciamo se serve un cielo buio, un binocolo o un telescopio, e ti mostriamo le altre stelle della tua età.',
        },
        {
          q: 'E per i bambini piccoli?',
          a: 'La stella più vicina, Proxima Centauri, dista 4,2 anni luce. Per chi ha meno di quattro anni la luce partita da una stella il giorno della nascita non è ancora arrivata: ti mostriamo qual è e il giorno in cui arriverà.',
        },
        {
          q: 'È gratis? Che fine fanno i miei dati?',
          a: 'È gratis e senza registrazione. La data di nascita resta nel tuo browser e non viene inviata a nessuno. Se cerchi una città, solo il suo nome viene inviato al servizio di geocodifica di Open-Meteo.',
        },
      ],
    },
  },
  poster: {
    en: {
      title: 'Free Star Map Poster: the Night Sky of Any Date and Place | Sky of Your Day',
      description:
        'Make a star map of the sky on any date, time and place: real stars, constellations, the Milky Way, the Moon’s phase and the planets. Free high-resolution PDF, PNG and SVG, ready to print.',
      sections: [
        {
          heading: 'What’s on your star map',
          paragraphs: [
            'The sky exactly as it was above a place at a given moment: nearly 9,000 stars in their real colours, the constellations with their names, the Milky Way, the Moon with its phase that night and the planets that were up.',
            'We also mark the star of that day: the star whose light set out on that date and is reaching Earth about now. It turns a map of a night into a small story about light.',
          ],
        },
        {
          heading: 'Printing it',
          paragraphs: [
            'Choose A4, A3, 30 × 40 or 50 × 70 cm and download the PDF: it is sized to the paper, ready for a print shop or a home printer. For very large prints use the SVG, which stays sharp at any size. The square, 4:5 and phone formats are made for sharing and for your lock screen.',
          ],
        },
      ],
      faqTitle: 'Questions',
      faq: [
        {
          q: 'Is the star map accurate?',
          a: 'Yes. Positions are computed for the exact place and time, including the daylight saving time in force then, from a catalogue built on Hipparcos measurements. The Moon and planets are calculated with Astronomy Engine.',
        },
        {
          q: 'Is it really free? Is there a watermark?',
          a: 'It is free, with no sign-up and no watermark on the sky. A small site address sits at the bottom of the poster.',
        },
        {
          q: 'I don’t know the exact time. What should I choose?',
          a: 'Leave it at 22:00. The sky turns about 15 degrees an hour, so the time changes which stars are up; any evening hour gives a full, true night sky for that date.',
        },
        {
          q: 'Can I make one for a wedding, an anniversary or a birth?',
          a: 'Yes: any date, any place. Add a title and a dedication, and pick one of four styles: Night, Paper, Gold or White.',
        },
      ],
    },
    es: {
      title: 'Mapa estelar personalizado gratis: el cielo de una fecha y un lugar | Sky of Your Day',
      description:
        'Crea el mapa del cielo de cualquier fecha, hora y lugar: estrellas reales, constelaciones, Vía Láctea, fase de la Luna y planetas. PDF, PNG y SVG en alta resolución, gratis y listos para imprimir.',
      sections: [
        {
          heading: 'Qué hay en tu mapa estelar',
          paragraphs: [
            'El cielo exactamente como estaba sobre un lugar en un momento dado: casi 9.000 estrellas con sus colores reales, las constelaciones con sus nombres, la Vía Láctea, la Luna con su fase de aquella noche y los planetas que estaban en el cielo.',
            'También marcamos la estrella de aquel día: aquella cuya luz salió en esa fecha y está llegando a la Tierra más o menos ahora. Convierte el mapa de una noche en una pequeña historia sobre la luz.',
          ],
        },
        {
          heading: 'Cómo imprimirlo',
          paragraphs: [
            'Elige A4, A3, 30 × 40 o 50 × 70 cm y descarga el PDF: ya tiene la medida del papel, listo para la imprenta o la impresora de casa. Para impresiones muy grandes usa el SVG, que se mantiene nítido a cualquier tamaño. Los formatos cuadrado, 4:5 y móvil están pensados para las redes sociales y para el fondo de pantalla.',
          ],
        },
      ],
      faqTitle: 'Preguntas',
      faq: [
        {
          q: '¿El mapa estelar es preciso?',
          a: 'Sí. Las posiciones se calculan para el lugar y la hora exactos, incluido el horario de verano vigente entonces, a partir de un catálogo basado en las medidas del satélite Hipparcos. La Luna y los planetas se calculan con Astronomy Engine.',
        },
        {
          q: '¿Es gratis de verdad? ¿Tiene marca de agua?',
          a: 'Es gratis, sin registro y sin marca de agua sobre el cielo. Abajo del póster solo aparece la pequeña dirección del sitio.',
        },
        {
          q: 'No sé la hora exacta. ¿Qué elijo?',
          a: 'Deja las 22:00. El cielo gira unos 15 grados por hora, así que la hora cambia qué estrellas están altas; cualquier hora de la noche da un cielo nocturno completo y real para esa fecha.',
        },
        {
          q: '¿Puedo hacerlo para una boda, un aniversario o un nacimiento?',
          a: 'Sí: cualquier fecha, cualquier lugar. Añade un título y una dedicatoria y elige uno de los cuatro estilos: Noche, Papel, Oro o Blanco.',
        },
      ],
    },
    it: {
      title: 'Mappa stellare personalizzata gratis: il cielo di una data e di un luogo | Sky of Your Day',
      description:
        'Crea la mappa del cielo di qualsiasi data, ora e luogo: stelle vere, costellazioni, Via Lattea, fase della Luna e pianeti. PDF, PNG e SVG in alta risoluzione, gratis e pronti da stampare.',
      sections: [
        {
          heading: 'Cosa c’è nella tua mappa stellare',
          paragraphs: [
            'Il cielo esattamente com’era sopra un luogo in un certo momento: quasi 9.000 stelle con i loro colori reali, le costellazioni con i nomi, la Via Lattea, la Luna con la fase di quella notte e i pianeti che erano in cielo.',
            'Segniamo anche la stella di quel giorno: quella la cui luce è partita in quella data e arriva sulla Terra più o meno adesso. Trasforma la mappa di una notte in una piccola storia sulla luce.',
          ],
        },
        {
          heading: 'Come stamparla',
          paragraphs: [
            'Scegli A4, A3, 30 × 40 o 50 × 70 cm e scarica il PDF: ha già le misure del foglio, pronto per la copisteria o la stampante di casa. Per le stampe molto grandi usa l’SVG, che resta nitido a qualsiasi dimensione. I formati quadrato, 4:5 e telefono sono fatti per i social e per lo sfondo dello schermo.',
          ],
        },
      ],
      faqTitle: 'Domande',
      faq: [
        {
          q: 'La mappa stellare è precisa?',
          a: 'Sì. Le posizioni sono calcolate per il luogo e l’ora esatti, ora legale di allora compresa, a partire da un catalogo basato sulle misure del satellite Hipparcos. Luna e pianeti sono calcolati con Astronomy Engine.',
        },
        {
          q: 'È davvero gratis? C’è una filigrana?',
          a: 'È gratis, senza registrazione e senza filigrana sul cielo. In fondo al poster c’è solo il piccolo indirizzo del sito.',
        },
        {
          q: 'Non conosco l’ora esatta. Cosa scelgo?',
          a: 'Lascia le 22:00. Il cielo ruota di circa 15 gradi all’ora, quindi l’ora cambia quali stelle sono alte; qualsiasi ora della sera dà un cielo notturno completo e vero per quella data.',
        },
        {
          q: 'Posso farla per un matrimonio, un anniversario o una nascita?',
          a: 'Sì: qualsiasi data, qualsiasi luogo. Aggiungi un titolo e una dedica e scegli uno dei quattro stili: Notte, Carta, Oro o Bianco.',
        },
      ],
    },
  },
};
