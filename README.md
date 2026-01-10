# ip-socket

A reusable, easy-to-use WebSocket library for Node.js. Designed for simplicity and extensibility.

## Features

- 🚀 **Easy Setup**: Get a WebSocket server running in seconds.
- 🔌 **Plug-and-Play Events**: Modular event handling structure.
- 📡 **Broadcasting**: Built-in methods to broadcast messages to all connected clients.
- 🛡️ **TypeScript Support**: First-class TypeScript support with exported types.
- 🐳 **Deployment Ready**: Dockerfile included and Render/Railway friendly.

## Installation

```bash
npm install ip-socket
# or
pnpm add ip-socket
# or
yarn add ip-socket
# or
bun add ip-socket
```

## Quick Start

### Server

```javascript
const { createIPSocketServer } = require('ip-socket');

const server = createIPSocketServer({
  port: 3000,
  onConnection: (ws) => {
    console.log('Client connected');
    ws.send('Hello from ip-socket!');
  },
  onMessage: (msg, ws) => {
    console.log('Received:', msg);
  }
});
```

### Client (Browser)

```html
<script>
  const ws = new WebSocket('ws://localhost:3000');
  
  ws.onopen = () => {
    console.log('Connected!');
  };

  ws.onmessage = (event) => {
    console.log('Server says:', event.data);
  };
</script>
```

## Documentation

- [Getting Started](docs/getting-started.md)
- [Events Guide](docs/events.md)
- [API Reference](docs/api-reference.md)
- [Deployment Guide](docs/deployment.md)

## License

MIT
