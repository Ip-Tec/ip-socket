import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";

export class IPSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private options: {
    reconnect?: boolean;
    reconnectInterval?: number;
    maxToReconnect?: number;
  };
  private reconnectAttempts = 0;
  private ackCallbacks: Map<string, (response: any) => void> = new Map();

  constructor(
    url: string,
    options: {
      reconnect?: boolean;
      reconnectInterval?: number;
      maxToReconnect?: number;
    } = {},
  ) {
    this.url = url;
    this.options = {
      reconnect: true,
      reconnectInterval: 1000,
      maxToReconnect: 10,
      ...options,
    };
  }

  public connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      console.log("Connected to server");
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data.toString());
        if (msg.ackId && this.ackCallbacks.has(msg.ackId)) {
          this.ackCallbacks.get(msg.ackId)?.(msg.payload);
          this.ackCallbacks.delete(msg.ackId);
          return;
        }
      } catch (e) {
        // Not JSON or plain message
      }
    };

    this.ws.onclose = () => {
      console.log("Disconnected");
      if (
        this.options.reconnect &&
        this.reconnectAttempts < (this.options.maxToReconnect || 10)
      ) {
        const interval =
          (this.options.reconnectInterval || 1000) *
          Math.pow(2, this.reconnectAttempts);
        console.log(`Reconnecting in ${interval}ms...`);
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, interval);
      }
    };
  }

  public send(data: any, callback?: (response: any) => void) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const payload = typeof data === "string" ? { text: data } : data;

      if (callback) {
        const ackId = uuidv4();
        this.ackCallbacks.set(ackId, callback);
        payload.ackId = ackId;
      }

      this.ws.send(JSON.stringify(payload));
    } else {
      console.error("WebSocket is not open");
    }
  }
}
