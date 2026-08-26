import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);

router.post('/login', validateRequest(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

router.get('/me', requireAuth, (req, res, next) =>
  authController.me(req, res, next)
);

export default router;