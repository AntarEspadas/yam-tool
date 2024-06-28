<script lang="ts">
	import { onMount } from 'svelte';
	import Polygon from '$lib/components/Polygon.svelte';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import { polygonService } from '$lib/services/PolygonService';
	import type { AreaDetails } from '$lib/types';
	import AreaDetailsComponent from '$lib/components/AreaDetails.svelte';
	import AreaDetailsForm from '$lib/components/AreaDetailsForm.svelte';
	import AreaList from '$lib/components/AreaList.svelte';
	import MapSettings from '$lib/components/MapSettings.svelte';
	import Map from '$lib/components/Map.svelte';
	import { imageService } from '$lib/services/ImageService';
	import type { PageData } from './$types';
	import { floorService } from '$lib/services/FloorService';

	export let data: PageData;

	let polygons: string[] = [];
	let editTarget: string | undefined = undefined;
	let polygonClosed = true;

	let showContextMenu = false;
	let contextMenuX = 0;
	let contextMenuY = 0;
	let contextMenuTarget: string;

	// let activeAreaDetails: AreaDetails | undefined = undefined;
	let activeArea: string | undefined = undefined;

	$: ({ floor, floorId } = data);

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
		floor.areas[id] = {
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
		delete floor.areas[editTarget];
		floorService.saveFloor(floorId, floor);
		floor.areas = floor.areas;
		editTarget = undefined;
	}

	function stopEditing() {
		editTarget = undefined;
		floorService.saveFloor(floorId, floor);
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
		floor.areas[id] ??= {
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
		floor.image = await imageService.fileToDataUrl(file);
		floorService.saveFloor(floorId, floor);
	}
</script>

<div class="container">
	<Map
		gridX={floor.grid.x}
		gridY={floor.grid.y}
		showGrid={floor.grid.visible}
		src={floor.image}
		let:ref
		on:change={handleMapImageChange}
	>
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
					gridX={floor.grid.x}
					gridY={floor.grid.y}
					on:closed={markPolygonClosed}
					on:contextmenu={onContextMenu}
					on:click={handlePolygonClicked}
				/>
			{/each}
		</svg>
	</Map>

	<div>
		<MapSettings
			bind:gridX={floor.grid.x}
			bind:gridY={floor.grid.x}
			bind:showGrid={floor.grid.visible}
			on:change={handleMapImageChange}
		/>

		<div class="area-details-container">
			{#if activeArea !== undefined && editTarget === undefined}
				<AreaDetailsComponent
					identifier={floor.areas[activeArea].identifier}
					name={floor.areas[activeArea].name}
					description={floor.areas[activeArea].description}
				/>
			{:else if editTarget !== undefined}
				<AreaDetailsForm
					id={editTarget}
					bind:identifier={floor.areas[editTarget].identifier}
					bind:name={floor.areas[editTarget].name}
					bind:description={floor.areas[editTarget].description}
					forceDisableSubmit={!polygonClosed}
					on:submit={stopEditing}
					on:delete={deleteCurrentArea}
				/>
			{/if}
		</div>
	</div>
	<AreaList
		areas={floor.areas}
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
