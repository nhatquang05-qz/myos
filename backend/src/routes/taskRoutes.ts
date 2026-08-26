import { Router } from 'express';
import { taskController } from '../controllers/taskController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  taskIdParamSchema,
} from '../validators/taskValidators.js';

const router = Router();

// Tất cả endpoints đều yêu cầu xác thực JWT
router.use(requireAuth);

router.get('/', (req, res, next) => {
  const parsed = taskQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || 'Query parameter không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  req.query = parsed.data as never;
  taskController.getTasks(req, res, next);
});

router.get('/:id', (req, res, next) => {
  const parsed = taskIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Task ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  taskController.getTaskById(req, res, next);
});

router.post('/', validateRequest(createTaskSchema), (req, res, next) => {
  taskController.createTask(req, res, next);
});

router.patch('/:id', validateRequest(updateTaskSchema), (req, res, next) => {
  const parsed = taskIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Task ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  taskController.updateTask(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  const parsed = taskIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Task ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  taskController.deleteTask(req, res, next);
});

export default router;