<script context="module" lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import type { Meta } from '@storybook/svelte';
	import AreaList from '$lib/components/AreaList.svelte';
	import type { Area } from '$lib/types';

	export const meta: Meta<AreaList> = {
		title: 'components/Area list',
		component: AreaList,
		tags: ['autodocs']
	};
</script>

<script lang="ts">
	const areas: Area[] = [
		{ id: '0', floorId: 0, identifier: '1A', name: 'Entrance', description: '' },
		{ id: '1', floorId: 0, identifier: '1B', name: 'Foyer', description: '' },
		{ id: '2', floorId: 0, identifier: '2A', name: 'Main Hall', description: '' },
		{ id: '3', floorId: 0, identifier: '2B', name: 'Cloakroom', description: '' }
	];

	const longAreas = new Array(50).fill(0).map((_, i) => ({ ...areas[0], id: i.toString() }));
</script>

<Story name="Default">
	<AreaList {areas} />
</Story>

<Story name="Scrollable">
	<div class="max-height-300">
		<AreaList areas={longAreas} />
	</div>
</Story>

<style>
	.max-height-300 :global(.area-list) {
		max-height: 300px;
	}
</style>
