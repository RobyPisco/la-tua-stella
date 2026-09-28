<script lang="ts">
  import { untrack } from 'svelte';
  import { locale, t } from '../i18n.svelte';

  // Three plain fields instead of <input type="date">: native pickers differ wildly between
  // phones, and scrolling back decades to a birth year is painful on all of them.
  let { value = $bindable(''), invalid = false, describedby, legend }: { value?: string; invalid?: boolean; describedby?: string; legend?: string } = $props();

  let day = $state('');
  let month = $state('');
  let year = $state('');

  const compose = (d: string, m: string, y: string) => {
    const dd = +d, mm = +m, yy = +y;
    const valid = yy >= 1000 && mm >= 1 && dd >= 1 && dd <= new Date(yy, mm, 0).getDate();
    return valid ? `${yy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}` : '';
  };

  // A date set from outside (a saved one, loaded after the page) fills the three fields.
  $effect.pre(() => {
    const v = value;
    untrack(() => {
      if (!v || v === compose(day, month, year)) return;
      const [y, m, d] = v.split('-');
      year = y;
      month = String(+m);
      day = String(+d);
    });
  });

  const months = $derived(
    Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i, 1).toLocaleDateString(locale.lang, { month: 'long' }),
    ),
  );

  $effect(() => {
    value = compose(day, month, year);
  });
</script>

<fieldset class="date" aria-describedby={describedby}>
  <legend>{legend ?? t().birthLabel}</legend>
  <div class="fields">
    <label class="day">
      <span>{t().day}</span>
      <select class="field" bind:value={day} aria-invalid={invalid}>
        <option value="" disabled>–</option>
        {#each { length: 31 } as _, i}
          <option value={String(i + 1)}>{i + 1}</option>
        {/each}
      </select>
    </label>
    <label class="month">
      <span>{t().month}</span>
      <select class="field" bind:value={month} aria-invalid={invalid}>
        <option value="" disabled>–</option>
        {#each months as name, i}
          <option value={String(i + 1)}>{name}</option>
        {/each}
      </select>
    </label>
    <label class="year">
      <span>{t().year}</span>
      <input
        class="field"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="4"
        autocomplete="bday-year"
        placeholder={t().yearPlaceholder}
        bind:value={year}
        aria-invalid={invalid}
      />
    </label>
  </div>
</fieldset>

<style>
  .date {
    border: 0;
    margin: 0;
    padding: 0;
    min-width: 0;
  }
  legend {
    padding: 0;
    margin-bottom: 0.5rem;
    color: var(--muted);
  }
  .fields {
    display: grid;
    grid-template-columns: 4.75rem minmax(0, 1fr) 5.75rem;
    gap: 0.5rem;
  }
  label {
    display: grid;
    gap: 0.25rem;
    min-width: 0;
  }
  label span {
    font-size: 0.85rem;
    color: var(--muted);
  }
  .field {
    width: 100%;
  }
  select.field {
    appearance: none;
    padding-right: 1.9rem;
    background-image: linear-gradient(45deg, transparent 50%, var(--muted) 50%),
      linear-gradient(135deg, var(--muted) 50%, transparent 50%);
    background-position: calc(100% - 1.05rem) 55%, calc(100% - 0.7rem) 55%;
    background-size: 0.35rem 0.35rem;
    background-repeat: no-repeat;
    text-overflow: ellipsis;
  }
  select.field:invalid,
  select.field option[value=''] {
    color: var(--muted);
  }
</style>
