const WebSocket = require('ws');
const port = process.env.PORT || 10000;

const wss = new WebSocket.Server({ 
    port,
    handleProtocols: (protocols, request) => {
        return protocols.values().next().value || "";
    }
});

wss.on('connection', (ws) => {
    console.log("Client connected - Handshake Forced");

    ws.on('message', (message) => {
        // Relay to everyone else
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Keep-alive heartbeat to prevent Render from cutting the line
    const timer = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.ping();
    }, 20000);

    ws.on('close', () => {
        clearInterval(timer);
        console.log("Client disconnected");
    });
});

console.log(`Relay active on port ${port}`);
