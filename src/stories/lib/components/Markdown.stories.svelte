<script context="module" lang="ts">
  import { Story } from "@storybook/addon-svelte-csf"
  import type { Meta } from "@storybook/svelte"
  import Markdown from "$lib/components/Markdown.svelte"

  export const meta: Meta<Markdown> = {
    title: "components/Makrdown",
    component: Markdown,
    tags: ["autodocs"],
  }

  let content = `# Title 1
## Title 2
### Title 3
#### Title 4
##### Title 5
###### Title 6

This right here is just a regular paragraph

*These letters are italic*

**These letters are bold**

And here *we* **mix** ~~and~~ _match_ \`styles\`

- Have
- some
- bullet
- points

1. one
2. two
3. three

a

1000000. First list item
   - First nested list item
     - Second nested list ite

\`\`\`   
print("Hello, World!")
\`\`\`

>Do not believe everything you read on the internet
>-Abraham Lincoln

[A link](https://5e.tools)

- [ ] A checkbox

Water is H<sub>2</sub>O

E = mc<sup>2</sub>




| API        | Documented CSP Policy           |
| ------------- |:-------------:|
|Google Fonts|No documented policy|
|Mixpanel|No documented policy|
|Ractive.js|[Documented policy](http://docs.ractivejs.org/edge/csp)|
|Stripe|[Documented policy](https://support.stripe.com/questions/what-about-pci-dss-3-1)|

| Model 1 | Model 2 | Conclusion |
|---------|---------|------------|
| True    | True    | ???        |
| False   | False   | ???        |
| True    | False   | ???        |
| False   | True    | ???        |

`
</script>

<Story name="Default">
  <Markdown {content} />
</Story>
