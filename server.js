const WebSocket = require('ws');
const port = process.env.PORT || 10000;

const wss = new WebSocket.Server({ 
    port: port,
    host: '0.0.0.0',
    handleProtocols: (protocols) => {
        return protocols.values().next().value || "";
    }
});

wss.on('connection', (ws) => {
    console.log("HANDSHAKE FORCED - Connection Verified");

    ws.on('message', (message) => {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
    const timer = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.ping();
    }, 20000);

    ws.on('close', () => {
        clearInterval(timer);
        console.log("Client disconnected");
    });
});

console.log(`Relay active on port ${port}`);
