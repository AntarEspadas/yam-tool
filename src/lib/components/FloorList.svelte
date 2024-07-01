<script lang="ts">
  import type { Floor } from "$lib/types"
  import { createEventDispatcher } from "svelte"

  export let floors: Floor[]
  export let current: number

  const dispatch = createEventDispatcher<{ add: {} }>()
</script>

<div class="floor-list card p-4">
  {#each floors as floor}
    <a href="/maps/{floor.mapId}/floors/{floor.id}">
      <div
        class:variant-soft={floor.id !== current}
        class:variant-soft-primary={floor.id === current}
        class="floor-preview card variant-soft p-4 hover:variant-soft-secondary"
      >
        <p>{floor.name}</p>
        {#if floor.image}
          <img class="floor-preview-image" src={floor.image} alt={floor.name} />
        {:else}
          <span class="missing-image material-symbols-outlined"> description </span>
        {/if}
      </div>
    </a>
  {/each}
  <button class="add-btn btn" on:click={() => dispatch("add", {})} aria-label="Add floor">
    <div
      class="add-card card variant-soft border-surface-500 p-4 hover:variant-soft-secondary hover:border-secondary-500"
    >
      <span class="material-symbols-outlined">add</span>
    </div>
  </button>
</div>

<style lang="scss">
  .floor-list {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    padding: 10px;

    @include xs {
      width: 100%;
    }

    @include sm {
      width: 130px;
    }

    @include lg {
      box-shadow: 10px 10px 22px -27px rgba(0, 0, 0, 0.75) inset;
      -webkit-box-shadow: 10px 10px 22px -27px rgba(0, 0, 0, 0.75) inset;
      -moz-box-shadow: 10px 10px 22px -27px rgba(0, 0, 0, 0.75) inset;
    }
  }
  .floor-preview {
    width: 100%;
    margin-bottom: 10px;
    padding: 7px;
  }

  .add-btn {
    width: 100%;
    padding: 0px;
  }

  .add-card {
    width: 70%;
    aspect-ratio: 2/3;
    display: flex;
    justify-content: center;
    align-items: center;
    border-style: dashed;
    border-width: 2px;
  }

  .missing-image {
    text-align: center;
    width: 100%;
    font-size: 60px;
  }
</style>
