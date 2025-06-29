import express from 'express';
import { login, logout, signUp } from '../Controllers/userController.js';

const userRouter=express.Router();


userRouter.post("/login",login);
userRouter.post("/signup",signUp);
userRouter.post("/logout",logout);

export default userRouter;