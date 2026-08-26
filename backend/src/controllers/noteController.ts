import { Request, Response, NextFunction } from 'express';
import { noteService } from '../services/noteService.js';
import { ApiResponse } from '../types/api.js';

export class NoteController {
  async getNotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = await noteService.getNotes(userId, req.query as never);
      const response: ApiResponse = {
        success: true,
        data,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getNoteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const note = await noteService.getNoteById(id, userId);
      const response: ApiResponse = {
        success: true,
        data: { note },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const note = await noteService.createNote(userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: { note },
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const note = await noteService.updateNote(id, userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: { note },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await noteService.deleteNote(id, userId);
      const response: ApiResponse = {
        success: true,
        message: 'Ghi chú đã được xóa thành công',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const noteController = new NoteController();