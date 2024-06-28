import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { floorService } from '$lib/services/FloorService';
import { polygonService } from '$lib/services/PolygonService';
import { areaService } from '$lib/services/AreaService';

export const load: PageLoad = async ({ params }) => {
	const floorId = Number(params.floor);
	if (isNaN(floorId)) error(400, 'Invalid floor');

	const floor = await floorService.getFloor(floorId);
	const polygons = await polygonService.getPolygonsByFloor(floorId);
	const areas = await areaService.getAreasByFloor(floorId);

	if (floor === undefined) error(404, 'Floor not found');

	return {
		floor
	};
};
