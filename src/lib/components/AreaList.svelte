<script lang="ts">
	import type { Area } from '$lib/types';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	export let areas: Area[];
	export let value: string | undefined = undefined;
	export let disableAddButton = false;

	const dispatch = createEventDispatcher<{ addClick: {} }>();
</script>

<!-- <button class="variant-filled btn" disabled={editTarget !== undefined} on:click={addPolygon}
			>Add</button
		> -->
<div class="area-list">
	<div class="area-list-content">
		<ListBox>
			{#each areas as area (area.id)}
				<ListBoxItem
					name={area.id}
					class={value == area.id ? '' : 'variant-soft'}
					active="variant-soft-secondary"
					hover="hover:variant-ghost"
					bind:group={value}
					value={area.id}
				>
					<h6 class="h6">{area.identifier}</h6>
					<h5 class="h5">
						{area.name}
					</h5>
				</ListBoxItem>
			{/each}
		</ListBox>
	</div>
	<button
		class="variant-filled btn"
		disabled={disableAddButton}
		on:click={() => dispatch('addClick', {})}
	>
		<span class="material-symbols-outlined">add</span>
		<span>New</span>
	</button>
</div>

<style>
	.area-list {
		display: grid;
		grid-template-rows: 1fr auto;
		row-gap: 1rem;
	}
	.area-list-content {
		overflow-y: auto;
	}
</style>
