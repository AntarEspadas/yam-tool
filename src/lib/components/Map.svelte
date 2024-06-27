<script lang="ts">
	export let gridX;
	export let gridY;
	export let showGrid: boolean;
	export let src: string;

	let ref: HTMLElement;
</script>

<div
	class="map"
	class:grid={showGrid}
	style="--grid-x:{gridX}px; --grid-y:{gridY}px"
	style:--img="url('{src}')"
	bind:this={ref}
>
	<slot {ref} />
</div>

<style>
	.map {
		background-image: var(--img);
		background-size: cover;
		background-repeat: no-repeat;
		aspect-ratio: 1317/2141;
		height: 800px;
	}

	.map.grid {
		background:
			repeating-linear-gradient(#ccccccc2 0 2px, transparent 0px 100%) top / var(--grid-x)
				var(--grid-y),
			repeating-linear-gradient(90deg, #ccccccc2 0 2px, transparent 0px 100%) left / var(--grid-x)
				var(--grid-y),
			var(--img) left/cover no-repeat;
	}
</style>
