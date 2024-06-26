<script context="module" lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import type { Meta } from '@storybook/svelte';
	import AreaDetails from '$lib/components/AreaDetails.svelte';

	export const meta: Meta<AreaDetails> = {
		title: 'components/Area details',
		component: AreaDetails,
		tags: ['autodocs']
	};
</script>

<Template let:args>
	<AreaDetails
		identifier="Lorem"
		name="ipsum dolor sit amet"
		description="Nesciunt illo quos perferendis voluptatibus odit. Nam sed commodi totam nulla, fugit voluptatem? Possimus cupiditate excepturi soluta earum nihil tempore voluptates saepe."
		{...args}
	/>
</Template>

<Story name="Default"></Story>

<Story name="Empty description" args={{ description: '' }}></Story>
