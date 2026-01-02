import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { createAuthSchema, loginAuthSchema } from '../../validations/auth/validation.js';
import { prisma } from '../../lib/prisma.js';
import { generateToken } from '../../utility/auth.js';
import { sendMail } from '../../services/mail..js';


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

      const { name, email, phone, password, role_id } = value;

      // 🔍 check if user exists by email or phone
      const orConditions = [] as any[]; // Type assertion to satisfy TS

      if (email) orConditions.push({ email });
      if (phone) orConditions.push({ phone });

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: orConditions.length ? (orConditions as any) : undefined,
        },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email or phone already exists",
        });
      }


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
          email: email ?? null,
          phone: phone ?? null,
          password: hashedPassword,
          role_id: role_id ?? defaultRole.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
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

      const { email, phone, password } = value;
      console.log(email, phone, password);

      if (!email && !phone) {
        return res.status(400).json({
          success: false,
          message: 'Email or phone is required',
        });
      }

      // 🔹 بناء where array بشكل صحيح
      const whereConditions = [];
      if (email) whereConditions.push({ email });
      if (phone) whereConditions.push({ phone });

      if (whereConditions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Email or phone is required',
        });
      }

      // 🔹 جلب المستخدم مع الحقول الأساسية + password
      const user = await prisma.user.findFirst({
        where: { OR: whereConditions },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role_id: true,
          password: true, // 🔹 مهم جدًا
          role: { select: { id: true, role: true } },
        },
      });

      // 🔹 تحقق أن المستخدم موجود وأن لديه password
      if (!user || !user.password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // 🔐 تحقق من كلمة المرور
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // 🔑 توليد التوكن
      const token = generateToken(user.id);

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
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
      const { userId, name, email, phone, currentPassword, newPassword } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID is required",
        });
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          password: true, // 🔹 مهم للتحقق من currentPassword
          role_id: true,
          role: { select: { id: true, role: true } },
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const updateData: any = {};

      // Update name
      if (name) updateData.name = name;

      // Update email
      if (email && email !== user.email) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "This email is already taken",
          });
        }
        updateData.email = email;
      }

      // Update phone
      if (phone && phone !== user.phone) {
        const existingUser = await prisma.user.findUnique({ where: { phone } });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "This phone is already taken",
          });
        }
        updateData.phone = phone;
      }

      // Update password
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            message: "Current password is required to set a new password",
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

      // Apply update
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role_id: true,
          role: { select: { id: true, role: true } },
        },
      });

      return res.status(200).json({
        success: true,
        user: updatedUser,
      });

    } catch (error: any) {
      return res.status(500).json({
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
          email: true,
          phone: true,
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





  /**
   * Foget Password
   * 
   */


  static forgetPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Generate a new password
      const newPassword = Math.random().toString(36).slice(-8);

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // update the new password in the database
      await prisma.user.update({
        where: { email: email },
        data: { password: hashedPassword },
      });

      // send the new password to the user's email

      await sendMail(
        email,
        "كلمة المرور الجديدة",
        `مرحباً، كلمة المرور الجديدة الخاصة بك هي: ${newPassword}\nيرجى تغييرها بعد تسجيل الدخول.`
      );

      return res.status(200).json({
        success: true,
        message: "تم إرسال كلمة المرور الجديدة إلى بريدك الإلكتروني",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "حدث خطأ أثناء إعادة تعيين كلمة المرور",
      });
    }
  };


}

export default AuthController;
