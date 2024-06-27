<script lang="ts">
	import type { AreaDetails } from '$lib/types';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

	export let areas: Record<string, AreaDetails>;

	export let value: string | undefined = undefined;
</script>

<div class="area-list">
	<ListBox>
		{#each Object.keys(areas) as areaId (areaId)}
			<ListBoxItem
				name={areaId}
				class={value == areaId ? '' : 'variant-soft'}
				active="variant-soft-secondary"
				hover="hover:variant-ghost"
				bind:group={value}
				value={areaId}
			>
				<h6 class="h6">{areas[areaId].identifier}</h6>
				<h5 class="h5">
					{areas[areaId].name}
				</h5>
			</ListBoxItem>
		{/each}
	</ListBox>
</div>

<style>
	.area-list {
		overflow-y: auto;
	}
</style>
