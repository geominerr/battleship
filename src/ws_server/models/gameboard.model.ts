import { Ship } from '../game/ship';

interface IShip {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: ShipType;
}

interface IShot {
  x: number;
  y: number;
}

interface IShipState {
  size: number;
  hits: number;
}

interface ICell {
  state: CellStateType;
  shipId?: number;
  instance?: Ship;
}

interface IGameRes {
  nextPlayerID: number;
  status: StatusType;
  error: boolean;
  errorMessage: string;
  cellsAround?: ICellAround[];
  winner?: { id: number };
}

interface ICellAround {
  status: StatusType;
  position: IShot;
}

type CellStateType = 'empty' | 'miss' | 'shot' | 'ship';
type ShipType = 'small' | 'medium' | 'large' | 'huge';
type StatusType = 'miss' | 'killed' | 'shot';

export { IShip, IShot, IShipState, ICell, IGameRes, ICellAround, StatusType };
