<script context="module" lang="ts">
  import { Story, Template } from "@storybook/addon-svelte-csf"
  import type { Meta } from "@storybook/svelte"
  import Sidebar from "$lib/components/Sidebar.svelte"

  export const meta: Meta<Sidebar> = {
    title: "components/Sidebar",
    component: Sidebar,
    tags: ["autodocs"],
  }
</script>

<Template let:args>
  <Sidebar breakpoint="md" {...args}>
    <ul class="ul" style="width: 300px; height: 100%; overflow-y: auto">
      {#each new Array(15).fill(0) as _, i}
        <li>
          <div class="card p-4">
            <p>Element {i + 1}</p>
          </div>
        </li>
      {/each}
    </ul>
  </Sidebar>
</Template>

<Story name="Left - hidden" args={{ direction: "left" }}></Story>
<Story name="Right - hidden" args={{ direction: "right" }}></Story>
<Story name="Left - visible" args={{ direction: "left", open: true, breakpoint: "xl" }}></Story>
<Story name="Right - visible" args={{ direction: "right", open: true, breakpoint: "xl" }}></Story>
