<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte"
  import type { Point } from "$lib/types"
  import { polygonService } from "$lib/services/PolygonService"

  let relativeGridX
  let relativeGridY
  let relativeGridXOffset
  let relativeGridYOffset

  export {
    relativeGridX as gridX,
    relativeGridY as gridY,
    relativeGridXOffset as gridXOffset,
    relativeGridYOffset as gridYOffset,
  }

  export let allowEdit = false
  export let id: string
  export let floorId: number
  export let disabled = false
  export let parent: HTMLElement
  export let forceShow = false
  export let parentWidth = 0
  export let parentHeight = 0

  const dispatch = createEventDispatcher<{
    closed: {}
    contextmenu: { originalEvent: MouseEvent; polygonId: string }
    click: { originalEvent: MouseEvent; polygonId: string }
    keydown: { originalEvent: KeyboardEvent; polygonId: string }
  }>()

  let points: Point[] = []
  let dragTarget: Point | undefined = undefined
  let closed = false

  let mounted = false
  let loaded = false

  $: gridX = (relativeGridX / 500) * parentWidth
  $: gridY = (relativeGridY / 500) * parentHeight
  $: gridXOffset = (relativeGridXOffset / 500) * (parentWidth - gridX)
  $: gridYOffset = (relativeGridYOffset / 500) * (parentHeight - gridY)

  $: opacity = forceShow ? 1 : 0

  $: load(id, mounted)

  $: svgPoints = getSvgPoints(points, closed, gridX, gridY, gridXOffset, gridYOffset)

  $: if (!allowEdit) {
    parent.removeEventListener("mousemove", onDrag)
    dragTarget = undefined
    save(mounted, loaded)
  } else {
    parent.addEventListener("mousemove", onDrag)
  }

  onMount(() => {
    parent.addEventListener("mousemove", onDrag)
    parent.addEventListener("mousedown", addPoint)
    parent.addEventListener("mouseup", mouseUp)

    mounted = true

    return () => {
      parent.removeEventListener("mousemove", onDrag)
      parent.removeEventListener("mousedown", addPoint)
      parent.removeEventListener("mouseup", mouseUp)
    }
  })

  function save(mounted: boolean, loaded: boolean) {
    if (!mounted) return
    if (!loaded) return
    polygonService.savePolygon({ id, floorId, points })
  }

  async function load(id: string, mounted: boolean) {
    if (!mounted) return
    const polygon = await polygonService.getPolygon(id)
    points = polygon?.points ?? []
    if (points.length !== 0) {
      closed = true
    }
    loaded = true
  }

  function getSvgPoints(
    points: Point[],
    closed: boolean,
    gridX: number,
    gridY: number,
    gridXOffset: number,
    gridYOffset: number
  ) {
    let pointsStr =
      "M" +
      points.map((p) => p.x * gridX + gridXOffset + " " + (p.y * gridY + gridYOffset)).join(" L ")
    if (closed) pointsStr += " Z"
    return pointsStr
  }

  function snap(
    x: number,
    y: number,
    gridX: number,
    gridY: number,
    gridXOffset: number,
    gridYOffset: number
  ): [number, number] {
    x -= gridXOffset
    y -= gridYOffset
    const lowestX = Math.floor(x / gridX) * gridX
    const lowestY = Math.floor(y / gridY) * gridY
    const xDiff = x - lowestX
    const yDiff = y - lowestY

    let targetX = lowestX
    if (xDiff > gridX / 2) {
      targetX += gridX
    }

    let targetY = lowestY
    if (yDiff > gridY / 2) {
      targetY += gridY
    }

    return [targetX / gridX, targetY / gridY]
  }

  function addPoint(e: MouseEvent) {
    if (!allowEdit) return
    if (closed) return
    if (e.button !== 0) return
    const [x, y] = snap(e.layerX, e.layerY, gridX, gridY, gridXOffset, gridYOffset)
    points.push({
      x,
      y,
      first: points.length == 0,
    })
    points = points
  }

  function pointClicked(point: Point) {
    if (!allowEdit) return
    if (point.dragged) {
      delete point.dragged
      return
    }
    if (point.first) {
      closed = true
      dispatch("closed", {})
    }
  }

  function pointMouseDown(point: Point) {
    if (!allowEdit) return
    dragTarget = point
  }

  function mouseUp() {
    if (!allowEdit) return
    dragTarget = undefined
  }

  function onDrag(e: MouseEvent) {
    if (!allowEdit) return
    if (dragTarget === undefined) return
    const [x, y] = snap(e.layerX, e.layerY, gridX, gridY, gridXOffset, gridYOffset)
    dragTarget.x = x
    dragTarget.y = y
    // We can later use this to skip over 'click' events, as they should not be fired if the element was dragged
    dragTarget.dragged = true
    points = points
  }

  function pointKeyDown(e: KeyboardEvent, point: Point) {
    if (!e.key.startsWith("Arrow")) return
    switch (e.key) {
      case "ArrowDown":
        point.y += 1
        break
      case "ArrowUp":
        point.y -= 1
        break
      case "ArrowRight":
        point.x += 1
        break
      case "ArrowLeft":
        point.x -= 1
        break
    }
    points = points
  }

  function handleContextMenu(e: MouseEvent) {
    if (allowEdit) return
    dispatch("contextmenu", { originalEvent: e, polygonId: id })
  }

  function handleClick(e: MouseEvent) {
    if (allowEdit) return
    dispatch("click", { originalEvent: e, polygonId: id })
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (allowEdit) return
    dispatch("keydown", { originalEvent: e, polygonId: id })
  }
</script>

<path
  d={svgPoints}
  style:fill={closed ? "rgba(0, 247, 247, 0.25)" : "none"}
  style="
	--opacity:{opacity};
	--pointer-events:{disabled ? 'none' : 'all'};
	--cursor:{disabled || allowEdit ? 'default' : 'pointer'};"
  role="button"
  tabindex="0"
  on:contextmenu={handleContextMenu}
  on:click={handleClick}
  on:keydown={handleKeyDown}
/>
{#if allowEdit}
  {#each points as point, i}
    <circle
      cx={point.x * gridX + gridXOffset}
      cy={point.y * gridY + gridYOffset}
      r="10"
      fill="rgb(17, 155, 155)"
      on:click|stopPropagation={() => pointClicked(point)}
      on:mousedown|stopPropagation={() => pointMouseDown(point)}
      on:keydown={(e) => pointKeyDown(e, point)}
      role="button"
      tabindex="0"
    />
  {/each}
{/if}

<style>
  path {
    opacity: var(--opacity);
    stroke: rgba(0, 122, 204, 0.5);
    stroke-width: 3px;
    pointer-events: var(--pointer-events);
    cursor: var(--cursor);
  }

  path:hover {
    opacity: 1;
    outline: none;
  }
</style>
