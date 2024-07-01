<script context="module" lang="ts">
  import { Story, Template } from "@storybook/addon-svelte-csf"
  import type { Meta } from "@storybook/svelte"
  import AreaDetailsForm from "$lib/components/AreaDetailsForm.svelte"

  export const meta: Meta<AreaDetailsForm> = {
    title: "components/Area details form",
    component: AreaDetailsForm,
    tags: ["autodocs"],
  }
</script>

<Story name="Default">
  <AreaDetailsForm
    id="story-area"
    identifier=""
    name=""
    description=""
    forceDisableSubmit={false}
    on:submit
    on:delete
  />
</Story>
