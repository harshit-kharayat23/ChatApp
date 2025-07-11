import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "https://chit-chat-qyxv.onrender.com",
    methods: ['GET', 'POST']

  }
});


const userSocketMap = {};

export const  getRecieverIdSocketId=(reciever)=>{


    return userSocketMap[reciever];

}


io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId!=undefined) {
    userSocketMap[userId] = socket.id;
  }

  io.emit('getOnlineUsers', Object.keys(userSocketMap));


  socket.on('disconnect', () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    }
  });
});

export { app, server, io };
