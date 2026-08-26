import { Request, Response, NextFunction } from 'express';
import { eventService } from '../services/eventService.js';
import { ApiResponse } from '../types/api.js';

export class EventController {
  async getEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const events = await eventService.getEvents(userId, req.query as never);
      const response: ApiResponse = {
        success: true,
        data: { events },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const event = await eventService.getEventById(id, userId);
      const response: ApiResponse = {
        success: true,
        data: { event },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const event = await eventService.createEvent(userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: { event },
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const event = await eventService.updateEvent(id, userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: { event },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await eventService.deleteEvent(id, userId);
      const response: ApiResponse = {
        success: true,
        message: 'Sự kiện đã được xóa thành công',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const eventController = new EventController();