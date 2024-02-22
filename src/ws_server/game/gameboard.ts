import { Ship } from './ship';
import {
  ICell,
  IGameRes,
  IShip,
  IShot,
  ICellAround,
} from '../models/gameboard.model';

export class GameBoard {
  boards: Map<number, ICell[][]>;
  ships: Map<number, IShip[]>;
  ids: number[];
  boardSize: number = 10;
  currentPlayerID: number = 0;

  constructor(ids: number[]) {
    this.boards = new Map();
    this.ships = new Map();
    this.ids = ids;
  }

  getPlayers(): number[] {
    return this.ids;
  }

  public addShips(
    idPlayer: number,
    ships: IShip[],
  ): [number, IShip[]][] | null {
    this.createBoard(idPlayer, ships);
    this.ships.set(idPlayer, ships);

    if (this.boards.size === 2) {
      this.currentPlayerID = idPlayer;
      return Array.from(this.ships.entries());
    }

    return null;
  }

  public attack(idPlayer: number, shot: IShot): IGameRes {
    const enemyId = this.getEnemyId(idPlayer);
    const { x, y } = shot;
    const response: IGameRes = {
      nextPlayerID: 0,
      status: 'miss',
      error: false,
      errorMessage: '',
    };

    if (this.currentPlayerID !== idPlayer) {
      return {
        ...response,
        error: true,
        errorMessage: '"It\'s another player\'s turn"',
      };
    }

    if (typeof enemyId === 'number') {
      const board = this.boards.get(enemyId);

      if (board) {
        const cell = board?.[x]?.[y];

        if (cell) {
          const { state } = cell;

          switch (state) {
            case 'miss':
              cell.state = 'miss';
              this.currentPlayerID = enemyId;

              return {
                ...response,
                nextPlayerID: enemyId,
                status: 'miss',
              };
            case 'shot':
              cell.state = 'shot';
              this.currentPlayerID = enemyId;

              return {
                ...response,
                nextPlayerID: enemyId,
                status: 'shot',
              };

            case 'empty':
              cell.state = 'miss';
              this.currentPlayerID = enemyId;

              return {
                ...response,
                nextPlayerID: enemyId,
              };
            case 'ship':
              cell.state = 'shot';
              this.currentPlayerID = idPlayer;

              const destroeydShipID = cell.instance?.makeDamage();
              const ships = this.ships.get(enemyId);

              if (destroeydShipID || destroeydShipID === 0) {
                if (ships) {
                  const ship = ships[destroeydShipID];

                  if (ship) {
                    ship.length = 0;
                  }

                  if (ships.every(({ length }) => !length)) {
                    return {
                      ...response,
                      nextPlayerID: idPlayer,
                      status: 'killed',
                      winner: { id: idPlayer },
                    };
                  }
                }

                const cellsAround = this.getSurroundingCoordinates(
                  destroeydShipID,
                  board,
                );

                return {
                  ...response,
                  nextPlayerID: idPlayer,
                  status: 'killed',
                  cellsAround,
                };
              }

              return { ...response, nextPlayerID: idPlayer, status: 'shot' };
            default:
              return {
                ...response,
                error: true,
                errorMessage:
                  '"Apparently I didn\'t take into account some case"',
              };
          }
        }
      }
    }

    return {
      ...response,
      error: true,
      errorMessage: '"Unknown error :-)))"',
    };
  }

  public generateRandomAttack(idPlayer: number): IShot {
    const { boardSize } = this;
    const enemyId = this.getEnemyId(idPlayer);
    let shot: IShot = { x: 0, y: 1 };

    if (typeof enemyId === 'number') {
      const board = this.boards.get(enemyId);

      if (board) {
        while (!shot.x) {
          const x = Math.floor(Math.random() * boardSize);
          const y = Math.floor(Math.random() * boardSize);

          if (
            board[x]?.[y]?.state !== 'miss' &&
            board[x]?.[y]?.state !== 'shot'
          ) {
            shot = { x, y };
          }
        }
      }
    }

    return shot;
  }

  private createBoard(idPlayer: number, ships: IShip[]): void {
    const field: ICell[][] = Array(this.boardSize)
      .fill(0)
      .map(() => Array(this.boardSize).fill({ state: 'empty' }));

    ships.forEach((ship, index) => {
      const { x, y } = ship.position;
      const { length, direction } = ship;
      const instance = new Ship(length, index);

      for (let i = 0; i < length; i += 1) {
        const coordinateX = direction ? x : x + i;
        const coordinateY = direction ? y + i : y;

        if (field[coordinateY]) {
          const subArr = field[coordinateX];

          if (subArr) {
            subArr[coordinateY] = {
              state: 'ship',
              shipId: index,
              instance: instance,
            };
          }
        }
      }
    });

    this.boards.set(idPlayer, field);
  }

  private getSurroundingCoordinates(
    shipId: number,
    board: ICell[][],
  ): ICellAround[] {
    const { boardSize } = this;

    const unshotCoordinates: ICellAround[] = [];

    for (let i = 0; i < boardSize; i += 1) {
      for (let j = 0; j < boardSize; j += 1) {
        const cell = board?.[i]?.[j];

        if (cell && cell.shipId === shipId) {
          for (let x = i - 1; x <= i + 1; x += 1) {
            for (let y = j - 1; y <= j + 1; y += 1) {
              if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
                if (
                  board[x]?.[y]?.state !== 'miss' &&
                  board[x]?.[y]?.state !== 'shot'
                ) {
                  unshotCoordinates.push({
                    status: 'miss',
                    position: { x, y },
                  });
                }
              }
            }
          }
        }
      }
    }
    // debugger;
    // console.log('BEFORE UPDATE');
    // console.table(board.map((arr) => arr.map((cell) => cell.state)));
    // console.table(board.map((arr) => arr.map((cell) => cell.shipId || 0)));

    // console.log(' COORDINATES', unshotCoordinates);
    // console.log(' COORDINATES UNIC', [...new Set(unshotCoordinates)]);
    // const ids: number[] = [];

    // unshotCoordinates.forEach(({ position }, index) => {
    //   console.log('POSITION', position, 'ID', index, '\nTable defore mutation');
    //   console.table(board.map((arr) => arr.map((cell) => cell.state)));
    //   const { x, y } = position;
    //   const cell = board[x]?.[y];

    //   if (cell) {
    //     cell.state = 'miss';
    //     ids.push(index);
    //   }
    //   console.log('POSITION', position, 'ID', index, '\nTable defore mutation');
    //   console.table(board.map((arr) => arr.map((cell) => cell.state)));
    // });
    // console.log('IDS', ids);
    // console.log('AFTER UPDATE');
    // console.table(board.map((arr) => arr.map((cell) => cell.shipId || 0)));
    // console.table(board.map((arr) => arr.map((cell) => cell.state)));

    // console.table(unshotCoordinates);

    return unshotCoordinates;
  }

  getEnemyId(idPlayer: number): number | undefined {
    return this.ids.filter((id) => id !== idPlayer)[0];
  }
}
