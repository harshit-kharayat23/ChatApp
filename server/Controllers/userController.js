import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcrypt"
import cloudinary from '../lib/cloudinary.js'

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

       const token=generateToken(newUser._id)
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
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:3 * 24 * 60 * 60 * 1000,

        })


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

export const logout=async(req,res)=>{


    res.cookie("token",{
        maxAge:0,
        httpOnly:true,
    })
    return res.status(200).json({
    success: true,
    message: "Logged out successfully!",
  });



}

// if user is authenticated or not

export const checkAuth=(req,res)=>{

    res.json({
        success:true,
        user:req.user,
    })


}



// update user profile details


export const updateProfile=async(req,res)=>{

        try{

            const {photo,fullName,bio}=req.body;
            const userId=req.user._id;
            let updatedUser;
            if(!profile){
                    updatedUser=await User.findByIdAndUpdate(userId,{ 
                        fullName,
                        bio
                    },{new:true})
            }else{
                const upload=await cloudinary.uploader.upload(photo)

                updatedUser=await User.findByIdAndUpdate(userId,{
                    photo:upload.secure_url,
                    bio,
                    fullName,
                },{new:true})
            }

            return res.status(200).json({
                success:true,
                message:"Profile Updated Successfully!",
                user:updatedUser,
            })


        }catch(err){
                return res.status(500).json({
            success:false,
            message:"Error: "+err.message
        })
        }



}

