export interface XYCoord {
	x: number;
	y: number;
}

export interface BoardCoord {
	zone: number;
	columnn: number;
}

export interface BoardCoordMove {
	init: boolean;
	from: BoardCoord;
	to: BoardCoord;
}