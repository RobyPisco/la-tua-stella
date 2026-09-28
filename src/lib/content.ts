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
    de: {
      title: 'Dein Stern: der Stern, dessen Licht an deinem Geburtstag aufbrach | Sky of Your Day',
      description:
        'Gib dein Geburtsdatum ein und finde den Stern, dessen Licht an deinem Geburtstag aufgebrochen ist und jetzt die Erde erreicht. Sieh, wo du ihn heute Nacht findest. Kostenlos, ohne Anmeldung.',
      sections: [
        {
          heading: 'So funktioniert es',
          paragraphs: [
            'Licht braucht Zeit. Von einem Stern in 40 Lichtjahren Entfernung ist das Licht, das du heute Nacht siehst, vor 40 Jahren aufgebrochen.',
            'Für jedes Alter gibt es also einen Stern in genau der richtigen Entfernung: Das Licht, das ihn an deinem Geburtstag verlassen hat, kommt ungefähr jetzt auf der Erde an. Wir durchsuchen einen Katalog von über 4.000 nahen Sternen, erstellt aus den Katalogen Hipparcos, Yale und Gliese, nach dem Stern, der zu deinem Datum passt, und bevorzugen Sterne, die du mit bloßem Auge sehen kannst.',
            'Dann berechnen wir für deinen Standort, wann er aufgeht, wie hoch er steigt und in welche Richtung du schauen musst, und zeichnen den echten Himmel über dir mit deinem Stern darin. Mit dem Handy kannst du es zum Himmel halten und dem Pfeil folgen.',
          ],
        },
      ],
      faqTitle: 'Fragen',
      faq: [
        {
          q: 'Ist es ein echter Stern?',
          a: 'Ja. Jeder Stern hier ist ein echter Stern mit gemessener Entfernung. Nichts wird erfunden oder für dich „getauft“: Es ist der Stern, dessen Entfernung in Lichtjahren deinem Alter entspricht.',
        },
        {
          q: 'Wie genau ist das Datum?',
          a: 'Die Entfernungen der Sterne stammen aus Parallaxenmessungen. Bei nahen Sternen liegt die Unsicherheit zwischen einigen Wochen und einigen Monaten Lichtlaufzeit: Das Datum ist also eine gute Schätzung, nicht auf den Tag genau.',
        },
        {
          q: 'Und wenn mein Stern zu schwach ist, um ihn zu sehen?',
          a: 'Wir bevorzugen Sterne, die mit bloßem Auge sichtbar sind. Für manche Alter ist der passendste Stern schwach: Dann sagen wir dir, ob du einen dunklen Himmel, ein Fernglas oder ein Teleskop brauchst, und zeigen dir die anderen Sterne in deinem Alter.',
        },
        {
          q: 'Und bei Babys und kleinen Kindern?',
          a: 'Der nächste Stern, Proxima Centauri, ist 4,2 Lichtjahre entfernt. Bei Kindern unter vier Jahren ist das Licht, das an ihrem Geburtstag aufgebrochen ist, noch nicht angekommen: Wir zeigen, welcher Stern es ist und an welchem Tag sein Licht die Erde erreicht.',
        },
        {
          q: 'Ist es kostenlos? Was passiert mit meinen Daten?',
          a: 'Es ist kostenlos und ohne Anmeldung. Dein Geburtsdatum wird nur in deinem Browser verwendet und nirgendwohin gesendet. Wenn du nach einer Stadt suchst, wird nur ihr Name an den Geocoding-Dienst von Open-Meteo gesendet.',
        },
      ],
    },
    fr: {
      title: 'Ton étoile : l’étoile dont la lumière est partie le jour de ta naissance | Sky of Your Day',
      description:
        'Entre ta date de naissance et trouve l’étoile dont la lumière est partie le jour de ta naissance et atteint la Terre maintenant. Découvre où la regarder ce soir. Gratuit, sans inscription.',
      sections: [
        {
          heading: 'Comment ça marche',
          paragraphs: [
            'La lumière met du temps à voyager. D’une étoile située à 40 années-lumière, la lumière que tu vois ce soir est partie il y a 40 ans.',
            'Pour chaque âge, il existe donc une étoile à la bonne distance : la lumière qui l’a quittée le jour de ta naissance arrive sur Terre à peu près maintenant. Nous cherchons dans un catalogue de plus de 4 000 étoiles proches, construit à partir des catalogues Hipparcos, Yale et Gliese, celle qui correspond à ta date, en privilégiant les étoiles visibles à l’œil nu.',
            'Ensuite nous calculons, pour l’endroit où tu te trouves, quand elle se lève, à quelle hauteur elle monte et dans quelle direction regarder, et nous dessinons le vrai ciel au-dessus de toi avec ton étoile. Sur un téléphone, tu peux le lever vers le ciel et suivre la flèche.',
          ],
        },
      ],
      faqTitle: 'Questions',
      faq: [
        {
          q: 'C’est une vraie étoile ?',
          a: 'Oui. Chaque étoile ici est une vraie étoile dont la distance a été mesurée. Rien n’est inventé ni « baptisé » pour toi : c’est l’étoile dont la distance en années-lumière correspond à ton âge.',
        },
        {
          q: 'La date est-elle précise ?',
          a: 'Les distances des étoiles viennent de mesures de parallaxe. Pour les étoiles proches, l’incertitude va de quelques semaines à quelques mois de trajet de la lumière : la date est une bonne estimation, pas exacte au jour près.',
        },
        {
          q: 'Et si mon étoile est trop faible pour être vue ?',
          a: 'Nous privilégions les étoiles visibles à l’œil nu. Pour certains âges, l’étoile la plus proche du compte est faible : nous te disons s’il faut un ciel noir, des jumelles ou un télescope, et nous te montrons les autres étoiles de ton âge.',
        },
        {
          q: 'Et pour les bébés et les jeunes enfants ?',
          a: 'L’étoile la plus proche, Proxima du Centaure, est à 4,2 années-lumière. Pour les enfants de moins de quatre ans, la lumière partie le jour de leur naissance n’est pas encore arrivée : nous montrons de quelle étoile il s’agit et la date à laquelle sa lumière atteindra la Terre.',
        },
        {
          q: 'C’est gratuit ? Que deviennent mes données ?',
          a: 'C’est gratuit et sans inscription. Ta date de naissance est utilisée uniquement dans ton navigateur et n’est envoyée nulle part. Si tu cherches une ville, seul son nom est envoyé au service de géocodage d’Open-Meteo.',
        },
      ],
    },
    pt: {
      title: 'Sua estrela: a estrela cuja luz partiu no dia do seu nascimento | Sky of Your Day',
      description:
        'Digite sua data de nascimento e encontre a estrela cuja luz partiu no dia em que você nasceu e está chegando agora à Terra. Veja onde olhar esta noite. Grátis, sem cadastro.',
      sections: [
        {
          heading: 'Como funciona',
          paragraphs: [
            'A luz leva tempo para viajar. De uma estrela a 40 anos-luz, a luz que você vê esta noite partiu há 40 anos.',
            'Então, para cada idade existe uma estrela na distância certa: a luz que saiu dela no dia do seu nascimento está chegando à Terra mais ou menos agora. Procuramos num catálogo de mais de 4.000 estrelas próximas, montado a partir dos catálogos Hipparcos, Yale e Gliese, a que corresponde à sua data, e damos preferência às estrelas que você pode ver a olho nu.',
            'Depois calculamos, para o lugar onde você está, quando ela nasce, até que altura sobe e para que lado olhar, e desenhamos o céu real acima de você com a sua estrela. No celular, você pode apontá-lo para o céu e seguir a seta.',
          ],
        },
      ],
      faqTitle: 'Perguntas',
      faq: [
        {
          q: 'É uma estrela de verdade?',
          a: 'Sim. Cada estrela aqui é uma estrela real, com distância medida. Nada é inventado nem “batizado” para você: é a estrela cuja distância em anos-luz corresponde à sua idade.',
        },
        {
          q: 'A data é precisa?',
          a: 'As distâncias das estrelas vêm de medições de paralaxe. Para estrelas próximas, a incerteza vai de algumas semanas a alguns meses de viagem da luz: a data é uma boa estimativa, não exata ao dia.',
        },
        {
          q: 'E se a minha estrela for fraca demais para ver?',
          a: 'Damos preferência a estrelas visíveis a olho nu. Para algumas idades a estrela mais próxima da conta é fraca: dizemos se você precisa de um céu escuro, de binóculos ou de um telescópio, e mostramos as outras estrelas da sua idade.',
        },
        {
          q: 'E para bebês e crianças pequenas?',
          a: 'A estrela mais próxima, Proxima Centauri, está a 4,2 anos-luz. Para crianças com menos de quatro anos, a luz que partiu no dia do nascimento ainda não chegou: mostramos qual é a estrela e a data em que a luz dela vai chegar à Terra.',
        },
        {
          q: 'É grátis? O que acontece com os meus dados?',
          a: 'É grátis e sem cadastro. Sua data de nascimento é usada só no seu navegador e não é enviada a lugar nenhum. Se você procurar uma cidade, só o nome dela é enviado ao serviço de geocodificação do Open-Meteo.',
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
    de: {
      title: 'Sternkarte als Poster, kostenlos: der Nachthimmel zu jedem Datum und Ort | Sky of Your Day',
      description:
        'Erstelle eine Sternkarte des Himmels zu jedem Datum, jeder Uhrzeit und jedem Ort: echte Sterne, Sternbilder, Milchstraße, Mondphase und Planeten. Kostenloses PDF, PNG und SVG in hoher Auflösung, druckfertig.',
      sections: [
        {
          heading: 'Was auf deiner Sternkarte ist',
          paragraphs: [
            'Der Himmel genau so, wie er zu einem bestimmten Moment über einem Ort stand: fast 9.000 Sterne in ihren echten Farben, die Sternbilder mit ihren Namen, die Milchstraße, der Mond in seiner Phase jener Nacht und die Planeten, die zu sehen waren.',
            'Wir markieren auch den Stern jenes Tages: den Stern, dessen Licht an diesem Datum aufgebrochen ist und jetzt ungefähr die Erde erreicht. So wird aus der Karte einer Nacht eine kleine Geschichte über das Licht.',
          ],
        },
        {
          heading: 'Drucken',
          paragraphs: [
            'Wähle A4, A3, 30 × 40 oder 50 × 70 cm und lade das PDF herunter: Es hat genau die Papiergröße, bereit für den Copyshop oder den Drucker zu Hause. Für sehr große Drucke nimm das SVG, das in jeder Größe scharf bleibt. Die Formate quadratisch, 4:5 und Handy sind zum Teilen und für den Sperrbildschirm gedacht.',
          ],
        },
      ],
      faqTitle: 'Fragen',
      faq: [
        {
          q: 'Ist die Sternkarte genau?',
          a: 'Ja. Die Positionen werden für den genauen Ort und die genaue Uhrzeit berechnet, einschließlich der damals geltenden Sommerzeit, aus einem Katalog auf Basis der Hipparcos-Messungen. Mond und Planeten werden mit Astronomy Engine berechnet.',
        },
        {
          q: 'Ist es wirklich kostenlos? Gibt es ein Wasserzeichen?',
          a: 'Es ist kostenlos, ohne Anmeldung und ohne Wasserzeichen auf dem Himmel. Unten auf dem Poster steht klein die Adresse der Website.',
        },
        {
          q: 'Ich kenne die genaue Uhrzeit nicht. Was soll ich wählen?',
          a: 'Lass einfach 22:00. Der Himmel dreht sich um etwa 15 Grad pro Stunde, die Uhrzeit ändert also, welche Sterne hoch stehen; jede Abendstunde ergibt einen vollständigen und echten Nachthimmel für dieses Datum.',
        },
        {
          q: 'Kann ich eine für eine Hochzeit, einen Jahrestag oder eine Geburt machen?',
          a: 'Ja: jedes Datum, jeder Ort. Füge einen Titel und eine Widmung hinzu und wähle einen von vier Stilen: Nacht, Papier, Gold oder Weiß.',
        },
      ],
    },
    fr: {
      title: 'Carte du ciel en poster, gratuite : le ciel de n’importe quelle date et lieu | Sky of Your Day',
      description:
        'Crée une carte du ciel de n’importe quelle date, heure et lieu : vraies étoiles, constellations, Voie lactée, phase de la Lune et planètes. PDF, PNG et SVG gratuits en haute résolution, prêts à imprimer.',
      sections: [
        {
          heading: 'Ce qu’il y a sur ta carte du ciel',
          paragraphs: [
            'Le ciel exactement tel qu’il était au-dessus d’un lieu à un moment donné : près de 9 000 étoiles dans leurs vraies couleurs, les constellations avec leurs noms, la Voie lactée, la Lune dans sa phase de cette nuit-là et les planètes qui étaient levées.',
            'Nous indiquons aussi l’étoile de ce jour-là : celle dont la lumière est partie à cette date et atteint la Terre à peu près maintenant. La carte d’une nuit devient une petite histoire de lumière.',
          ],
        },
        {
          heading: 'L’imprimer',
          paragraphs: [
            'Choisis A4, A3, 30 × 40 ou 50 × 70 cm et télécharge le PDF : il est au format du papier, prêt pour un imprimeur ou une imprimante à la maison. Pour les très grands tirages, utilise le SVG, qui reste net à toutes les tailles. Les formats carré, 4:5 et téléphone sont faits pour le partage et pour l’écran de verrouillage.',
          ],
        },
      ],
      faqTitle: 'Questions',
      faq: [
        {
          q: 'La carte du ciel est-elle exacte ?',
          a: 'Oui. Les positions sont calculées pour le lieu et l’heure exacts, y compris l’heure d’été en vigueur à l’époque, à partir d’un catalogue fondé sur les mesures d’Hipparcos. La Lune et les planètes sont calculées avec Astronomy Engine.',
        },
        {
          q: 'C’est vraiment gratuit ? Y a-t-il un filigrane ?',
          a: 'C’est gratuit, sans inscription et sans filigrane sur le ciel. L’adresse du site figure en petit en bas du poster.',
        },
        {
          q: 'Je ne connais pas l’heure exacte. Que choisir ?',
          a: 'Laisse 22:00. Le ciel tourne d’environ 15 degrés par heure, donc l’heure change les étoiles qui sont hautes ; n’importe quelle heure du soir donne un ciel nocturne complet et vrai pour cette date.',
        },
        {
          q: 'Puis-je en faire une pour un mariage, un anniversaire ou une naissance ?',
          a: 'Oui : n’importe quelle date, n’importe quel lieu. Ajoute un titre et une dédicace, et choisis l’un des quatre styles : Nuit, Papier, Or ou Blanc.',
        },
      ],
    },
    pt: {
      title: 'Mapa estelar em pôster grátis: o céu de qualquer data e lugar | Sky of Your Day',
      description:
        'Crie um mapa estelar do céu de qualquer data, hora e lugar: estrelas reais, constelações, Via Láctea, fase da Lua e planetas. PDF, PNG e SVG grátis em alta resolução, prontos para imprimir.',
      sections: [
        {
          heading: 'O que tem no seu mapa estelar',
          paragraphs: [
            'O céu exatamente como estava sobre um lugar num certo momento: quase 9.000 estrelas com suas cores reais, as constelações com seus nomes, a Via Láctea, a Lua na fase daquela noite e os planetas que estavam no céu.',
            'Também marcamos a estrela daquele dia: a estrela cuja luz partiu naquela data e está chegando à Terra mais ou menos agora. O mapa de uma noite vira uma pequena história sobre a luz.',
          ],
        },
        {
          heading: 'Como imprimir',
          paragraphs: [
            'Escolha A4, A3, 30 × 40 ou 50 × 70 cm e baixe o PDF: ele já tem o tamanho do papel, pronto para a gráfica ou para a impressora de casa. Para impressões muito grandes use o SVG, que fica nítido em qualquer tamanho. Os formatos quadrado, 4:5 e celular são feitos para compartilhar e para a tela de bloqueio.',
          ],
        },
      ],
      faqTitle: 'Perguntas',
      faq: [
        {
          q: 'O mapa estelar é preciso?',
          a: 'Sim. As posições são calculadas para o lugar e a hora exatos, incluindo o horário de verão em vigor na época, a partir de um catálogo baseado nas medições do Hipparcos. A Lua e os planetas são calculados com o Astronomy Engine.',
        },
        {
          q: 'É grátis mesmo? Tem marca d’água?',
          a: 'É grátis, sem cadastro e sem marca d’água no céu. O endereço do site aparece pequeno na parte de baixo do pôster.',
        },
        {
          q: 'Não sei a hora exata. O que escolho?',
          a: 'Deixe 22:00. O céu gira cerca de 15 graus por hora, então a hora muda quais estrelas estão altas; qualquer hora da noite dá um céu noturno completo e real para aquela data.',
        },
        {
          q: 'Posso fazer um para um casamento, um aniversário ou um nascimento?',
          a: 'Sim: qualquer data, qualquer lugar. Adicione um título e uma dedicatória e escolha um dos quatro estilos: Noite, Papel, Ouro ou Branco.',
        },
      ],
    },
  },
};
