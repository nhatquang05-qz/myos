import { Request, Response, NextFunction } from 'express';
import { transactionService } from '../services/transactionService.js';
import { ApiResponse } from '../types/api.js';

export class TransactionController {
  async getTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = await transactionService.getTransactions(userId, req.query as never);
      const response: ApiResponse = {
        success: true,
        data,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getTransactionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const transaction = await transactionService.getTransactionById(id, userId);
      const response: ApiResponse = {
        success: true,
        data: { transaction },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const transaction = await transactionService.createTransaction(userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: { transaction },
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const transaction = await transactionService.updateTransaction(id, userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: { transaction },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await transactionService.deleteTransaction(id, userId);
      const response: ApiResponse = {
        success: true,
        message: 'Giao dịch đã được xóa thành công',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const summary = await transactionService.getSummary(userId, req.query as never);
      const response: ApiResponse = {
        success: true,
        data: { summary },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const categories = await transactionService.getCategories(userId);
      const response: ApiResponse = {
        success: true,
        data: { categories },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const transactionController = new TransactionController();