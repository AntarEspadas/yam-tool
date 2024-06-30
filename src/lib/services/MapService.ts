import type { MapDb } from '$lib/db/indext';
import { db } from '$lib/db/indext';

export class MapService {
	constructor(private db: MapDb) {}

	public getMapById(mapId: number) {
		return this.db.maps.where('id').equals(mapId).first();
	}

	public addMap() {
		return this.db.maps.add({ name: 'New Map' });
	}
}

export const mapService = new MapService(db);
