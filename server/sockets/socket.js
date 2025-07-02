import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

// initialize Socket.IO server with CORS config
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',  // your frontend origin
    methods: ['GET', 'POST']
  }
});

// In-memory map: { userId: socketId }
export const userSocketMap = {};

// handle new connections
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId!=undefined) {
    // associate userId to the connected socket
    userSocketMap[userId] = socket.id;
  }

  // emit updated online user list to all connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  // handle client disconnect
  socket.on('disconnect', () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    }
  });
});

export { app, server, io };
