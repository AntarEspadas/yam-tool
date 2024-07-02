<script context="module" lang="ts">
  import { Story } from "@storybook/addon-svelte-csf"
  import type { Meta } from "@storybook/svelte"
  import FloorDetailsForm from "$lib/components/FloorDetailsForm.svelte"

  export const meta: Meta<FloorDetailsForm> = {
    title: "components/Floor details form",
    component: FloorDetailsForm,
    tags: ["autodocs"],
  }
</script>

<Story name="Default" let:args>
  <FloorDetailsForm on:submit on:cancel on:delete {...args} />
</Story>
