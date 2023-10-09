import { ChitZone } from '../interface/chit';
import { PlayerColor } from '../interface/player';

export const CHIT_MAP_DEFAULT: ChitZone[] = [
  {
    0: { count: 5, color: PlayerColor.WHITE },
    1: { count: 0, color: PlayerColor.NULL },
    2: { count: 0, color: PlayerColor.NULL },
    3: { count: 0, color: PlayerColor.NULL },
    4: { count: 3, color: PlayerColor.BLACK },
    5: { count: 0, color: PlayerColor.NULL },
  },
  {
    0: { count: 5, color: PlayerColor.BLACK },
    1: { count: 0, color: PlayerColor.NULL },
    2: { count: 0, color: PlayerColor.NULL },
    3: { count: 0, color: PlayerColor.NULL },
    4: { count: 0, color: PlayerColor.NULL },
    5: { count: 2, color: PlayerColor.WHITE },
  },
  {
    0: { count: 5, color: PlayerColor.BLACK },
    1: { count: 0, color: PlayerColor.NULL },
    2: { count: 0, color: PlayerColor.NULL },
    3: { count: 0, color: PlayerColor.NULL },
    4: { count: 3, color: PlayerColor.WHITE },
    5: { count: 0, color: PlayerColor.NULL },
  },
  {
    0: { count: 5, color: PlayerColor.WHITE },
    1: { count: 0, color: PlayerColor.NULL },
    2: { count: 0, color: PlayerColor.NULL },
    3: { count: 0, color: PlayerColor.NULL },
    4: { count: 0, color: PlayerColor.NULL },
    5: { count: 2, color: PlayerColor.BLACK },
  },
];
