import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import {
    createSubcategorySchema,
    updateSubcategorySchema,
} from '../../validations/subcategories/validation.js';

export default class SubcategoryController {

    // Get all subcategories
    static index = async (req: Request, res: Response) => {
        try {
            const subcategories = await prisma.subcategory.findMany({
                include: { category: true }, 
                orderBy: { createdAt: 'desc' },
            });

            res.status(200).json({ 
                success: true, 
                data: subcategories 
            });
        } catch (error: any) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    };

    // Get subcategory by ID
    static find = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const subcategory = await prisma.subcategory.findUnique({
                where: { id },
                include: { category: true },
            });

            if (!subcategory) {
                return res.status(404).json({ success: false, error: 'Subcategory not found' });
            }

            res.status(200).json({ success: true, data: subcategory });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    };

    // Create subcategory
    static create = async (req: Request, res: Response) => {
        try {
            const { error, value } = createSubcategorySchema.validate(req.body, {
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

            const { title_ar, title_en, category_id } = value;

            const subcategory = await prisma.subcategory.create({
                data: { title_ar, title_en, category_id },
            });

            res.status(201).json({ success: true, data: subcategory });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    };

    // Update subcategory
    static update = async (req: Request, res: Response) => {
        try {
            const { error, value } = updateSubcategorySchema.validate(req.body, {
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
            const { title_ar, title_en, category_id } = value;

            const subcategory = await prisma.subcategory.findUnique({ where: { id } });
            if (!subcategory) {
                return res.status(404).json({ success: false, error: 'Subcategory not found' });
            }

            const updatedSubcategory = await prisma.subcategory.update({
                where: { id },
                data: { title_ar, title_en, category_id },
            });

            res.status(200).json({ success: true, data: updatedSubcategory });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    };

    // Delete subcategory
    static destroy = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const subcategory = await prisma.subcategory.findUnique({ where: { id } });
            if (!subcategory) {
                return res.status(404).json({ success: false, error: 'Subcategory not found' });
            }

            await prisma.subcategory.delete({ where: { id } });

            res.status(200).json({ success: true });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    };
}
