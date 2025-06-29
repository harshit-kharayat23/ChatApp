import express from 'express'
import "dotenv/config";
import cors from 'cors';
import http from 'http';

// create express app 
const app=express();
const server=http.createServer(app);


// middlewares setup
app.use(express.json({limit:"4mb"}));
app.use(cors());

app.use("/api/status",(req,res)=>{
        res.send("Server is live")
});

const PORT=process.env.PORT_NUMBER || 6000;

server.listen(PORT,()=>{
    console.log(`server listening to port ${PORT}`)
})