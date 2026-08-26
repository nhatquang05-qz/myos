import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { ApiResponse } from './types/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Base healthcheck endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const response: ApiResponse<{ status: string; timestamp: string }> = {
    success: true,
    data: {
      status: 'UP',
      timestamp: new Date().toISOString(),
    },
  };
  res.status(200).json(response);
});

// Global error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[MyOS Backend] Server running at http://localhost:${PORT}`);
});

export default app;