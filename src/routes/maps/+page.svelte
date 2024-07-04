<script lang="ts">
  import { goto } from "$app/navigation"
  import MapList from "$lib/components/MapList.svelte"
  import { mapService } from "$lib/services/MapService"
  import { liveQuery } from "dexie"
  import { FileButton } from "@skeletonlabs/skeleton"
  import { fileService } from "$lib/services/FileService"

  const maps = liveQuery(() => mapService.getMaps())

  async function createMap() {
    const mapId = await mapService.addMap()
    goto(`/maps/${mapId}`)
  }

  async function importMap(e: Event) {
    const target = e.target as HTMLInputElement
    if (!target.files?.length) return
    const content = await fileService.readAsText(target.files[0])
    await mapService.importMap(content)
  }
</script>

<div class="main-container">
  <h1 class="h1">Maps</h1>
  <div class="buttons">
    <button class="variant-soft-primary btn" on:click={createMap}>
      <span class="material-symbols-outlined"> add </span>
      <span> New map </span>
    </button>
    <FileButton
      name="import"
      button="btn variant-soft-primary"
      accept="application/json"
      on:change={importMap}
    >
      <span class="material-symbols-outlined"> download </span>
      <span> Import </span>
    </FileButton>
  </div>
  <MapList maps={$maps ?? []} />
</div>

<style>
  .main-container {
    height: calc(100% - 2rem);
    width: calc(100% - 2rem);
    display: grid;
    grid-template-rows: auto auto 1fr;
    gap: 2rem;
  }

  .buttons {
    display: flex;
    gap: 1rem;
  }
</style>
