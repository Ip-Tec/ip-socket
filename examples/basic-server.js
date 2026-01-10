const { createIPSocketServer } = require('../dist'); 

const server = createIPSocketServer({
    port: 3000,
    onConnection: (ws) => {
        console.log('New client connected!');
        ws.send('Welcome to IP Socket!');
    },
    onMessage: (msg, ws) => {
        console.log('Received:', msg);
        // Broadcast to all
        server.broadcast(msg);
    },
    onDisconnect: (ws) => {
        console.log('Client disconnected');
    }
});
