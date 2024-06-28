<script context="module" lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import type { Meta } from '@storybook/svelte';
	import MapSettings from '$lib/components/MapSettings.svelte';

	export const meta: Meta<MapSettings> = {
		title: 'components/Map settings',
		component: MapSettings,
		tags: ['autodocs']
	};
</script>

<Template let:args>
	<MapSettings gridX={10} gridY={10} showGrid {...args} />
</Template>

<Story name="Open" args={{ open: true }}></Story>
<Story name="Closed" args={{ open: false }}></Story>
