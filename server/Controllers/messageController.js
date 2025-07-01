
import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary, { uploadOnCloudinary } from '../lib/cloudinary.js'

import { io ,userSocketMap } from "../server.js";
import Conversation from "../models/Conversation.js";

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

            const senderId=req.user._id;

            const conversation=await Conversation.find({
               participants:{ $all:[
                    {
                        senderId,
                        targetId,
                    },
                    
                ]
            }
            }).populate("messages")

            if(!conversation){
            return res.status(400).json({
                message:"conversation not found"
            })
           
        }
         return res.status(200).json({
                data:conversation?.messages,
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
        const {text}=req.body;
        const {targetId}=req.params;
        const userId = req.user._id;

        let image;
        if(req.file){
            image=await uploadOnCloudinary(req.file.path)
        }

        let conversation=await Conversation.findOne({
            participants:{$all:[userId,targetId]}
        });

        
       let newMessage=await Message.create({
            senderId:userId,
            targetId,
            image,
            text,

       })
       if(!conversation){
             conversation=await Conversation.create({
                participants:[userId,targetId],
                messages:[newMessage._id]
             }) 
        }else{
            conversation.messages.push(newMessage._id)
            await conversation.save();
        }


       // emit  the new message to the reciever 's socket

    //    const targetSocketId=userSocketMap[targetId];
    //    if(targetSocketId){
    //         io.to(targetSocketId).emit("newMessage",newMessage)
    //    }
        


       res.status(201).json(({
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

