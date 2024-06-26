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
	<label for="identifier-input">Identifier</label>
	<input id="identifier-input" type="text" bind:value={identifier} />

	<label for="name-input">Name</label>
	<input id="name-input" type="text" bind:value={name} />

	<label for="description-input"></label>
	<textarea id="description-input" bind:value={description}></textarea>

	<button type="submit" disabled={!valid || forceDisableSubmit}>Done</button>
	<button on:click={handleDelete}>Delete</button>
</form>
