import { describe, it, expect, beforeAll, afterAll } from "vitest";
import WebSocket from "ws";
import { createIPSocketServer, IPSocketServer } from "../src/server";

describe("IPSocket Server", () => {
  let server: IPSocketServer;
  const PORT = 4000;

  beforeAll(() => {
    server = createIPSocketServer({ port: PORT });
  });

  afterAll(() => {
    server.close();
  });

  it("should allow a client to connect", async () => {
    return new Promise<void>((resolve) => {
      const ws = new WebSocket(`ws://localhost:${PORT}`);
      ws.on("open", () => {
        ws.close();
        resolve();
      });
    });
  });

  it("should echo messages via broadcast", async () => {
    return new Promise<void>((resolve) => {
      const ws1 = new WebSocket(`ws://localhost:${PORT}`);
      const ws2 = new WebSocket(`ws://localhost:${PORT}`);
      let ws2Received = false;

      ws2.on("message", (data) => {
        if (data.toString() === "hello") {
          ws2Received = true;
          ws1.close();
          ws2.close();
          resolve();
        }
      });

      ws1.on("open", () => {
        // Wait for ws2 to be ready
        setTimeout(() => {
          server.broadcast("hello");
        }, 100);
      });
    });
  });
});
