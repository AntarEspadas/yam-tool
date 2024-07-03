<script lang="ts">
  import type { Map } from "$lib/types"

  export let maps: Map[]
</script>

{#if maps.length !== 0}
  <div class="maps">
    {#each maps as map}
      <a href="/maps/{map.id}">
        <div class="map card variant-soft p-4 hover:variant-soft-secondary">
          <p><strong>{map.name}</strong></p>
          <span class="missing-image material-symbols-outlined"> map </span>
        </div>
      </a>
    {/each}
  </div>
{:else}
  <div class="no-maps">
    <h5 class="h5">You don't have any maps yet</h5>
  </div>
{/if}

<style lang="scss">
  .maps {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .map {
    display: grid;
    grid-template-rows: 2rem 1fr;
    align-items: center;
    justify-content: center;
    width: 9rem;
    height: 14rem;
  }

  .missing-image {
    text-align: center;
    font-size: 5rem;
  }

  .no-maps {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  a {
    height: fit-content;
  }
</style>
