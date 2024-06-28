<script lang="ts">
	import { onMount } from 'svelte';
	import Polygon from '$lib/components/Polygon.svelte';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import { polygonService } from '$lib/services/PolygonService';
	import { areaDetailsService } from '$lib/services/AreaDetailsService';
	import type { AreaDetails } from '$lib/types';
	import AreaDetailsComponent from '$lib/components/AreaDetails.svelte';
	import AreaDetailsForm from '$lib/components/AreaDetailsForm.svelte';
	import AreaList from '$lib/components/AreaList.svelte';
	import MapSettings from '$lib/components/MapSettings.svelte';
	import Map from '$lib/components/Map.svelte';
	import { imageService } from '$lib/services/ImageService';

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

	let mapSrc: string | undefined = undefined;

	let areas: Record<string, AreaDetails> = {
		'3b66dcf6-9586-4b18-8db6-1d076904beb8': {
			identifier: '1A',
			name: 'Entrance',
			description: `A wrought-iron gate with hinges on one side and a lock on the other fills the archway of a stone portico (area 1A). The gate is unlocked, and its rusty hinges shriek when the gate is opened. Oil lamps hang from the portico ceiling by chains, flanking a set of oaken doors that open into a grand foyer (area 1B).

Hanging on the south wall of the foyer is a shield emblazoned with a coat-of-arms (a stylized golden windmill on a red field), flanked by framed portraits of stony-faced aristocrats (long-dead members of the Durst family). Mahogany-framed double doors leading from the foyer to the main hall (area 2A) are set with panes of stained glass.`
		}
	};

	// let activeAreaDetails: AreaDetails | undefined = undefined;
	let activeArea: string | undefined = undefined;

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
		areaDetailsService.saveAreaDetails(areas);
		areas = areas;
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
		activeArea = undefined;
		areas[id] ??= {
			identifier: '',
			name: '',
			description: ''
		};
	}

	function handlePolygonClicked(e: CustomEvent) {
		const { polygonId } = e.detail;
		console.log(polygonId, 'clicked', e.detail);
		activeArea = polygonId;
	}

	async function handleMapImageChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file === undefined) return;
		mapSrc = await imageService.fileToDataUrl(file);
	}
</script>

<div class="container">
	<Map {gridX} {gridY} {showGrid} bind:src={mapSrc} let:ref on:change={handleMapImageChange}>
		<svg width="100%" height="100%">
			{#each polygons as polygon (polygon)}
				<Polygon
					parent={ref}
					id={polygon}
					allowEdit={polygon === editTarget}
					disabled={editTarget !== undefined && polygon !== editTarget}
					forceShow={editTarget !== undefined ||
						polygon == activeArea ||
						polygon == contextMenuTarget}
					{gridX}
					{gridY}
					on:closed={markPolygonClosed}
					on:contextmenu={onContextMenu}
					on:click={handlePolygonClicked}
				/>
			{/each}
		</svg>
	</Map>

	<div>
		<MapSettings bind:gridX bind:gridY bind:showGrid />

		<div class="area-details-container">
			{#if activeArea !== undefined && editTarget === undefined}
				<AreaDetailsComponent
					identifier={areas[activeArea].identifier}
					name={areas[activeArea].name}
					description={areas[activeArea].description}
				/>
			{:else if editTarget !== undefined}
				<AreaDetailsForm
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
	<AreaList
		{areas}
		disableAddButton={editTarget !== undefined}
		bind:value={activeArea}
		on:addClick={addPolygon}
	/>
</div>

<ContextMenu
	bind:open={showContextMenu}
	bind:polygonId={contextMenuTarget}
	x={contextMenuX}
	y={contextMenuY}
	on:edit={onEdit}
/>

<style>
	.container {
		display: grid;
		grid-template-columns: auto 2fr 1fr;
		column-gap: 10px;
	}

	.area-details-container {
		margin-top: 1rem;
	}
</style>
