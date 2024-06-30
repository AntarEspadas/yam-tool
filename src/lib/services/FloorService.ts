import type { Floor } from '$lib/types';
import { type MapDb, db } from '$lib/db/indext';
export class FloorService {
	private static readonly KEY = 'floors';

	constructor(private db: MapDb) {}

	public addFloor(mapId: number) {
		return this.db.floors.add({
			mapId,
			grid: {
				visible: false,
				x: 50,
				y: 50
			},
			name: 'New Floor'
		});
	}

	public getFloor(id: number) {
		return this.db.floors.where('id').equals(id).first();
	}

	public saveFloor(floor: Floor) {
		return this.db.floors.put(floor);
	}

	public getFloors() {
		return this.db.floors.toArray();
	}

	public getFloorsByMapId(mapId: number) {
		return this.db.floors.where('mapId').equals(mapId).toArray();
	}
}

export const floorService = new FloorService(db);
