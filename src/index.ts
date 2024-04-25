import express from 'express'
import {createServer} from 'node:http'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'
import {Server} from 'socket.io'

const index = express()
const server = createServer(index)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// const __dirname = dirname(fileURLToPath(import.meta.url));

index.get('/', (req, res) => {
  // res.sendFile(join(__dirname, 'index.html'));
  res.send('Hello, it`s me ')
})

io.on('connection', (socket) => {
  socket.handshake.headers.origin = 'http://localhost:3000'
  console.log('a user connected')
})

const PORT = process.env.PORT || 3009

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})