const http = require('http');
const sockjs = require('sockjs');

const wss = sockjs.createServer();
const clients = new Map();

wss.on('connection', (ws) => {
    console.log("connected");
    const id = uuidv4();
    const metadata = { id };

    clients.set(ws, metadata);

    ws.on('data', (messageAsString) => {
        const message = JSON.parse(messageAsString);
        const metadata = clients.get(ws);
        console.log(metadata, message)
    });

    ws.on("close", () => {
        clients.delete(ws);
    });
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const server = http.createServer();
wss.installHandlers(server, { prefix: '/ws' });
server.listen(7071, '0.0.0.0');

console.log("wss up");