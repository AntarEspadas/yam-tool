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
			}
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

	// public saveFloors(floors: Record<string, Floor | undefined>) {
	// 	const serializedFloors = JSON.stringify(floors);
	// 	localStorage.setItem(FloorService.KEY, serializedFloors);
	// }
}

export const floorService = new FloorService(db);
