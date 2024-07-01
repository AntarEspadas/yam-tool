<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { FileButton } from '@skeletonlabs/skeleton';

	export let gridX: number;
	export let gridY: number;
	export let showGrid: boolean;

	export let open = false;
</script>

<Accordion>
	<AccordionItem bind:open>
		<span class="material-symbols-outlined" slot="lead">map</span>
		<p slot="summary">Map settings</p>
		<svelte:fragment slot="content">
			<div class="file-input-container">
				<FileButton name="map-file-input" accept="image/*" on:change>Select map image</FileButton>
			</div>
			<label>
				<input class="checkbox" type="checkbox" bind:checked={showGrid} />
				<span>Show grid</span>
			</label>
			<label class="label"
				><span>Grid X</span>
				<br />
				<input class="input" type="number" bind:value={gridX} />
			</label>
			<RangeSlider name="grid-x" bind:value={gridX} min={1} max={200} step={0.5}></RangeSlider>
			<label class="label"
				><span>Grid Y</span>
				<br />
				<input class="input" type="number" bind:value={gridY} />
			</label>
			<RangeSlider name="grid-y" bind:value={gridY} min={1} max={200} step={0.5}></RangeSlider>
		</svelte:fragment>
	</AccordionItem>
</Accordion>

<style>
	.input {
		width: 5.5em;
	}

	.file-input-container {
		width: 100%;
		display: flex;
		justify-content: center;
	}
</style>
