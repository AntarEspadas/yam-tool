<script lang="ts">
  import { markdownService } from "$lib/services/MarkdownService"
  import { CodeBlock } from "@skeletonlabs/skeleton"

  export let content: string

  $: sections = markdownService.partialParse(content)
</script>

<div class="markdown">
  {#each sections as section}
    {#if typeof section === "string"}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html section}
    {:else}
      <CodeBlock language={section.lang || undefined} code={section.text} />
    {/if}
  {/each}
</div>

<style lang="scss">
  .markdown {
    :global(ul) {
      list-style: disc inside;
      padding-left: 1rem;
    }
    :global(ol) {
      list-style: decimal inside;
      padding-left: 1rem;
    }
    :global(table) {
      margin-top: 1rem;
    }
    :global(div.codeblock) {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }
</style>
