<script lang="ts">
  import MoonHub from '$lib/components/pages/MoonHub.svelte';

  let { data } = $props();
</script>

<MoonHub {data} />
