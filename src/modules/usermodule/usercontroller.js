import { Router } from "express";
import { getprofile, Refresh_token, signin, signup, signupwithgmail } from "./userservice.js";
import { authntication } from "../../middlewares/authentication.js";
import { authorization } from "../../middlewares/authorization.js";
import { validate } from "../../middlewares/validation.js";
import { refreshTokenSchema, signupschema } from "./user.validation.js";
import { multerLocal } from "../../middlewares/multer.js";


export const userRouter=Router()


userRouter.post ("/signup",multerLocal("user").single("image"),validate(signupschema),signup)
userRouter.post ("/refreshtoken",validate(refreshTokenSchema),Refresh_token)
userRouter.post ("/signup/gmail",signupwithgmail)
userRouter.post ("/signin",signin)
userRouter.post ("/profile",authntication,authorization(["admin","user"]),getprofile)
