import { Router } from "express";
import { acceptORreject, createMessage, getallMessages, getAllRequests, request_Sender_Identity  } from "./messageservice.js";
import { multerLocal } from "../../db/common/middlewares/multer.js";
import { authntication } from "../../db/common/middlewares/authentication.js";
export const messageRouter=new Router({strict:true})


messageRouter.post ("/createMessage",multerLocal({custompath:"ImagesUpload",ext:["image/jpeg"]}).array("images",5),createMessage)
messageRouter.get ("/getMessages",authntication,getallMessages)
messageRouter.get ("/request_Sender_Identity",request_Sender_Identity)
messageRouter.get ("/getAllRequests",authntication,getAllRequests) 
messageRouter.get ("/acceptORreject",authntication,acceptORreject) 
