import express from 'express'
import { userAuth } from "../middlewares/auth.js"
import { checkAuth, updateProfile } from '../Controllers/userController.js';


const profileRouter=express.Router();

profileRouter.get("/check",userAuth,checkAuth)
profileRouter.post("/upadteprofile",userAuth,updateProfile)

export default profileRouter;