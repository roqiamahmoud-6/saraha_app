import { conversationModel } from "../../db/models/conversationmodel.js"
import { messageModel } from "../../db/models/messagemodel.js"
import { create, createe, find, findall, findbyid } from "../../db/service/db.service.js"

export const createConversation =async(req,res,next)=>{
    try{
        const {messageId}=req.body
        const message=await findbyid({
            model:messageModel,
            id:messageId
        })
    if(!message?.conversation){
        throw new Error("not accepted to create conversation")
    }
    if(await find({
        model:conversationModel,
        condition:{messageId}
    })){
        throw new Error("conversation alreade exist")
    }
    const conv=await createe({
        model:conversationModel,
        data:{
            messageId,
            user1:req.user._id,
            user2:message.userId
        }
    })
    res.status(201).json({message:"created conversation successfully",conv})

    }catch(err){
         res.status(404).json({message:err.message,stack:err.stack})
    }
}

export const sendMessage =async(req,res,next)=>{
    try{
       const { content, _id } = req.body
       const conversation = await findbyid({
        model: conversationModel,
        id:_id
    })
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    if (String(req.user._id) !== String(conversation.user1) && String(req.user._id) !== String(conversation.user2)) {
         throw new Error("Unauthorized to send message")
    }
    const message = await createe({
      model: messageModel,
      data: {
         content,
         userId: conversation.user2,
         senderId: req.user._id,
         conversationId:_id
        }
    })
    res.status(201).json({message: "Message sent successfully",message})
    }catch(err){
         res.status(404).json({message:err.message,stack:err.stack})
    }
}

export const getConversationMessages = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const conversation = await findbyid({
      model: conversationModel,
      id: _id
    })

    if (!conversation) {
      throw new Error("Conversation not found");
    }
    if ( String(req.user._id) !== String(conversation.user1) &&String(req.user._id) !== String(conversation.user2)) {
      throw new Error("Unauthorized to view conversation messages");
    }
const messages= await findall({
    model:messageModel,
    condition:{ conversationId: _id },
    options:{
        sort:{ createdAt: 1 }
    }
})
    return res.status(200).json({message: "Conversation messages retrieved successfully", messages})

  } catch (err) {
   res.status(404).json({message:err.message,stack:err.stack})
  }
}