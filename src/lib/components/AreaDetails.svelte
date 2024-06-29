<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	/** The id for the area */
	export let id: string;
	/** Short identifier for the area, such as 1A, 2B, etc.*/
	export let identifier: string;
	/** The name of the area */
	export let name: string;
	/** Description of the area */
	export let description: string;

	const dispatch = createEventDispatcher<{ edit: { id: string } }>();
</script>

<article class="area-details card p-4">
	<header class="card-header">
		<h3 class="h3">{identifier} - {name}</h3>
	</header>
	{#if description}
		<hr class="mt-4 opacity-50" />
		<section class="p-4">
			<p>{description}</p>
		</section>
	{/if}
	<footer class="card-footer mt-4">
		<button
			type="button"
			class="variant-soft-secondary btn btn-sm"
			on:click={() => dispatch('edit', { id })}
		>
			<span class="material-symbols-outlined">edit</span>
			<span>Edit</span>
		</button>
	</footer>
</article>

<style>
	header {
		padding-bottom: 0.5rem;
		padding-top: 0.5rem;
	}
</style>
