import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

// Routes
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import passionRoutes from './routes/passionRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import personalChatRoutes from './routes/personalChatRoutes.js';

import Message from './models/Message.js';
import PersonalChat from './models/PersonalChat.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    withCredentials: true
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/passion', passionRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/user', userRoutes);
app.use('/api/personalChat', personalChatRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

io.on('connection', (socket) => {
  console.log('User connected');

  // ----- Discussion Chat -----
  socket.on('joinDiscussion', (discussionId) => {
    socket.join(discussionId);
  });

  socket.on('sendMessage', async ({ discussionId, user, text }) => {
    const newMessage = new Message({ discussionId, user, text });
    await newMessage.save();
    io.to(discussionId).emit('receiveMessage', newMessage);
  });

  // ----- Personal Chat -----
  socket.on('joinPersonalChat', (chatId) => {
    socket.join(chatId);
  });

  socket.on('sendPersonalMessage', async ({ chatId, sender, content }) => {
    try {
      const chat = await PersonalChat.findById(chatId);
      const newMessage = {
        sender,
        content,
        timestamp: new Date(),
      };
      chat.messages.push(newMessage);
      await chat.save();
      io.to(chatId).emit('receivePersonalMessage', newMessage);
    } catch (err) {
      console.error("Error sending personal message:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(5000, () => console.log('Server running'));
  })
  .catch(err => console.log(err));