import { Request, Response, NextFunction } from 'express';

export const adminOnly = (req: any, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied - Admin only',
    });
  }
  next();
};