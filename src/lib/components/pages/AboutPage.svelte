<script lang="ts">
  import { KOFI_URL } from '$lib/brand';
  import type { Lang } from '$lib/i18n.svelte';
  import { PAGES } from '$lib/routes';
  import Seo from '../Seo.svelte';

  let { lang }: { lang: Lang } = $props();

  type About = { title: string; description: string; p: string[]; made: string; donateH: string; donateP: string; donateBtn: string };

  const ABOUT: Record<Lang, About> = {
    it: {
      title: 'Chi sono',
      description: 'Chi c’è dietro Sky of Your Day e perché è gratis.',
      p: [
        'Non c’è un team, non c’è un’azienda: c’è una persona sola, con la curiosità di sapere che aspetto avesse il cielo il giorno della propria nascita — e senza un modo semplice per vederlo.',
        'Da lì è nato Sky of Your Day: un modo per trovare la stella la cui luce è partita quel giorno e sta arrivando solo ora, e per portarla a casa in un poster vero, da stampare o regalare.',
        'Niente pubblicità, niente in vendita: il dominio lo pago di tasca propria. Se il sito è stato utile, un caffè su Ko-fi aiuta a tenerlo online — ma resterà sempre gratis.',
      ],
      made: 'Fatto in Italia, con un po’ d’amore per il mondo.',
      donateH: 'Se ti va di offrirmi un caffè',
      donateP: 'Non sblocca nulla, non cambia niente: è solo un modo per dire grazie.',
      donateBtn: 'Offri un caffè',
    },
    en: {
      title: 'About',
      description: 'Who’s behind Sky of Your Day, and why it’s free.',
      p: [
        'There’s no team, no company: there’s one person, curious to know what the sky looked like on the day they were born — and unable to find an easy way to see it.',
        'That’s where Sky of Your Day came from: a way to find the star whose light left that day and is only arriving now, and to bring it home as a real poster, to print or give away.',
        'No ads, nothing for sale: the domain is paid for out of pocket. If the site was useful, a coffee on Ko-fi helps keep it running — but it will always stay free.',
      ],
      made: 'Made in Italy, with a little love for the world.',
      donateH: 'If you’d like to buy me a coffee',
      donateP: 'It unlocks nothing, it changes nothing: it’s just a way to say thanks.',
      donateBtn: 'Buy a coffee',
    },
    es: {
      title: 'Sobre mí',
      description: 'Quién está detrás de Sky of Your Day y por qué es gratis.',
      p: [
        'No hay equipo, no hay empresa: hay una persona, con la curiosidad de saber cómo era el cielo el día de su nacimiento, sin encontrar una forma sencilla de verlo.',
        'De ahí nació Sky of Your Day: una manera de encontrar la estrella cuya luz salió ese día y está llegando justo ahora, y de llevártela a casa en un póster real, para imprimir o regalar.',
        'Sin publicidad, sin nada en venta: el dominio se paga de su propio bolsillo. Si el sitio ha sido útil, un café en Ko-fi ayuda a mantenerlo en marcha — pero seguirá siendo gratis siempre.',
      ],
      made: 'Hecho en Italia, con un poco de amor por el mundo.',
      donateH: 'Si te apetece invitarme a un café',
      donateP: 'No desbloquea nada, no cambia nada: es solo una forma de decir gracias.',
      donateBtn: 'Invitar a un café',
    },
    de: {
      title: 'Über mich',
      description: 'Wer hinter Sky of Your Day steckt und warum es kostenlos ist.',
      p: [
        'Es gibt kein Team, kein Unternehmen: Es gibt eine Person, die eines Abends wissen wollte, wie der Himmel am eigenen Geburtstag aussah — und keinen einfachen Weg fand, ihn zu sehen.',
        'Daraus ist Sky of Your Day entstanden: ein Weg, den Stern zu finden, dessen Licht an diesem Tag aufgebrochen ist und gerade erst ankommt, und ihn als echtes Poster mit nach Hause zu nehmen, zum Drucken oder Verschenken.',
        'Keine Werbung, nichts zu verkaufen: Die Domain wird aus eigener Tasche bezahlt. Wenn die Seite geholfen hat, hilft ein Kaffee auf Ko-fi, sie am Laufen zu halten — aber sie bleibt immer kostenlos.',
      ],
      made: 'Gemacht in Italien, mit ein bisschen Liebe für die Welt.',
      donateH: 'Wenn du mir einen Kaffee ausgeben möchtest',
      donateP: 'Es schaltet nichts frei, es ändert nichts: Es ist nur eine Art, Danke zu sagen.',
      donateBtn: 'Einen Kaffee spendieren',
    },
    fr: {
      title: 'À propos',
      description: 'Qui est derrière Sky of Your Day, et pourquoi c’est gratuit.',
      p: [
        'Il n’y a pas d’équipe, pas d’entreprise : il y a une seule personne, curieuse de savoir à quoi ressemblait le ciel le jour de sa naissance — sans trouver de moyen simple de le voir.',
        'C’est de là qu’est né Sky of Your Day : une façon de trouver l’étoile dont la lumière est partie ce jour-là et arrive seulement maintenant, et de la ramener chez toi dans un poster bien réel, à imprimer ou à offrir.',
        'Pas de publicité, rien à vendre : le nom de domaine est payé de sa poche. Si le site a été utile, un café sur Ko-fi aide à le maintenir en ligne — mais il restera toujours gratuit.',
      ],
      made: 'Fait en Italie, avec un peu d’amour pour le monde.',
      donateH: 'Si tu as envie de m’offrir un café',
      donateP: 'Ça ne débloque rien, ça ne change rien : c’est juste une façon de dire merci.',
      donateBtn: 'Offrir un café',
    },
    pt: {
      title: 'Sobre mim',
      description: 'Quem está por trás do Sky of Your Day e por que é grátis.',
      p: [
        'Não há equipe, não há empresa: há uma pessoa, com a curiosidade de saber como era o céu no dia do seu nascimento — e sem encontrar um jeito simples de ver isso.',
        'Foi daí que nasceu o Sky of Your Day: um jeito de encontrar a estrela cuja luz partiu naquele dia e está chegando só agora, e de levá-la para casa num pôster de verdade, para imprimir ou dar de presente.',
        'Sem anúncios, nada à venda: o domínio é pago do próprio bolso. Se o site foi útil, um café no Ko-fi ajuda a mantê-lo no ar — mas ele vai continuar sendo grátis sempre.',
      ],
      made: 'Feito na Itália, com um pouco de amor pelo mundo.',
      donateH: 'Se você quiser me pagar um café',
      donateP: 'Não libera nada, não muda nada: é só um jeito de dizer obrigado.',
      donateBtn: 'Pagar um café',
    },
  };

  const c = $derived(ABOUT[lang]);
</script>

<Seo title={c.title} description={c.description} {lang} alternates={PAGES.about} image={`/og/${lang}/about.png`} />

<article class="doc">
  <header>
    <h1>{c.title}</h1>
  </header>
  <section>
    {#each c.p as line}<p>{line}</p>{/each}
    <p class="note"><em>{c.made}</em></p>
  </section>
  {#if KOFI_URL}
    <div class="cta">
      <h2>{c.donateH}</h2>
      <p>{c.donateP}</p>
      <div class="actions">
        <a class="btn" href={KOFI_URL} target="_blank" rel="noopener">{c.donateBtn}</a>
      </div>
    </div>
  {/if}
</article>
