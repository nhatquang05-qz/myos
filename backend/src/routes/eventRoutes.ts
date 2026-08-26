import { Router } from 'express';
import { eventController } from '../controllers/eventController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createEventSchema,
  updateEventSchema,
  eventQuerySchema,
  eventIdParamSchema,
} from '../validators/eventValidators.js';

const router = Router();

// Tất cả endpoints đều yêu cầu xác thực JWT
router.use(requireAuth);

router.get('/', (req, res, next) => {
  const parsed = eventQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || 'Query parameter không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  req.query = parsed.data as never;
  eventController.getEvents(req, res, next);
});

router.get('/:id', (req, res, next) => {
  const parsed = eventIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Event ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  eventController.getEventById(req, res, next);
});

router.post('/', validateRequest(createEventSchema), (req, res, next) => {
  eventController.createEvent(req, res, next);
});

router.patch('/:id', validateRequest(updateEventSchema), (req, res, next) => {
  const parsed = eventIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Event ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  eventController.updateEvent(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  const parsed = eventIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Event ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  eventController.deleteEvent(req, res, next);
});

export default router;