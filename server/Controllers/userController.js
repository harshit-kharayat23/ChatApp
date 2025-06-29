import { generateToken } from "../lib/utils";
import User from "../models/User";
import bcrypt from "bcrypt"

export const signUp=async(req,res)=>{

    const {fullName,email,password,bio}=req.body;

    try{
        if(!fullName || !email || !password || !bio){
            return res.status(500).json({
            success:false,
            message:"All Fields required!"
        })
        }

        const user=await User.findOne({email});
        if(user){
            return res.status(500).json({
            success:false,
            message:"User already Exists !please login!"
        })
        }

        const hashPass=await bcrypt.hash(password,10);


       let  newUser=new User({
            fullName,
            email,
            password:hashPass,
            bio,

       })

       await newUser.save();

       generateToken(newUser._id)
       return res.status(201).json({
            success:true,
            message:"Account Created",
            token,
            user,
        })


    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Error: "+err.message
        })
    }



}


export const login=async(req,res)=>{

      const {email,password}=req.body;
      try{
        if(!email || !password){
            return res.status(500).json({
            success:false,
            message:"All Fields required!"
        })
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(500).json("Please Sign Up!")
        }

        const isValidPass=await bcrypt.compare(password,user?.password)

        if(!isValidPass){
            return res.status(501).json({
                success:false,
                message:"Password is Incorrect!"
            })
        }
        const token=generateToken(user._id);
        res.co


        return res.status(201).json({
            success:true,
            message:"Logged In successfully!",
            user,
        })



      }catch(err){
        return res.status(500).json({
            success:false,
            message:"Error: "+err.message
        })
      }


}