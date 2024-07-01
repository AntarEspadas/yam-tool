<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let id: string;
	/** Controls wether the 'Done' button will be forced into the disabled state */
	export let forceDisableSubmit: boolean;

	export let identifier = '';
	export let name = '';
	export let description = '';

	const dispatch = createEventDispatcher<{
		submit: { id: string; identifier: string; name: string; description: string };
		delete: { id: string };
	}>();

	$: valid = identifier.length !== 0 && name.length !== 0;

	function handleSubmit() {
		dispatch('submit', { id, identifier, name, description });
	}

	function handleDelete() {
		dispatch('delete', { id });
	}
</script>

<form class="area-details-editor" on:submit|preventDefault={handleSubmit}>
	<label class="label"
		><span>Identifier</span>
		<input class="input" type="text" bind:value={identifier} />
	</label>

	<label class="label"
		><span>Name</span>
		<input class="input" type="text" bind:value={name} />
	</label>

	<label class="label"
		><span>Description</span>
		<textarea class="textarea" bind:value={description}></textarea>
	</label>

	<button
		class="variant-ghost-primary btn mt-2"
		type="submit"
		disabled={!valid || forceDisableSubmit}>Done</button
	>
	<button class="variant-ghost-error btn" type="button" on:click={handleDelete}>Delete</button>

	<p class="mt-4 text-slate-400"><em>Note: changes will be stored on your device only</em></p>
</form>

<style>
	textarea {
		height: 300px;
	}
</style>
