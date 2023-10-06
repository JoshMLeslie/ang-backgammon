import { Component, Input, OnInit } from '@angular/core';
import { CHIT_MAP_DEFAULT } from './chits.const';
import { MovementService } from '../service/movement.service';
import { isValidMove } from '../util/logic';
import { ChitColumn } from '../interface/chit';
import { BoardCoord } from '../interface/util';
import { TurnService } from '../service/turn.service';
import { combineLatest, map, merge, mergeMap, of, zip } from 'rxjs';
import { Player } from '../interface/player';

@Component({
  selector: 'app-chits',
  templateUrl: './chits.component.html',
  styleUrls: ['./chits.component.scss'],
})
export class ChitsComponent implements OnInit {
  @Input() ctx?: CanvasRenderingContext2D;
  chits = CHIT_MAP_DEFAULT;

  getChitCol(coord: BoardCoord): ChitColumn {
    return this.chits[coord.zone][coord.element];
  }

  constructor(private turn: TurnService, private movement: MovementService) {
    combineLatest([
      this.movement.tracker$,
      this.turn.activePlayer$,
      this.turn.dice$,
    ])
      .pipe(map(([coords, active, dice]) => ({ active, coords, dice })))
      .subscribe(({ active, coords, dice }) => {
        if (!coords.init || !active) {
          return;
        }
        // TODO / logic for a player being able to click on an origin lives elsewhere
        const validMove = isValidMove(
          this.getChitCol(coords.to),
          active as Player['color'],
          coords,
          dice
        );
        if (validMove) {
          console.log('valid move');
        }
      });
  }

  chitClick(e: any, i: string) {
    console.log('foo', e, i);
  }

  ngOnInit() {
    if (!this.ctx) {
      throw Error('canvas ctx not present in chits');
    }
  }
}
