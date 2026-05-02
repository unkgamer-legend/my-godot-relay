const WebSocket = require('ws');
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ 
    port,
    handleProtocols: (protocols) => {
        return protocols.values().next().value;
    }
});

wss.on('connection', (ws) => {
    console.log("Client connected");
    
    ws.on('message', (data) => {
        // Broadcast to everyone else
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    ws.on('close', () => {
        console.log("Client disconnected");
    });
});

console.log(`Relay active on port ${port}`);
