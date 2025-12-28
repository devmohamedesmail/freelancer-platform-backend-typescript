import Joi from "joi";




export const createCategorySchema = Joi.object({
  title_ar: Joi.string().min(2).max(100).required(),
  title_en: Joi.string().min(2).max(100).required(),
});

export const updateCategorySchema = Joi.object({
  title_ar: Joi.string().min(2).max(100).required(),
  title_en: Joi.string().min(2).max(100).required(),
});

export const getCategorySchema = Joi.object({
  id: Joi.number().integer().required()
});

export const deleteCategorySchema = Joi.object({
  id: Joi.number().integer().required()
});