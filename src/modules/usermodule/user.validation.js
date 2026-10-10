import Joi from "joi"
export const signupschema={
   body: Joi.object({
              fname:Joi.string().required(),
              lname:Joi.string().required(),
              email:Joi.string().required(),
              gender:Joi.string().required(),
              age:Joi.number().required(),
              phone:Joi.string().required(),
              password:Joi.string().required(),
              roles:Joi.string().required()
 }).required()
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
