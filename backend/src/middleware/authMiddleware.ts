import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { JwtUserPayload } from '../types/auth.js';
import { userRepository } from '../repositories/userRepository.js';
import { ApiResponse } from '../types/api.js';

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const response: ApiResponse = {
      success: false,
      message: 'Yêu cầu token xác thực hợp lệ',
      errorCode: 'UNAUTHORIZED',
    };
    res.status(401).json(response);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'Tài khoản xác thực không tồn tại',
        errorCode: 'UNAUTHORIZED',
      };
      res.status(401).json(response);
      return;
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatar_url,
    };

    next();
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn',
      errorCode: 'UNAUTHORIZED',
    };
    res.status(401).json(response);
  }
};