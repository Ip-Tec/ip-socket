# API Reference

## `createIPSocketServer(config: IPSocketConfig)`

Creates and starts a new WebSocket server.

### `IPSocketConfig` Interface

| Property | Type | Description |
| self | --- | --- |
| `port` | `number` | Port to listen on. Defaults to `process.env.PORT` or `8080`. |
| `onConnection` | `(ws: WebSocket) => void` | Callback for new connections. |
| `onMessage` | `(msg: any, ws: WebSocket) => void` | Callback for received messages. |
| `onDisconnect` | `(ws: WebSocket) => void` | Callback for disconnections. |

### Returns: `IPSocketServer`

The server instance.

## `IPSocketServer` Class

### Methods

- **`broadcast(message: any): void`**
  Sends a message to all connected clients. JSON serializes objects automatically.

- **`close(): void`**
  Stops the server and closes all connections.
