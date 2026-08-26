import { Request, Response } from 'express';
import { ApiResponse } from '../types/api.js';

export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    errorCode: 'ROUTE_NOT_FOUND',
  };
  res.status(404).json(response);
};