import { Router } from 'express';
import healthRoutes from './healthRoutes.js';

const apiRouter = Router();

// Infrastructure / Health routes
apiRouter.use(healthRoutes);

export default apiRouter;