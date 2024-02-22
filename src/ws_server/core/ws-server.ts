import WebSocket from 'ws';
import { WebSocketCustom } from '../models/websocket.model';
import { RequestHandler } from '../services/handler.sevice';

export class WebSocketServer {
  wss: WebSocket.Server;
  handler: RequestHandler;

  constructor(port: number, host: string) {
    this.wss = new WebSocket.Server({ port, host });
    this.handler = new RequestHandler();
  }

  listen(): void {
    try {
      this.wss
        .on('connection', (ws: WebSocketCustom) => {
          ws.on('message', (msg) => {
            try {
              this.handler.handle(msg.toString(), ws);
            } catch (err) {
              if (err instanceof Error) {
                console.error(err);
              }
            }
          });
        })
        .on('error', console.error)
        .on('close', () => {
          this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.close();
            }
          });

          console.log('WebSocket Server closed');
        });
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
      }
    }
  }
}
