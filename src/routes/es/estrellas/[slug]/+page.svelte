<script lang="ts">
  import StarPage from '$lib/components/pages/StarPage.svelte';

  let { data } = $props();
</script>

<StarPage {data} />
