interface IRegistration {
  type: 'reg';
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  id: number;
}

interface IUpdateWinners {
  type: 'update_winners';
  data: IWinner[];
  id: number;
}

interface IWinner {
  name: string;
  wins: number;
}

interface ICreateGame {
  type: 'create_game';
  data: {
    idGame: number;
    idPlayer: number;
  };
  id: number;
}

interface IUpdateRoomState {
  type: 'update_room';
  data: IRoom[];
  id: number;
}

interface IRoom {
  roomId: number;
  roomUsers: IUser[];
}

interface IUser {
  name: string;
  index: number;
}

interface IStartGame {
  type: 'start_game';
  data: {
    ships: IShip[];
    currentPlayerIndex: number;
  };
  id: number;
}

interface IShip {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

interface IAttackFeedback {
  type: 'attack';
  data: {
    position: {
      x: number;
      y: number;
    };
    currentPlayer: number;
    status: 'miss' | 'killed' | 'shot';
  };
  id: number;
}

interface ITurnInfo {
  type: 'turn';
  data: {
    currentPlayer: number;
  };
  id: number;
}

interface IFinishGame {
  type: 'finish';
  data: {
    winPlayer: number;
  };
  id: number;
}

type ResponseType =
  | IRegistration
  | IUpdateWinners
  | ICreateGame
  | IUpdateRoomState
  | IStartGame
  | IAttackFeedback
  | ITurnInfo
  | IFinishGame;

export {
  IRegistration,
  IUpdateWinners,
  ICreateGame,
  IUpdateRoomState,
  IStartGame,
  IAttackFeedback,
  ITurnInfo,
  IFinishGame,
  ResponseType,
};
