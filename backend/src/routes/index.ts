import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';

const apiRouter = Router();

// Infrastructure Routes
apiRouter.use(healthRoutes);

// Authentication Module Routes
apiRouter.use('/auth', authRoutes);

export default apiRouter;