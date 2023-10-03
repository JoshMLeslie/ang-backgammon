import * as C from './board.const';

// in px unless otherwise noted / obvious
const ZONE_WIDTH = (C.BOARD_WIDTH - C.DIVIDE_WIDTH) / 2 - C.GOAL_WIDTH;
const ZONE_HEIGHT = 168;

const MARKER_GAP = 8;
const MARKER_HEIGHT = 160;
const MARKER_WIDTH =
  (ZONE_WIDTH - (C.ZONE_ELEMENT_COUNT + 1) * MARKER_GAP) / C.ZONE_ELEMENT_COUNT;
const MARKER_TIP_WIDTH = MARKER_WIDTH / 5;
const MARKER_TIP_START = MARKER_TIP_WIDTH * 2;
const MARKER_TIP_END = MARKER_TIP_WIDTH + MARKER_TIP_START;

// 1 2
// 3 4
const ZONE = [1, 2, 3, 4];
const ZONE_START: { [z: number]: { x: number; y: number } } = {
  1: { x: C.GOAL_WIDTH + MARKER_GAP, y: C.BOARD_BORDER_STROKE },
  2: {
    x: C.DIVIDE_WIDTH / 2 + MARKER_GAP + C.BOARD_WIDTH / 2,
    y: C.BOARD_BORDER_STROKE,
  },
  3: {
    x: C.GOAL_WIDTH + MARKER_GAP,
    y: C.BOARD_HEIGHT - C.BOARD_BORDER_STROKE,
  },
  4: {
    x: C.DIVIDE_WIDTH / 2 + MARKER_GAP + C.BOARD_WIDTH / 2,
    y: C.BOARD_HEIGHT - C.BOARD_BORDER_STROKE,
  },
};

/* [[startX, startY, endX, endY], ...] */
type ElementBounds = number[][];
interface BackgroundBoundaries {
  zoneBounds: ElementBounds;
  [z: number]: ElementBounds;
}

export const drawZonesAndTriangles = (ctx: CanvasRenderingContext2D): BackgroundBoundaries => {
  if (!ctx) {
    throw Error('Fn called without canvas ctx');
  }

  const zoneBounds: ElementBounds = [];
  const zoneElementBounds: { [z: number]: ElementBounds } = {};

  ZONE.forEach((z) => {
    const { x: zoneStartX, y: zoneStartY } = ZONE_START[z];
		zoneBounds.push([zoneStartX, zoneStartY, zoneStartX + ZONE_WIDTH, zoneStartY + ZONE_HEIGHT,])

    const invert = z > 2;
    const markerHeight = zoneStartY + (invert ? -1 : 1) * MARKER_HEIGHT;

    for (let i = 0; i < C.ZONE_ELEMENT_COUNT; i++) {
      ctx.fillStyle = i % 2 ? 'black' : 'lightgray';
			
      const lineStartX = zoneStartX + i * (MARKER_WIDTH + MARKER_GAP);

      const shapeBounds = [
        [lineStartX, zoneStartY],
        [lineStartX + MARKER_TIP_START, markerHeight],
        [lineStartX + MARKER_TIP_END, markerHeight],
        [lineStartX + MARKER_WIDTH, zoneStartY],
      ];

      ctx.beginPath();
      ctx.moveTo(lineStartX, zoneStartY);
      // leg 1
      ctx.lineTo(lineStartX + MARKER_TIP_START, markerHeight);
      // cap
      ctx.arc(
        lineStartX + MARKER_WIDTH / 2,
        markerHeight,
        MARKER_TIP_WIDTH / 2,
        180,
        0,
        !invert // the other way doesn't work right
      );
      // tip
      ctx.lineTo(lineStartX + MARKER_TIP_END, markerHeight);
      // leg 2
      ctx.lineTo(lineStartX + MARKER_WIDTH, zoneStartY);
      ctx.fill();
    }
  });
  return { zoneBounds, ...zoneElementBounds };
};
