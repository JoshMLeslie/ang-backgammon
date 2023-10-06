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
  private readonly next$ = new Subject<void>();
  private readonly init$ = new Subject<Player['color']>();
  readonly active$ = merge(this.next$, this.init$).pipe(
    startWith('white'),
    scan((acc, init) => {
      if (init) {
        return init;
      }
      return acc === 'white' ? 'black' : 'white';
    }, 'white') // TODO reset to '' and add start sequence
  );

  init(player: Player) {
    this.init$.next(player.color);
  }

  next() {
    this.next$.next();
  }
}
