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
	const areas: Record<string, AreaDetails> = {
		'1': { identifier: '1A', name: 'Entrance', description: '' },
		'2': { identifier: '1B', name: 'Foyer', description: '' },
		'3': { identifier: '2A', name: 'Main Hall', description: '' },
		'4': { identifier: '2B', name: 'Cloakroom', description: '' }
	};
</script>

<Story name="Default">
	<AreaList {areas} />
</Story>
