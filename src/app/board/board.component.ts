import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  DIVIDE_WIDTH
} from './board.const';
import {
  drawGoals,
  drawZonesAndTriangles,
  elementClicked as isElementClicked,
  zoneClicked,
} from './board.helper';

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

    drawGoals(ctx);

    const zonesAndTrianglesBounds = drawZonesAndTriangles(ctx);
    this.board.addEventListener('click', ({ offsetX, offsetY }) => {
      const inZone = zoneClicked(
        { x: offsetX, y: offsetY },
        zonesAndTrianglesBounds.zoneBounds
      );
      if (inZone !== null) {
        const elementClicked = isElementClicked(
          { x: offsetX, y: offsetY },
          zonesAndTrianglesBounds[inZone]
        );
        if (elementClicked !== null) {
          console.log("zone", inZone, "el", elementClicked)
        }
      }
    });

    // draw board edge
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, BOARD_WIDTH - 4, BOARD_HEIGHT - 4);
  }
}
