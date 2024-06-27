<script context="module" lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import type { Meta } from '@storybook/svelte';
	import Map from '$lib/components/Map.svelte';
	import image from './static/first-floor.png';

	export const meta: Meta<Map> = {
		title: 'components/Map',
		component: Map,
		tags: ['autodocs']
	};
</script>

<Template let:args>
	<Map {...args} gridX={61.5} gridY={61.5} src={image} />
</Template>

<Story name="Grid on" args={{ showGrid: true }} />
<Story name="Grid off" args={{ showGrid: false }} />
