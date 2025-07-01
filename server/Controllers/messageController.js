
import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from '../lib/cloudinary.js'

import { io ,userSocketMap } from "../server.js";

// get all users for side bar


export const  getAllUsers=async(req,res)=>{

        try{

            const userId=req.user._id;
            const filteredUsers=await User.find({_id:{$ne :userId}}).select('-password');
            const unseenMessages={};
            const promises=filteredUsers.map(async(user)=>{
                const messages=await Message.find({senderId:user._id ,targetId:userId ,seen:false})
                if(messages.length>0){
                    unseenMessages[user._id]=messages.length;
                }
            })
            await Promise.all(promises)
            return res.status(200).json({
                success:true,
                users:filteredUsers,
                unseenMessages,
            })


        }catch(err){
            return  res.status(501).json({
                success:false,
                message:"ERROR :"+err.message,
            })
        }

}


// get all messages for selected users

export const getMessages=async(req,res)=>{

    try{

            const {targetId}=req.params;

            const myId=req.user._id;

            const messages=await Message.find({
                $or:[
                    {
                        senderId:myId,
                        targetId:targetId,
                    },
                    {
                        senderId:targetId,
                        targetId:myId,
                    }
                ]
            })

            await Message.updateMany({
                senderId:myId,
                targetId:targetId,
            },{seen:true},{new:true}) 
            res.json({
                success:true,
                messages,
            })


    }catch(err){
        res.status(501).json({
                success:false,
                message:"ERROR :"+err.message,
            })

    }


}

// api to mark message as seen  using message id

export const markMessageAsSeen=async(req,res)=>{

    try{    
        const {id}=req.params;
        await Message.findByIdAndUpdate(id,{seen:true},{new:true})
        res.json({
            success:true,
        })



    }catch(err){
             res.status(501).json({
                success:false,
                message:"ERROR :"+err.message,
            })
    }




}


export const sendMessage=async(req,res)=>{

    try{
        const {text,image}=req.body;
        const targetId=req.params;
        const userId=req._id;
        let imageUrl;
        if(image){
            const response= await cloudinary.uploader.upload(photo);
            imageUrl=response.secure_url;

        }
       const newMessage=await Message.create({
            senderId:userId,
            targetId,
            image:imageUrl,
            text

       })

       // emit  the new message to the reciever 's socket

       const targetSocketId=userSocketMap[targetId];
       if(targetSocketId){
            io.to(targetSocketId).emit("newMessage",newMessage)
       }
        


       res.json(({
        success:true,
        newMessage,
       }))


    }catch(err){
          res.status(501).json({
                success:false,
                message:"ERROR :"+err.message,
            })
    }



}