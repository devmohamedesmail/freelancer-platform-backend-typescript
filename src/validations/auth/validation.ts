import Joi from "joi";



export const createAuthSchema = Joi.object({
   name: Joi.string().min(3).max(30).required(),
   identifier: Joi.string().min(3).max(30).required(),
   password: Joi.string().min(6).required(),
    role_id: Joi.number().integer().required()
});



export const loginAuthSchema = Joi.object({
   identifier: Joi.string().min(3).max(30).required(),
   password: Joi.string().min(6).required()
});