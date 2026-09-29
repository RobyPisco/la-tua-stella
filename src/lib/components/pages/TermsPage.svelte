<script lang="ts">
  import { KOFI_URL } from '$lib/brand';
  import type { Lang } from '$lib/i18n.svelte';
  import { PAGES } from '$lib/routes';
  import { SITE_NAME } from '$lib/site';
  import Seo from '../Seo.svelte';

  let { lang }: { lang: Lang } = $props();

  type Section = { h: string; p: string[] };
  type Terms = { title: string; description: string; lead: string; sections: Section[]; donate: Section };

  const TERMS: Record<Lang, Terms> = {
    it: {
      title: 'Condizioni d’uso',
      description: 'Cosa puoi fare con i poster del cielo creati su Sky of Your Day: sono gratis e distribuiti con licenza CC BY-SA 4.0, come i dati stellari da cui nascono.',
      lead: 'Sky of Your Day è gratuito e lo resterà. Queste poche regole servono a tenerlo così.',
      sections: [
        {
          h: 'Cosa puoi fare',
          p: [
            'Creare, scaricare e stampare tutti i poster e le immagini che vuoi, senza pagare nulla.',
            'Usarli per te, appenderli a casa, regalarli, condividerli sui social o in un messaggio.',
            'Portare il file in copisteria o a una stamperia online per farlo stampare.',
            'I poster e le immagini che crei sono distribuiti con licenza Creative Commons BY-SA 4.0, la stessa dei dati stellari da cui nascono: puoi usarli, modificarli e anche venderli, purché citi la fonte e condivida le versioni modificate con la stessa licenza.',
          ],
        },
        {
          h: 'Cosa resta riservato',
          p: [
            'Il nome e il marchio Sky of Your Day, il codice, la grafica del sito e i testi delle pagine: non si possono copiare per creare un servizio simile né usare per far credere che un prodotto venga da Sky of Your Day.',
            'Se ripubblichi o vendi un poster, lascia l’indirizzo skyofyourday.com e cita i dati, come chiede la licenza: per esempio «Sky of Your Day (skyofyourday.com), dati stellari HYG Database, CC BY-SA 4.0».',
          ],
        },
        {
          h: 'Di chi sono le cose',
          p: [
            'Il nome Sky of Your Day, il codice, la grafica del sito e i testi delle pagine sono di Sky of Your Day: tutti i diritti riservati.',
            'Le posizioni e i dati delle stelle vengono dall’HYG Database (CC BY-SA 4.0), le figure delle costellazioni da d3-celestial (BSD-3) e i calcoli da Astronomy Engine (MIT): restano liberi secondo le loro licenze.',
          ],
        },
        {
          h: 'Precisione',
          p: [
            'Il cielo è calcolato con cura per la data, l’ora e il luogo scelti, ma il sito è offerto così com’è, senza garanzie: i dati di alcune stelle, soprattutto le meno studiate, possono essere incompleti.',
          ],
        },
        {
          h: 'Privacy',
          p: [
            'Niente cookie e niente account. La data di nascita e il luogo restano sul tuo dispositivo.',
            'Quando cerchi una città, il nome cercato viene inviato a Open-Meteo per trovarne le coordinate.',
            'Quando scarichi un poster, il sito aggiunge 1 al contatore pubblico delle mappe create: si conta lo scaricamento, non chi lo fa.',
          ],
        },
      ],
      donate: {
        h: 'Donazioni',
        p: ['Chi vuole può sostenere il sito con una donazione volontaria. Non sblocca nulla: tutto resta gratis per tutti.'],
      },
    },
    en: {
      title: 'Terms of use',
      description: 'What you can do with the sky posters made on Sky of Your Day: they are free and released under CC BY-SA 4.0, like the star data they come from.',
      lead: 'Sky of Your Day is free and will stay free. These few rules help keep it that way.',
      sections: [
        {
          h: 'What you can do',
          p: [
            'Make, download and print as many posters and images as you like, without paying anything.',
            'Use them yourself, hang them at home, give them as gifts, share them on social media or in a message.',
            'Take the file to a print shop or an online printing service to have it printed.',
            'The posters and images you make are released under the Creative Commons BY-SA 4.0 licence, the same as the star data they come from: you can use them, change them and even sell them, as long as you credit the source and share changed versions under the same licence.',
          ],
        },
        {
          h: 'What stays reserved',
          p: [
            'The Sky of Your Day name and brand, the code, the site design and the page texts: they may not be copied to build a similar service or used to suggest that a product comes from Sky of Your Day.',
            'If you republish or sell a poster, keep the skyofyourday.com address and credit the data, as the licence requires: for example “Sky of Your Day (skyofyourday.com), star data HYG Database, CC BY-SA 4.0”.',
          ],
        },
        {
          h: 'Who owns what',
          p: [
            'The Sky of Your Day name, the code, the site design and the page texts belong to Sky of Your Day: all rights reserved.',
            'Star positions and data come from the HYG Database (CC BY-SA 4.0), constellation figures from d3-celestial (BSD-3) and calculations from Astronomy Engine (MIT): they remain free under their own licences.',
          ],
        },
        {
          h: 'Accuracy',
          p: [
            'The sky is carefully calculated for the chosen date, time and place, but the site is provided as is, without warranty: data for some stars, especially less studied ones, may be incomplete.',
          ],
        },
        {
          h: 'Privacy',
          p: [
            'No cookies and no accounts. Your date of birth and place stay on your device.',
            'When you search for a city, the name you type is sent to Open-Meteo to find its coordinates.',
            'When you download a poster, the site adds 1 to the public count of maps made: it counts the download, not who made it.',
          ],
        },
      ],
      donate: {
        h: 'Donations',
        p: ['Anyone who wants to can support the site with a voluntary donation. It unlocks nothing: everything stays free for everyone.'],
      },
    },
    es: {
      title: 'Condiciones de uso',
      description: 'Qué puedes hacer con los pósters del cielo creados en Sky of Your Day: son gratis y se distribuyen con licencia CC BY-SA 4.0, como los datos estelares de los que nacen.',
      lead: 'Sky of Your Day es gratis y lo seguirá siendo. Estas pocas reglas sirven para que siga así.',
      sections: [
        {
          h: 'Qué puedes hacer',
          p: [
            'Crear, descargar e imprimir todos los pósters e imágenes que quieras, sin pagar nada.',
            'Usarlos para ti, colgarlos en casa, regalarlos, compartirlos en redes sociales o en un mensaje.',
            'Llevar el archivo a una copistería o a una imprenta online para imprimirlo.',
            'Los pósters y las imágenes que creas se distribuyen con licencia Creative Commons BY-SA 4.0, la misma de los datos estelares de los que nacen: puedes usarlos, modificarlos e incluso venderlos, siempre que cites la fuente y compartas las versiones modificadas con la misma licencia.',
          ],
        },
        {
          h: 'Qué queda reservado',
          p: [
            'El nombre y la marca Sky of Your Day, el código, el diseño del sitio y los textos de las páginas: no se pueden copiar para crear un servicio similar ni usar para dar a entender que un producto viene de Sky of Your Day.',
            'Si vuelves a publicar o vendes un póster, deja la dirección skyofyourday.com y cita los datos, como pide la licencia: por ejemplo «Sky of Your Day (skyofyourday.com), datos estelares HYG Database, CC BY-SA 4.0».',
          ],
        },
        {
          h: 'De quién es cada cosa',
          p: [
            'El nombre Sky of Your Day, el código, el diseño del sitio y los textos de las páginas son de Sky of Your Day: todos los derechos reservados.',
            'Las posiciones y los datos de las estrellas proceden de HYG Database (CC BY-SA 4.0), las figuras de las constelaciones de d3-celestial (BSD-3) y los cálculos de Astronomy Engine (MIT): siguen siendo libres según sus licencias.',
          ],
        },
        {
          h: 'Precisión',
          p: [
            'El cielo se calcula con cuidado para la fecha, la hora y el lugar elegidos, pero el sitio se ofrece tal cual, sin garantías: los datos de algunas estrellas, sobre todo las menos estudiadas, pueden estar incompletos.',
          ],
        },
        {
          h: 'Privacidad',
          p: [
            'Sin cookies y sin cuentas. Tu fecha de nacimiento y tu lugar se quedan en tu dispositivo.',
            'Cuando buscas una ciudad, el nombre que escribes se envía a Open-Meteo para encontrar sus coordenadas.',
            'Cuando descargas un póster, el sitio suma 1 al contador público de mapas creados: se cuenta la descarga, no quién la hace.',
          ],
        },
      ],
      donate: {
        h: 'Donaciones',
        p: ['Quien quiera puede apoyar el sitio con una donación voluntaria. No desbloquea nada: todo sigue siendo gratis para todos.'],
      },
    },
    de: {
      title: 'Nutzungsbedingungen',
      description: 'Was du mit den Himmelspostern von Sky of Your Day machen darfst: Sie sind kostenlos und stehen unter CC BY-SA 4.0, wie die Sterndaten, aus denen sie entstehen.',
      lead: 'Sky of Your Day ist kostenlos und bleibt es. Diese wenigen Regeln sorgen dafür, dass es so bleibt.',
      sections: [
        {
          h: 'Was du darfst',
          p: [
            'So viele Poster und Bilder erstellen, herunterladen und drucken, wie du willst, ohne etwas zu bezahlen.',
            'Sie selbst nutzen, zu Hause aufhängen, verschenken, in sozialen Medien oder in einer Nachricht teilen.',
            'Die Datei in einen Copyshop oder zu einer Online-Druckerei bringen, um sie drucken zu lassen.',
            'Die Poster und Bilder, die du erstellst, stehen unter der Lizenz Creative Commons BY-SA 4.0, derselben wie die Sterndaten, aus denen sie entstehen: Du darfst sie nutzen, verändern und sogar verkaufen, solange du die Quelle nennst und veränderte Fassungen unter derselben Lizenz weitergibst.',
          ],
        },
        {
          h: 'Was vorbehalten bleibt',
          p: [
            'Der Name und die Marke Sky of Your Day, der Code, die Gestaltung der Website und die Texte der Seiten: Sie dürfen nicht kopiert werden, um einen ähnlichen Dienst aufzubauen, und nicht verwendet werden, um den Eindruck zu erwecken, ein Produkt stamme von Sky of Your Day.',
            'Wenn du ein Poster erneut veröffentlichst oder verkaufst, lass die Adresse skyofyourday.com stehen und nenne die Daten, wie es die Lizenz verlangt: zum Beispiel „Sky of Your Day (skyofyourday.com), Sterndaten HYG Database, CC BY-SA 4.0“.',
          ],
        },
        {
          h: 'Wem was gehört',
          p: [
            'Der Name Sky of Your Day, der Code, die Gestaltung der Website und die Texte der Seiten gehören Sky of Your Day: alle Rechte vorbehalten.',
            'Positionen und Daten der Sterne stammen aus der HYG Database (CC BY-SA 4.0), die Sternbildfiguren aus d3-celestial (BSD-3) und die Berechnungen aus Astronomy Engine (MIT): Sie bleiben unter ihren eigenen Lizenzen frei.',
          ],
        },
        {
          h: 'Genauigkeit',
          p: [
            'Der Himmel wird für das gewählte Datum, die Uhrzeit und den Ort sorgfältig berechnet, aber die Website wird ohne Gewähr angeboten, so wie sie ist: Die Daten einiger Sterne, vor allem der weniger erforschten, können unvollständig sein.',
          ],
        },
        {
          h: 'Datenschutz',
          p: [
            'Keine Cookies und keine Konten. Dein Geburtsdatum und dein Ort bleiben auf deinem Gerät.',
            'Wenn du nach einer Stadt suchst, wird der eingegebene Name an Open-Meteo gesendet, um ihre Koordinaten zu finden.',
            'Wenn du ein Poster herunterlädst, zählt die Website den öffentlichen Zähler der erstellten Karten um 1 hoch: Gezählt wird der Download, nicht wer ihn macht.',
          ],
        },
      ],
      donate: {
        h: 'Spenden',
        p: ['Wer möchte, kann die Website mit einer freiwilligen Spende unterstützen. Sie schaltet nichts frei: Alles bleibt für alle kostenlos.'],
      },
    },
    fr: {
      title: 'Conditions d’utilisation',
      description: 'Ce que tu peux faire avec les posters du ciel créés sur Sky of Your Day : ils sont gratuits et diffusés sous licence CC BY-SA 4.0, comme les données stellaires dont ils sont issus.',
      lead: 'Sky of Your Day est gratuit et le restera. Ces quelques règles servent à ce qu’il le reste.',
      sections: [
        {
          h: 'Ce que tu peux faire',
          p: [
            'Créer, télécharger et imprimer autant de posters et d’images que tu veux, sans rien payer.',
            'Les utiliser pour toi, les accrocher chez toi, les offrir, les partager sur les réseaux sociaux ou dans un message.',
            'Apporter le fichier chez un imprimeur ou à un service d’impression en ligne pour le faire imprimer.',
            'Les posters et les images que tu crées sont diffusés sous licence Creative Commons BY-SA 4.0, la même que celle des données stellaires dont ils sont issus : tu peux les utiliser, les modifier et même les vendre, à condition de citer la source et de partager les versions modifiées sous la même licence.',
          ],
        },
        {
          h: 'Ce qui reste réservé',
          p: [
            'Le nom et la marque Sky of Your Day, le code, le graphisme du site et les textes des pages : ils ne peuvent pas être copiés pour créer un service similaire ni utilisés pour laisser croire qu’un produit vient de Sky of Your Day.',
            'Si tu republies ou vends un poster, laisse l’adresse skyofyourday.com et cite les données, comme le demande la licence : par exemple « Sky of Your Day (skyofyourday.com), données stellaires HYG Database, CC BY-SA 4.0 ».',
          ],
        },
        {
          h: 'À qui appartient quoi',
          p: [
            'Le nom Sky of Your Day, le code, le graphisme du site et les textes des pages appartiennent à Sky of Your Day : tous droits réservés.',
            'Les positions et les données des étoiles viennent de la HYG Database (CC BY-SA 4.0), les figures des constellations de d3-celestial (BSD-3) et les calculs d’Astronomy Engine (MIT) : elles restent libres selon leurs licences.',
          ],
        },
        {
          h: 'Précision',
          p: [
            'Le ciel est calculé avec soin pour la date, l’heure et le lieu choisis, mais le site est proposé tel quel, sans garantie : les données de certaines étoiles, surtout les moins étudiées, peuvent être incomplètes.',
          ],
        },
        {
          h: 'Vie privée',
          p: [
            'Pas de cookies ni de compte. Ta date de naissance et ton lieu restent sur ton appareil.',
            'Quand tu cherches une ville, le nom saisi est envoyé à Open-Meteo pour trouver ses coordonnées.',
            'Quand tu télécharges un poster, le site ajoute 1 au compteur public des cartes créées : on compte le téléchargement, pas la personne.',
          ],
        },
      ],
      donate: {
        h: 'Dons',
        p: ['Qui le souhaite peut soutenir le site par un don volontaire. Il ne débloque rien : tout reste gratuit pour tout le monde.'],
      },
    },
    pt: {
      title: 'Termos de uso',
      description: 'O que você pode fazer com os pôsteres do céu criados no Sky of Your Day: são grátis e distribuídos com licença CC BY-SA 4.0, como os dados estelares de onde vêm.',
      lead: 'O Sky of Your Day é grátis e vai continuar assim. Estas poucas regras servem para manter as coisas assim.',
      sections: [
        {
          h: 'O que você pode fazer',
          p: [
            'Criar, baixar e imprimir quantos pôsteres e imagens quiser, sem pagar nada.',
            'Usá-los para você, pendurá-los em casa, dar de presente, compartilhar nas redes sociais ou numa mensagem.',
            'Levar o arquivo a uma gráfica ou a um serviço de impressão online para imprimir.',
            'Os pôsteres e as imagens que você cria são distribuídos com a licença Creative Commons BY-SA 4.0, a mesma dos dados estelares de onde vêm: você pode usá-los, modificá-los e até vendê-los, desde que cite a fonte e compartilhe as versões modificadas com a mesma licença.',
          ],
        },
        {
          h: 'O que continua reservado',
          p: [
            'O nome e a marca Sky of Your Day, o código, o design do site e os textos das páginas: não podem ser copiados para criar um serviço parecido nem usados para dar a entender que um produto vem do Sky of Your Day.',
            'Se você republicar ou vender um pôster, mantenha o endereço skyofyourday.com e cite os dados, como pede a licença: por exemplo “Sky of Your Day (skyofyourday.com), dados estelares HYG Database, CC BY-SA 4.0”.',
          ],
        },
        {
          h: 'De quem é cada coisa',
          p: [
            'O nome Sky of Your Day, o código, o design do site e os textos das páginas são do Sky of Your Day: todos os direitos reservados.',
            'As posições e os dados das estrelas vêm do HYG Database (CC BY-SA 4.0), as figuras das constelações do d3-celestial (BSD-3) e os cálculos do Astronomy Engine (MIT): continuam livres segundo as suas licenças.',
          ],
        },
        {
          h: 'Precisão',
          p: [
            'O céu é calculado com cuidado para a data, a hora e o lugar escolhidos, mas o site é oferecido como está, sem garantias: os dados de algumas estrelas, sobretudo as menos estudadas, podem estar incompletos.',
          ],
        },
        {
          h: 'Privacidade',
          p: [
            'Sem cookies e sem contas. Sua data de nascimento e seu lugar ficam no seu aparelho.',
            'Quando você procura uma cidade, o nome digitado é enviado ao Open-Meteo para encontrar as coordenadas.',
            'Quando você baixa um pôster, o site soma 1 ao contador público de mapas criados: conta-se o download, não quem faz.',
          ],
        },
      ],
      donate: {
        h: 'Doações',
        p: ['Quem quiser pode apoiar o site com uma doação voluntária. Ela não libera nada: tudo continua grátis para todos.'],
      },
    },
  };

  const c = $derived(TERMS[lang]);
</script>

<Seo title={`${c.title} | ${SITE_NAME}`} description={c.description} {lang} alternates={PAGES.terms} image={`/og/${lang}/terms.png`} />

<article class="doc">
  <header>
    <h1>{c.title}</h1>
    <p class="lead">{c.lead}</p>
  </header>
  {#each c.sections as s (s.h)}
    <section>
      <h2>{s.h}</h2>
      {#each s.p as line}<p>{line}</p>{/each}
    </section>
  {/each}
  {#if KOFI_URL}
    <section>
      <h2>{c.donate.h}</h2>
      {#each c.donate.p as line}<p>{line} <a href={KOFI_URL} target="_blank" rel="noopener">Ko-fi</a></p>{/each}
    </section>
  {/if}
</article>
