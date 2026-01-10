# API Reference

## `createIPSocketServer(config: IPSocketConfig)`

Initialize the server.

### `IPSocketConfig`
- `port`: Port number (default: `process.env.PORT` or `8080`).
- `redisUrl`: Redis connection string for scaling (optional).
- `auth`: **Deprecated**, use `server.use()` instead.

---

## `IPSocketServer` Class

### Middleware
- **`use(middleware: (socket, next) => void)`**: Register middleware to run on connection.
  ```typescript
  server.use((socket, next) => {
      console.log('New connection attempt');
      next();
  });
  ```

### Room Management
- **`join(socket: IPSocket, room: string)`**: Add a socket to a room.
- **`leave(socket: IPSocket, room: string)`**: Remove a socket from a room.

### Broadcasting
- **`to(room: string).emit(message: any)`**: Send a message to all sockets in a specific room.
  - Supports scaling via Redis if configured.
- **`broadcast(message: any)`**: Send a message to **all** connected sockets.

---

## `IPSocketClient` Class (Client SDK)

### Methods
- **`connect()`**: Establish connection to the server.
- **`send(data: any, callback?: (res) => void)`**: Send a message.
  - If `callback` is provided, the server must reply with the matching `ackId`.

### Automatic Features
- **Reconnection**: Automatically retries with exponential backoff on disconnect.
