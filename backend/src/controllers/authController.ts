import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';
import { ApiResponse } from '../types/api.js';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await authService.register(req.body);
      const response: ApiResponse = {
        success: true,
        data,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await authService.login(req.body);
      const response: ApiResponse = {
        success: true,
        data,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await authService.getCurrentUser(userId);
      const response: ApiResponse = {
        success: true,
        data: { user },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();