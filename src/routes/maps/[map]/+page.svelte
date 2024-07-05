<script lang="ts">
  import { goto } from "$app/navigation"
  import MapDetailsForm from "$lib/components/MapDetailsForm.svelte"
  import Markdown from "$lib/components/Markdown.svelte"
  import { fileService } from "$lib/services/FileService.js"
  import { mapService } from "$lib/services/MapService"
  import { modalService } from "$lib/services/ModalService.js"
  import { getModalStore } from "@skeletonlabs/skeleton"

  export let data

  const modalStore = getModalStore()

  let edit = false
  let isExportInProgress = false

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
    await goto("/maps", { replaceState: true })
  }

  async function exportMap() {
    isExportInProgress = true
    try {
      const exportedMap = await mapService.exportMap(map.id)
      const blob = new Blob([exportedMap], { type: "application/json" })
      fileService.download(blob, map.name + ".json")
    } finally {
      isExportInProgress = false
    }
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
      <button
        type="button"
        class="variant-soft-secondary btn btn-sm"
        on:click={exportMap}
        disabled={isExportInProgress}
      >
        <span class="material-symbols-outlined"> upload </span>
        <span>Export</span>
      </button>
    </footer>
  </div>
{:else}
  <div class="map-details-form card p-4">
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
  header {
    margin-bottom: 2rem;
  }
  .map-details {
    display: grid;
    height: 100%;
    grid-template-rows: auto 1fr auto;
    overflow: hidden;
    justify-content: center;
  }
  section {
    height: 100%;
    max-width: 1200px;
    overflow: auto;
  }

  .map-details-form {
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }
</style>
