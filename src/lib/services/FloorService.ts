import type { Floor } from '$lib/types';

export class FloorService {
	private static readonly KEY = 'floors';

	public addFloor() {
		const floors = this.getFloors();
		const id = crypto.randomUUID();
		floors[id] = {
			grid: {
				visible: false,
				x: 50,
				y: 50
			},
			areas: {}
		};
		this.saveFloors(floors);
		return id;
	}

	public getFloor(id: string) {
		const floors = this.getFloors();
		return floors[id];
	}

	public saveFloor(id: string, floor: Floor) {
		const floors = this.getFloors();
		floors[id] = floor;
		this.saveFloors(floors);
	}

	public getFloors() {
		const serializedFloors = localStorage.getItem(FloorService.KEY) as string;
		return (JSON.parse(serializedFloors) ?? {}) as Record<string, Floor | undefined>;
	}

	public saveFloors(floors: Record<string, Floor | undefined>) {
		const serializedFloors = JSON.stringify(floors);
		localStorage.setItem(FloorService.KEY, serializedFloors);
	}
}

export const floorService = new FloorService();
