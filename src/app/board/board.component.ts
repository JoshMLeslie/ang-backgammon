import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, tap } from 'rxjs';
import { BoardBoundaries } from '../interface/board';
import { MovementService } from '../service/movement.service';
import { BOARD_BORDER_STROKE, BOARD_HEIGHT, BOARD_WIDTH, DIVIDE_WIDTH } from './board.const';
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

  zones?: BoardBoundaries;

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
    ctx.fillRect(BOARD_WIDTH / 2 - 2, 0, BOARD_BORDER_STROKE, BOARD_HEIGHT);

    drawGoals(ctx);

    this.subscribeZones(ctx);

    // draw board edge
    ctx.strokeStyle = 'black';
    ctx.lineWidth = BOARD_BORDER_STROKE;
    ctx.strokeRect(2, 2, BOARD_WIDTH - BOARD_BORDER_STROKE, BOARD_HEIGHT - BOARD_BORDER_STROKE);
  }

  private subscribeZones(ctx: CanvasRenderingContext2D) {
    this.zones = drawZonesAndTriangles(ctx);
    // handle user clicking starting zone and ending zone for a turn
    fromEvent<MouseEvent>(this.board, 'click').pipe(
      tap(({ offsetX, offsetY }) => {
        const zone = zoneClicked(
          { x: offsetX, y: offsetY },
          this.zones!.zoneBounds
        );
        if (zone === null) {
          return;
        }
        const element = elementClicked(
          { x: offsetX, y: offsetY },
          this.zones![zone]
        );
        if (element === null) {
          return;
        }
        // push board-valid movement to movement tracking srv
        this.movement.track({ columnn: element, zone });
      })
    ).subscribe();

  }
}
