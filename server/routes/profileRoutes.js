import express from 'express'
import { userAuth } from "../middlewares/auth.js"
import { checkAuth, getProfile, updateProfile } from '../Controllers/userController.js';
import { upload } from '../middlewares/multer.js';


const profileRouter=express.Router();

profileRouter.get("/check",userAuth,checkAuth)
profileRouter.put("/updateProfile",userAuth,upload.single("photo"),updateProfile)
profileRouter.get("/getProfile",userAuth,getProfile);

export default profileRouter;