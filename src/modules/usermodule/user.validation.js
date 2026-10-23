import Joi from "joi"
import { generalRules } from "../../db/common/utilites/generalRules.js"
import { Types } from "mongoose"
export const signupschema={
   body: Joi.object({
              fname:Joi.string().required(),
              lname:Joi.string().required(),
              email:generalRules.email,
              gender:Joi.string().required(),
              age:Joi.number().required(),
              phone:Joi.string().required(),
              password:Joi.string().required(),
              twoStepVerifiction:Joi.boolean(),
              roles:Joi.string().required()
 }
).required(),
   files: generalRules.files
}
export const refreshTokenSchema={
   headers: Joi.object({
             "refresh_token":Joi.string().required(),
             "content-length":Joi.string().required(),
              "host":Joi.string().required(),
             "user-agent" :Joi.string().required(),
             "accept":Joi.string().required(),
              "accept-encoding":Joi.string().required(),
             "connection" :Joi.string().required(),
              "postman-token" :Joi.string().required()
 }).required()
}
export const shareprofileSchema={
   params:Joi.object({
      id:Joi.string().custom((value,helper)=>{
      return Types.ObjectId.isValid(value)?value:helper.message("invalid id")
   }).required()
}).required()
}
