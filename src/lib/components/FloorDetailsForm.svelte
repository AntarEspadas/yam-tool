<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let name: string
  export let sortOrder: number

  const dispatch = createEventDispatcher<{
    submit: { name: string; sortOrder: number }
    cancel: undefined
    delete: undefined
  }>()

  function handleSubmit() {
    dispatch("submit", { name, sortOrder })
  }
</script>

<form class="floor-details-form" on:submit|preventDefault={handleSubmit}>
  <label class="label">
    <span>Name</span>
    <input class="input" type="text" bind:value={name} />
  </label>
  <label class="sort-order label"
    ><span>Sort order</span>
    <br />
    <input class="input" type="number" bind:value={sortOrder} />
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
</form>

<style lang="scss">
  .sort-order {
    width: 5.5rem;
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
