import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { createAuthSchema, loginAuthSchema } from '../../validations/auth/validation.js';
import { prisma } from '../../lib/prisma.js';
import { generateToken } from '../../utility/auth.js';

class AuthController {

  /**
   * Register a new user
   * @param req 
   * @param res 
   * @returns 
   * 
   */
  static register = async (req: Request, res: Response) => {
    try {
      const { error, value } = createAuthSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(d => d.message),
        });
      }

      const { name, identifier, password, role_id } = value;

      // 🔍 check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { identifier },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this identifier already exists',
        });
      }

      // 🔍 default role
      const defaultRole = await prisma.role.findUnique({
        where: { role: 'user' },
      });

      if (!defaultRole) {
        return res.status(500).json({
          success: false,
          message: 'Default role not found',
        });
      }

      // 🔐 hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ create user
      const newUser = await prisma.user.create({
        data: {
          name,
          identifier,
          password: hashedPassword,
          role_id: role_id ?? defaultRole.id,
        },
        select: {
          id: true,
          name: true,
          identifier: true,
          role_id: true,
          createdAt: true,
          role: {
            select: {
              id: true,
              role: true,
            },
          },
        },
      });

      // 🔑 generate token
      const token = generateToken(newUser.id);



      return res.status(201).json({
        success: true,
        user: newUser,
        token,
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



  /**
   *  Login user
   * @param req 
   * @param res 
   * @returns 
   */
  static login = async (req: Request, res: Response) => {
    try {
      // ✅ validate input

      const { error, value } = loginAuthSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(d => d.message),
        });
      }

      const { identifier, password } = value;

      // 🔍 find user with relations
      const user = await prisma.user.findUnique({
        where: { identifier },
        include: {
          role: {
            select: { 
              id: true,
              role: true 
            },
          },
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // 🔐 check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // 🔑 generate token
      const token = generateToken(user.id);

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          identifier: user.identifier,
          role_id: user.role_id,
          role: user.role,
        },
        token,
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



  /**
   * Logout user
   * @param req 
   * @param res 
   */
  static logout = async (req: Request, res: Response) => {
    try {
      // In JWT stateless, logout handled client-side
      res.status(200).json({
        success: true,
        message: "Logout successful. Please remove the token from client storage.",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



  /**
   * update user
   * @param req 
   * @param res 
   * @returns 
   */
  static update = async (req: Request, res: Response) => {
    try {
      const { userId, name, identifier, currentPassword, newPassword } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID is required",
        });
      }

      // Find user
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const updateData: any = {};

      if (name) updateData.name = name;

      if (identifier && identifier !== user.identifier) {
        const existingUser = await prisma.user.findUnique({ where: { identifier } });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "This identifier is already taken",
          });
        }
        updateData.identifier = identifier;
      }

      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            message: "Current password is required to set new password",
          });
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
          return res.status(400).json({
            success: false,
            message: "Current password is incorrect",
          });
        }

        if (newPassword.length < 6) {
          return res.status(400).json({
            success: false,
            message: "New password must be at least 6 characters long",
          });
        }

        updateData.password = await bcrypt.hash(newPassword, 10);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          identifier: true,
          role: true,
        },
      });

      res.status(200).json({
        success: true,
        user: updatedUser,
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Delete user account
   * @param req 
   * @param res 
   * @returns 
   */
  static destroy = async (req: Request, res: Response) => {
    try {
      const { userId, password } = req.body;

      if (!userId || !password) {
        return res.status(400).json({
          success: false,
          message: "User ID and password are required",
        });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Password is incorrect",
        });
      }

      await prisma.user.delete({ where: { id: userId } });

      res.status(200).json({
        success: true,
        message: "User account deleted successfully",
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };




  /**
   * Get user profile
   * @param req 
   * @param res 
   * @returns 
   */
  static getProfile = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID is required",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: {
          id: true,
          name: true,
          identifier: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        user,
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



}

export default AuthController;
