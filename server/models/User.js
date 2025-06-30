import mongoose from 'mongoose'

const userSchema= new mongoose.Schema({

    emailId:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },

    fullName:{
        type:String,
        required:true,
    },
    photo:{
        type:String,
        default:""
    },
    bio:{
        type:String,

    }


},{timestamps:true})


const User=mongoose.model("User",userSchema)

export default User;