// src/middleware/auth.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../types';

const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        message: 'You are not logged in. Please log in to get access.'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      res.status(401).json({
        message: 'The user belonging to this token no longer exists.'
      });
      return;
    }

    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Invalid token. Please log in again.'
    });
  }
};

const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: 'You do not have permission to perform this action'
      });
      return;
    }
    next();
  };
};

export { protect, restrictTo };