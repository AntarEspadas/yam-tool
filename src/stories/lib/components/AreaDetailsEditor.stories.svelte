<script context="module" lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import type { Meta } from '@storybook/svelte';
	import AreaDetailsEditor from '$lib/components/AreaDetailsEditor.svelte';

	export const meta: Meta<AreaDetailsEditor> = {
		title: 'components/Area details editor',
		component: AreaDetailsEditor,
		tags: ['autodocs']
	};
</script>

<!-- <Template let:args>
	<AreaDetailsEditor {...args} />
</Template> -->

<Story name="Default">
	<AreaDetailsEditor
		id="story-area"
		identifier=""
		name=""
		description=""
		forceDisableSubmit={false}
		on:submit
		on:delete
	/>
</Story>
