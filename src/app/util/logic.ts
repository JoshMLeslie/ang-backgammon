import { ChitColumn } from '../interface/chit';
import { Player } from '../interface/player';
import { BoardCoord } from '../interface/util';

export const isValidMove = (
  coords: BoardCoord[],
  chits: ChitColumn,
  activePlayer: Player['color']
) => {
	console.log(coords, chits, activePlayer);
	
  return false;
};
