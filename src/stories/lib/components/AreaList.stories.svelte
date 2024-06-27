<script context="module" lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import type { Meta } from '@storybook/svelte';
	import AreaList from '$lib/components/AreaList.svelte';
	import type { AreaDetails } from '$lib/types';

	export const meta: Meta<AreaList> = {
		title: 'components/Area list',
		component: AreaList,
		tags: ['autodocs']
	};
</script>

<script lang="ts">
	const areas = {
		'1': { identifier: '1A', name: 'Entrance', description: '' },
		'2': { identifier: '1B', name: 'Foyer', description: '' },
		'3': { identifier: '2A', name: 'Main Hall', description: '' },
		'4': { identifier: '2B', name: 'Cloakroom', description: '' }
	} satisfies Record<string, AreaDetails>;

	const longAreas: Record<string, AreaDetails> = {};

	for (let i = 0; i < 50; i++) {
		longAreas[i.toString()] = areas['1'];
	}
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
