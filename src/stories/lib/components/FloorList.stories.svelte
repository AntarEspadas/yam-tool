<script context="module" lang="ts">
  import type { Meta } from "@storybook/svelte"
  import type { Floor } from "$lib/types"
  import { Story, Template } from "@storybook/addon-svelte-csf"
  import FloorList from "$lib/components/FloorList.svelte"

  import firstFloor from "./static/first-floor.png"
  import firstFloorTilted from "./static/first-floor-tilted.png"
  import secondFloor from "./static/second-floor.png"
  import secondFloorTilted from "./static/second-floor-tilted.png"
  import thridFloor from "./static/third-floor.png"
  import thridFloorTilted from "./static/third-floor-tilted.png"
  import attic from "./static/attic.png"
  import atticTilted from "./static/attic-tilted.png"

  const images = [
    firstFloor,
    firstFloorTilted,
    secondFloor,
    secondFloorTilted,
    thridFloor,
    thridFloorTilted,
    attic,
    atticTilted,
  ]

  export const meta: Meta<FloorList> = {
    title: "components/Floor list",
    component: FloorList,
    tags: ["autodocs"],
  }

  const floorTemplate: Floor = {
    id: 0,
    mapId: 0,
    grid: {
      visible: true,
      x: 50,
      y: 50,
      xOffset: 0,
      yOffset: 0,
    },
    name: "",
    image: "",
    sortOrder: 0,
  }

  const manyFloors = new Array(10).fill(0).map((_, i) => ({
    ...floorTemplate,
    id: i,
    name: `Floor ${i + 1}`,
    image: images[i % images.length],
    sortOrder: i,
  }))

  const fewFloors = manyFloors.slice(0, 2)

  const missingImage = [{ ...floorTemplate, name: "New floor" }]
</script>

<Template let:args>
  <FloorList current={0} {...args} on:add />
</Template>

<Story name="Few floors" args={{ floors: fewFloors }} />
<Story name="Many floors" args={{ floors: manyFloors }} />
<Story name="Missing image" args={{ floors: missingImage }} />
