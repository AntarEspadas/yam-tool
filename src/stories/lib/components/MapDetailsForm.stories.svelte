<script context="module" lang="ts">
  import { Story } from "@storybook/addon-svelte-csf"
  import type { Meta } from "@storybook/svelte"
  import MapDetailsForm from "$lib/components/MapDetailsForm.svelte"

  export const meta: Meta<MapDetailsForm> = {
    title: "components/Map details form",
    component: MapDetailsForm,
    tags: ["autodocs"],
  }

  const description =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, magnam voluptas obcaecati consectetur, rerum, hic tenetur eius amet delectus sint cumque a inventore saepe iure quia nihil ipsam autem voluptatum."
</script>

<Story name="Default" let:args>
  <MapDetailsForm {description} name="Name of the map" {...args} />
</Story>
