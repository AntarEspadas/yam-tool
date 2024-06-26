<script lang="ts">
	import { onMount } from 'svelte';
	import '../src/app.css';

	onMount(() => {
		document.body.setAttribute('data-theme', 'skeleton');
	});
</script>

<slot />
