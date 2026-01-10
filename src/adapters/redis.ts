import { createClient, RedisClientType } from "redis";
import { IPSocketServer } from "../server";

export class RedisAdapter {
  private pubClient: RedisClientType;
  private subClient: RedisClientType;
  private server: IPSocketServer;
  private channel: string = "ip-socket:broadcast";

  constructor(server: IPSocketServer, redisUrl?: string) {
    this.server = server;
    this.pubClient = createClient({ url: redisUrl });
    this.subClient = this.pubClient.duplicate();

    this.init();
  }

  private async init() {
    await this.pubClient.connect();
    await this.subClient.connect();

    this.subClient.subscribe(this.channel, (message: string) => {
      try {
        const parsed = JSON.parse(message);

        if (parsed.room) {
          this.server.localTo(parsed.room, parsed.payload);
        } else {
          this.server.localBroadcast(parsed.payload);
        }
      } catch (e) {
        console.error("Redis Adapter Error:", e);
      }
    });
  }

  public publish(payload: any, room?: string) {
    const message = JSON.stringify({ payload, room });
    this.pubClient.publish(this.channel, message);
  }
}
