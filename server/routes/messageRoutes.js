import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { getAllUsers, sendMessage } from '../Controllers/messageController.js';
import { getMessages, markMessageAsSeen } from '../Controllers/messageController.js';
import { upload } from '../middlewares/multer.js';


const messageRouter=express.Router();


messageRouter.get("/users",userAuth,getAllUsers);
messageRouter.get("/getMessages/:targetId",userAuth,getMessages);
messageRouter.put("/markSeen/:id",userAuth,markMessageAsSeen);
messageRouter.post("/sendMessage/:targetId",userAuth,upload.single("image"),sendMessage)

export default messageRouter;