import express from 'express'
import { userAuth } from "../middlewares/auth.js"
import { checkAuth, getProfile, updateProfile } from '../Controllers/userController.js';


const profileRouter=express.Router();

profileRouter.get("/check",userAuth,checkAuth)
profileRouter.put("/updateProfile",userAuth,updateProfile)
profileRouter.get("/getProfile",userAuth,getProfile);

export default profileRouter;