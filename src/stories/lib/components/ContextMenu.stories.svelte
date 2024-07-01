<script context="module" lang="ts">
  import { Story, Template } from "@storybook/addon-svelte-csf"
  import type { Meta } from "@storybook/svelte"
  import ContextMenu from "$lib/components/ContextMenu.svelte"

  export const meta: Meta<ContextMenu> = {
    title: "components/Context menu",
    component: ContextMenu,
    tags: ["autodocs"],
  }
</script>

<Story name="Default">
  <ContextMenu open autoclose={false} polygonId="polygon-id" x={0} y={0} />
</Story>
