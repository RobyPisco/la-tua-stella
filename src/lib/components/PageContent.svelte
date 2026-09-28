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
    <!-- Closed by default; the answers stay in the page for search engines and work without JS. -->
    <div class="faq">
      {#each content.faq as item}
        <details>
          <summary>{item.q}</summary>
          <p class="answer">{item.a}</p>
        </details>
      {/each}
    </div>
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
    border-top: 1px solid var(--rule);
  }
  details {
    border-bottom: 1px solid var(--rule);
  }
  summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    font-family: var(--serif);
    font-size: 1.3rem;
    cursor: pointer;
    list-style: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  /* A plus that turns into a minus. */
  summary::after {
    content: '+';
    flex: none;
    font-family: var(--sans, inherit);
    font-size: 1.6rem;
    line-height: 1;
    color: var(--star);
    transition: transform 0.2s;
  }
  details[open] summary::after {
    content: '−';
  }
  summary:hover {
    color: var(--star);
  }
  .answer {
    margin: 0 0 1.25rem;
    color: var(--muted);
  }
</style>
