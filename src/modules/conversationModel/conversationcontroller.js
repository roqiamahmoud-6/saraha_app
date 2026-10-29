import { Router } from "express";
import { createConversation, getConversationMessages, sendMessage } from "./conversationservice.js";
import { authntication } from "../../db/common/middlewares/authentication.js";
export const conversationRouter = Router({strict:true})

conversationRouter.post ("/createConversation",authntication,createConversation)
conversationRouter.post ("/sendMessage",authntication,sendMessage)
conversationRouter.get ("/getConversationMessages/:_id",authntication,getConversationMessages)