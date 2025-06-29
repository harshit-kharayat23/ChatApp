//middleWares
import jwt from "jsonwebtoken"
import User from "../models/User.js";

export const userAuth=async(req,res,next)=>{

    try{

        const {token}=req.cookies;

       const decoded=jwt.verify(token,process.env.JWT_SECRET)
       const user=await User.findById(decoded.userId).select("-password");
       if(!user){
            return res.status(500).json({
            success:false,
            message:"Invalid Token"
        })
       }

       req.user=user;
       next();


    }catch(err){
        return res.status(500).json({
            success:false,
            message:"AUTH ERROR: "+err.message
        })
    }




}


