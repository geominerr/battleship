import { IShip, PressetTuple } from '../models/gameboard.model';

export const generateShips = (): IShip[] => {
  try {
    const length: number = pressets.length;
    const index: number = Math.floor(Math.random() * length);

    return (
      pressets[index]?.map(
        (data: PressetTuple): IShip => ({
          position: { x: data[0], y: data[1] },
          direction: data[2],
          length: data[3],
          type: data[4],
        }),
      ) || []
    );
  } catch (err) {
    throw err;
  }
};

const pressets: PressetTuple[][] = [
  [
    [3, 1, false, 4, 'huge'],
    [3, 6, false, 3, 'large'],
    [3, 4, false, 3, 'large'],
    [3, 8, true, 2, 'medium'],
    [7, 5, true, 2, 'medium'],
    [0, 0, false, 2, 'medium'],
    [0, 8, false, 1, 'small'],
    [7, 3, true, 1, 'small'],
    [0, 4, true, 1, 'small'],
    [9, 4, false, 1, 'small'],
  ],
  [
    [4, 2, false, 4, 'huge'],
    [3, 4, true, 3, 'large'],
    [1, 8, false, 3, 'large'],
    [2, 0, true, 2, 'medium'],
    [0, 4, false, 2, 'medium'],
    [7, 5, false, 2, 'medium'],
    [9, 3, false, 1, 'small'],
    [6, 0, true, 1, 'small'],
    [0, 0, true, 1, 'small'],
    [7, 7, true, 1, 'small'],
  ],
  [
    [4, 4, false, 4, 'huge'],
    [4, 2, false, 3, 'large'],
    [1, 6, false, 3, 'large'],
    [4, 8, true, 2, 'medium'],
    [8, 0, true, 2, 'medium'],
    [0, 8, false, 2, 'medium'],
    [2, 0, false, 1, 'small'],
    [8, 8, false, 1, 'small'],
    [4, 0, true, 1, 'small'],
    [8, 6, true, 1, 'small'],
  ],
  [
    [2, 8, false, 4, 'huge'],
    [7, 7, false, 3, 'large'],
    [0, 3, true, 3, 'large'],
    [5, 0, true, 2, 'medium'],
    [6, 3, true, 2, 'medium'],
    [2, 3, false, 2, 'medium'],
    [8, 3, false, 1, 'small'],
    [5, 6, true, 1, 'small'],
    [7, 0, true, 1, 'small'],
    [2, 6, false, 1, 'small'],
  ],
  [
    [3, 4, false, 4, 'huge'],
    [5, 6, false, 3, 'large'],
    [6, 0, true, 3, 'large'],
    [7, 8, true, 2, 'medium'],
    [5, 8, true, 2, 'medium'],
    [0, 1, false, 2, 'medium'],
    [0, 5, false, 1, 'small'],
    [9, 5, false, 1, 'small'],
    [2, 7, true, 1, 'small'],
    [0, 8, false, 1, 'small'],
  ],
  [
    [5, 4, true, 4, 'huge'],
    [6, 1, false, 3, 'large'],
    [8, 6, true, 3, 'large'],
    [1, 8, false, 2, 'medium'],
    [3, 3, true, 2, 'medium'],
    [0, 5, false, 2, 'medium'],
    [6, 9, true, 1, 'small'],
    [0, 0, true, 1, 'small'],
    [0, 2, true, 1, 'small'],
    [3, 1, false, 1, 'small'],
  ],
  [
    [5, 3, false, 4, 'huge'],
    [0, 3, false, 3, 'large'],
    [2, 1, false, 3, 'large'],
    [5, 7, true, 2, 'medium'],
    [6, 1, false, 2, 'medium'],
    [2, 5, false, 2, 'medium'],
    [0, 1, false, 1, 'small'],
    [7, 7, true, 1, 'small'],
    [0, 5, false, 1, 'small'],
    [9, 1, false, 1, 'small'],
  ],
  [
    [3, 5, true, 4, 'huge'],
    [2, 0, true, 3, 'large'],
    [5, 4, false, 3, 'large'],
    [6, 0, true, 2, 'medium'],
    [6, 7, true, 2, 'medium'],
    [4, 0, true, 2, 'medium'],
    [9, 4, true, 1, 'small'],
    [9, 1, true, 1, 'small'],
    [0, 2, false, 1, 'small'],
    [9, 8, true, 1, 'small'],
  ],
  [
    [3, 4, true, 4, 'huge'],
    [8, 5, true, 3, 'large'],
    [1, 9, false, 3, 'large'],
    [3, 0, true, 2, 'medium'],
    [7, 0, true, 2, 'medium'],
    [9, 1, true, 2, 'medium'],
    [5, 4, true, 1, 'small'],
    [0, 4, false, 1, 'small'],
    [5, 8, false, 1, 'small'],
    [6, 6, true, 1, 'small'],
  ],
  [
    [6, 3, true, 4, 'huge'],
    [1, 6, false, 3, 'large'],
    [8, 2, true, 3, 'large'],
    [8, 7, true, 2, 'medium'],
    [3, 0, false, 2, 'medium'],
    [1, 2, false, 2, 'medium'],
    [1, 0, true, 1, 'small'],
    [2, 4, true, 1, 'small'],
    [3, 8, true, 1, 'small'],
    [0, 4, false, 1, 'small'],
  ],
];
