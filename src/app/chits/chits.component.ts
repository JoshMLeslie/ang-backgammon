import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { BoardBoundaries } from '../interface/board';
import { ChitColumn, ChitZone } from '../interface/chit';
import { PlayerColor } from '../interface/player';
import { BoardCoord, BoardCoordMove } from '../interface/util';
import { MovementService } from '../service/movement.service';
import { TurnService } from '../service/turn.service';
import { isValidMove } from '../util/logic';
import { CHIT_MAP_DEFAULT } from './chits.const';
import { BOARD_BORDER_STROKE } from '../board/board.const';

@Component({
  selector: 'app-chits',
  templateUrl: './chits.component.html',
  styleUrls: ['./chits.component.scss'],
})
export class ChitsComponent implements OnInit {
  @Input() zones?: BoardBoundaries;
  @Output() activeMarkers = new EventEmitter<ChitZone[]>();
  chits = CHIT_MAP_DEFAULT;

  getCol(coord: BoardCoord): ChitColumn {
    return this.chits[coord.zone][coord.columnn];
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
          this.getCol(coords.to),
          active,
          coords,
          dice
        );
        if (validMove) {
          console.log('valid move. updating...');
          this.updateChits(coords, active, validMove);
        }
      });
  }

  updateChits(
    { from, to }: BoardCoordMove,
    active: PlayerColor,
    validMove: ReturnType<typeof isValidMove>
  ) {
    const newChits = [...this.chits];
    const newStart = newChits[from.zone][from.columnn];
    const newEnd = newChits[to.zone][to.columnn];

    newStart.count--;
    if (newStart.count === 0) {
      newStart.color = PlayerColor.NULL;
    }

    if (validMove === 'bounce') {
      newEnd.count = 1;
      newEnd.color = active;
      // TODO handle bounced player's chit
      console.log("handle bounced player's chit");
    } else {
      // move player's chit to empty or controlled column

      newEnd.count++;
      if (newEnd.count === 1) {
        newEnd.color = active;
      }
    }

    console.log(this.chits, newChits);
    this.activeMarkers.emit(newChits);
  }

  ngOnInit(): void {
    console.log(this.zones);
  }

  locateZone(z: number): {
    [dir: string]: string;
  } {
    if (!this.zones) {
      console.log("no zones!")
      return {
        top: '0',
        left: '0',
      };
    }

    if (z < 2) {
      const [[left, top], _] = this.zones.zoneBounds[z];
      return {
        left: `${left}px`,
        top: `${top}px`,
      };
    } else {
      const [[left, top], _] = this.zones.zoneBounds[z];
      return {
        transform: 'scaleY(-1)',
        left: `${left}px`,
        top: `${top}px`,
      };
    }
  }

  locateCol({ c, z }: { c: number; z: number }): {
    top: string;
    left: string;
  } {
    if (!this.zones) {
      return {
        top: '0',
        left: '0',
      };
    }

    // coords are absolute to the board,
    // need to be adjusted per zone
    // and for borders 
    const [[zoneLeft, zoneTop], _] = this.zones.zoneBounds[z]; 
    const [[left, top], __] = this.zones[z][c];
    return {
      left: `${left - zoneLeft - BOARD_BORDER_STROKE}px`,
      top: `${top - zoneTop - BOARD_BORDER_STROKE}px`,
    };
  }

  chitClick({
    c,
    color,
    i,
    z,
  }: {
    c: number;
    color: string;
    i: number;
    z: number;
  }) {
    console.log('foo', color, z, c, i);
  }
}
