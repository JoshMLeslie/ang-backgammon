import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { ChitsComponent } from './chits/chits.component';
import { TurnService } from './service/turn.service';
import { MovementService } from './service/movement.service';

@NgModule({
  declarations: [AppComponent, BoardComponent, ChitsComponent],
  imports: [BrowserModule],
  providers: [TurnService, MovementService],
  bootstrap: [AppComponent],
})
export class AppModule {}
