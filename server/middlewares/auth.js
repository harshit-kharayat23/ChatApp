import jwt from "jsonwebtoken";
import User from "../models/User.js";
import "dotenv/config";

export const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies; 
    console.log("Cookies received:", req.cookies);
    console.log("Token value:", req.cookies.token);


    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Token" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
        return res.status(401).json({
      success: false,
      message: err.name === "JsonWebTokenError" ? "Invalid token" : err.message,
      
    });

  }
};
