<script lang="ts">
	import { onMount } from 'svelte';
	import Polygon from '$lib/components/Polygon.svelte';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import { polygonService } from '$lib/services/PolygonService';
	import type { Area } from '$lib/types';
	import AreaDetailsComponent from '$lib/components/AreaDetails.svelte';
	import AreaDetailsForm from '$lib/components/AreaDetailsForm.svelte';
	import AreaList from '$lib/components/AreaList.svelte';
	import MapSettings from '$lib/components/MapSettings.svelte';
	import Map from '$lib/components/Map.svelte';
	import { imageService } from '$lib/services/ImageService';
	import type { PageData } from './$types';
	import { floorService } from '$lib/services/FloorService';
	import { areaService } from '$lib/services/AreaService';
	import { liveQuery } from 'dexie';

	export let data: PageData;

	let polygonClosed = true;

	let showContextMenu = false;
	let contextMenuX = 0;
	let contextMenuY = 0;
	let contextMenuTarget: string;

	let editTargetId: string | undefined = undefined;
	let activeAreaId: string | undefined = undefined;

	$: ({ floor } = data);

	$: areas = liveQuery(async () => {
		return await areaService.getAreasByFloor(floor.id);
	});

	$: polygonIds = liveQuery(async () => {
		const polygons = await polygonService.getPolygonsByFloor(floor.id);
		const polygonIds = polygons.map((p) => p.id);
		return polygonIds;
	});

	$: editTarget = liveQuery(async () => {
		if (editTargetId === undefined) return undefined;
		return await areaService.getAreaById(editTargetId!);
	});

	$: activeArea = liveQuery(async () => {
		if (activeAreaId === undefined) return undefined;
		return await areaService.getAreaById(activeAreaId!);
	});

	async function addPolygon() {
		const id = await areaService.addArea(floor.id);
		await polygonService.savePolygon({
			id,
			floorId: floor.id,
			points: []
		});
		editTargetId = id;
		polygonClosed = false;
	}

	async function deleteCurrentArea() {
		if (editTargetId === undefined) return;
		await Promise.all([
			polygonService.deletePolygon(editTargetId),
			areaService.deleteArea(editTargetId)
		]);
		// TODO: maybe areas should be an observable
		editTargetId = undefined;
	}

	async function stopEditing(e: CustomEvent) {
		if (editTargetId === undefined) return;
		const { identifier, name, description } = e.detail;
		await areaService.saveArea({
			id: editTargetId,
			floorId: floor.id,
			identifier,
			name,
			description
		});
		editTargetId = undefined;
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
		editTargetId = id;
		polygonClosed = true;
		activeAreaId = undefined;
	}

	function handlePolygonClicked(e: CustomEvent) {
		const { polygonId } = e.detail;
		activeAreaId = polygonId;
	}

	async function handleMapImageChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file === undefined) return;
		floor.image = await imageService.fileToDataUrl(file);
		await floorService.saveFloor(floor);
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
			{#each $polygonIds ?? [] as polygon (polygon)}
				<Polygon
					parent={ref}
					id={polygon}
					floorId={floor.id}
					allowEdit={polygon === editTargetId}
					disabled={editTargetId !== undefined && polygon !== editTargetId}
					forceShow={editTargetId !== undefined ||
						polygon == activeAreaId ||
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
			{#if $activeArea !== undefined && $editTarget === undefined}
				<AreaDetailsComponent
					identifier={$activeArea.identifier}
					name={$activeArea.name}
					description={$activeArea.description}
				/>
			{:else if $editTarget !== undefined}
				<AreaDetailsForm
					id={$editTarget.id}
					identifier={$editTarget.identifier}
					name={$editTarget.name}
					description={$editTarget.description}
					forceDisableSubmit={!polygonClosed}
					on:submit={stopEditing}
					on:delete={deleteCurrentArea}
				/>
			{/if}
		</div>
	</div>
	<AreaList
		areas={$areas ?? []}
		disableAddButton={editTargetId !== undefined}
		bind:value={activeAreaId}
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
