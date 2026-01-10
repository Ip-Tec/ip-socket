import { createIPSocketServer } from "../src";

const server = createIPSocketServer({
  port: 3000,
  onConnection: (ws) => {
    console.log("DEV SERVER: New client connected!");
    ws.send("Connected to Dev Server");
  },
  onMessage: (msg, ws) => {
    console.log("DEV SERVER Received:", msg);
    server.broadcast(msg);
  },
});
