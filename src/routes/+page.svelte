<script lang="ts">
	import { floorService } from '$lib/services/FloorService';
	import { goto } from '$app/navigation';
	function handleClick() {
		const floorId = floorService.addFloor();
		goto(`floors/${floorId}`);
	}
</script>

<button class="variant-soft btn" on:click={handleClick}>Add floor</button>
