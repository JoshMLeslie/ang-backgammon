import { Injectable } from '@angular/core';
import { Subject, map, merge, scan, startWith } from 'rxjs';
import { Player } from '../interface/player';

enum Tasks {
  "roll",
  "move"
}

@Injectable({
  providedIn: 'root',
})
export class TurnService {
  private readonly nextPlayer$ = new Subject<void>();
  private readonly initPlayer$ = new Subject<Player['color']>();
  readonly activePlayer$ = merge(this.nextPlayer$, this.initPlayer$).pipe(
    startWith('white'),  // TODO reset to '' and add start sequence
    scan((acc, init) => {
      if (init) {
        return init;
      }
      return acc === 'white' ? 'black' : 'white';
    }, '')
  );

  private readonly _roll$ = new Subject<void>();
  readonly dice$ = this._roll$.pipe(
    map(() => [
      Math.round(Math.random() * 5) + 1,
      Math.round(Math.random() * 5) + 1,
    ])
  );

  readonly tasks$ = new Subject().pipe(startWith(Tasks));

  init(player: Player) {
    this.initPlayer$.next(player.color);
  }

  next() {
    this.nextPlayer$.next();
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
