import { WebSocketServer } from "ws";
import { IPSocketConfig, IPSocket } from "../utils/types";

export function handleMessage(
  ws: IPSocket,
  wss: WebSocketServer,
  data: any,
  config: IPSocketConfig,
) {
  let parsed: any;
  try {
    parsed = JSON.parse(data.toString());
  } catch (e) {
    parsed = data.toString();
  }

  if (config.onMessage) {
    config.onMessage(parsed, ws);
  }
}
