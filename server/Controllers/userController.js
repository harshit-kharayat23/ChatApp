import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";


export const signUp = async (req, res) => {
  const { fullName, emailId, password} = req.body;

  try {
    if (!fullName || !emailId || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      emailId,
      password: hashedPassword,
    });
 
    const token = generateToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "Lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error: " + err.message,
    });
  }
};


export const login = async (req, res) => {
  const { emailId, password } = req.body;

  try {
    if (!emailId || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please sign up.",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password!",
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set to true in production
      sameSite: "Lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error: " + err.message,
    });
  }
};


export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully!",
  });
};


export const checkAuth = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};


export const updateProfile = async (req, res) => {
  try {
    const { photo, fullName, bio } = req.body;
    const userId = req.user._id;

    let updatedUser;

    if (!photo) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName, bio },
        { new: true }
      );
    } else {
      const uploadedImage = await cloudinary.uploader.upload(photo);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          fullName,
          bio,
          photo: uploadedImage.secure_url,
        },
        { new: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error: " + err.message,
    });
  }
};


export const getProfile=async(req,res)=>{

      const userId=req.user._id;
      try{
        const userDetails=await User.findById(userId).select("-password");
          if(!userDetails){
                return res.status(500).json({
                success:false,
                message:"User Details not found",
           })
          }
          res.status(200).json({
            success:true,
            user:userDetails,
          })

      }catch(err){
        res.status(500).json({
          success:false,
          message:"Error: "+err.message,
        })
      }

      


}