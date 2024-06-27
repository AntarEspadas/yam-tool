<script lang="ts">
	import { onMount } from 'svelte';

	export let gridX;
	export let gridY;
	export let showGrid: boolean;
	export let src: string;

	let ref: HTMLElement;

	let mounted = false;

	let aspectRatio = '1/1';

	$: getSize(src, mounted);

	onMount(() => {
		mounted = true;
	});

	function getSize(src: string, mounted: boolean) {
		if (!mounted) return;
		const image = new Image();
		image.onload = () => {
			// Not a fan of mutating top level variables instead of returning values,
			// but returning values from this callback would require the use of a promise,
			// which can't be awaited at the top level, so this will do for now
			aspectRatio = image.naturalWidth + '/' + image.naturalHeight;
		};
		image.src = src;
	}
</script>

<div
	class="map"
	class:grid={showGrid}
	style="--grid-x:{gridX}px; --grid-y:{gridY}px"
	style:--img="url('{src}')"
	style:--aspect-ratio={aspectRatio}
	bind:this={ref}
>
	<slot {ref} />
</div>

<style>
	.map {
		background-image: var(--img);
		background-size: contain;
		background-repeat: no-repeat;
		aspect-ratio: var(--aspect-ratio);
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
