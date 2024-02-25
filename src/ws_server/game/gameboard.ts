import { Ship } from './ship';
import { generateShips } from '../utils/ship-generator.util';
import { showBoard } from '../utils/show-bot-board.utils';
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
  idBot: number = 0;

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
    botMode?: boolean,
  ): [number, IShip[]][] | null {
    try {
      this.createBoard(idPlayer, ships);
      this.ships.set(idPlayer, ships);

      if (botMode) {
        const idBot = this.getEnemyId(idPlayer);
        const shipsBot = generateShips();

        if (idBot) {
          this.idBot = idBot;
          this.createBoard(idBot, shipsBot);
          this.ships.set(idBot, shipsBot);
          const board = this.boards.get(idBot);

          if (board) {
            showBoard(board);
          }
        }
      }

      if (this.boards.size === 2) {
        this.currentPlayerID = idPlayer;
        return Array.from(this.ships.entries());
      }

      return null;
    } catch (err) {
      throw err;
    }
  }

  public attack(idPlayer: number, shot: IShot): IGameRes {
    try {
      const enemyId = this.getEnemyId(idPlayer);
      const { x, y } = shot;
      const response: IGameRes = {
        nextPlayerID: 0,
        status: 'miss',
        error: false,
        errorMessage: '',
        nextBot: false,
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
                  nextBot: this.idBot === enemyId,
                };
              case 'shot':
                cell.state = 'shot';
                this.currentPlayerID = enemyId;

                return {
                  ...response,
                  nextPlayerID: enemyId,
                  status: 'shot',
                  nextBot: this.idBot === enemyId,
                };

              case 'empty':
                cell.state = 'miss';
                this.currentPlayerID = enemyId;

                return {
                  ...response,
                  nextPlayerID: enemyId,
                  nextBot: this.idBot === enemyId,
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
                    nextBot: this.idBot === idPlayer,
                  };
                }

                return {
                  ...response,
                  nextPlayerID: idPlayer,
                  status: 'shot',
                  nextBot: this.idBot === idPlayer,
                };
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
    } catch (err) {
      throw err;
    }
  }

  public generateRandomAttack(idPlayer: number, botMode?: boolean): IShot {
    try {
      const { boardSize } = this;
      const enemyId = this.getEnemyId(idPlayer);
      let shot: IShot = {} as IShot;
      let flag: boolean = true;

      if (typeof enemyId === 'number') {
        const board = this.boards.get(enemyId);

        if (board) {
          while (flag) {
            const x = Math.floor(Math.random() * boardSize);
            const y = Math.floor(Math.random() * boardSize);
            const cellState = board[x]?.[y]?.state;

            if (
              (!botMode && cellState !== 'shot') ||
              (botMode && cellState !== 'miss' && cellState !== 'shot')
            ) {
              shot = { x, y };
              flag = false;
            }
          }
        }
      }

      return shot;
    } catch (err) {
      throw err;
    }
  }

  private createBoard(idPlayer: number, ships: IShip[]): void {
    try {
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
    } catch (err) {
      throw err;
    }
  }

  private getSurroundingCoordinates(
    shipId: number,
    board: ICell[][],
  ): ICellAround[] {
    try {
      const { boardSize } = this;

      const unshotCoordinates: ICellAround[] = [];

      for (let i = 0; i < boardSize; i += 1) {
        for (let j = 0; j < boardSize; j += 1) {
          const cell = board?.[i]?.[j];

          if (cell && cell.shipId === shipId) {
            unshotCoordinates.push({
              status: 'killed',
              position: { x: i, y: j },
            });
            for (let x = i - 1; x <= i + 1; x += 1) {
              for (let y = j - 1; y <= j + 1; y += 1) {
                if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
                  if (board[x]?.[y]?.state !== 'shot') {
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

      return unshotCoordinates;
    } catch (err) {
      throw err;
    }
  }

  getEnemyId(idPlayer: number): number | undefined {
    try {
      return this.ids.filter((id) => id !== idPlayer)[0];
    } catch (err) {
      throw err;
    }
  }
}
