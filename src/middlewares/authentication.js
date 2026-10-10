import jwt from "jsonwebtoken"
import { findbyid } from "../db/db.service.js"
import { usermodel } from "../db/models/usermodel.js"
export const authntication =async (req,res,next)=>{
   const {authorization}=req.headers
   if(!authorization){
    return res.status(401).json ({message:"token not exist"})
   }
   const decoded = jwt.verify(authorization,"roro2222")
   if (!decoded?.id){return res.status(404).json({message:"invalid token"})}
   const user = await findbyid({
    model:usermodel,
    id:decoded.id
   })
    if(!user){ return res.status(404).json ({message:"user not exist"})}
   req.user=user
   next()

}