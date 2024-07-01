<script context="module" lang="ts">
  import { Story, Template } from "@storybook/addon-svelte-csf"
  import type { Meta } from "@storybook/svelte"
  import Map from "$lib/components/Map.svelte"
  import image from "./static/first-floor.png"
  import image2 from "./static/death-house.webp"

  export const meta: Meta<Map> = {
    title: "components/Map",
    component: Map,
    tags: ["autodocs"],
  }
</script>

<Template let:args>
  <Map gridX={61.5} gridY={61.5} src={image} showGrid={false} on:change {...args} />
</Template>

<Story name="Grid on" args={{ showGrid: true }} />
<Story name="Grid off" />
<Story name="Different image" args={{ src: image2 }} />
<Story name="No image" args={{ src: undefined }} />
