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
  };

  const c = $derived(TERMS[lang]);
</script>

<Seo title={`${c.title} | ${SITE_NAME}`} description={c.description} {lang} alternates={PAGES.terms} />

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
