import { Request, Response, NextFunction } from 'express';
import { gpaService } from '../services/gpaService.js';
import { ApiResponse } from '../types/api.js';

export class GpaController {
  async getSemesterGpa(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { semesterId } = req.params;
      const summary = await gpaService.getSemesterGpa(semesterId, userId);
      const response: ApiResponse = {
        success: true,
        data: { gpaSummary: summary },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getSubjectGradeSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { subjectId } = req.params;
      const summary = await gpaService.getSubjectGradeSummary(subjectId, userId);
      const response: ApiResponse = {
        success: true,
        data: { subjectSummary: summary },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getCumulativeGpa(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const summary = await gpaService.getCumulativeGpa(userId);
      const response: ApiResponse = {
        success: true,
        data: { cumulativeGpa: summary },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const gpaController = new GpaController();