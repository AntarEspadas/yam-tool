<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let inputGridX: number;
	let inputGridY: number;

	export { inputGridX as gridX, inputGridY as gridY };

	export let showGrid: boolean;
	export let src: string | undefined;

	$: gridX = inputGridX / 5;
	$: gridY = inputGridY / 5;

	// Because we need to calculate the dimensions of every new image, using the src prop directy
	// causes the page to jump, since the image is updated first, then moments later the aspect ratio.
	// We work around this by using a second src variable, which is the one that is actually used in markup
	// and is only updated once the aspect ratio has been calculated
	let actualSrc: string | undefined;

	let ref: HTMLElement;
	let fileInput: HTMLInputElement;

	let mounted = false;

	let aspectRatio = '1/1';

	let offsetWidth: number = 0;
	let offsetHeight: number = 0;

	$: getSize(src, mounted);

	onMount(() => {
		mounted = true;
	});

	function getSize(src: string | undefined, mounted: boolean) {
		if (!mounted) return;
		if (src === undefined) {
			aspectRatio = '9/16';
			actualSrc = undefined;
			return;
		}
		const image = new Image();
		image.onload = () => {
			// Not a fan of mutating top level variables instead of returning values,
			// but returning values from this callback would require the use of a promise,
			// which can't be awaited at the top level, so this will do for now
			aspectRatio = image.naturalWidth + '/' + image.naturalHeight;
			actualSrc = src;
		};
		image.src = src;
	}
</script>

<div
	class="map"
	class:hide={actualSrc === undefined}
	style="--grid-x:{gridX}%; --grid-y:{gridY}%"
	style:--img="url('{actualSrc}')"
	style:--aspect-ratio={aspectRatio}
	bind:this={ref}
	bind:offsetWidth
	bind:offsetHeight
>
	<div style="height: 100%; width: 100%;">
		<slot {ref} {offsetWidth} {offsetHeight} />
	</div>
	{#if showGrid}
		<div class="grid"></div>
	{/if}
</div>
{#if src === undefined}
	<div class="no-map">
		<div class="file-select">
			<FileDropzone name="map-image" accept="image/*" bind:fileInput on:change />
		</div>
	</div>
{/if}

<style lang="scss">
	.map {
		background-image: var(--img);
		background-size: contain;
		background-repeat: no-repeat;
		aspect-ratio: var(--aspect-ratio);
		overflow-y: hidden;

		@include xs {
			width: 95vw;
			max-height: 90vh;
			height: unset;
		}

		@include md {
			width: unset;
			max-width: 96%;
			max-height: 95%;
		}
	}

	.grid {
		pointer-events: none;
		width: 100%;
		height: 100%;
		transform: translateY(-100%);
		background:
			repeating-linear-gradient(#ccccccc2 0 2px, transparent 0px 100%) top / var(--grid-x)
				var(--grid-y),
			repeating-linear-gradient(90deg, #ccccccc2 0 2px, transparent 0px 100%) left / var(--grid-x)
				var(--grid-y);
	}

	.no-map {
		display: flex;
		height: 800px;
		width: 500px;
		justify-content: center;
		align-items: center;
	}

	.hide {
		display: none;
	}
</style>
