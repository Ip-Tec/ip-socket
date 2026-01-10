import { WebSocketServer } from "ws";
import { IPSocketConfig, IPSocket } from "../utils/types";
import { handleMessage } from "./message";

export function handleConnection(
  ws: IPSocket,
  wss: WebSocketServer,
  config: IPSocketConfig,
) {
  if (config.onConnection) {
    config.onConnection(ws);
  }

  ws.on("message", (data) => {
    handleMessage(ws, wss, data, config);
  });

  ws.on("close", () => {
    if (config.onDisconnect) {
      config.onDisconnect(ws);
    }
  });
}
