<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
  import {onMount} from "svelte"

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="manifest" href="/manifest.json">
</svelte:head>
{@render children()}
