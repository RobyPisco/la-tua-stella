<script lang="ts">
  import BornHub from '$lib/components/pages/BornHub.svelte';

  let { data } = $props();
</script>

<BornHub {data} />
