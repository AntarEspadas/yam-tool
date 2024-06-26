export interface Point {
	x: number;
	y: number;
	first: boolean;
	dragged?: boolean;
}

export interface Polygon {
	points: Point[];
}
