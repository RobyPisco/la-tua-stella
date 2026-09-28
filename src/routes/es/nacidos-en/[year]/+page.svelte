<script lang="ts">
  import BornYear from '$lib/components/pages/BornYear.svelte';

  let { data } = $props();
</script>

<BornYear {data} />
