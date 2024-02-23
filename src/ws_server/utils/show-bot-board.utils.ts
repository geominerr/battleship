import { ICell } from '../models/gameboard.model';

export const showBoard = (board: ICell[][]): void => {
  const arrState: string[][] = board.map((arr) =>
    arr.map((cell) => cell.state),
  );
  const size = arrState.length;
  const rotatedArr: string[][] = Array.from({ length: size }, () =>
    Array(size).fill(''),
  );

  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      const cellState = arrState?.[j]?.[i];
      if (cellState) {
        const sub = rotatedArr[i];
        if (sub) {
          sub[j] = cellState;
        }
      }
    }
  }

  console.log('BOARD BOT');
  console.table(rotatedArr);
};
