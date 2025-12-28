import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; 
   

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is missing'
      });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err, decoded) => {
        if (err) {
          return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
          });
        }

        req.user = decoded as { id: number; role: string }; // ✅ TypeScript هيقبلها
        next();
      }
    );

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};
