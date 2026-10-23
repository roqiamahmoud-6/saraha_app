import { Router } from "express";
import { confirmEmail, forgetPassword, getprofile, logout, Refresh_token, resendOtp, resetPassword, shareProfile, signin, signInWithVerification, signup, signupwithgmail, updateProfile } from "./userservice.js";
import { authntication } from "../../db/common/middlewares/authentication.js";
import { authorization } from "../../db/common/middlewares/authorization.js";
import { validate } from "../../db/common/middlewares/validation.js";
import { refreshTokenSchema, shareprofileSchema, signupschema } from "./user.validation.js";
import { multerLocal } from "../../db/common/middlewares/multer.js";


export const userRouter=Router()


userRouter.post ("/signup" ,multerLocal({custompath:"user",ext:["image/jpeg"]}).fields([ { name: "image", maxCount: 1 },{ name: "images", maxCount: 2 }]),validate(signupschema),signup)
userRouter.post ("/refreshtoken",validate(refreshTokenSchema),Refresh_token)
userRouter.post ("/signup/gmail",signupwithgmail)
userRouter.post ("/signin",signin)
userRouter.post ("/signInWithVerification",signInWithVerification)
userRouter.post ("/profile",authntication,authorization(["admin","user"]),getprofile)
userRouter.post ("/shareProfile/:id",validate(shareprofileSchema),shareProfile)
userRouter.post ("/updateProfile",authntication,updateProfile)
userRouter.post ("/logout",authntication,logout)
userRouter.post ("/confirmEmail",confirmEmail)
userRouter.post ("/resendOtp",resendOtp)
userRouter.post ("/forgetPassword",forgetPassword)
userRouter.post ("/resetPassword",resetPassword)

