import express from 'express'
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';

import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import profileRouter from './routes/profileRoutes.js';

// create express app 
const app=express();
const server=http.createServer(app);


// middlewares setup
app.use(express.json({limit:"4mb"}));
app.use(cookieParser())
app.use(cors());





app.get("/api/status",(req,res)=>{
        res.send("Server is live")
});

app.use("/api/status",userRouter)
app.use("/api/status",profileRouter)


const PORT=process.env.PORT_NUMBER || 3000;

connectDB().then(()=>{
    console.log("Database connected")
    server.listen(PORT,()=>{
    console.log(`server listening to port ${PORT}`)
})

}).catch(()=>{
    console.log("Database did not connected!")
})

