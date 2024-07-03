<script lang="ts">
  import { floorService } from "$lib/services/FloorService"
  import { liveQuery } from "dexie"
  import type { PageData } from "./floors/$types"
  import FloorList from "$lib/components/FloorList.svelte"
  import Sidebar from "$lib/components/Sidebar.svelte"
  import { leftSidebarOpen } from "$lib/stores"
  import { goto } from "$app/navigation"

  export let data: PageData

  $: ({ map, floorId } = data)

  $: floors = liveQuery(async () => await floorService.getFloorsByMapId(map.id))

  $: closeSidebar(floorId)

  async function addFloor() {
    const floorId = await floorService.addFloor(map.id)
    await goto(`/maps/${map.id}/floors/${floorId}`)
  }

  function closeSidebar(_floorId: number) {
    $leftSidebarOpen = false
  }

  $: console.log($floors)
</script>

<div class="floor-layout">
  <div class="left-sidebar">
    <Sidebar breakpoint="lg" direction="left" bind:open={$leftSidebarOpen}>
      <div class="floor-list-container">
        <FloorList floors={$floors ?? []} current={floorId} on:add={addFloor} />
      </div>
    </Sidebar>
  </div>
  <slot />
</div>

<button
  class="sidebar-button-left variant-filled-surface btn btn-sm"
  on:click={() => ($leftSidebarOpen = true)}
>
  <span class="material-symbols-outlined"> chevron_right </span>
</button>

<style lang="scss">
  .floor-layout {
    display: grid;
    width: 100%;
    height: 100%;
    @include xs {
      grid-template-rows: auto 1fr;
    }
    @include md {
      grid-template-rows: unset;
      grid-template-columns: auto 1fr;
    }
  }

  .floor-list-container {
    height: 100%;
  }

  .left-sidebar {
    overflow: hidden;
  }

  .sidebar-button-left {
    position: fixed;
    top: 5px;
    display: block;
    padding-bottom: 0;
    left: 5px;
    @include lg {
      display: none;
    }
  }
</style>
