<script lang="ts">
	import Polygon from '$lib/components/Polygon.svelte';

	let polygons: string[] = [];
	let activePolygon: string | undefined = undefined;
	let buttonLabel: 'add' | 'cancel' | 'done' = 'add';
	let gridX = 61.5;
	let gridY = 61.5;
	let showGrid = false;

	function buttonClicked() {
		if (buttonLabel === 'add') {
			const id = crypto.randomUUID();
			polygons.push(id);
			polygons = polygons;
			activePolygon = id;
			buttonLabel = 'cancel';
		} else if (buttonLabel === 'cancel') {
			polygons = polygons.filter((p) => p !== activePolygon);
			activePolygon = undefined;
			buttonLabel = 'add';
		} else if (buttonLabel === 'done') {
			activePolygon = undefined;
			buttonLabel = 'add';
		}
	}

	function polygonClosed() {
		buttonLabel = 'done';
	}
</script>

<div class="map">
	{#if showGrid}
		<div class="grid" style="--grid-x:{gridX}px; --grid-y:{gridY}px"></div>
	{/if}
	<div class="controls">
		<button class="add-button" on:click|stopPropagation={buttonClicked}>{buttonLabel}</button>
		<label for="grid-x">Grid X</label>
		<input id="grid-x" type="number" bind:value={gridX} />
		<label for="grid-y">Grid Y</label>
		<input id="grid-y" type="number" bind:value={gridY} />
		<label for="show-grid">Grid Y</label>
		<input id="show-grid" type="checkbox" bind:checked={showGrid} />
	</div>
	<svg width="100%" height="100%">
		{#each polygons as polygon (polygon)}
			<Polygon
				id={polygon}
				editing={polygon === activePolygon}
				disabled={activePolygon !== undefined && polygon !== activePolygon}
				editMode={activePolygon !== undefined}
				{gridX}
				{gridY}
				on:closed={polygonClosed}
			/>
		{/each}
	</svg>
</div>

<style>
	.map {
		background-image: url('/first-floor.png');
		background-size: contain;
		background-repeat: no-repeat;
		width: 100%;
		height: 800px;
		position: absolute;
	}

	.grid {
		pointer-events: none;
		width: 100%;
		height: 100%;
		background-image: repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%),
			repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 100%);
		background-size: var(--grid-x) var(--grid-y);
		position: absolute;
	}

	.controls {
		position: absolute;
		right: 0;
		display: flex;
		flex-direction: column;
	}
</style>
