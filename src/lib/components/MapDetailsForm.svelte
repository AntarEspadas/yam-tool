<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let name = ""
  export let description = ""

  const dispatch = createEventDispatcher<{
    submit: { name: string; description: string }
    cancel: undefined
    delete: undefined
  }>()

  function handleSubmit() {
    dispatch("submit", { name, description })
  }
</script>

<form class="floor-details-form" on:submit|preventDefault={handleSubmit}>
  <label class="label">
    <span>Name</span>
    <input class="input" type="text" bind:value={name} />
  </label>

  <label class="label" style="height: 100%;"
    ><span>Description</span>
    <textarea class="textarea" bind:value={description}></textarea>
  </label>

  <div class="buttons">
    <button class="variant-ghost-primary btn" type="submit">Save</button>
    <button class="variant-ghost-error btn" type="button" on:click={() => dispatch("cancel")}>
      Cancel
    </button>
    <button
      class="delete-btn variant-ghost-error btn"
      type="button"
      on:click={() => dispatch("delete")}
    >
      <span class="material-symbols-outlined"> delete </span>
    </button>
  </div>
  <p class="mt-4 text-slate-400"><em>Note: changes will be stored on your device only</em></p>
</form>

<style>
  form {
    height: 100%;
    width: 100%;
    max-width: 1200px;
    display: grid;
    grid-template-rows: auto 1fr auto auto;
  }
  textarea {
    height: 90%;
    resize: none;
  }
  .buttons {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    gap: 0.5rem;
  }
  .delete-btn {
    grid-column: 4;
  }
</style>
