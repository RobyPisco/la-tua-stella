<script lang="ts">
  import MoonMonth from '$lib/components/pages/MoonMonth.svelte';

  let { data } = $props();
</script>

<MoonMonth {data} />
