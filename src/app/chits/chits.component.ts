import { Component, Input, OnInit } from '@angular/core';
import { CHIT_MAP_DEFAULT } from './chits.const';

@Component({
  selector: 'app-chits',
  templateUrl: './chits.component.html',
  styleUrls: ['./chits.component.scss']
})
export class ChitsComponent implements OnInit {
  @Input() ctx? : CanvasRenderingContext2D;
  chits = CHIT_MAP_DEFAULT;

  chitClick(e: any, i: string) {
    console.log("foo", e, i)
  }

  ngOnInit() {
    if (!this.ctx) {
      throw Error("canvas ctx not present in chits");
    }


  }
}
