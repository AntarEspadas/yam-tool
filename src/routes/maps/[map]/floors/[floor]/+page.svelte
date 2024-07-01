<script lang="ts">
	import type { PageData } from './$types';
	import { polygonService } from '$lib/services/PolygonService';
	import { imageService } from '$lib/services/ImageService';
	import { floorService } from '$lib/services/FloorService';
	import { areaService } from '$lib/services/AreaService';
	import { liveQuery } from 'dexie';
	import { debounce } from '$lib/util';
	import Polygon from '$lib/components/Polygon.svelte';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import AreaDetailsComponent from '$lib/components/AreaDetails.svelte';
	import AreaDetailsForm from '$lib/components/AreaDetailsForm.svelte';
	import AreaList from '$lib/components/AreaList.svelte';
	import MapSettings from '$lib/components/MapSettings.svelte';
	import Map from '$lib/components/Map.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { leftSidebarOpen } from '$lib/stores';

	export let data: PageData;

	let polygonClosed = true;

	let showContextMenu = false;
	let contextMenuX = 0;
	let contextMenuY = 0;
	let contextMenuTarget: string;

	let rightSidebarOpen = false;

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

	$: saveGrid(floor.grid.x, floor.grid.y, floor.grid.visible);

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
		const id = e.detail.id;
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

	const saveGrid = debounce(async (x: number, y: number, visible: boolean) => {
		await floorService.saveFloor({ ...floor, grid: { x, y, visible } });
	}, 500);
</script>

<div class="main-container">
	<Map
		gridX={floor.grid.x}
		gridY={floor.grid.y}
		showGrid={floor.grid.visible}
		src={floor.image}
		let:ref
		let:offsetWidth
		let:offsetHeight
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
					parentWidth={offsetWidth}
					parentHeight={offsetHeight}
					on:closed={markPolygonClosed}
					on:contextmenu={onContextMenu}
					on:click={handlePolygonClicked}
				/>
			{/each}
		</svg>
	</Map>

	<div>
		<div class="area-details-container">
			{#if $activeArea !== undefined && $editTarget === undefined}
				<AreaDetailsComponent
					id={$activeArea.id}
					identifier={$activeArea.identifier}
					name={$activeArea.name}
					description={$activeArea.description}
					on:edit={onEdit}
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
	<div class="right-sidebar-container">
		<Sidebar breakpoint="xxl" direction="right" bind:open={rightSidebarOpen}>
			<div class="right-sidebar">
				<MapSettings
					bind:gridX={floor.grid.x}
					bind:gridY={floor.grid.y}
					bind:showGrid={floor.grid.visible}
					on:change={handleMapImageChange}
				/>
				<AreaList
					areas={$areas ?? []}
					disableAddButton={editTargetId !== undefined}
					bind:value={activeAreaId}
					on:addClick={addPolygon}
				/>
			</div>
		</Sidebar>
	</div>
</div>

<button
	class="sidebar-button-right variant-filled-surface btn btn-sm"
	on:click={() => (rightSidebarOpen = true)}
>
	<span class="material-symbols-outlined"> chevron_left </span>
</button>
<button
	class="sidebar-button-left variant-filled-surface btn btn-sm"
	on:click={() => ($leftSidebarOpen = true)}
>
	<span class="material-symbols-outlined"> chevron_right </span>
</button>
<ContextMenu
	bind:open={showContextMenu}
	bind:polygonId={contextMenuTarget}
	x={contextMenuX}
	y={contextMenuY}
	on:edit={onEdit}
/>

<style lang="scss">
	.main-container {
		height: 100%;
		column-gap: 10px;
		margin-left: 10px;
		padding-top: 10px;
		@include xs {
			overflow-y: auto;
			// display: flex;
			// flex-direction: column;
			// grid-template-rows: 1fr 1fr auto;
		}
		@include md {
			overflow: hidden;
			display: grid;
			grid-template-rows: unset;
			grid-template-columns: 1fr 480px auto;
		}
		@include xl {
			grid-template-columns: 1fr 550px auto;
		}
		@include xxl {
			grid-template-columns: 1fr 600px auto;
		}
	}

	.area-details-container {
		margin-top: 1rem;
	}

	.right-sidebar {
		display: grid;
		grid-template-rows: auto 1fr;
		height: 100%;
		@include xs {
			width: 100%;
		}
		@include sm {
			width: 300px;
		}
	}

	button[class^='sidebar-button-'] {
		position: fixed;
		top: 5px;
		display: block;
	}

	button.sidebar-button-right {
		right: 5px;
		@include xxl {
			display: none;
		}
	}

	button.sidebar-button-left {
		left: 5px;
		@include lg {
			display: none;
		}
	}

	.right-sidebar-container {
		height: 100%;
		overflow: auto;
	}
</style>
