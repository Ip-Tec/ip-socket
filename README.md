# ip-socket

<div align="center">

**The "Nigerian Socket.IO"** 🚀  
A robust, flexible, and scalable WebSocket library for Node.js.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

</div>

---

`ip-socket` is a powerful WebSocket wrapper designed for modern applications. It brings the ease of use of Socket.IO with a lightweight, modular architecture.

## 🔥 Key Features

- **🏠 Rooms & Channels**: Group sockets easily (`server.to('room').emit(...)`).
- **🛡️ Middleware System**: Express-style middleware (`server.use(...)`) for auth and logging.
- **🧱 Scalability**: Built-in **Redis Adapter** for multi-server deployments.
- **🔌 Auto-Reconnection**: Smart client that handles network drops automatically.
- **📨 Acknowledgements**: Request-Response pattern support (`client.send(data, callback)`).
- **💓 Heartbeat**: Automatic Ping/Pong to keep connections alive.
- **🐳 Cloud Ready**: Comes with Docker support for Render/Railway.

## 📦 Installation

```bash
npm install ip-socket
# or
pnpm add ip-socket
```

## 🚀 Quick Start

### Server

```typescript
import { createIPSocketServer } from 'ip-socket';

const server = createIPSocketServer({ port: 3000 });

// 🛡️ Middleware: Authentication
server.use((socket, next) => {
    if (socket.data.token === 'secret') return next();
    // next(new Error('Unauthorized')); // Uncomment to block
    next();
});

server.onConnection = (socket) => {
    console.log(`Client ${socket.id} connected`);

    // 🏠 Join a Room
    server.join(socket, 'general');

    // 📨 Handle Messages
    socket.on('message', (msg) => {
        // 📢 Broadcast to Room
        server.to('general').emit(`User ${socket.id} says: ${msg}`);
    });
};
```

### Client (Browser/Node)

```javascript
import { IPSocketClient } from 'ip-socket/client';

const client = new IPSocketClient('ws://localhost:3000');

client.connect();

// 📨 Send with Acknowledgement
client.send({ type: 'greet' }, (response) => {
    console.log('Server replied:', response);
});
```

## 🧱 Scaling with Redis

Running multiple server instances? Use the Redis Adapter to sync broadcasts.

```typescript
const server = createIPSocketServer({
    port: 3000,
    redisUrl: 'redis://localhost:6379' 
});
// Now server.to('room').emit() works across ALL servers!
```

## 📚 Documentation

- [Getting Started](docs/getting-started.md)
- [API Reference](docs/api-reference.md)
- [Events Guide](docs/events.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

Built with ❤️ by Ip-Tec. Open to contributions!

## License

MIT
