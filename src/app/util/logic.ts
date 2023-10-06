import { ChitColumn } from '../interface/chit';
import { Player } from '../interface/player';
import { BoardCoord } from '../interface/util';

export const isValidMove = (
  chits: ChitColumn,
  activePlayer: Player['color']
) => {
	if (chits.count === 1 && chits.player.color !== activePlayer) {
		return "bounce";
	}
	if (chits.count === 0 || chits.player.color === activePlayer) {
		return true;
	}
  return false;
};
