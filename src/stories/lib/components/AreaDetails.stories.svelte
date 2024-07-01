<script context="module" lang="ts">
  import { Story, Template } from "@storybook/addon-svelte-csf"
  import type { Meta } from "@storybook/svelte"
  import AreaDetails from "$lib/components/AreaDetails.svelte"

  export const meta: Meta<AreaDetails> = {
    title: "components/Area details",
    component: AreaDetails,
    tags: ["autodocs"],
  }

  let markdownDescription = `
# Title 1
## Title 2
### Title 3
#### Title 4
##### Title 5
###### Title 6

*These letters are italic*

**These letters are bold**

- Have
- some
- bullet
- points

what

	Do not believe everything you read on the internet -Abraham Lincoln
	`
</script>

<Template let:args>
  <AreaDetails
    id="0"
    identifier="Lorem"
    name="ipsum dolor sit amet"
    description="Nesciunt illo quos perferendis voluptatibus odit. Nam sed commodi totam nulla, fugit voluptatem? Possimus cupiditate excepturi soluta earum nihil tempore voluptates saepe."
    on:edit
    {...args}
  />
</Template>

<Story name="Default"></Story>

<Story name="Empty description" args={{ description: "" }}></Story>

<Story name="Markdown description" args={{ description: markdownDescription }}></Story>
