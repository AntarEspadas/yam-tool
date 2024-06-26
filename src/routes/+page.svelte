<script lang="ts">
	import { onMount } from 'svelte';
	import Polygon from '$lib/components/Polygon.svelte';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import { polygonService } from '$lib/services/PolygonService';
	import { areaDetailsService } from '$lib/services/AreaDetailsService';
	import type { AreaDetails } from '$lib/types';
	import AreaDetailsComponent from '$lib/components/AreaDetails.svelte';
	import AreaDetailsEditor from '$lib/components/AreaDetailsEditor.svelte';

	let mapRef: HTMLElement;

	let polygons: string[] = [];
	let editTarget: string | undefined = undefined;
	let polygonClosed = true;
	let gridX = 61.5;
	let gridY = 61.5;
	let showGrid = false;

	let showContextMenu = false;
	let contextMenuX = 0;
	let contextMenuY = 0;
	let contextMenuTarget: string;

	let areas: Record<string, AreaDetails> = {
		'3b66dcf6-9586-4b18-8db6-1d076904beb8': {
			identifier: '1A',
			name: 'Entrance',
			description: `A wrought-iron gate with hinges on one side and a lock on the other fills the archway of a stone portico (area 1A). The gate is unlocked, and its rusty hinges shriek when the gate is opened. Oil lamps hang from the portico ceiling by chains, flanking a set of oaken doors that open into a grand foyer (area 1B).

Hanging on the south wall of the foyer is a shield emblazoned with a coat-of-arms (a stylized golden windmill on a red field), flanked by framed portraits of stony-faced aristocrats (long-dead members of the Durst family). Mahogany-framed double doors leading from the foyer to the main hall (area 2A) are set with panes of stained glass.`
		}
	};

	let activeAreaDetails: AreaDetails | undefined = undefined;

	onMount(() => {
		const savedPolygons = polygonService.getPolygons();
		areas = areaDetailsService.getAreaDetails();
		for (const polygon in savedPolygons) {
			polygons.push(polygon);
		}
		polygons = polygons;
	});

	function addPolygon() {
		const id = crypto.randomUUID();
		polygons.push(id);
		polygons = polygons;
		areas[id] = {
			identifier: '',
			name: '',
			description: ''
		};
		editTarget = id;
		polygonClosed = false;
	}

	function deleteCurrentArea() {
		if (editTarget === undefined) return;
		polygons = polygons.filter((p) => p !== editTarget);
		polygonService.deletePolygon(editTarget);
		delete areas[editTarget];
		editTarget = undefined;
	}

	function stopEditing() {
		editTarget = undefined;
		areaDetailsService.saveAreaDetails(areas);
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
		editTarget = id;
		polygonClosed = true;
		activeAreaDetails = undefined;
		areas[id] ??= {
			identifier: '',
			name: '',
			description: ''
		};
	}

	function handlePolygonClicked(e: CustomEvent) {
		const { polygonId } = e.detail;
		console.log(polygonId, 'clicked', e.detail);
		activeAreaDetails = areas[polygonId];
	}
</script>

<div class="container">
	<div class="map" bind:this={mapRef}>
		{#if showGrid}
			<div class="grid" style="--grid-x:{gridX}px; --grid-y:{gridY}px"></div>
		{/if}

		<svg width="100%" height="100%">
			{#each polygons as polygon (polygon)}
				<Polygon
					id={polygon}
					editing={polygon === editTarget}
					disabled={editTarget !== undefined && polygon !== editTarget}
					editMode={editTarget !== undefined}
					{gridX}
					{gridY}
					parent={mapRef}
					on:closed={markPolygonClosed}
					on:contextmenu={onContextMenu}
					on:click={handlePolygonClicked}
				/>
			{/each}
		</svg>
	</div>

	<div>
		<div class="controls">
			<button class="variant-filled btn" disabled={editTarget !== undefined} on:click={addPolygon}
				>Add</button
			>
			<label class="label"
				><span>Grid X</span>
				<input class="input" type="number" bind:value={gridX} />
			</label>
			<label class="label"
				><span>Grid Y</span>
				<input class="input" type="number" bind:value={gridY} />
			</label>
			<label>
				<input class="checkbox" type="checkbox" bind:checked={showGrid} />
				<span>Show grid</span>
			</label>
		</div>

		<div class="area-details-container">
			{#if activeAreaDetails !== undefined && editTarget === undefined}
				<AreaDetailsComponent
					identifier={activeAreaDetails.identifier}
					name={activeAreaDetails.name}
					description={activeAreaDetails.description}
				/>
			{:else if editTarget !== undefined}
				<AreaDetailsEditor
					id={editTarget}
					bind:identifier={areas[editTarget].identifier}
					bind:name={areas[editTarget].name}
					bind:description={areas[editTarget].description}
					forceDisableSubmit={!polygonClosed}
					on:submit={stopEditing}
					on:delete={deleteCurrentArea}
				/>
			{/if}
		</div>
	</div>
</div>

<ContextMenu
	bind:open={showContextMenu}
	x={contextMenuX}
	y={contextMenuY}
	polygonId={contextMenuTarget}
	on:edit={onEdit}
/>

<style>
	.container {
		display: grid;
		grid-template-columns: auto 1fr;
		column-gap: 10px;
	}

	.map {
		background-image: url('/first-floor.png');
		background-size: cover;
		background-repeat: no-repeat;
		aspect-ratio: 1317/2141;
		height: 800px;
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
		right: 0;
		display: flex;
		flex-direction: column;
	}

	.area-details-container {
		right: 0px;
		top: 200px;
		width: 450px;
	}
</style>
