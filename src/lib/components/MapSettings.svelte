<script lang="ts">
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton"
  import { FileButton } from "@skeletonlabs/skeleton"
  import Slider from "./Slider.svelte"

  export let gridX: number
  export let gridY: number
  export let gridXOffset: number
  export let gridYOffset: number
  export let showGrid: boolean

  export let open = false
</script>

<Accordion>
  <AccordionItem bind:open>
    <span class="material-symbols-outlined" slot="lead">map</span>
    <p slot="summary">Map settings</p>
    <svelte:fragment slot="content">
      <div class="file-input-container">
        <FileButton name="map-file-input" accept="image/*" on:change>Select map image</FileButton>
      </div>
      <label>
        <input class="checkbox" type="checkbox" bind:checked={showGrid} />
        <span>Show grid</span>
      </label>
      <Slider name="grid-x" label="Grid X" min={1} max={200} step={0.25} bind:value={gridX} />
      <Slider name="grid-y" label="Grid Y" min={1} max={200} step={0.25} bind:value={gridY} />
      <Slider
        name="grid-x-offset"
        label="Grid X offset"
        min={0}
        max={350}
        step={0.25}
        bind:value={gridXOffset}
      />
      <Slider
        name="grid-y-offset"
        label="Grid Y offset"
        min={0}
        max={350}
        step={0.25}
        bind:value={gridYOffset}
      />
    </svelte:fragment>
  </AccordionItem>
</Accordion>

<style>
  .file-input-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
