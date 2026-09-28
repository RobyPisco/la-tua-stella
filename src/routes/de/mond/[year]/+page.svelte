<script lang="ts">
  import MoonYear from '$lib/components/pages/MoonYear.svelte';

  let { data } = $props();
</script>

<MoonYear {data} />
