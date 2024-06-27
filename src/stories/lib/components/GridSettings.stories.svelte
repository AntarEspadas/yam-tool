<script context="module" lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import type { Meta } from '@storybook/svelte';
	import GridSettings from '$lib/components/GridSettings.svelte';

	export const meta: Meta<GridSettings> = {
		title: 'components/Grid settings',
		component: GridSettings,
		tags: ['autodocs']
	};
</script>

<Template let:args>
	<GridSettings gridX={10} gridY={10} showGrid {...args} />
</Template>

<Story name="Open" args={{ open: true }}></Story>
<Story name="Closed" args={{ open: false }}></Story>
