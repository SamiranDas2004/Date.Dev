const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());


const activeUsers = {};

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('joinRoom', (email) => {
    activeUsers[email] = socket.id;
    console.log(`${email} joined with socket ID ${socket.id}`);
  });

  socket.on('sendMessage', ({ fromUser, toUser, message }) => {
    const toSocketId = activeUsers[toUser];
   
    
    if (toSocketId) {
      io.to(toSocketId).emit('receiveMessage', { fromUser, message });
    }
  });

  socket.on('disconnect', () => {
    for (const email in activeUsers) {
      if (activeUsers[email] === socket.id) {
        delete activeUsers[email];
        break;
      }
    }
    console.log('a user disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
