<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { RangeSlider } from '@skeletonlabs/skeleton';

	export let gridX: number;
	export let gridY: number;
	export let showGrid: boolean;

	export let open = false;
</script>

<Accordion>
	<AccordionItem bind:open>
		<span class="material-symbols-outlined" slot="lead">grid_4x4</span>
		<p slot="summary">Grid settings</p>
		<svelte:fragment slot="content">
			<label class="label"
				><span>Grid X</span>
				<br />
				<input class="input" type="number" bind:value={gridX} />
			</label>
			<RangeSlider name="grid-x" bind:value={gridX} min={5} max={150} step={0.25}></RangeSlider>
			<label class="label"
				><span>Grid Y</span>
				<br />
				<input class="input" type="number" bind:value={gridY} />
			</label>
			<RangeSlider name="grid-y" bind:value={gridY} min={5} max={150} step={0.25}></RangeSlider>
			<label>
				<input class="checkbox" type="checkbox" bind:checked={showGrid} />
				<span>Show grid</span>
			</label>
		</svelte:fragment>
	</AccordionItem>
</Accordion>

<style>
	.input {
		width: 5.5em;
	}
</style>
