<script lang="ts">
  import StarsHub from '$lib/components/pages/StarsHub.svelte';

  let { data } = $props();
</script>

<StarsHub {data} />
