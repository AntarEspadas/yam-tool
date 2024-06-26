export interface Point {
	x: number;
	y: number;
	first: boolean;
	dragged?: boolean;
}

export interface Polygon {
	points: Point[];
}

export interface AreaDetails {
	identifier: string;
	name: string;
	description: string;
}
