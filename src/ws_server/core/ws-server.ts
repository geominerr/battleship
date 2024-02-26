import WebSocket from 'ws';
import { WebSocketCustom } from '../models/websocket.model';
import { RequestHandler } from '../services/handler.sevice';
import { stdout } from 'process';

export class WebSocketServer {
  wss: WebSocket.Server;
  handler: RequestHandler;
  port: number;
  host: string;

  constructor(port: number, host: string) {
    this.wss = new WebSocket.Server({ port, host, clientTracking: true });
    this.handler = new RequestHandler();
    this.port = port;
    this.host = host;
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
        .on('listening', () =>
          stdout.write(
            `Start \x1b[92mWebsocket\x1b[0m server on the \x1b[93m${this.port}\x1b[0m port. Host: \x1b[93m${this.host}\x1b[0m`,
          ),
        )
        .on('error', (err) => console.error(err))
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

  close(): void {
    this.wss.close();
  }
}
