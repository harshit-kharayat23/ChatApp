import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        
    },
    bio: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
