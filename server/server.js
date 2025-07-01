import express from 'express'
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';

import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import profileRouter from './routes/profileRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

// create express app 
const app=express();
const server=http.createServer(app);

// initialize socket .io server

export const io=new Server(server,{
    cors:{
        origin:"*"
    }
})

export const userSocketMap={}; // online users

io.on("connection",(socket)=>{

    const userId=socket.handshake.query.userId;
    console.log("user connected ",userId)
    if(userId)
        userSocketMap[userId]=socket.id;


    io.emit("getOnlineUsers",Object.keys(userSocketMap))


    socket.on("disconnect",()=>{
        console.log("User disconnected",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })

})


// middlewares setup
app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true                 
}));






app.get("/api/auth",(req,res)=>{
        res.send("Server is live")
});

app.use("/api/auth", userRouter);       
app.use("/api/auth", profileRouter);    
app.use("/api/auth", messageRouter); 



const PORT=process.env.PORT_NUMBER || 3000;

connectDB().then(()=>{
    console.log("Database connected")
    server.listen(PORT,()=>{
    console.log(`server listening to port ${PORT}`)
})

}).catch(()=>{
    console.log("Database did not connected!")
})

