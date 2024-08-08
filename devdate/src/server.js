const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const Message = require('./models/messages'); // Ensure the correct import path
const { default: dbConnect } = require('./lib/dbConnect');

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
dbConnect()
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining a room
  socket.on('joinRoom', async (userEmail) => {
    activeUsers[userEmail] = socket.id;
    console.log(`${userEmail} joined with socket ID ${socket.id}`);


    // Fetch undelivered messages 
    const undeliveredMessages = await Message.find({
      toUser: userEmail,
      delivered: false,
    }).sort({ timestamp: 1 });

    // Send undelivered messages to the user
    socket.emit('previousMessages', undeliveredMessages);

    // Mark messages as delivered
    await Message.updateMany(
      { toUser: userEmail, delivered: false },
      { delivered: true }
    );
  });

  // Handle sending a message
  socket.on('sendMessage', async ({ fromUser, toUser, message }) => {
    const newMessage = new Message({ fromUser, toUser, message });

    // Save the message to the database
    await newMessage.save();

    // Check if the recipient is connected
    const recipientSocketId = activeUsers[toUser];

    if (recipientSocketId) {
      // Emit the message to the recipient
      io.to(recipientSocketId).emit('receiveMessage', newMessage);

      // Mark the message as delivered
      await Message.findByIdAndUpdate(newMessage._id, { delivered: true });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    for (const email in activeUsers) {
      if (activeUsers[email] === socket.id) {
        delete activeUsers[email];
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server is listening on *:3001');
});
