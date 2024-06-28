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

export interface Grid {
	x: number;
	y: number;
	visible: boolean;
}

export interface Floor {
	image?: string;
	grid: Grid;
	areas: Record<string, AreaDetails>;
}
