import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, map, merge, scan, startWith } from 'rxjs';
import { Player } from '../interface/player';

interface InitTrigger<T extends string = ''> {
  action: 'init' | T;
  val: string;
}

@Injectable({
  providedIn: 'root',
})
export class TurnService {
  private readonly nextPlayer$ = new Subject<void>();
  private readonly initPlayer$ = new Subject<Player['color']>();
  readonly activePlayer$ = merge(this.nextPlayer$, this.initPlayer$).pipe(
    startWith('white'),
    scan((acc, init) => {
      if (init) {
        return init;
      }
      return acc === 'white' ? 'black' : 'white';
    }, 'white') // TODO reset to '' and add start sequence
  );

  private readonly _roll$ = new Subject<void>();
  readonly dice$ = this._roll$.pipe(
    map(() => [
      Math.round(Math.random() * 5) + 1,
      Math.round(Math.random() * 5) + 1,
    ])
  );

  init(player: Player) {
    this.initPlayer$.next(player.color);
  }

  next() {
    this.nextPlayer$.next();
  }
}
