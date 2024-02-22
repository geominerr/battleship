interface IUser {
  name: string;
  password: string;
  wins: number;
}

interface IRoomUser {
  name: string;
  index: number;
}

export { IUser, IRoomUser };
