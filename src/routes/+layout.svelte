<script lang="ts">
  import { Modal, initializeStores } from "@skeletonlabs/skeleton"
  import { onMount } from "svelte"
  import { autoModeWatcher } from "@skeletonlabs/skeleton"
  import { mapService } from "$lib/services/MapService"
  import "../app.css"

  initializeStores()

  onMount(async () => {
    autoModeWatcher()

    mapService.importDemoMap()
  })
</script>

<Modal />

<div class="app-container">
  <slot></slot>
</div>

<style>
  :global(body) {
    margin: 0;
  }

  .app-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
