# Events Guide

`ip-socket` is designed to be event-driven.

## Core Events

### Connection (`onConnection`)

Triggered when a new client connects to the server.

```typescript
onConnection: (ws: WebSocket) => {
    console.log('Client connected');
}
```

### Message (`onMessage`)

Triggered when a message is received from any client. Messages are automatically parsed as JSON if possible, otherwise returned as strings.

```typescript
onMessage: (msg: any, ws: WebSocket) => {
    if (msg.type === 'chat') {
        // handle chat
    }
}
```

### Disconnect (`onDisconnect`)

Triggered when a client connection closes.

```typescript
onDisconnect: (ws: WebSocket) => {
    console.log('Client disconnected');
}
```

## Custom Events

You are encouraged to build your own event routing inside `onMessage`.

```typescript
import { createIPSocketServer } from 'ip-socket';

const server = createIPSocketServer({
    port: 3000,
    onMessage: (msg, ws) => {
        switch(msg.type) {
            case 'LOGIN':
                handleLogin(msg.payload, ws);
                break;
            case 'CHAT':
                server.broadcast({ type: 'CHAT', text: msg.text });
                break;
        }
    }
});
```
