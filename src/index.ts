import express from 'express'
import {createServer} from 'node:http'
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

index.get('/', (req, res) => {
  res.send('Hello, it`s me ')
})

const messages = [
  {id: '2342', message: 'hello, Serg', user: {id: 'asdfdfsd', name: 'Aleks'}},
  {id: '2123', message: 'hello, Aleks', user: {id: 'asdfsdf', name: 'Serg'}}
]

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('client-message-sent', (message: string) => {
    const messageItem = {id: '2342' + new Date().getTime(), message: message, user: {id: 'asdfdfsd', name: 'Aleks'}}
    messages.push(messageItem)
    socket.emit('new-message-sent', messageItem)
  })

  socket.emit('init-messages-published', messages)
})

const PORT = process.env.PORT || 3009

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})