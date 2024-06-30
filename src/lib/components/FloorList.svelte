<script lang="ts">
	import type { Floor } from '$lib/types';

	export let floors: Floor[];
	export let current: number;
</script>

<div class="floor-list card p-4">
	{#each floors as floor}
		<a href="/maps/{floor.mapId}/floors/{floor.id}">
			<div
				class:variant-soft={floor.id !== current}
				class:variant-soft-primary={floor.id === current}
				class="floor-preview card variant-soft p-4 hover:variant-soft-secondary"
			>
				<p>{floor.name}</p>
				<img class="floor-preview-image" src={floor.image} alt={floor.name} />
			</div>
		</a>
	{/each}
</div>

<style lang="scss">
	.floor-list {
		width: 130px;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow-y: auto;
		padding: 10px;

		@include lg {
			box-shadow: 10px 10px 22px -27px rgba(0, 0, 0, 0.75) inset;
			-webkit-box-shadow: 10px 10px 22px -27px rgba(0, 0, 0, 0.75) inset;
			-moz-box-shadow: 10px 10px 22px -27px rgba(0, 0, 0, 0.75) inset;
		}
	}
	.floor-preview {
		width: 100%;
		margin-bottom: 10px;
		padding: 7px;
	}
</style>
