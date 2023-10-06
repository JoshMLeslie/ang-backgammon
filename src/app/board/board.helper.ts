import { XYCoord } from '../interface/util';
import * as C from './board.const';

// in px unless otherwise noted / obvious
const ZONE_WIDTH = (C.BOARD_WIDTH - C.DIVIDE_WIDTH) / 2 - C.GOAL_WIDTH;

const MARKER_WIDTH =
  (ZONE_WIDTH - (C.ZONE_ELEMENT_COUNT + 1) * C.MARKER_GAP) /
  C.ZONE_ELEMENT_COUNT;
const MARKER_TIP_WIDTH = MARKER_WIDTH / 5;
const MARKER_TIP_START = MARKER_TIP_WIDTH * 2;
const MARKER_TIP_END = MARKER_TIP_WIDTH + MARKER_TIP_START;

// 0 1
// 2 3
const ZONE = [0, 1, 2, 3];
const ZONE_START: XYCoord[] = [
  { x: C.GOAL_WIDTH + C.MARKER_GAP, y: C.BOARD_BORDER_STROKE },
  {
    x: C.DIVIDE_WIDTH / 2 + C.MARKER_GAP + C.BOARD_WIDTH / 2,
    y: C.BOARD_BORDER_STROKE,
  },
  {
    x: C.GOAL_WIDTH + C.MARKER_GAP,
    y: C.BOARD_HEIGHT - C.BOARD_BORDER_STROKE,
  },
  {
    x: C.DIVIDE_WIDTH / 2 + C.MARKER_GAP + C.BOARD_WIDTH / 2,
    y: C.BOARD_HEIGHT - C.BOARD_BORDER_STROKE,
  },
];

// [[x1, y1], ... [xN, yN]]
type ElBounds = [number, number][];
interface ElementBounds {
  [z: number]: {
    [el: number]: ElBounds;
  };
}

// [[[x1, y1], [x2, y2]], [[x1, y1], [x2, y2]]]
type ZoneBounds = [number, number][][];
interface BoardBoundaries extends ElementBounds {
  zoneBounds: ZoneBounds;
}

export const drawGoals = (ctx: CanvasRenderingContext2D) => {
  // draw left goals
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, C.GOAL_WIDTH, C.BOARD_HEIGHT);
  // draw right goals
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 4;
  ctx.strokeRect(C.BOARD_WIDTH - C.GOAL_WIDTH, 0, C.GOAL_WIDTH, C.BOARD_HEIGHT);
};

export const drawZonesAndTriangles = (
  ctx: CanvasRenderingContext2D
): BoardBoundaries => {
  if (!ctx) {
    throw Error('Fn called without canvas ctx');
  }

  const zoneBounds: ZoneBounds = [];
  const zoneElementBounds: ElementBounds = {};

  ZONE.forEach((z) => {
    const { x: zoneStartX, y: zoneStartY } = ZONE_START[z];
    const invert = z >= ZONE.length / 2;
    const markerHeight = zoneStartY + (invert ? -1 : 1) * C.MARKER_HEIGHT;

		// zoneStartY is at the top. Inverted zoneStartY is at the bottom
    if (invert) {
			// swap inverted Y values to non-inverted so it's easier to test bounds
      zoneBounds.push([
        [zoneStartX , zoneStartY - C.ZONE_HEIGHT],
        [zoneStartX + ZONE_WIDTH, zoneStartY],
      ]);
    } else {
      zoneBounds.push([
        [zoneStartX, zoneStartY],
        [zoneStartX + ZONE_WIDTH, zoneStartY + C.ZONE_HEIGHT],
      ]);
    }

    for (let i = 0; i < C.ZONE_ELEMENT_COUNT; i++) {
      ctx.fillStyle = (
        invert ? [C.COLOR_A, C.COLOR_B] : [C.COLOR_B, C.COLOR_A]
      )[i % 2]; // uhh..

      const lineStartX = zoneStartX + i * (MARKER_WIDTH + C.MARKER_GAP);

      if (!zoneElementBounds[z]) {
        zoneElementBounds[z] = {};
      }
			if (invert) {
				zoneElementBounds[z][i] = [
					[lineStartX, markerHeight],
					[lineStartX + MARKER_WIDTH, zoneStartY],
				];
			} else {
				zoneElementBounds[z][i] = [
					[lineStartX, zoneStartY],
					[lineStartX + MARKER_WIDTH, markerHeight],
				];
			}

      ctx.beginPath();
      ctx.moveTo(lineStartX, zoneStartY);
      // leg 1
      ctx.lineTo(lineStartX + MARKER_TIP_START, markerHeight);
      // tip
      ctx.arc(
        lineStartX + MARKER_WIDTH / 2,
        markerHeight,
        MARKER_TIP_WIDTH / 2,
        180,
        0,
        !invert // the other way doesn't work right
      );
      // cap
      ctx.lineTo(lineStartX + MARKER_TIP_END, markerHeight);
      // leg 2
      ctx.lineTo(lineStartX + MARKER_WIDTH, zoneStartY);
      ctx.fill();
    }
  });

  return { zoneBounds, ...zoneElementBounds };
};

const isInBounds = (
  clickCoord: XYCoord,
  testCoords: ElBounds
): boolean => {
  const { x: testX, y: testY } = clickCoord;
  const x1 = testCoords[0][0];
  const x2 = testCoords[1][0];
  const y1 = testCoords[0][1];
  const y2 = testCoords[1][1];

  return testX >= x1 && testX <= x2 && testY >= y1 && testY <= y2;
};
export const zoneClicked = (
  clickCoord: XYCoord,
  testCoords: ZoneBounds
): number | null => {
  for (let i = 0; i < ZONE.length; i++) {
    if (isInBounds(clickCoord, testCoords[i])) {
      return i;
    }
  }
  return null;
};
export const elementClicked = (
  clickCoord: XYCoord,
  testCoords: ElementBounds[number]
): number | null => {
  for (let i = 0; i < C.ZONE_ELEMENT_COUNT; i++) {
    if (isInBounds(clickCoord, testCoords[i])) {
      return i;
    }
  }
  return null;
};
