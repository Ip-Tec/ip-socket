import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { IPSocketConfig, IPSocket } from "./utils/types";
import { handleConnection } from "./events/connection";
import { RedisAdapter } from "./adapters/redis";

export class IPSocketServer {
  private wss: WebSocketServer;
  private config: IPSocketConfig;
  private rooms: Map<string, Set<IPSocket>> = new Map();
  private adapter?: RedisAdapter;

  constructor(config: IPSocketConfig) {
    this.config = config;
    const port = config.port || parseInt(process.env.PORT || "8080");

    this.wss = new WebSocketServer({
      port,
      verifyClient: config.auth ? config.auth : undefined,
    });

    if (config.redisUrl) {
      this.adapter = new RedisAdapter(this, config.redisUrl);
    }

    this.init(port);
  }

  private init(port: number) {
    this.wss.on("connection", (ws: WebSocket, req) => {
      // Enhance WebSocket with IPSocket properties
      const ipWs = ws as IPSocket;
      ipWs.id = uuidv4();
      ipWs.rooms = new Set();
      ipWs.data = {}; // Can be populated further if we had access to verifyClient context,
      // but with simple middleware we rely on req usage or custom logic

      handleConnection(ipWs, this.wss, this.config);
    });

    console.log(`IPSocket Server running on port ${port}`);
  }

  // Room Management
  public join(client: IPSocket, room: string) {
    client.rooms.add(room);
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }
    this.rooms.get(room)?.add(client);
  }

  public leave(client: IPSocket, room: string) {
    client.rooms.delete(room);
    this.rooms.get(room)?.delete(client);
    if (this.rooms.get(room)?.size === 0) {
      this.rooms.delete(room);
    }
  }

  // Broadcast to all or specific room
  public to(room: string) {
    return {
      emit: (message: any) => {
        if (this.adapter) {
          this.adapter.publish(message, room);
        } else {
          this.localTo(room, message);
        }
      },
    };
  }

  public broadcast(message: any) {
    if (this.adapter) {
      this.adapter.publish(message);
    } else {
      this.localBroadcast(message);
    }
  }

  // Internal methods for local broadcasting (called by Adapter or fallback)
  public localTo(room: string, message: any) {
    const clients = this.rooms.get(room);
    if (clients) {
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            typeof message === "string" ? message : JSON.stringify(message),
          );
        }
      });
    }
  }

  public localBroadcast(message: any) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          typeof message === "string" ? message : JSON.stringify(message),
        );
      }
    });
  }

  public close() {
    this.wss.close();
  }
}

export function createIPSocketServer(config: IPSocketConfig = {}) {
  return new IPSocketServer(config);
}
