export interface Point {
	x: number;
	y: number;
	first: boolean;
	dragged?: boolean;
}

export interface Polygon {
	id: string;
	floorId: number;
	points: Point[];
}

export interface Area {
	id: string;
	floorId: number;
	identifier: string;
	name: string;
	description: string;
}

export interface Grid {
	x: number;
	y: number;
	visible: boolean;
}

export interface Floor {
	id: number;
	mapId: number;
	image?: string;
	grid: Grid;
	name: string;
}

export interface Map {
	id: number;
	name: string;
}
