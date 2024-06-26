import type { Polygon } from '$lib/types';

export class PolygonService {
	private static readonly KEY = 'polygons';

	public getPolygons() {
		const serializedPolygons = localStorage.getItem(PolygonService.KEY) as string;
		return (JSON.parse(serializedPolygons) ?? {}) as Record<string, Polygon>;
	}

	public getPolygon(id: string): Polygon | undefined {
		return this.getPolygons()[id];
	}

	public savePolygon(id: string, polygon: Polygon) {
		const polygons = this.getPolygons();
		polygons[id] = polygon;
		const serializedPolygons = JSON.stringify(polygons);
		localStorage.setItem(PolygonService.KEY, serializedPolygons);
	}

	public deletePolygon(id: string) {
		const polygons = this.getPolygons();
		delete polygons[id];
		const serializedPolygons = JSON.stringify(polygons);
		localStorage.setItem(PolygonService.KEY, serializedPolygons);
	}
}

export const polygonService = new PolygonService();
