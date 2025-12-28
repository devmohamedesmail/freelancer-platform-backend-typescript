import { prisma } from '../../lib/prisma.js';
import type { Request, Response } from 'express';

class SettingController {
  /**
   * Get all settings
   * @param req 
   * @param res 
   */
  static index = async (req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        orderBy: { key: 'asc' },
      });

      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };


  /**
   * Get public settings only
   * @param req 
   * @param res 
   */
  static getPublic = async (req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: { isPublic: true },
        orderBy: { key: 'asc' },
      });

      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };


  /**
   * Get setting by key
   * @param req 
   * @param res 
   * @returns 
   */
  static findByKey = async (req: Request, res: Response) => {
    try {
      const { key } = req.params;

      const setting = await prisma.setting.findUnique({ where: { key: key! } });

      if (!setting) {
        return res.status(404).json({
          success: false,
          message: "Setting not found",
        });
      }

      res.status(200).json({
        success: true,
        data: setting,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };


  /**
   * Get setting by ID
   * @param req 
   * @param res 
   * @returns 
   */
  static find = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const setting = await prisma.setting.findUnique({ where: { id } });

      if (!setting) {
        return res.status(404).json({
          success: false,
          message: "Setting not found",
        });
      }

      res.status(200).json({
        success: true,
        data: setting,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };


  /**
   * Create a new setting
   * @param req 
   * @param res 
   * @returns 
   */
  static create = async (req: Request, res: Response) => {
    try {
      const { key, value, type, description, isPublic } = req.body;

      if (!key || !value) {
        return res.status(400).json({
          success: false,
          message: "Key and value are required",
        });
      }

      const existingSetting = await prisma.setting.findUnique({ where: { key } });
      if (existingSetting) {
        return res.status(400).json({
          success: false,
          message: "Setting with this key already exists",
        });
      }

      const setting = await prisma.setting.create({
        data: {
          key,
          value,
          type: type || 'string',
          description,
          isPublic: isPublic ?? false,
        },
      });

      res.status(201).json({
        success: true,
        data: setting,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  /**
   * update a setting
   * @param req 
   * @param res 
   * @returns 
   */
  static update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { key, value, type, description, isPublic } = req.body;

      const setting = await prisma.setting.findUnique({ where: { id } });
      if (!setting) {
        return res.status(404).json({
          success: false,
          message: "Setting not found",
        });
      }

      if (key && key !== setting.key) {
        const existingSetting = await prisma.setting.findUnique({ where: { key } });
        if (existingSetting) {
          return res.status(400).json({
            success: false,
            message: "Setting with this key already exists",
          });
        }
      }

      const updatedSetting = await prisma.setting.update({
        where: { id },
        data: {
          key: key || setting.key,
          value: value || setting.value,
          type: type || setting.type,
          description: description !== undefined ? description : setting.description,
          isPublic: isPublic !== undefined ? isPublic : setting.isPublic,
        },
      });

      res.status(200).json({
        success: true,
        data: updatedSetting,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

 /**
  * Gelete a setting
  * @param req 
  * @param res 
  * @returns 
  */
  static destroy = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const setting = await prisma.setting.findUnique({ where: { id } });
      if (!setting) {
        return res.status(404).json({
          success: false,
          message: "Setting not found",
        });
      }

      await prisma.setting.delete({ where: { id } });

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

export default SettingController;
