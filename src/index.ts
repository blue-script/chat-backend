import express from 'express'
import {createServer} from 'node:http'
import {Server} from 'socket.io'

const index = express()
const server = createServer(index)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

index.get('/', (req, res) => {
  res.send('Hello, it`s me ')
})

const messages = [
  {id: '123', message: 'hello, Serg', user: {id: '789', name: 'Aleks'}},
  {id: '456', message: 'hello, Aleks', user: {id: '10111', name: 'Serg'}}
]

const usersState = new Map()

io.on('connection', (socket) => {
  usersState.set(socket, {id: new Date().getTime().toString(), name: 'anonym'})

  io.on('disconnect', () => {
    usersState.delete(socket)
  })


  socket.on('client-name-sent', (name: string) => {
    if (typeof name !== 'string') return

    const user = usersState.get(socket)
    user.name = name
  })

  socket.on('client-typed', () => {
    socket.broadcast.emit('user-typing', usersState.get(socket))
  })

  socket.on('client-message-sent', (message: string, successFn) => {
    if (typeof message !== 'string' || message.length > 20) {
      successFn('Message length should be less than 20 chars')
      return
    }

    const user = usersState.get(socket)

    const messageItem = {id: new Date().getTime().toString(), message: message, user: {id: user.id, name: user.name}}
    messages.push(messageItem)

    socket.emit('new-message-sent', messageItem)

    successFn(null)
  })

  socket.emit('init-messages-published', messages, (data: string) => {
    console.log('INIT MESSAGES RECEIVED ' + data)
  })

})

const PORT = process.env.PORT || 3009

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})