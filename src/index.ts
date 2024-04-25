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
  {id: '2342', message: 'hello, Serg', user: {id: 'asdfdfsd', name: 'Aleks'}},
  {id: '2123', message: 'hello, Aleks', user: {id: 'asdfsdf', name: 'Serg'}}
]

const usersState = new Map()

io.on('connection', (socket) => {
  usersState.set(socket, {id: new Date().getTime().toString(), name: "anonym"} )

  socket.on('disconnect', ()=>{
    usersState.delete(socket)
  })


  socket.on('client-name-sent',( name: string)=>{
    if (typeof name !== 'string') return

    const user = usersState.get(socket)
    user.name = name
  })

  socket.on('client-typed',( )=>{
    socket.emit('user-typing', usersState.get(socket))

  socket.on('client-message-sent', (message: string) => {
    if (typeof message !== 'string') return

    const user = usersState.get(socket)

    const messageItem = {id: new Date().getTime().toString(), message: message, user: {id: user.id, name: user.name}}
    messages.push(messageItem)

    socket.emit('new-message-sent', messageItem)
  })

  socket.emit('init-messages-published', messages)
})

const PORT = process.env.PORT || 3009

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})