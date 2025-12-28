import Joi from "joi";

// Create Subcategory
export const createSubcategorySchema = Joi.object({
    title_ar: Joi.string().min(2).max(100).required(),
    title_en: Joi.string().min(2).max(100).required(),
    category_id: Joi.number().integer().required(), // ID of parent category
});

// Update Subcategory
export const updateSubcategorySchema = Joi.object({
    title_ar: Joi.string().min(2).max(100).required(),
    title_en: Joi.string().min(2).max(100).required(),
    category_id: Joi.number().integer().required(),
});

// Get Subcategory by ID
export const getSubcategorySchema = Joi.object({
    id: Joi.number().integer().required(),
});

// Delete Subcategory by ID
export const deleteSubcategorySchema = Joi.object({
    id: Joi.number().integer().required(),
});
