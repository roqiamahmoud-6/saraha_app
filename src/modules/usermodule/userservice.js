
import {OAuth2Client} from'google-auth-library';
import { create, find } from "../../db/db.service.js"
import { usermodel } from "../../db/models/usermodel.js"
import { Encrypt } from "../../security/encryption.js"
import { Comparee, Hash } from "../../security/hashing.js"
import  jwt  from "jsonwebtoken"
export const signup=async (req,res,next)=>{
   try{
     const {fname,lname,email,password,age,gender,phone}=req.body
   const emailExist= await find({
    model:usermodel,
    condition:{email}
   })
  
   if(emailExist){return res.status(409).json({message:"email already exist"})}
   const encryptedphone=Encrypt(phone)
   const hashhpass=await Hash(password) 

   const result = await create({
      model:usermodel,
      data:{fname,lname,email,password:hashhpass,age,gender,phone:encryptedphone}
   })
   res.status(201).json({message:"sign up done successfully"})
}catch(err){
   res.status(404).json({message:err.message,stack:err.stack})
}
}

export const signin=async (req,res,next)=>{
   try{
      const{email,password}=req.body
      const user=await find({
         model:usermodel,
         condition:{email,provider:"system"}
      })
      const access_token =jwt.sign({id:user.id,email:user.email},"roro2222",{
         expiresIn:120
      })
      const refresh_token =jwt.sign({id:user.id},"roro4444",{
         expiresIn:"4d"
      })
      
      if(!user){return res.status(400).json({message:"invalid email or not exist "})}
      const isMatch = await Comparee(
         password,
    user.password
    )
     if(!isMatch){return res.status(404).json({message:"invalid password"})}
     res.status(200).json({tokens:{access_token,refresh_token}})
   }catch(err){
    res.status(404).json({message:err.message,stack:err.stack})
   }
}

export const getprofile=async (req,res,next)=>{
   try{
      const{token}=req.body
      if (!token){
         return res.status(400).json({message:"token not found"})
      }
      const decoder= jwt.verify(token,"roro2222")

      const user=await find({
         model:usermodel,
         condition:{email:decoder.email,provider:"system"}
      })
     
      
      if(!user){return res.status(400).json({message:"user not exist"})}
      
     res.status(200).json(user)
   }catch(err){
    res.status(404).json({message:err.message,stack:err.stack})
   }
}

export const signupwithgmail=async (req,res,next)=>{
   try{
      const{idToken}=req.body
      const client = new OAuth2Client();
      async function verify() {
         const decoded = await client.verifyIdToken({
            idToken,
            audience:  "581869907690-0ih84n2ccr6n2v6964au5rii9tm24u1d.apps.googleusercontent.com" ,  
         });
         const { given_name ,  family_name , email ,picture ,email_verified } = decoded.getPayload();
         let user =await usermodel.findOne({email:email.toLowerCase()})
         if(!user){
            user = await usermodel.create({
               fname:given_name,
               lname:family_name,
               email ,
               profileimage:picture,
               isconfirmed:email_verified,
               provider:"google"
            })
         }
          const access_token =jwt.sign({id:user.id,email:user.email},"roro2222",{
         expiresIn:120
      })
      const refresh_token =jwt.sign({id:user.id},"roro4444",{
         expiresIn:"4d"
      })
     res.status(200).json({tokens:{access_token , refresh_token}})
  
}
verify().catch(console.error);
   }catch(err){
    res.status(404).json({message:err.message,stack:err.stack})
   }
}   
