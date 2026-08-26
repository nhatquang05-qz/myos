import { Request, Response, NextFunction } from 'express';
import { subjectService } from '../services/subjectService.js';
import { ApiResponse } from '../types/api.js';

export class SubjectController {
  async getSubjectsBySemester(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { semesterId } = req.params;
      const subjects = await subjectService.getSubjectsBySemester(semesterId, userId);
      const response: ApiResponse = {
        success: true,
        data: { subjects },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getSubjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const subject = await subjectService.getSubjectById(id, userId);
      const response: ApiResponse = {
        success: true,
        data: { subject },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { semesterId } = req.params;
      const subject = await subjectService.createSubject(semesterId, userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: { subject },
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const subject = await subjectService.updateSubject(id, userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: { subject },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await subjectService.deleteSubject(id, userId);
      const response: ApiResponse = {
        success: true,
        message: 'Môn học đã được xóa thành công',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const subjectController = new SubjectController();