import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { Server } from 'socket.io';
const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));
app.get('/', (req, res) => {
    // res.sendFile(join(__dirname, 'index.html'));
    res.send('Hello, it`s me ');
});
io.on('connection', (socket) => {
    console.log('a user connected');
});
server.listen(3009, () => {
    console.log('server running at http://localhost:3009');
});