<script lang="ts">
	import { floorService } from '$lib/services/FloorService';
	import { liveQuery } from 'dexie';
	import type { PageData } from './$types';
	import FloorList from '$lib/components/FloorList.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { leftSidebarOpen } from '$lib/stores';

	export let data: PageData;

	$: ({ map, floorId } = data);

	$: floors = liveQuery(async () => await floorService.getFloorsByMapId(map.id));
</script>

<div class="floor-layout">
	<div>
		<Sidebar breakpoint="lg" direction="left" bind:open={$leftSidebarOpen}>
			<FloorList floors={$floors ?? []} current={floorId} />
		</Sidebar>
	</div>
	<slot />
</div>

<style lang="scss">
	.floor-layout {
		display: grid;
		width: 100%;
		@include sm {
			// grid-template-columns: 0 1fr;
			grid-template-columns: auto 1fr;
		}
		@include lg {
			grid-template-columns: auto 1fr;
		}
	}
</style>
