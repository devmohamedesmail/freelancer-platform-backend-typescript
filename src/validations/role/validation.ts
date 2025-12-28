import Joi from "joi";



export const createRoleSchema = Joi.object({
  role: Joi.string().min(3).max(30).required().messages({
    'string.base': `"role" should be a type of 'text'`,
    'string.empty': `"role" cannot be an empty field`,
    'string.min': `"role" should have a minimum length of {#limit}`,
    'string.max': `"role" should have a maximum length of {#limit}`,
    'any.required': `"role" is a required field`
  })
});



export const updateRoleSchema = Joi.object({
  role: Joi.string().min(3).max(30).messages({
    'string.base': `"role" should be a type of 'text'`,
    'string.empty': `"role" cannot be an empty field`,
    'string.min': `"role" should have a minimum length of {#limit}`,
    'string.max': `"role" should have a maximum length of {#limit}`,
  })
});