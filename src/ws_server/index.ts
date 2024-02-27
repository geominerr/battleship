import { WebSocketServer } from './core/ws-server';

const WS_PORT = 3000;
const WS_HOST = '127.0.0.1';

export const wsServer = new WebSocketServer(WS_PORT, WS_HOST);
