import { ChitColumn } from '../interface/chit';
import { Player } from '../interface/player';
import { BoardCoord, BoardCoordMove } from '../interface/util';

const movementDownhill = ({ from, to }: BoardCoordMove): boolean => {
  if (from.zone > to.zone) {
    return false;
  } else if (from.zone === to.zone && from.element >= to.element) {
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

export const moveInDice = (
  { from, to }: BoardCoordMove,
  dice: number[]
): boolean => {
  let dist: number;
  if (from.zone === to.zone) {
    dist = to.element - from.element;
  } else {
    dist = (to.zone + 1) * to.element - (from.zone + 1) * from.element;
  }
  return diceRanges(dice).some((d) => d <= dist) || false;
};

export const isValidMove = (
  chits: ChitColumn,
  activePlayer: Player['color'],
  coords: BoardCoordMove,
  dice: number[]
) => {
  if (!movementDownhill(coords)) {
    return false;
  }
  if (!moveInDice(coords, dice)) {
    return false;
  }
  if (chits.count === 1 && chits.player.color !== activePlayer) {
    return 'bounce';
  }
  if (chits.count === 0 || chits.player.color === activePlayer) {
    return true;
  }
  return false;
};
