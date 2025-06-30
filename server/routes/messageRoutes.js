import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { getAllUsers, sendMessage } from '../Controllers/messageController.js';
import { getMessages, markMessageAsSeen } from '../Controllers/messageController.js';


const messageRouter=express.Router();


messageRouter.get("/users",userAuth,getAllUsers);
messageRouter.get("/getMessages/:targetId",userAuth,getMessages);
messageRouter.put("/markSeen/:id",userAuth,markMessageAsSeen);
messageRouter.post("/sendMessage/:targetId",userAuth,sendMessage)

export default messageRouter;