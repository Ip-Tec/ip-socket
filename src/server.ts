import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { IPSocketConfig, IPSocket, Middleware } from "./utils/types";
import { handleConnection } from "./events/connection";
import { RedisAdapter } from "./adapters/redis";

export class IPSocketServer {
  private wss: WebSocketServer;
  private config: IPSocketConfig;
  private rooms: Map<string, Set<IPSocket>> = new Map();
  private adapter?: RedisAdapter;
  private middlewares: Middleware[] = [];

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
    this.wss.on("connection", async (ws: WebSocket, req) => {
      // Enhance WebSocket with IPSocket properties
      const ipWs = ws as IPSocket;
      ipWs.id = uuidv4();
      ipWs.rooms = new Set();
      ipWs.isAlive = true;
      ipWs.data = {};

      ipWs.on("pong", () => {
        ipWs.isAlive = true;
      });

      // Execute Middleware
      try {
        await this.runMiddlewares(ipWs);
        handleConnection(ipWs, this.wss, this.config);
      } catch (err) {
        console.error("Middleware Error:", err);
        ipWs.close(); // Close connection if middleware fails
      }
    });

    // Heartbeat Interval
    const interval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        const ipWs = ws as IPSocket;
        if (ipWs.isAlive === false) return ws.terminate();

        ipWs.isAlive = false;
        ws.ping();
      });
    }, 30000);

    this.wss.on("close", () => clearInterval(interval));

    console.log(`IPSocket Server running on port ${port}`);
  }

  public use(fn: Middleware) {
    this.middlewares.push(fn);
  }

  private runMiddlewares(socket: IPSocket): Promise<void> {
    return new Promise((resolve, reject) => {
      let index = 0;

      const next = (err?: Error) => {
        if (err) return reject(err);
        if (index >= this.middlewares.length) return resolve();

        const middleware = this.middlewares[index++];
        try {
          middleware(socket, next);
        } catch (e) {
          reject(e);
        }
      };

      next();
    });
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
