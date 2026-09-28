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
      description: 'Cosa puoi fare con i poster del cielo creati su Sky of Your Day: gratis per uso personale e per i regali, non per la rivendita.',
      lead: 'Sky of Your Day è gratuito e lo resterà. Queste poche regole servono a tenerlo così.',
      sections: [
        {
          h: 'Cosa puoi fare',
          p: [
            'Creare, scaricare e stampare tutti i poster e le immagini che vuoi, senza pagare nulla.',
            'Usarli per te, appenderli a casa, regalarli, condividerli sui social o in un messaggio.',
            'Portare il file in copisteria o a una stamperia online per farlo stampare.',
          ],
        },
        {
          h: 'Cosa non è consentito',
          p: [
            'Vendere i poster o i file creati con il sito, anche modificati: per esempio su Etsy, Amazon, eBay o in un negozio.',
            'Offrire a pagamento la creazione di poster fatti con il sito.',
            'Togliere l’indirizzo skyofyourday.com dai poster per presentarli come un lavoro proprio.',
          ],
        },
        {
          h: 'Di chi sono le cose',
          p: [
            'La grafica, l’impaginazione dei poster e i testi del sito sono di Sky of Your Day.',
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
      description: 'What you can do with the sky posters made on Sky of Your Day: free for personal use and gifts, not for resale.',
      lead: 'Sky of Your Day is free and will stay free. These few rules help keep it that way.',
      sections: [
        {
          h: 'What you can do',
          p: [
            'Make, download and print as many posters and images as you like, without paying anything.',
            'Use them yourself, hang them at home, give them as gifts, share them on social media or in a message.',
            'Take the file to a print shop or an online printing service to have it printed.',
          ],
        },
        {
          h: 'What is not allowed',
          p: [
            'Selling posters or files made with the site, even modified ones: for example on Etsy, Amazon, eBay or in a shop.',
            'Offering paid poster-making made with the site.',
            'Removing the skyofyourday.com address from posters to present them as your own work.',
          ],
        },
        {
          h: 'Who owns what',
          p: [
            'The design, the poster layout and the texts of the site belong to Sky of Your Day.',
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
      description: 'Qué puedes hacer con los pósters del cielo creados en Sky of Your Day: gratis para uso personal y para regalar, no para revender.',
      lead: 'Sky of Your Day es gratis y lo seguirá siendo. Estas pocas reglas sirven para que siga así.',
      sections: [
        {
          h: 'Qué puedes hacer',
          p: [
            'Crear, descargar e imprimir todos los pósters e imágenes que quieras, sin pagar nada.',
            'Usarlos para ti, colgarlos en casa, regalarlos, compartirlos en redes sociales o en un mensaje.',
            'Llevar el archivo a una copistería o a una imprenta online para imprimirlo.',
          ],
        },
        {
          h: 'Qué no está permitido',
          p: [
            'Vender los pósters o los archivos creados con el sitio, aunque estén modificados: por ejemplo en Etsy, Amazon, eBay o en una tienda.',
            'Ofrecer como servicio de pago la creación de pósters hechos con el sitio.',
            'Quitar la dirección skyofyourday.com de los pósters para presentarlos como un trabajo propio.',
          ],
        },
        {
          h: 'De quién es cada cosa',
          p: [
            'El diseño, la maquetación de los pósters y los textos del sitio son de Sky of Your Day.',
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
      description: 'Was du mit den Himmelspostern von Sky of Your Day machen darfst: kostenlos für den persönlichen Gebrauch und als Geschenk, nicht zum Weiterverkauf.',
      lead: 'Sky of Your Day ist kostenlos und bleibt es. Diese wenigen Regeln sorgen dafür, dass es so bleibt.',
      sections: [
        {
          h: 'Was du darfst',
          p: [
            'So viele Poster und Bilder erstellen, herunterladen und drucken, wie du willst, ohne etwas zu bezahlen.',
            'Sie selbst nutzen, zu Hause aufhängen, verschenken, in sozialen Medien oder in einer Nachricht teilen.',
            'Die Datei in einen Copyshop oder zu einer Online-Druckerei bringen, um sie drucken zu lassen.',
          ],
        },
        {
          h: 'Was nicht erlaubt ist',
          p: [
            'Mit der Website erstellte Poster oder Dateien verkaufen, auch verändert: zum Beispiel auf Etsy, Amazon, eBay oder in einem Geschäft.',
            'Die Erstellung von Postern mit der Website als bezahlte Dienstleistung anbieten.',
            'Die Adresse skyofyourday.com von den Postern entfernen, um sie als eigene Arbeit auszugeben.',
          ],
        },
        {
          h: 'Wem was gehört',
          p: [
            'Die Gestaltung, das Layout der Poster und die Texte der Website gehören Sky of Your Day.',
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
      description: 'Ce que tu peux faire avec les posters du ciel créés sur Sky of Your Day : gratuits pour un usage personnel et pour offrir, pas pour la revente.',
      lead: 'Sky of Your Day est gratuit et le restera. Ces quelques règles servent à ce qu’il le reste.',
      sections: [
        {
          h: 'Ce que tu peux faire',
          p: [
            'Créer, télécharger et imprimer autant de posters et d’images que tu veux, sans rien payer.',
            'Les utiliser pour toi, les accrocher chez toi, les offrir, les partager sur les réseaux sociaux ou dans un message.',
            'Apporter le fichier chez un imprimeur ou à un service d’impression en ligne pour le faire imprimer.',
          ],
        },
        {
          h: 'Ce qui n’est pas autorisé',
          p: [
            'Vendre les posters ou les fichiers créés avec le site, même modifiés : par exemple sur Etsy, Amazon, eBay ou dans une boutique.',
            'Proposer contre paiement la création de posters faits avec le site.',
            'Retirer l’adresse skyofyourday.com des posters pour les présenter comme ton propre travail.',
          ],
        },
        {
          h: 'À qui appartient quoi',
          p: [
            'Le graphisme, la mise en page des posters et les textes du site appartiennent à Sky of Your Day.',
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
      description: 'O que você pode fazer com os pôsteres do céu criados no Sky of Your Day: grátis para uso pessoal e para presentear, não para revenda.',
      lead: 'O Sky of Your Day é grátis e vai continuar assim. Estas poucas regras servem para manter as coisas assim.',
      sections: [
        {
          h: 'O que você pode fazer',
          p: [
            'Criar, baixar e imprimir quantos pôsteres e imagens quiser, sem pagar nada.',
            'Usá-los para você, pendurá-los em casa, dar de presente, compartilhar nas redes sociais ou numa mensagem.',
            'Levar o arquivo a uma gráfica ou a um serviço de impressão online para imprimir.',
          ],
        },
        {
          h: 'O que não é permitido',
          p: [
            'Vender os pôsteres ou os arquivos criados com o site, mesmo modificados: por exemplo na Etsy, na Amazon, no eBay ou numa loja.',
            'Oferecer como serviço pago a criação de pôsteres feitos com o site.',
            'Tirar o endereço skyofyourday.com dos pôsteres para apresentá-los como trabalho próprio.',
          ],
        },
        {
          h: 'De quem é cada coisa',
          p: [
            'O design, a diagramação dos pôsteres e os textos do site são do Sky of Your Day.',
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
