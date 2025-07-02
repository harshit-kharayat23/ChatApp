import express from 'express';
import http from 'http';
import {Server} from 'socket.io'
 

const app=express();


const server=http.createServer(app);


const io=new Server({
    cors:{
        origin:'http//localhost:5173',

    }
})

io.on("connection",(socket)=>{

    console.log("New user connected: ",socket.id)



})


export {app,server,io};