<script context="module" lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import type { Meta } from '@storybook/svelte';
	import Markdown from '$lib/components/Markdown.svelte';

	export const meta: Meta<Markdown> = {
		title: 'components/Makrdown',
		component: Markdown,
		tags: ['autodocs']
	};

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

\`\`\`   
print("Hello, World!")
\`\`\`

what

>Do not believe everything you read on the internet
>-Abraham Lincoln

[A link](https://5e.tools)`;
</script>

<Story name="Default">
	<Markdown {content} />
</Story>
