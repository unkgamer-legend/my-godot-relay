const WebSocket = require('ws');
// Render tells us which port to use through process.env.PORT
const port = process.env.PORT || 10000;

const wss = new WebSocket.Server({ 
    port: port,
    host: '0.0.0.0', // CRITICAL: This allows external connections
    handleProtocols: (protocols) => {
        return protocols.values().next().value || "";
    }
});

wss.on('connection', (ws) => {
    console.log("HANDSHAKE FORCED - Connection Verified");

    ws.on('message', (data) => {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
});

console.log(`Relay active on port ${port}`);
