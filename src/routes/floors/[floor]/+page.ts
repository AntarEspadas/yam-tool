import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { floorService } from '$lib/services/FloorService';

export const load: PageLoad = ({ params }) => {
	const floor = floorService.getFloor(params.floor);
	if (floor === undefined) error(404, 'Floor not found');
	return {
		floor,
		floorId: params.floor
	};
};
