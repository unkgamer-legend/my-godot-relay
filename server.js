const WebSocket = require('ws');
const http = require('http');

const port = process.env.PORT || 10000;
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Relay is Running"); // This keeps Render happy
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log("CLIENT JOINED");
    ws.on('message', (data) => {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
});

server.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on port ${port}`);
});
