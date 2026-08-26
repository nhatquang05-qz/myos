import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/api.js';

export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;

  constructor(message: string, statusCode = 400, errorCode = 'BAD_REQUEST') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    const errorResponse: ApiResponse = {
      success: false,
      message: err.message,
      errorCode: err.errorCode,
    };
    res.status(err.statusCode).json(errorResponse);
    return;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const serverErrorResponse: ApiResponse = {
    success: false,
    message: isProduction ? 'Internal Server Error' : err.message,
    errorCode: 'INTERNAL_SERVER_ERROR',
  };

  res.status(500).json(serverErrorResponse);
};