<script lang="ts">
	import { floorService } from '$lib/services/FloorService';
	import { goto } from '$app/navigation';
	import { mapService } from '$lib/services/MapService';

	async function handleClick() {
		const mapId = await mapService.addMap();
		const floorId = await floorService.addFloor(mapId);
		goto(`/maps/${mapId}/floors/${floorId}`);
	}
</script>

<button class="variant-soft btn" on:click={handleClick}>Add map</button>
