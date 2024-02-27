# RSSchool NodeJS websocket task template

> Static http server and base task packages.
> By default WebSocket client tries to connect to the 3000 port.

## Description

### Team play

- **User validation**

  1. Validation by name and password
  2. If the user exists and the password matches the name, check for an active connection. One user can have 1 active connection!

- **Create room**

  1. One user can create only one room!

- **Add to room**

  1. The user cannot be added to the room he created!
  2. If you have an open room but you are added to another, your room will be deleted!
  3. If you have an open room and you select single play, your room will be deleted!

- **Game**

  1. You can't make a move while it's your opponent's turn!
  2. If you click on already open cells, this counts as a move!

### Single play

**Attention!**
Bot after ~8-10 misses will destroy your entire fleet! So hurry up!😜
To give you a hint and check whether you can defeat him, after the game starts, there will be a ship placement table in the console!

**BOARD BOT**

| (index) |   0    |  1  |   2    |   3    |   4    |   5    |   6    |   7    |   8    |   9    |
| :-----: | :----: | :-: | :----: | :----: | :----: | :----: | :----: | :----: | :----: | :----: |
|    0    |   0    |  0  |   0    |   0    |   0    | 'ship' |   0    | 'ship' |   0    |   0    |
|    1    |   0    |  0  |   0    |   0    |   0    | 'ship' |   0    |   0    |   0    |   0    |
|    2    |   0    |  0  |   0    |   0    |   0    |   0    |   0    |   0    |   0    |   0    |
|    3    | 'ship' |  0  | 'ship' | 'ship' |   0    |   0    | 'ship' |   0    | 'ship' |   0    |
|    4    | 'ship' |  0  |   0    |   0    |   0    |   0    | 'ship' |   0    |   0    |   0    |
|    5    | 'ship' |  0  |   0    |   0    |   0    |   0    |   0    |   0    |   0    |   0    |
|    6    |   0    |  0  | 'ship' |   0    |   0    | 'ship' |   0    |   0    |   0    |   0    |
|    7    |   0    |  0  |   0    |   0    |   0    |   0    |   0    | 'ship' | 'ship' | 'ship' |
|    8    |   0    |  0  | 'ship' | 'ship' | 'ship' | 'ship' |   0    |   0    |   0    |   0    |
|    9    |   0    |  0  |   0    |   0    |   0    |   0    |   0    |   0    |   0    |   0    |

Have a good game!😜

## Installation

1. Clone/download repo
2. `npm install`

## Usage

**Development**

`npm run start:dev`

- App served @ `http://localhost:8181` with tsx
- WS served @ `ws://localhost:3000` with tsx

**Production**

`npm run start`

- App served @ `http://localhost:8181`
- WS served @ `ws://localhost:3000`

---

**All commands**

| Command             | Description                                   |
| ------------------- | --------------------------------------------- |
| `npm run start:dev` | App served @ `http://localhost:8181` with tsx |
| `npm run start`     | App served @ `http://localhost:8181`          |
| `npm run lint`      | Run ESLint for code linting                   |
| `npm run format`    | Run Prettier for code formatting              |

**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.
