<script lang="ts">
	import { markdownService } from '$lib/services/MarkdownService';
	import { CodeBlock } from '@skeletonlabs/skeleton';

	export let content: string;

	$: sections = markdownService.partialParse(content);
</script>

<div class="markdown">
	{#each sections as section}
		{#if typeof section === 'string'}
			{@html section}
		{:else}
			<CodeBlock language={section.lang || undefined} code={section.text} />
		{/if}
	{/each}
</div>

<style lang="scss">
	.markdown {
		:global(ul),
		:global(ol) {
			list-style: unset;
			padding-left: 2rem;
		}
	}
</style>
