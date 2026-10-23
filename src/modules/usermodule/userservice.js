import {hash, randomInt, randomUUID}from "crypto"
import {OAuth2Client} from'google-auth-library';
import { create, createe, find, findbyid, findByIdAndUpdate, findoneAndUPDATe } from "../../db/service/db.service.js"
import { usermodel } from "../../db/models/usermodel.js"
import { Decrypt, Encrypt } from "../../db/common/security/encryption.js"
import { Comparee, Hash } from "../../db/common/security/hashing.js"
import  jwt  from "jsonwebtoken"
import multer from 'multer';
import { deleteKey, getValue, incr, setValue, ttl } from "../../db/service/redis.servise.js";
import { generateOtp, sendEmail } from "../../db/common/utilites/sendMail.js";
import { otpTemplate, resetPasswordTemplate, twoStepTemplate } from "../../db/common/utilites/otpTemplete.js";


export const signup=async (req,res,next)=>{
   try{
     const {fname,lname,email,password,age,gender,phone,roles,twoStepVerifiction}=req.body
     const emailExist= await find({
        model:usermodel,
        condition:{email}
      })
      
      if(emailExist){return res.status(409).json({message:"email already exist"})}
      const otp = await generateOtp()
      const hashOtp=await Hash(otp)
      await setValue({
        key:`otp:${email}`,
        value:hashOtp,
        ex:60*10
      })
      await setValue({
        key:`otp:max:${email}`,
        value:1,
        ex:60*6
      })
      await sendEmail({
        to:email,
        subject:"confirm Email",
        html:otpTemplate(otp)
      })
   const encryptedphone=Encrypt(phone)
   const hashhpass=await Hash(password) 
   // console.log(req.files)
   const paths=[]
   for(const file of req.files.images){
      paths.push(file.path)
   }
   const result = await create({
      model:usermodel,
      data:{fname,lname,email,roles,password:hashhpass,age,gender,phone:encryptedphone,profileimage:req.files.image[0].path,coverImages:paths,twoStepVerifiction:twoStepVerifiction === "true"}
   })
   
  
   res.status(201).json({message:"sign up done successfully"})
}catch(err){
   res.status(404).json({message:err.message,stack:err.stack})
}
}

export const confirmEmail=async (req,res,next)=>{
   try{
    const {email,otp}=req.body 
  
  const otpp = await getValue({ key:`otp:${email}`});
  if (!otpp) {
    throw new Error("OTP expired or not found ")
}

const isValid = await Comparee(otp, otpp);

if (!isValid) {
    return res.status(400).json({
        message: "Invalid OTP"
    });
}
    const user=await findoneAndUPDATe({
      model:usermodel,
      data:{email,
         isconfirmed:false
      },
      updateData:{isconfirmed:true}
    })
    if(!user){
      throw new Error(" user not exist ")
    }
    await deleteKey({key:`otp:${email}`})
    res.status(200).json({message:"done"})
}catch(err){
   res.status(404).json({message:err.message,stack:err.stack})
}
}

export const resendOtp=async (req,res,next)=>{
   try{
    const {email}=req.body 
    const isblocked=await ttl({key:`otp:block:${email}`}) 
    if(isblocked>0){
       throw new Error(`you have been blocked`)
    }
    if (await ttl({key:`otp:${email}`})>0){
      throw new Error(`you can resend otp after${await ttl({key:`otp:${email}`})} `)
    }
    if(isblocked<0){
       
       if(Number(await getValue({key:`otp:max:${email}`}))>=3){
          await setValue({
           key:`otp:block:${email}`,
           value:1,
           ex:60*20
         })
         throw new Error("you have exceded the number of resend otp")
       }
    }
    const user = await find({
      model:usermodel,
      condition:{
         email,
         isconfirmed:false
      }
    })
    if(!user){
      throw new Error("user not exist or already confirmed")
    }
    const otp = await generateOtp()
      const hashOtp=await Hash(otp)
      await setValue({
        key:`otp:${email}`,
        value:hashOtp,
        ex:60*10
      })
      await sendEmail({
        to:email,
        subject:"confirm Email",
        otp:otp
      })
      await incr({key:`otp:max:${email}`})
    res.status(200).json({message:"done"})
}catch(err){
   res.status(404).json({message:err.message,stack:err.stack})
}
}

export const signin=async (req,res,next)=>{
   try{
      const{email,password}=req.body
      const tokenId=randomUUID()
      const user=await find({
         model:usermodel,
         condition:{email,provider:"system"}
      })
      if(!user){throw new Error("invalid email or not exist ")}
      
      if(await getValue({ key:`maxTrial:${email}`})>=5){
         throw new Error("you banned for 5 mins")}
      const isMatch = await Comparee( password, user.password )
      if(!isMatch){
      await incr({key:`maxTrial:${email}`,ex:60*5})
       throw new Error("invalid password")
      }
      if(user?.twoStepVerifiction){
         const otp = await generateOtp()
         const otpValue=await Hash(otp)
         await setValue({
            key:`otpforVerifiction:${email}`,
            value:otpValue,
            ex:60*5
         })
          await sendEmail({
        to:email,
        subject:"2-step-verifiction",
        html:twoStepTemplate(otp)
      })
      return res.status(200).json({message:"you recieved code for verification in your email "})
      }

      const access_token =jwt.sign({id:user.id,email:user.email},"roro2222",{
         expiresIn:120,
         jwtid:tokenId
      })
      const refresh_token =jwt.sign({id:user.id},"roro4444",{
         expiresIn:"4d",
         jwtid:tokenId
      })
      await deleteKey({ key:`maxTrial:${email}`})
     res.status(200).json({tokens:{access_token,refresh_token}})
   }catch(err){
    res.status(404).json({message:err.message,stack:err.stack})
   }
}

export const signInWithVerification=async (req,res,next)=>{
   try{
    const {otp,email}=req.body
    const tokenId=randomUUID()
    const user=await find({
         model:usermodel,
         condition:{email,twoStepVerifiction:true}
      })
   if (!user) {
       throw new Error("User not found or verification is disabled");
   }
    const otpvalue=await getValue({key:`otpforVerifiction:${email}`})
      if (!otpvalue) {
       throw new Error("OTP expired or not found");
      }
    if(!await Comparee(otp,otpvalue)){
      throw new Error("invalid otp")
    }
    await deleteKey({key:`otpforVerifiction:${email}`})
    const access_token =jwt.sign({id:user.id,email:user.email},"roro2222",{
         expiresIn:120,
         jwtid:tokenId
      })
      const refresh_token =jwt.sign({id:user.id},"roro4444",{
         expiresIn:"4d",
         jwtid:tokenId
      })
      res.status(200).json({tokens:{access_token,refresh_token}})
   }catch(err){
    res.status(404).json({message:err.message,stack:err.stack})
   }
}

export const getprofile=async (req,res,next)=>{
   try{
     const user = req.user
     const decrypted=Decrypt(user.phone)
     res.status(200).json({"your profile":{ 
      fname:user.fname,
      lname:user.lname,
      email:user.email,
      phone:decrypted,
      gender:user.gender,
      age:user.age}
     
     } )
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

export const Refresh_token= async(req,res,next)=>{
   const {refresh_token}=req.headers
  if(!refresh_token){
      return res.status(401).json ({message:"token not exist"})
     }
     const decoded = jwt.verify(refresh_token,"roro4444")
     if (!decoded?.id){return res.status(404).json({message:"invalid token"})}
     const user = await findbyid({
      model:usermodel,
      id:decoded.id
     })
      if(!user){ return res.status(404).json ({message:"user not exist"})}
       
      const access_token =jwt.sign({id:user.id,email:user.email},"roro2222",{
         expiresIn:120
      })
      res.status(200).json({access_token})

}


export const shareProfile= async(req,res,next)=>{
  try{
   const{id}=req.params
    const user = await findbyid({
      model :usermodel,
      id:id,
      options:{password:0,provider:0,isconfirmed:0,createdAt:0,updatedAt:0,__v:0}
    })
    if(!user){
       return res.status(404).json({message:"user not found"})
      }
      const decrypted=Decrypt(user.phone)
      user.phone = decrypted
    res .status(200).json(user)
  }catch(err){
   res.status(404).json({message:err.message,stack:err.stack})
}
  

}


export const updateProfile= async(req,res,next)=>{
  try{
  const user = req.user;
    const { fname, lname, age, phone } = req.body;

    const updateQuery = {}

    if (fname !== undefined) {updateQuery.fname = fname}
    if (lname !== undefined) {updateQuery.lname = lname}
    if (age !== undefined) {updateQuery.age = age}
    if (phone !== undefined) {
      updateQuery.phone = Encrypt(phone);
    }
   const updated= await findByIdAndUpdate({
      model:usermodel,
      id:user._id,
      updateData:updateQuery
   })
   res.status(200).json(updated)
  }catch(err){
   res.status(500).json({message:err.message,stack:err.stack})
}
}


export const logout= async(req,res,next)=>{
  try{
   const{ flag }=req.query
   if(flag=="all"){
       req.user.changeCardintialAT=new Date()
      await req.user.save()
      return res.status(200).json({message: "logout for all devices done successfully"})
   }else{
      await setValue({
         key:`revoke token :: ${req.user._id} :: ${req.decoded.jti}`,
         value:`${req.decoded.jti}`,
         ex:req.decoded.exp - Math.floor(Date.now()/1000)
      })
      return res.status(200).json({message: "Logout successfully"})
   }
  }catch(err){
   res.status(500).json({message:err.message,stack:err.stack})
}
}

export const forgetPassword= async(req,res,next)=>{
   try{
      const {email}=req.body
      const user = await find({
        model:usermodel,
        condition:{
           email
        }
      })
      if(!user){
        throw new Error("user not exist ")
      }
      const isblocked=await ttl({key:`otpforgetPass:block:${email}`}) 
    if(isblocked>0){
       throw new Error(`you have been blocked`)
    }
    if (await ttl({key:`otpforgetPass:${email}`})>0){
      throw new Error(`you can resend otp after${await ttl({key:`otpforgetPass:${email}`})} `)
    }
    if(isblocked<0){
       
       if(Number(await getValue({key:`otpforgetPass:max:${email}`}))>=3){
          await setValue({
           key:`otpforgetPass:block:${email}`,
           value:1,
           ex:60*20
         })
         throw new Error("you have exceded the number of resend otp")
       }
    }
    const otp = await generateOtp()
      const hashOtp=await Hash(otp)
      await setValue({
        key:`otpforgetPass:${email}`,
        value:hashOtp,
        ex:60*10
      })
      await sendEmail({
        to:email,
        subject:"Forget password",
        html:resetPasswordTemplate(otp)
      })
      await incr({key:`otpforgetPass:max:${email}`})
    res.status(200).json({message:"done"})
  }catch(err){
   res.status(500).json({message:err.message,stack:err.stack})
}
}

export const resetPassword= async(req,res,next)=>{
   try{
      const {newPASS,otp,email}=req.body
      const otpValue=await getValue({ key:`otpforgetPass:${email}`})
      if (!otpValue) {
         throw new Error("OTP expired or not found ")
      }
      if(!await Comparee(otp,otpValue)){
         throw new Error("invalid otp")
      }
     const user= await findoneAndUPDATe({
         model:usermodel,
         data: { email },
         updateData:{
            password:await Hash(newPASS),
            changeCardintialAT:new Date()
         }
      })
      if (!user) {
    throw new Error("user not exist");
} 
  await deleteKey({ key: `otpforgetPass:${email}` });
    res.status(200).json({message:"done"})
  }catch(err){
   res.status(500).json({message:err.message,stack:err.stack})
}
}

