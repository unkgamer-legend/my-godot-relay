const WebSocket = require('ws');
const http = require('http');

const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Game Server is running and listening for connections.');
});

const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

wss.on('connection', (ws, req) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(`[Connect] Client joined from IPs: ${clientIp}`);

    ws.on('message', (data) => {
        const bytesReceived = data.length;
        console.log(`[Bandwidth] Received ${bytesReceived} bytes from ${clientIp}`);

        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    ws.on('close', () => {
        console.log(`[Disconnect] Client left from IP: ${clientIp}`);
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
