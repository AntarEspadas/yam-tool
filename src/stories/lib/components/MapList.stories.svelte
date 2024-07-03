<script context="module" lang="ts">
  import { Story, Template } from "@storybook/addon-svelte-csf"
  import type { Meta } from "@storybook/svelte"
  import MapList from "$lib/components/MapList.svelte"
  import type { Map } from "$lib/types"

  export const meta: Meta<MapList> = {
    title: "components/Map list",
    component: MapList,
    tags: ["autodocs"],
  }

  const maps: Map[] = new Array(30)
    .fill(0)
    .map((_, i) => ({ id: i, name: `Map ${1}`, description: "" }))
</script>

<Template let:args>
  <MapList {...args} />
</Template>

<Story name="Several items" args={{ maps }} />
<Story name="No items" args={{ maps: [] }} />
