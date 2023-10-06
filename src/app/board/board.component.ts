import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, tap } from 'rxjs';
import { MovementService } from '../service/movement.service';
import { BOARD_HEIGHT, BOARD_WIDTH, DIVIDE_WIDTH } from './board.const';
import {
  drawGoals,
  drawZonesAndTriangles,
  elementClicked,
  zoneClicked,
} from './board.helper';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @ViewChild('board', { static: true })
  set board(el: ElementRef<HTMLCanvasElement>) {
    this._board = el?.nativeElement;
  }
  get board(): HTMLCanvasElement {
    return this._board;
  }
  private _board!: HTMLCanvasElement;

  ctx?: CanvasRenderingContext2D;

  constructor(private movement: MovementService) {}

  ngOnInit() {
    const ctx = this.board?.getContext('2d', {
      alpha: false,
      willReadFrequently: false,
    });

    if (!ctx) {
      console.error("Couldn't grab canvas context");
      return;
    }

    this.ctx = ctx;

    this.board.height = BOARD_HEIGHT;
    this.board.width = BOARD_WIDTH;

    // !!! layer orders matter !!!
    // draw board bg
    ctx.fillStyle = 'rgb(210, 180, 140)'; // tan
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    // draw center divide
    ctx.fillStyle = 'darkgray';
    ctx.fillRect(
      BOARD_WIDTH / 2 - DIVIDE_WIDTH / 2,
      0,
      DIVIDE_WIDTH,
      BOARD_HEIGHT
    );
    ctx.fillStyle = 'black';
    ctx.fillRect(BOARD_WIDTH / 2 - 2, 0, 4, BOARD_HEIGHT);

    drawGoals(ctx);

    this.subscribeZones(ctx);

    // draw board edge
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, BOARD_WIDTH - 4, BOARD_HEIGHT - 4);
  }

  private subscribeZones(ctx: CanvasRenderingContext2D) {
    const zonesAndTrianglesBounds = drawZonesAndTriangles(ctx);
    fromEvent<MouseEvent>(this.board, 'click').pipe(
      tap(({ offsetX, offsetY }) => {
        const zone = zoneClicked(
          { x: offsetX, y: offsetY },
          zonesAndTrianglesBounds.zoneBounds
        );
        if (zone === null) {
          return;
        }
        const element = elementClicked(
          { x: offsetX, y: offsetY },
          zonesAndTrianglesBounds[zone]
        );
        if (element === null) {
          return;
        }
        this.movement.track({ element, zone });
      })
    ).subscribe();

  }
}
