import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import taskRoutes from './taskRoutes.js';
import noteRoutes from './noteRoutes.js';
import eventRoutes from './eventRoutes.js';
import transactionRoutes from './transactionRoutes.js';

const apiRouter = Router();

// Infrastructure Routes
apiRouter.use(healthRoutes);

// Authentication Module
apiRouter.use('/auth', authRoutes);

// Tasks Module
apiRouter.use('/tasks', taskRoutes);

// Notes Module
apiRouter.use('/notes', noteRoutes);

// Calendar Events Module
apiRouter.use('/events', eventRoutes);

// Finance Transactions Module
apiRouter.use('/transactions', transactionRoutes);

export default apiRouter;