
import Joi from "joi"
export const generalRules ={
    email:Joi.string().email().required(),
     files: Joi.object({
        image: Joi.array().items(Joi.object()),
        images: Joi.array().items(Joi.object())
    })
}