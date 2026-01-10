# Getting Started with ip-socket

## Prerequisites

- Node.js (v14 or later)
- TypeScript (optional, but recommended)

## Installation

Install the package via your preferred package manager:

```bash
npm install ip-socket
```

## Basic Usage

### creating a Server

The core of `ip-socket` is the `createIPSocketServer` function. It initializes a WebSocket server on the specified port.

```typescript
import { createIPSocketServer } from 'ip-socket';

const server = createIPSocketServer({
    port: 8080,
    onConnection: (ws) => {
        console.log('New connection!');
    }
});
```

### Handling Messages

You can handle messages globally via the `onMessage` config option, or per-connection.

```typescript
const server = createIPSocketServer({
    port: 8080,
    onMessage: (msg, ws) => {
        // Handle all messages here
        console.log('Global handler:', msg);
    }
});
```
