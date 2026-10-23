import jwt from "jsonwebtoken"
import { find, findbyid } from "./../../service/db.service.js"
import { usermodel } from "../../models/usermodel.js"
import { getValue } from "../../service/redis.servise.js"
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

    if (user?.changeCardintialAT?.getTime() > decoded?.iat * 1000){
      throw new Error("you logout you must login again")
    }
    if(await getValue({
      key:`revoke token :: ${user._id} :: ${decoded.jti}`
    })){
       throw new Error("token expire from your device please login again")
    }
   req.user=user
   req.decoded=decoded
   next()

}