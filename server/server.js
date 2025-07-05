import express from 'express'
import "dotenv/config";
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import profileRouter from './routes/profileRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { app, server } from './sockets/socket.js';






// middlewares setup
app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true                 
}));






app.get("/",(req,res)=>{
        res.send("Server is live")
});

app.use("/", userRouter);       
app.use("/", profileRouter);    
app.use("/", messageRouter); 



const PORT=process.env.PORT_NUMBER || 3000;

connectDB().then(()=>{
    console.log("Database connected")
    server.listen(PORT,()=>{
    console.log(`server listening to port ${PORT}`)
})

}).catch(()=>{
    console.log("Database did not connected!")
})

