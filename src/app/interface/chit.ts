import { Player } from "./player";

export interface ChitColumn {
  count: number;
  player: Player;
}

export interface ChitZone {
  [c: number]: ChitColumn;
}
