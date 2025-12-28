import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../../validations/categories/validation.js';

export default class CategoryController {
  /**
   * Get all categories
   * @param req 
   * @param res 
   */
  static index = async (req: Request, res: Response) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          subcategories: true,
        },
      });

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  /**
   * Create new category
   * @param req 
   * @param res 
   * @returns 
   */
  static create = async (req: Request, res: Response) => {
    try {
      const { error, value } = createCategorySchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details.map((d: any) => d.message),
        });
      }

      const { title_en, title_ar } = value;



      const category = await prisma.category.create({
        data: {
          title_ar,
          title_en,

        },
      });

      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  /**
   * 
   * Get category by ID
   * @param req
   * @param res
   * 
  */
  static find = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
        });
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  /**
   * Update category
   * @param req 
   * @param res 
   * @returns 
   */
  static update = async (req: Request, res: Response) => {
    try {
      const { error, value } = updateCategorySchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details.map((d: any) => d.message),
        });
      }

      const id = Number(req.params.id);
      const { title_ar, title_en } = value;

      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
        });
      }



      const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
          title_ar,
          title_en,
        },
      });

      res.status(200).json({
        success: true,
        data: updatedCategory,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  /**
   * Delete category
   */
  static destroy = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      await prisma.category.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };



}

