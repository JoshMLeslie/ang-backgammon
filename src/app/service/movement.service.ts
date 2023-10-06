import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, pairwise } from 'rxjs';
import { BoardCoord } from '../interface/util';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  readonly tracker$ = new BehaviorSubject<BoardCoord[]>([]);
  private _tracker$ = new Subject<null | BoardCoord>();

  constructor() {
    this._tracker$
    .pipe(pairwise())
    .subscribe((coords) => {
      if (coords[0] && coords[1]) {
        console.log("trying to move from / to", coords);
        this._tracker$.next(null);
        this.tracker$.next(coords as BoardCoord[]);
      }
    })
  }

  track(coord: BoardCoord): void {
    this._tracker$.next(coord);
  }
}
