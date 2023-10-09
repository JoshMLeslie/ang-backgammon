import { ChitColumn } from '../interface/chit';
import { Player, PlayerColor } from '../interface/player';
import { BoardCoord, BoardCoordMove } from '../interface/util';

const movementDownhill = ({ from, to }: BoardCoordMove): boolean => {
  if (from.zone > to.zone) {
    return false;
  } else if (from.zone === to.zone && from.columnn >= to.columnn) {
    return false;
  }
  return true;
};

export const diceRanges = (dice: number[]): number[] => {
  const sums: number[] = [...dice];
  dice.reduce((acc, d) => {
    acc += d;
    sums.push(acc);
    return acc;
  });
  return sums;
};

export const moveWithinDice = (
  { from, to }: BoardCoordMove,
  dice: number[]
): boolean => {
  let dist: number;
  if (from.zone === to.zone) {
    dist = to.columnn - from.columnn;
  } else {
    dist = (to.zone + 1) * to.columnn - (from.zone + 1) * from.columnn;
  }
  return diceRanges(dice).some((d) => d <= dist) || false;
};

export const isValidMove = (
  chits: ChitColumn,
  activePlayer: PlayerColor,
  coords: BoardCoordMove,
  dice: number[]
) => {
  if (!movementDownhill(coords)) {
    return false;
  }
  if (!moveWithinDice(coords, dice)) {
    return false;
  }
  if (chits.count === 1 && chits.color !== activePlayer) {
    return 'bounce';
  }
  if (chits.count === 0 || chits.color === activePlayer) {
    return true;
  }
  return false;
};
