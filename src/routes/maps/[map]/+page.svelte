<script lang="ts">
  import { goto } from "$app/navigation"
  import MapDetailsForm from "$lib/components/MapDetailsForm.svelte"
  import Markdown from "$lib/components/Markdown.svelte"
  import { mapService } from "$lib/services/MapService"
  import { modalService } from "$lib/services/ModalService.js"
  import { getModalStore } from "@skeletonlabs/skeleton"

  export let data

  const modalStore = getModalStore()

  let edit = false

  $: ({ map } = data)

  async function updateMap(e: CustomEvent) {
    const { name, description } = e.detail
    map.name = name
    map.description = description
    edit = false
    await mapService.saveMap(map)
  }

  async function deleteMap() {
    const accept = await modalService.showModal(
      "confirm",
      { title: `Are you sure you wish to delete map "${map.name}"` },
      modalStore
    )
    if (accept !== true) return

    edit = false
    await mapService.deleteMapById(map.id)
    await goto("/maps")
  }
</script>

{#if edit !== true}
  <div class="map-details card p-4">
    <header class="card-header">
      <h1 class="h1">
        {map.name}
      </h1>
      <hr />
    </header>
    <section>
      <Markdown content={map.description ?? ""}></Markdown>
    </section>
    <footer class="card-footer">
      <button
        type="button"
        class="variant-soft-secondary btn btn-sm"
        on:click={() => (edit = true)}
      >
        <span class="material-symbols-outlined">edit</span>
        <span>Edit</span>
      </button>
    </footer>
  </div>
{:else}
  <div class="card p-4" style="height: 100%; overflow: hidden;">
    <MapDetailsForm
      name={map.name}
      description={map.description}
      on:submit={updateMap}
      on:cancel={() => (edit = false)}
      on:delete={deleteMap}
    />
  </div>
{/if}

<style>
  .map-details {
    display: grid;
    height: 100%;
    grid-template-rows: auto 1fr auto;
    overflow: hidden;
  }
  section {
    height: 100%;
    overflow: auto;
  }
</style>
