import { Request, Response, NextFunction } from 'express';
import { gradeService } from '../services/gradeService.js';
import { ApiResponse } from '../types/api.js';

export class GradeController {
  async getGradesBySubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { subjectId } = req.params;
      const grades = await gradeService.getGradesBySubject(subjectId, userId);
      const response: ApiResponse = {
        success: true,
        data: { grades },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getGradeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const grade = await gradeService.getGradeById(id, userId);
      const response: ApiResponse = {
        success: true,
        data: { grade },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createGrade(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { subjectId } = req.params;
      const grade = await gradeService.createGrade(subjectId, userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: { grade },
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateGrade(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const grade = await gradeService.updateGrade(id, userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: { grade },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteGrade(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await gradeService.deleteGrade(id, userId);
      const response: ApiResponse = {
        success: true,
        message: 'Điểm thành phần đã được xóa thành công',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const gradeController = new GradeController();