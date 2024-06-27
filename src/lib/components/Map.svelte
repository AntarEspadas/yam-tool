<script lang="ts">
	export let gridX;
	export let gridY;
	export let showGrid: boolean;
	export let src: string;

	let ref: HTMLElement;
</script>

<div class="map" style:background-image="url('{src}')" bind:this={ref}>
	<div style="width: 100%; height: 100%">
		<slot {ref} />
	</div>
	{#if showGrid}
		<div class="grid" style="--grid-x:{gridX}px; --grid-y:{gridY}px"></div>
	{/if}
</div>

<style>
	.grid {
		pointer-events: none;
		width: 100%;
		height: 100%;
		background-image: repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%),
			repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 100%);
		background-size: var(--grid-x) var(--grid-y);
		transform: translateY(-100%);
	}

	.map {
		background-size: cover;
		background-repeat: no-repeat;
		aspect-ratio: 1317/2141;
		height: 800px;
	}
</style>
