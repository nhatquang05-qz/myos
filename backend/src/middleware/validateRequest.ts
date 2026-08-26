import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { ApiResponse } from '../types/api.js';

export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstIssue = error.issues[0];
        const response: ApiResponse = {
          success: false,
          message: firstIssue?.message || 'Dữ liệu không hợp lệ',
          errorCode: 'VALIDATION_ERROR',
        };
        res.status(400).json(response);
        return;
      }
      next(error);
    }
  };
};