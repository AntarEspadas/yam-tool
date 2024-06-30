<script lang="ts">
	import { floorService } from '$lib/services/FloorService';
	import { goto } from '$app/navigation';

	const map = 0;

	async function handleClick() {
		const floorId = await floorService.addFloor(map);
		goto(`/maps/${map}/floors/${floorId}`);
	}
</script>

<button class="variant-soft btn" on:click={handleClick}>Add floor</button>
