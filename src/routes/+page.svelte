<script lang="ts">
	import { onMount } from 'svelte';
	import Polygon from '$lib/components/Polygon.svelte';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import { polygonService } from '$lib/services/PolygonService';

	let polygons: string[] = [];
	let activePolygon: string | undefined = undefined;
	let polygonClosed = true;
	let gridX = 61.5;
	let gridY = 61.5;
	let showGrid = false;

	let showContextMenu = false;
	let contextMenuX = 0;
	let contextMenuY = 0;
	let contextMenuTarget: string;

	onMount(() => {
		const savedPolygons = polygonService.getPolygons();
		for (const polygon in savedPolygons) {
			polygons.push(polygon);
		}
		polygons = polygons;
	});

	function addPolygon() {
		const id = crypto.randomUUID();
		polygons.push(id);
		polygons = polygons;
		activePolygon = id;
		polygonClosed = false;
	}

	function deleteCurrentPolygon() {
		polygons = polygons.filter((p) => p !== activePolygon);
		polygonService.deletePolygon(activePolygon);
		activePolygon = undefined;
	}

	function stopEditingPolygon() {
		activePolygon = undefined;
	}

	function markPolygonClosed() {
		polygonClosed = true;
	}

	function onContextMenu(e: CustomEvent) {
		e.detail.originalEvent.preventDefault();

		contextMenuX = e.detail.originalEvent.clientX;
		contextMenuY = e.detail.originalEvent.clientY;
		contextMenuTarget = e.detail.polygonId;
		showContextMenu = true;
	}

	function onEdit(e: CustomEvent) {
		const id = e.detail.polygonId;
		activePolygon = id;
		polygonClosed = true;
	}
</script>

<div class="map">
	<ContextMenu
		bind:open={showContextMenu}
		x={contextMenuX}
		y={contextMenuY}
		polygonId={contextMenuTarget}
		on:edit={onEdit}
	/>
	{#if showGrid}
		<div class="grid" style="--grid-x:{gridX}px; --grid-y:{gridY}px"></div>
	{/if}
	<div class="controls">
		<button class="add-button" disabled={activePolygon !== undefined} on:click={addPolygon}
			>Add</button
		>
		<label for="grid-x">Grid X</label>
		<input id="grid-x" type="number" bind:value={gridX} />
		<label for="grid-y">Grid Y</label>
		<input id="grid-y" type="number" bind:value={gridY} />
		<label for="show-grid">Grid Y</label>
		<input id="show-grid" type="checkbox" bind:checked={showGrid} />

		{#if activePolygon !== undefined}
			<div>
				<button disabled={!polygonClosed} on:click={stopEditingPolygon}>Done</button>
				<button on:click={deleteCurrentPolygon} on:mousedown|stopPropagation>Delete</button>
			</div>
		{/if}
	</div>
	<svg width="100%" height="100%">
		{#each polygons as polygon (polygon)}
			<Polygon
				id={polygon}
				editing={polygon === activePolygon}
				disabled={activePolygon !== undefined && polygon !== activePolygon}
				editMode={activePolygon !== undefined}
				{gridX}
				{gridY}
				on:closed={markPolygonClosed}
				on:contextmenu={onContextMenu}
			/>
		{/each}
	</svg>
</div>

<style>
	.map {
		background-image: url('/first-floor.png');
		background-size: contain;
		background-repeat: no-repeat;
		width: 100%;
		height: 800px;
		position: absolute;
	}

	.grid {
		pointer-events: none;
		width: 100%;
		height: 100%;
		background-image: repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%),
			repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 100%);
		background-size: var(--grid-x) var(--grid-y);
		position: absolute;
	}

	.controls {
		position: absolute;
		right: 0;
		display: flex;
		flex-direction: column;
	}
</style>
