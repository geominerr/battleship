import { WebSocket } from 'ws';

import { GameBoard } from '../game/gameboard';
import { parseRequest, stringifyResponse } from '../utils/transform.util';

import { IUser, IRoomUser } from '../models/request-handler.model';
import * as Request from '../models/request.model';
import * as Response from '../models/response.model';
import { WebSocketCustom } from '../models/websocket.model';

export class RequestHandler {
  users: Map<number, IUser>;
  rooms: Map<number, IRoomUser[]>;
  games: Map<number, GameBoard>;
  sockets: Map<number, WebSocketCustom>;

  constructor() {
    this.users = new Map();
    this.sockets = new Map();
    this.rooms = new Map();
    this.games = new Map();
  }

  public handle(message: string, ws: WebSocketCustom): void {
    try {
      const req: Request.RequestType = parseRequest(message);
      const { type } = req;
      console.log('Request: ', req);

      switch (type) {
        case 'single_play':
          this.singlePlay(ws);
          break;
        case 'reg':
          this.createUser(req, ws);
          break;
        case 'create_room':
          this.createRoom(ws.id);
          break;
        case 'add_user_to_room':
          this.addUserToRoom(req, ws.id);
          break;
        case 'add_ships':
          this.addShips(req, ws.id, ws?.botMode);
          break;
        case 'attack':
          this.attack(req, ws?.botMode);
          break;
        case 'randomAttack':
          this.randomAttack(req, ws?.botMode);
          break;
        default:
          ws.send('Unknown Command');
          break;
      }
    } catch (err) {
      throw err;
    }
  }

  private createUser(req: Request.IRegistration, ws: WebSocketCustom): void {
    try {
      const { type, data } = req;
      const index = this.findUserIndex(data) ?? this.users.size;
      const error = this.validateUser(data);
      const user = this.users.get(index);

      const response: Response.IRegistration = {
        type,
        data: {
          name: data.name,
          index: index,
          error: false,
          errorText: ``,
        },
        id: index,
      };

      if (error) {
        response.data.error = true;
        response.data.errorText = error.message;

        const res = stringifyResponse(response);
        ws.send(res);

        return;
      }

      ws.id = index;
      this.users.set(index, user || { ...req.data, wins: 0 });
      this.sockets.set(index, ws);

      const res = stringifyResponse(response);

      ws.send(res);
      this.updateRooms();
      this.updateWinners();

      ws.on('close', () => {
        console.log('WS connect closed', ws.id);
        this.sockets.delete(ws.id);
        this.updateRooms();
      });
    } catch (err) {
      throw err;
    }
  }

  private singlePlay(ws: WebSocketCustom): void {
    try {
      ws.botMode = true;
      const { id, botMode } = ws;

      // not the best decision))
      const idBot = id + 10000;
      this.createGame([id, idBot], botMode);
      this.rooms.delete(id);
      this.updateRooms();
    } catch (err) {
      throw err;
    }
  }

  private updateRooms(): void {
    try {
      const listActiveRoomsWithOnePlayer = [...this.rooms]
        .filter(([, users]) => {
          if (users.length === 1) {
            if (users[0]?.index !== undefined) {
              return (
                this.sockets.get(users[0].index)?.readyState === WebSocket.OPEN
              );
            }
          }

          return false;
        })
        .map(([roomId, roomUsers]) => ({ roomId, roomUsers }));

      const res: Response.IUpdateRoomState = {
        type: 'update_room',
        data: listActiveRoomsWithOnePlayer,
        id: 0,
      };

      this.sockets.forEach((socket) => socket.send(stringifyResponse(res)));
    } catch (err) {
      throw err;
    }
  }

  private addWinner(idWinner: number): void {
    try {
      const user = this.users.get(idWinner);

      if (user) {
        user.wins += 1;
      }
    } catch (err) {
      throw err;
    }
  }

  private updateWinners(): void {
    try {
      const listWinners = [...this.users]
        .map(([, { name, wins }]) => ({
          name,
          wins,
        }))
        .filter((user) => user.wins)
        .sort((a, b) => b.wins - a.wins);

      const response: Response.IUpdateWinners = {
        type: 'update_winners',
        data: listWinners,
        id: 0,
      };

      const transformedRes = stringifyResponse(response);

      this.sockets.forEach((ws) => {
        if (ws?.readyState === WebSocket.OPEN) {
          ws.send(transformedRes);
        }
      });
    } catch (err) {
      throw err;
    }
  }

  private createGame(ids: number[], botMode?: boolean): void {
    try {
      const idGame = this.games.size;
      const gameboard = new GameBoard(ids);
      this.games.set(idGame, gameboard);

      const res: Response.ICreateGame = {
        type: 'create_game',
        data: {
          idGame,
          idPlayer: 0,
        },
        id: 0,
      };

      ids.forEach((id) => {
        res.data.idPlayer = id;
        const transformedRes = stringifyResponse(res);
        const socket = this.sockets.get(id);

        if (!botMode) {
          if (socket?.botMode) {
            socket.botMode = false;
          }
        }

        socket?.send(transformedRes);
      });
    } catch (err) {
      throw err;
    }
  }

  private createRoom(idUser: number): void {
    try {
      const name = this.users.get(idUser)?.name || 'Anonymous';

      this.rooms.set(idUser, [{ name, index: idUser }]);

      this.updateRooms();
    } catch (err) {
      throw err;
    }
  }

  private addUserToRoom(req: Request.IAddUserToRoom, idPlayer: number): void {
    try {
      const { indexRoom } = req.data;
      const room = this.rooms.get(indexRoom);
      const roomCreatorIndex = room?.[0]?.index;
      const name = this.users.get(idPlayer)?.name;

      if (roomCreatorIndex === idPlayer) {
        this.sockets
          .get(idPlayer)
          ?.send('"You cannot add yourself to the room you created!"');

        return;
      }

      if (room && name) {
        room.push({ name, index: idPlayer });
        this.rooms.set(indexRoom, room);
        this.rooms.delete(idPlayer);
      }

      const ids: number[] | undefined = room?.map((user) => user.index);

      if (ids) {
        this.createGame(ids);
      }

      this.updateRooms();
    } catch (err) {
      throw err;
    }
  }

  private addShips(
    req: Request.IAddShips,
    idPlayer: number,
    botMode?: boolean,
  ): void {
    try {
      const { gameId, ships } = req.data;
      const gameBoard = this.games.get(gameId);

      if (gameBoard) {
        const dataBoard = gameBoard.addShips(idPlayer, ships, botMode);

        if (dataBoard) {
          const response: Response.IStartGame = {
            type: 'start_game',
            data: { ships: [], currentPlayerIndex: 0 },
            id: 0,
          };
          const messageTurn = this.createTurnResponse(idPlayer);

          dataBoard.forEach(([id, ships]) => {
            const res = stringifyResponse({
              ...response,
              data: { ships, currentPlayerIndex: id },
            });

            const socket = this.sockets.get(id);

            if (socket) {
              socket.send(res);
              socket.send(messageTurn);
            }
          });
        }
      }
    } catch (err) {
      throw err;
    }
  }

  private attack(req: Request.IAttack, botMode?: boolean): void {
    try {
      const { x, y, indexPlayer, gameId } = req.data;
      const game = this.games.get(gameId);

      if (game) {
        const gameRes = game.attack(indexPlayer, {
          x,
          y,
        });

        if (gameRes) {
          const {
            nextPlayerID,
            status,
            error,
            errorMessage,
            cellsAround,
            winner,
            nextBot,
          } = gameRes;

          if (error) {
            this.sockets.get(indexPlayer)?.send(errorMessage);

            return;
          }

          const playerIds = game.getPlayers();
          const response: Response.IAttackFeedback = {
            type: 'attack',
            data: {
              position: {
                x: x,
                y: y,
              },
              currentPlayer: indexPlayer,
              status: status,
            },
            id: 0,
          };
          const message = stringifyResponse(response);

          playerIds.forEach((id) => {
            this.sockets.get(id)?.send(message);
          });

          if (winner) {
            const winRes: Response.IFinishGame = {
              type: 'finish',
              data: { winPlayer: winner.id },
              id: 0,
            };

            const mesRes = stringifyResponse(winRes);

            playerIds.forEach((id) => {
              this.sockets.get(id)?.send(mesRes);
            });
            this.addWinner(winner.id);
            this.updateWinners();

            return;
          }

          if (cellsAround) {
            cellsAround.forEach(({ status, position }) => {
              const res: Response.IAttackFeedback = {
                ...response,
                data: { ...response.data, position, status },
              };

              const message = stringifyResponse(res);

              playerIds.forEach((id) => {
                this.sockets.get(id)?.send(message);
                const messageTurn = this.createTurnResponse(nextPlayerID);
                this.sockets.get(id)?.send(messageTurn);
              });
            });

            if (!nextBot) {
              return;
            }
          }

          const messageTurn = this.createTurnResponse(nextPlayerID);
          playerIds.forEach((id) => this.sockets.get(id)?.send(messageTurn));

          if (botMode) {
            if (nextBot) {
              const fakeRandomReq: Request.IRandomAttack = {
                type: 'randomAttack',
                data: { gameId, indexPlayer: nextPlayerID },
                id: 0,
              };
              setTimeout(() => {
                this.randomAttack(fakeRandomReq, true);
              }, 1100);
            }
          }
        }
      }
    } catch (err) {
      throw err;
    }
  }

  private randomAttack(req: Request.IRandomAttack, botMode?: boolean): void {
    try {
      const { gameId, indexPlayer } = req.data;
      const game = this.games.get(gameId);
      const fakeRequest: Request.IAttack = {
        type: 'attack',
        data: {
          indexPlayer: indexPlayer,
          gameId: gameId,
          x: 0,
          y: 0,
        },
        id: 0,
      };

      if (game) {
        const { x, y } = game.generateRandomAttack(indexPlayer, botMode);
        fakeRequest.data.x = x;
        fakeRequest.data.y = y;
      }

      this.attack(fakeRequest, botMode);
    } catch (err) {
      throw err;
    }
  }

  private createTurnResponse(id: number): string {
    try {
      const response: Response.ITurnInfo = {
        type: 'turn',
        data: {
          currentPlayer: id,
        },
        id: 0,
      };

      return stringifyResponse(response);
    } catch (err) {
      throw err;
    }
  }

  private findUserIndex(data: {
    name: string;
    password: string;
  }): number | null {
    try {
      const { name, password } = data;

      for (const [index, user] of this.users) {
        if (user.name === name && user.password === password) {
          return index;
        }
      }

      return null;
    } catch (err) {
      throw err;
    }
  }

  private validateUser(data: {
    name: string;
    password: string;
  }): { message: string } | null {
    try {
      const { name, password } = data;

      for (const [id, user] of this.users) {
        if (user.name === name && user.password !== password) {
          return { message: 'Password is not valid!' };
        }

        if (user.name === name && user.password === password) {
          if (this.sockets.get(id)?.readyState === WebSocket.OPEN) {
            return {
              message: `${name} user has an active connection ^_^ Close active tab  ^_^ `,
            };
          }
        }
      }

      return null;
    } catch (err) {
      throw err;
    }
  }
}
