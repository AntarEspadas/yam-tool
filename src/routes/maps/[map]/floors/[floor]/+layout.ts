import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { mapService } from '$lib/services/MapService';

export const ssr = false;
export const prerender = false;

export const load: PageLoad = async ({ params }) => {
	const mapId = Number(params.map);
	const floorId = Number(params.floor);

	if (isNaN(mapId)) error(400, 'Invalid map');
	if (isNaN(floorId)) error(400, 'Invalid floor');

	const map = await mapService.getMapById(mapId);

	if (map === undefined) error(404, 'Map not found');

	return {
		map,
		floorId
	};
};
