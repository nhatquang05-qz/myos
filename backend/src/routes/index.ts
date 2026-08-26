import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import taskRoutes from './taskRoutes.js';

const apiRouter = Router();

// Infrastructure Routes
apiRouter.use(healthRoutes);

// Authentication Module
apiRouter.use('/auth', authRoutes);

// Tasks Module
apiRouter.use('/tasks', taskRoutes);

export default apiRouter;