<script lang="ts">
	import type { Area } from '$lib/types';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	export let areas: Area[];
	export let value: string | undefined = undefined;
	export let disableAddButton = false;

	let searchTerm = '';

	$: filteredAreas = filterAreas(areas, searchTerm);

	const dispatch = createEventDispatcher<{ addClick: {} }>();

	function filterAreas(areas: Area[], searchTerm: string) {
		searchTerm = searchTerm.trim();
		if (searchTerm === '') return areas;
		searchTerm = searchTerm.toUpperCase();
		return areas.filter(
			(a) =>
				a.identifier.toUpperCase().includes(searchTerm) || a.name.toUpperCase().includes(searchTerm)
		);
	}
</script>

<div class="area-list">
	<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
		<div class="input-group-shim">
			<span class="material-symbols-outlined">search</span>
		</div>
		<input type="search" placeholder="Search..." data-vaul-no-drag bind:value={searchTerm} />
	</div>
	<div class="area-list-content">
		{#if areas.length !== 0}
			<ListBox>
				{#each filteredAreas as area (area.id)}
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
		{:else}
			<div class="empty-list">
				<p>Press 'New' to create a new area</p>
			</div>
		{/if}
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
		grid-template-rows: auto 1fr auto;
		row-gap: 1rem;
		overflow: hidden;
		height: 100%;
	}
	.area-list-content {
		overflow-y: auto;
	}

	.empty-list {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 0.4;
	}
</style>
