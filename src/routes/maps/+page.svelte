<script lang="ts">
  import { goto } from "$app/navigation"
  import MapList from "$lib/components/MapList.svelte"
  import { mapService } from "$lib/services/MapService"
  import { liveQuery } from "dexie"

  const maps = liveQuery(() => mapService.getMaps())

  async function createMap() {
    const mapId = await mapService.addMap()
    goto(`/maps/${mapId}`)
  }
</script>

<div class="main-container">
  <h1 class="h1">Maps</h1>
  <div>
    <button class="variant-soft-primary btn" on:click={createMap}>New map</button>
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
</style>
