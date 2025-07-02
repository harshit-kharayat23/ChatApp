import mongoose from "mongoose";


const messageSchema=new mongoose.Schema({


        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },

        targetId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        text:{
            type:String,
            default:"",
              trim: true, 

        },
        image:{
            type:String,
            default:""
        },
        seen:{
            type:Boolean,
            default:false,
        }






},{timestamps:true})


const Message=mongoose.model("Message",messageSchema);

export default Message;