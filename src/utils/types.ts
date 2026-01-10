import { WebSocket } from "ws";
import { IncomingMessage } from "http";

export interface IPSocket extends WebSocket {
  id: string;
  rooms: Set<string>;
  isAlive: boolean; // For heartbeat
  data?: any; // For storing auth user data
}

export type AuthMiddleware = (
  info: { req: IncomingMessage },
  next: (result: boolean, code?: number, message?: string) => void,
) => void;

export type Middleware = (
  socket: IPSocket,
  next: (err?: Error) => void,
) => void;

export interface IPSocketConfig {
  port?: number;
  auth?: AuthMiddleware;
  redisUrl?: string; // Enable Redis Adapter if provided
  onMessage?: (message: any, client: IPSocket) => void;
  onConnection?: (client: IPSocket) => void;
  onDisconnect?: (client: IPSocket) => void;
}

export interface IPSocketMessage {
  type: string;
  payload: any;
  timestamp?: number;
  room?: string; // Optional room target
}
