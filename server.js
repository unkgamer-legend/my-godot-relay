const WebSocket = require('ws');

// CRITICAL: Render tells your app which port to use via "process.env.PORT"
// If it's not there, it defaults to 8080 (for local testing)
const port = process.env.PORT || 8080;

// Create the server
const wss = new WebSocket.Server({ port: port }, () => {
    console.log(`Server is running on port ${port}`);
});

wss.on('connection', (ws) => {
    console.log('A player connected from the cloud!');

    ws.on('message', (message) => {
        console.log('Received:', message.toString());
        // Simple echo for testing
        ws.send("Server received: " + message.toString());
    });

    ws.on('close', () => console.log('Player disconnected'));
});
