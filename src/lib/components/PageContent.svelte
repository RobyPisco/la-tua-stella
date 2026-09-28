<script lang="ts">
  import type { PageContent } from '$lib/content';

  let { content }: { content: PageContent } = $props();
</script>

<article class="content">
  {#each content.sections as section}
    <section>
      <h2>{section.heading}</h2>
      {#each section.paragraphs as p}<p>{p}</p>{/each}
    </section>
  {/each}
  <section>
    <h2>{content.faqTitle}</h2>
    <dl class="faq">
      {#each content.faq as item}
        <div>
          <dt>{item.q}</dt>
          <dd>{item.a}</dd>
        </div>
      {/each}
    </dl>
  </section>
</article>

<style>
  .content {
    max-width: 78rem;
    margin: 5rem auto 0;
    display: grid;
    gap: 3rem;
  }
  section {
    display: grid;
    gap: 1rem;
    max-width: 42rem;
  }
  h2 {
    font-size: clamp(1.8rem, 3.5vw, 2.4rem);
  }
  p {
    color: var(--ink);
  }
  .faq {
    margin: 0;
    display: grid;
    gap: 1.5rem;
  }
  dt {
    font-family: var(--serif);
    font-size: 1.3rem;
    margin-bottom: 0.35rem;
  }
  dd {
    margin: 0;
    color: var(--muted);
  }
</style>
