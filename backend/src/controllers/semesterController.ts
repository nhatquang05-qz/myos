import { Request, Response, NextFunction } from 'express';
import { semesterService } from '../services/semesterService.js';
import { ApiResponse } from '../types/api.js';

export class SemesterController {
  async getSemesters(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const semesters = await semesterService.getSemesters(userId);
      const response: ApiResponse = {
        success: true,
        data: { semesters },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getSemesterById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const semester = await semesterService.getSemesterById(id, userId);
      const response: ApiResponse = {
        success: true,
        data: { semester },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createSemester(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const semester = await semesterService.createSemester(userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: { semester },
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateSemester(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const semester = await semesterService.updateSemester(id, userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: { semester },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteSemester(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await semesterService.deleteSemester(id, userId);
      const response: ApiResponse = {
        success: true,
        message: 'Học kỳ đã được xóa thành công',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const semesterController = new SemesterController();