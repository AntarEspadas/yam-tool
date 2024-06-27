<script lang="ts">
	import { onMount } from 'svelte';
	import '../src/app.css';

	onMount(() => {
		document.body.setAttribute('data-theme', 'skeleton');
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0"
	/>
</svelte:head>

<slot />
