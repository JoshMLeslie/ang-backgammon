import { PlayerColor } from "./player";

export interface ChitColumn {
  count: number;
  color: PlayerColor;
}

export interface ChitZone {
  [c: number]: ChitColumn;
}
