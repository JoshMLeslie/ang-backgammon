import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, pairwise } from 'rxjs';
import { BoardCoord, BoardCoordMove } from '../interface/util';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  readonly tracker$ = new BehaviorSubject<BoardCoordMove>({
    init: false,
    from: { element: 0, zone: 0 },
    to: { element: 0, zone: 0 },
  });
  private _tracker$ = new Subject<null | BoardCoord>();

  constructor() {
    this._tracker$.pipe(pairwise()).subscribe((coords) => {
      if (coords[0] && coords[1]) {
        console.log('trying to move from / to', coords);
        this._tracker$.next(null);
        this.tracker$.next({ init: true, from: coords[0], to: coords[1] });
      }
    });
  }

  track(coord: BoardCoord): void {
    this._tracker$.next(coord);
  }
}
