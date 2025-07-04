import jwt from "jsonwebtoken";
import User from "../models/User.js";
import "dotenv/config";

export const userAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header only
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.name === "JsonWebTokenError" ? "Invalid token" : err.message,
    });
  }
};
