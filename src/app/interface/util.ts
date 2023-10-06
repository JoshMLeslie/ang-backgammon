export interface XYCoord {
	x: number;
	y: number;
}

export interface BoardCoord {
	zone: number;
	element: number;
}

export interface BoardCoordMove {
	init: boolean;
	from: BoardCoord;
	to: BoardCoord;
}