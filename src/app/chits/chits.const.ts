// based on zones 0-3
interface ChitColumn {
  count: number;
  player: '' | 'white' | 'black';
}

interface ChitZone {
  [c: number]: ChitColumn;
}

export const CHIT_MAP_DEFAULT: ChitZone[] = [
  {
    0: { count: 5, player: 'white' },
    1: { count: 0, player: '' },
    2: { count: 0, player: '' },
    3: { count: 0, player: '' },
    4: { count: 3, player: 'black' },
    5: { count: 0, player: '' },
  },
  {
    0: { count: 5, player: 'black' },
    1: { count: 0, player: '' },
    2: { count: 0, player: '' },
    3: { count: 0, player: '' },
    4: { count: 0, player: '' },
    5: { count: 2, player: 'white' },
  },
  {
    0: { count: 5, player: 'black' },
    1: { count: 0, player: '' },
    2: { count: 0, player: '' },
    3: { count: 0, player: '' },
    4: { count: 3, player: 'white' },
    5: { count: 0, player: '' },
  },
  {
    0: { count: 5, player: 'white' },
    1: { count: 0, player: '' },
    2: { count: 0, player: '' },
    3: { count: 0, player: '' },
    4: { count: 0, player: '' },
    5: { count: 2, player: 'black' },
  },
];
