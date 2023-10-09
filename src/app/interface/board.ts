// [[x1, y1], ... [xN, yN]]
export type ElBounds = [number, number][];
export interface ElementBounds {
  [z: number]: {
    [el: number]: ElBounds;
  };
}

// [[[x1, y1], [x2, y2]], [[x1, y1], [x2, y2]]]
export type ZoneBounds = [number, number][][];
export interface BoardBoundaries extends ElementBounds {
  zoneBounds: ZoneBounds;
}