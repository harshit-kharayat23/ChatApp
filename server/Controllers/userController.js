import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { uploadOnCloudinary } from "../lib/cloudinary.js";
import {validateUser} from '../middlewares/validate.js'

export const signUp = async (req, res) => {
  const { fullName, emailId, password } = req.body;

  try {
    if (!fullName || !emailId || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
    validateUser(req);
    

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

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "Lax",
    //   maxAge: 3 * 24 * 60 * 60 * 1000,
    // });

    // converting to plain object and removing password
    const newUserWithoutPass=newUser.toObject();
    delete newUserWithoutPass.password;

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      userData: newUserWithoutPass,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message:err.message,
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
     validateUser(req);

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

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false, // set to true in production
    //   sameSite: "Lax",
    //   maxAge: 3 * 24 * 60 * 60 * 1000,
    // });
    const newUserWithoutPass=user.toObject();
    delete newUserWithoutPass.password;

    return res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      userData:newUserWithoutPass,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
     message:err.message,
    });
  }
};

export const logout = async (req, res) => {
  // res.cookie("token", "", {
  //   httpOnly: true,
  //   expires: new Date(0),
  // });

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
    const { fullName, bio } = req.body;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const userId = req.user._id;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Prepare update data
    const updateData = { fullName, bio };
    if (image) updateData.photo = image;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      userData: updatedUser,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error: " + err.message,
    });
  }
};

export const getProfile = async (req, res) => {
  const userId = req.user._id;
  try {
    const userDetails = await User.findById(userId).select("-password");
    if (!userDetails) {
      return res.status(500).json({
        success: false,
        message: "User Details not found",
      });
    }
    res.status(200).json({
      success: true,
      userData: userDetails,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error: " + err.message,
    });
  }
};
