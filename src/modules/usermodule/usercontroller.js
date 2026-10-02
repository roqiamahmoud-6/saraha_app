import { Router } from "express";
import { getprofile, signin, signup, signupwithgmail } from "./userservice.js";

export const userRouter=Router()


userRouter.post ("/signup",signup)
userRouter.post ("/signup/gmail",signupwithgmail)
userRouter.post ("/signin",signin)
userRouter.post ("/profile",getprofile)
