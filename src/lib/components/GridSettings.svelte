<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

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
				<input class="input" type="number" bind:value={gridX} />
			</label>
			<label class="label"
				><span>Grid Y</span>
				<input class="input" type="number" bind:value={gridY} />
			</label>
			<label>
				<input class="checkbox" type="checkbox" bind:checked={showGrid} />
				<span>Show grid</span>
			</label>
		</svelte:fragment>
	</AccordionItem>
</Accordion>
