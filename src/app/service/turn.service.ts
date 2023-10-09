import { Injectable } from '@angular/core';
import { Subject, combineLatest, map, merge, scan, startWith } from 'rxjs';
import { Player, PlayerColor } from '../interface/player';

enum Tasks {
  'roll',
  'move',
}

@Injectable({
  providedIn: 'root',
})
export class TurnService {
  private readonly initPlayer$ = new Subject<PlayerColor>();
  private readonly nextPlayerTrigger$ = new Subject<void>();
  readonly activePlayer$ = merge(
    this.nextPlayerTrigger$,
    this.initPlayer$
  ).pipe(
    scan((acc: PlayerColor, init: void | PlayerColor) => {
      if (init) {
        return init;
      }
      return acc === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE;
    }, PlayerColor.NULL)
  );

  private readonly _roll$ = new Subject<void>();
  readonly dice$ = this._roll$.pipe(
    map(() => {
      const d = [
        Math.round(Math.random() * 5) + 1,
        Math.round(Math.random() * 5) + 1,
      ];
      // handle doubling dice on matching rolls
      return d[0] === d[1] ? d.concat(d) : d;
    })
  );

  readonly tasks$ = new Subject().pipe(startWith(Tasks));

  init(player: Player) {
    this.initPlayer$.next(player.color);
  }

  next() {
    this.nextPlayerTrigger$.next();
  }

  roll() {
    this._roll$.next();
  }

  move(dist: number) {
    // todo
  }

  doTask(task: Tasks) {
    // todo
  }
}
