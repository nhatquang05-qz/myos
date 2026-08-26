import { Request, Response } from 'express';
import { checkDatabaseConnection } from '../config/database.js';

export const getHealthStatus = async (_req: Request, res: Response): Promise<void> => {
  const isDbConnected = await checkDatabaseConnection();

  if (isDbConnected) {
    res.status(200).json({
      success: true,
      message: 'MyOS API is running',
      database: 'connected'
    });
    return;
  }

  res.status(503).json({    
    success: false,
    message: 'Database connection failed',
    database: 'disconnected'
  });
};