
import { create, find, findall, findbyid, findByIdAndUpdate } from "../../db/service/db.service.js"
import { usermodel } from "../../db/models/usermodel.js"
import { messageModel } from "../../db/models/messagemodel.js"
import { Decrypt, Encrypt } from "../../db/common/security/encryption.js"
import { eventEmitter } from "../../db/common/utilites/event .js"
import { requestAcceptedTemplate, requestRejectedTemplate, requestSenderIdentityTemplate } from "../../db/common/utilites/otpTemplete.js"
import { sendEmail } from "../../db/common/utilites/sendMail.js"

 export const createMessage= async(req,res,next)=>{
    try{
       const {content,userId,senderId}=req.body
       if(!content&&!req.files?.length){throw new Error("you must send any thing content or image ")}
       const user =await find({
        model:usermodel,
        condition:{
            _id:userId
        }
       })
       if(!user){throw new Error("user not exist ")}
       const paths=[]
       if(req?.files?.length){
           for (const image of req.files){
            paths.push(image.path)
           }
       }
       await create({
        model:messageModel,
        data:{content:Encrypt(content),attachments:paths,userId,senderId}
       })
       res.status(201).json({message:"message sent successfully"})
    }catch(err){
        res.status(404).json({message:err.message,stack:err.stack})
    }
 }

 export const getallMessages= async(req,res,next)=>{
    try{
       const messages=await findall({
        model:messageModel,
        condition:{userid:req.user._id},
       })
       if(!messages.length){throw new Error(" not found messages 😔")}
         const decryptedMessages = messages.map(message => ({
          ...message.toObject(),
           content: Decrypt(message.content)
        }));
       res.status(200).json(decryptedMessages)

    }catch(err){
        res.status(404).json({message:err.message,stack:err.stack})
    }
 }

 export const request_Sender_Identity= async(req,res,next)=>{
    try{
      const {_id}=req.body
      const message =await findbyid ({
         model:messageModel,
         id:_id
      })
      if(!message){
         throw new Error("message not found")
      }
      const sender=await find({
         model:usermodel,
         condition:{
            _id:message.senderId
         },
         projection:{
            password:0,
            phone:0,
            provider:0
         }
      })
      if (!sender) {
        throw new Error("sender not found");
      }
      if(message?.status=="new"){
           await sendEmail({
           to:sender.email,
           subject:"request sender identity",
           html:requestSenderIdentityTemplate(_id)
             })
         await findByIdAndUpdate({
         model:messageModel,
         id:_id,
         updateData:{
           status:"pending"
        }
   })
   return res.status(200).json({message:"sent email to sender successfully to requst identity"})
      }else if(message?.status=="accepted"){
         return res.status(200).json(sender)
      }else if(message?.status=="rejected"){
         throw new Error("sender doesnot allow to show his identity")
      }else {
         throw new Error("request was pending")
      }

    }catch(err){
        res.status(404).json({message:err.message,stack:err.stack})
    }
 }

 export const getAllRequests= async(req,res,next)=>{
    try{
    const messages =await findall({
      model:messageModel,
      condition:{
         senderId:req.user._id,
         status:"pending"
      }
   })
   if(!messages.length){throw new Error(" not found requests 😔")}
         const decryptedMessages = messages.map(message => ({
          ...message.toObject(),
           content: Decrypt(message.content)
        }));
       res.status(200).json(decryptedMessages)
    }catch(err){
        res.status(404).json({message:err.message,stack:err.stack})
    }
 }

 export const acceptORreject= async(req,res,next)=>{
    try{
    const {_id,status}=req.body
    const message=await findbyid({
      model:messageModel,
      id:_id
    })
    if(!message){throw new Error ("message not exist")}
    const receiver=await findbyid({
      model:usermodel,
      id:message.userId
    })
    if(!receiver){throw new Error("receiver not exist")}

    if(status=="accepted"){
      await sendEmail({
         to:receiver.email,
         subject:`request Accepted`,
         html:requestAcceptedTemplate(_id)
      })
      await findByIdAndUpdate({
         model:messageModel,
         id:_id,
         updateData:{
            status:"accepted",
            conversation:"true"
         }
      }
   )
    }else if(status=="rejected"){
        await sendEmail({
         to:receiver.email,
         subject:`request rejected`,
         html:requestRejectedTemplate(_id)
      })
      await findByIdAndUpdate({
         model:messageModel,
         id:_id,
         updateData:{
            status:"rejected"
         }
      })
    }else{
      throw new Error("you must send accepted or rejected") 
    }
    return res.status(200).json("done")
    }catch(err){
        res.status(404).json({message:err.message,stack:err.stack})
    }
 }

