import type { Polygon } from '$lib/types';
import { type MapDb, db } from '$lib/db/indext';

export class PolygonService {
	private static readonly KEY = 'polygons';

	constructor(private db: MapDb) {}

	public getPolygonsByFloor(floorId: number) {
		return this.db.polygons.where('floorId').equals(floorId).toArray();
	}

	public getPolygon(id: string) {
		return this.db.polygons.where('id').equals(id).first();
	}

	public savePolygon(polygon: Polygon) {
		return this.db.polygons.put(polygon);
	}

	public deletePolygon(id: string) {
		return this.db.polygons.delete(id);
	}
}

export const polygonService = new PolygonService(db);
