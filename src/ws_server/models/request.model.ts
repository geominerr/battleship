interface IRegistration {
  type: 'reg';
  data: {
    name: string;
    password: string;
  };
  id: number;
}

interface ICreateRoom {
  type: 'create_room';
  data: string;
  id: number;
}

interface IAddUserToRoom {
  type: 'add_user_to_room';
  data: {
    indexRoom: number;
  };
  id: number;
}

interface IAddShips {
  type: 'add_ships';
  data: {
    gameId: number;
    ships: IShip[];
    indexPlayer: number;
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

interface IAttack {
  type: 'attack';
  data: {
    gameId: number;
    x: number;
    y: number;
    indexPlayer: number;
  };
  id: number;
}

interface IRandomAttack {
  type: 'randomAttack';
  data: {
    gameId: number;
    indexPlayer: number;
  };
  id: number;
}

type RequestType =
  | IRegistration
  | ICreateRoom
  | IAddUserToRoom
  | IAddShips
  | IAttack
  | IRandomAttack;

export {
  IRegistration,
  ICreateRoom,
  IAddUserToRoom,
  IAddShips,
  IAttack,
  IRandomAttack,
  RequestType,
};
