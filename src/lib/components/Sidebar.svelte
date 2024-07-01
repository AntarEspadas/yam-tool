<script lang="ts">
  import { Drawer } from "vaul-svelte"
  import { onMount } from "svelte"

  type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl"

  export let breakpoint: Breakpoint
  export let open = false
  export let direction: "left" | "right" = "left"

  let width = 0
  let isMounted = false
  let breakpointDiv: HTMLElement

  $: breakpointWidth = getWidth(breakpoint, isMounted)

  onMount(() => {
    window.addEventListener("resize", updateWidth)

    width = window.innerWidth

    isMounted = true

    return () => {
      window.removeEventListener("resize", updateWidth)
    }
  })

  function updateWidth() {
    width = window.innerWidth
  }

  function getWidth(breakpoint: Breakpoint, mounted: boolean) {
    if (!mounted) return Number.POSITIVE_INFINITY
    const varValue = getComputedStyle(breakpointDiv).getPropertyValue("--" + breakpoint)
    return Number(varValue?.replaceAll("px", ""))
  }
</script>

<div class="breakpoints" bind:this={breakpointDiv}></div>
{#if width >= breakpointWidth}
  <slot />
{:else}
  <Drawer.Root bind:open shouldScaleBackground bind:direction>
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 bg-black/40" />
      <Drawer.Content class="sidebar-drawer-content {direction === 'left' ? 'left' : 'right'}">
        <div class="card p-4">
          <slot />
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}

<style lang="scss">
  .breakpoints {
    display: none;
    --xs: #{$xsBreakpoint};
    --sm: #{$smBreakpoint};
    --md: #{$mdBreakpoint};
    --lg: #{$lgBreakpoint};
    --xl: #{$xlBreakpoint};
    --xxl: #{$xxlBreakpoint};
  }

  .card {
    height: 100%;
  }

  :global(.sidebar-drawer-content) {
    position: fixed;
    overflow-y: auto;
    overflow-x: hidden;
    top: 0;
    bottom: 0;
  }

  :global(.sidebar-drawer-content.right) {
    right: 0;
    @include xs {
      left: 25px;
    }
    @include sm {
      left: auto;
    }
  }
  :global(.sidebar-drawer-content.left) {
    left: 0;
    @include xs {
      right: 25px;
    }
    @include sm {
      right: auto;
    }
  }
</style>
