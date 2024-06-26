<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let polygonId: string;
	export let x: number;
	export let y: number;
	export let open: boolean;
	export let autoclose = true;

	const dispatch = createEventDispatcher<{
		edit: { polygonId: string };
	}>();

	onMount(() => {
		if (!autoclose) return;
		document.addEventListener('click', close);

		return () => {
			document.removeEventListener('click', close);
		};
	});

	function close() {
		open = false;
	}
</script>

{#if open}
	<div
		class="context-menu variant-filled-surface btn-group-vertical"
		style="--left: {x}px; --top: {y}px"
	>
		<button on:click={() => dispatch('edit', { polygonId })}>Edit</button>
	</div>
{/if}

<style>
	.context-menu {
		position: absolute;
		left: var(--left);
		top: var(--top);
	}

	button {
		margin-left: 7px;
		margin-right: 7px;
	}
</style>
