import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/taskService.js';
import { ApiResponse } from '../types/api.js';

export class TaskController {
  async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = await taskService.getTasks(userId, req.query as never);
      const response: ApiResponse = {
        success: true,
        data,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const task = await taskService.getTaskById(id, userId);
      const response: ApiResponse = {
        success: true,
        data: { task },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const task = await taskService.createTask(userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: { task },
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const task = await taskService.updateTask(id, userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: { task },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await taskService.deleteTask(id, userId);
      const response: ApiResponse = {
        success: true,
        message: 'Nhiệm vụ đã được xóa thành công',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const taskController = new TaskController();