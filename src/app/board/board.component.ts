import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

// in px unless otherwise noted / obvious
const BOARD_HEIGHT = 400;
const BOARD_WIDTH = 800;

const DIVIDE_WIDTH = 40;

const GOAL_WIDTH = 60;
const MARKER_GAP = 8;

const ZONE_WIDTH = (BOARD_WIDTH - DIVIDE_WIDTH) / 2 - GOAL_WIDTH;
const ZONE_ELEMENT_COUNT = 6;

const MARKER_HEIGHT = 160;
const MARKER_WIDTH =
  (ZONE_WIDTH - (ZONE_ELEMENT_COUNT + 1) * MARKER_GAP) / ZONE_ELEMENT_COUNT;
const MARKER_TIP_WIDTH = MARKER_WIDTH / 5;
// relative
const MARKER_TIP_START = MARKER_TIP_WIDTH * 2;
const MARKER_TIP_END = MARKER_TIP_WIDTH + MARKER_TIP_START;

// 1 2
// 3 4
const ZONE = [1,2,3, 4];
const ZONE_START: { [z: number]: { x: number; y: number } } = {
  1: { x: GOAL_WIDTH + MARKER_GAP, y: 4 },
  2: { x: DIVIDE_WIDTH / 2 + MARKER_GAP + BOARD_WIDTH / 2, y: 4 },
  3: { x: GOAL_WIDTH + MARKER_GAP, y: BOARD_HEIGHT - 4 },
  4: {
    x: DIVIDE_WIDTH / 2 + MARKER_GAP + BOARD_WIDTH / 2,
    y: BOARD_HEIGHT - 4,
  },
};
const drawTriangle = (ctx: CanvasRenderingContext2D): void => {
  if (!ctx) {
    throw Error('Fn called without canvas ctx');
  }
  ZONE.forEach((z) => {
    const { x: zoneStartX, y: zoneStartY } = ZONE_START[z];
    const invert = z > 2;
    const markerHeight = zoneStartY + (invert ? -1 : 1) * MARKER_HEIGHT;

    for (let i = 0; i < ZONE_ELEMENT_COUNT; i++) {
      const lineStartX = zoneStartX + i * (MARKER_WIDTH + MARKER_GAP);

      ctx.fillStyle = i % 2 ? 'black' : 'lightgray';

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
        !invert
      );
      // tip
      ctx.lineTo(lineStartX + MARKER_TIP_END, markerHeight);
      // leg 2
      ctx.lineTo(lineStartX + MARKER_WIDTH, zoneStartY);
      ctx.fill();
    }
  });
};

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements AfterViewInit {
  @ViewChild('board', { static: true })
  set board(el: ElementRef<HTMLCanvasElement>) {
    this._board = el?.nativeElement;
  }
  get board(): HTMLCanvasElement {
    return this._board;
  }
  private _board!: HTMLCanvasElement;

  ngAfterViewInit() {
    const ctx = this.board?.getContext('2d', {
      alpha: false,
      willReadFrequently: false,
    });

    if (!ctx) {
      console.error("Couldn't grab canvas context");
      return;
    }

    this.board.height = BOARD_HEIGHT;
    this.board.width = BOARD_WIDTH;

    // !!! layer orders matter !!!
    // draw board bg
    ctx.fillStyle = 'rgb(210, 180, 140)'; // tan
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    // draw center divide
    ctx.fillStyle = 'gray';
    ctx.fillRect(
      BOARD_WIDTH / 2 - DIVIDE_WIDTH / 2,
      0,
      DIVIDE_WIDTH,
      BOARD_HEIGHT
    );
    ctx.fillStyle = 'black';
    ctx.fillRect(BOARD_WIDTH / 2 - 2, 0, 4, BOARD_HEIGHT);
    // draw left goals
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, GOAL_WIDTH, BOARD_HEIGHT);
    // draw right goals
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeRect(BOARD_WIDTH - GOAL_WIDTH, 0, GOAL_WIDTH, BOARD_HEIGHT);

    // draw board edge
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, BOARD_WIDTH - 4, BOARD_HEIGHT - 4);

    drawTriangle(ctx);
  }
}
