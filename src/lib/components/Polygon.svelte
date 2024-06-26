<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import type { Point } from '$lib/types';
	import { polygonService } from '$lib/services/PolygonService';

	export let editing = false;
	export let id: string;
	export let gridX: number;
	export let gridY: number;
	export let editMode = false;
	export let disabled = false;

	const dispatch = createEventDispatcher<{
		closed: {};
		contextmenu: { originalEvent: MouseEvent; polygonId: string };
	}>();

	let points: Point[] = [];
	let dragTarget: Point | undefined = undefined;
	let closed = false;
	let mounted = false;

	$: opacity = editMode ? 1 : 0;

	$: load(id, mounted);

	$: svgPoints = getSvgPoints(points, closed, gridX, gridY);

	$: if (!editing) {
		document.removeEventListener('mousemove', onDrag);
		dragTarget = undefined;
		save(mounted);
	} else {
		document.addEventListener('mousemove', onDrag);
	}

	onMount(() => {
		document.addEventListener('mousemove', onDrag);
		document.addEventListener('mousedown', addPoint);
		document.addEventListener('mouseup', mouseUp);

		mounted = true;

		return () => {
			document.removeEventListener('mousemove', onDrag);
			document.removeEventListener('mousedown', addPoint);
			document.removeEventListener('mouseup', mouseUp);
		};
	});

	function save(mounted: boolean) {
		if (!mounted) return;
		polygonService.savePolygon(id, { points });
	}

	function load(id: string, mounted: boolean) {
		if (!mounted) return;
		const polygon = polygonService.getPolygon(id);
		points = polygon?.points ?? [];
		if (points.length !== 0) {
			closed = true;
		}
	}

	function getSvgPoints(points: Point[], closed: boolean, girdX: number, gridY: number) {
		let pointsStr = 'M' + points.map((p) => p.x * gridX + ' ' + p.y * gridY).join(' L ');
		if (closed) pointsStr += ' Z';
		return pointsStr;
	}

	function snap(x: number, y: number, gridX: number, gridY: number): [number, number] {
		const lowestX = Math.floor(x / gridX) * gridX;
		const lowestY = Math.floor(y / gridY) * gridY;
		const xDiff = x - lowestX;
		const yDiff = y - lowestY;

		let targetX = lowestX;
		if (xDiff > gridX / 2) {
			targetX += gridX;
		}

		let targetY = lowestY;
		if (yDiff > gridY / 2) {
			targetY += gridY;
		}

		return [targetX / gridX, targetY / gridY];
	}

	function addPoint(e: MouseEvent) {
		if (!editing) return;
		if (closed) return;
		const [x, y] = snap(e.clientX, e.clientY, gridX, gridY);
		points.push({
			x,
			y,
			first: points.length == 0
		});
		points = points;
	}

	function pointClicked(point: Point) {
		if (!editing) return;
		if (point.dragged) {
			delete point.dragged;
			return;
		}
		if (point.first) {
			closed = true;
			dispatch('closed', {});
		}
	}

	function pointMouseDown(point: Point) {
		if (!editing) return;
		dragTarget = point;
	}

	function mouseUp() {
		if (!editing) return;
		dragTarget = undefined;
	}

	function onDrag(e: MouseEvent) {
		if (!editing) return;
		if (dragTarget === undefined) return;
		const [x, y] = snap(e.clientX, e.clientY, gridX, gridY);
		dragTarget.x = x;
		dragTarget.y = y;
		// We can later use this to skip over 'click' events, as they should not be fired if the element was dragged
		dragTarget.dragged = true;
		points = points;
	}

	function pointKeyDown(e: KeyboardEvent, point: Point) {
		if (!e.key.startsWith('Arrow')) return;
		switch (e.key) {
			case 'ArrowDown':
				point.y += 1;
				break;
			case 'ArrowUp':
				point.y -= 1;
				break;
			case 'ArrowRight':
				point.x += 1;
				break;
			case 'ArrowLeft':
				point.x -= 1;
				break;
		}
		points = points;
	}

	function handleContextMenu(e: MouseEvent) {
		if (editMode || editing) return;
		dispatch('contextmenu', { originalEvent: e, polygonId: id });
	}
</script>

<path
	d={svgPoints}
	style:fill={closed ? 'rgba(0, 247, 247, 0.25)' : 'none'}
	style="
	--opacity:{opacity};
	--pointer-events:{disabled ? 'none' : 'all'};
	--cursor:{disabled || editing ? 'default' : 'pointer'};"
	on:contextmenu={handleContextMenu}
/>
{#if editing}
	{#each points as point, i}
		<circle
			cx={point.x * gridX}
			cy={point.y * gridY}
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
	}
</style>
