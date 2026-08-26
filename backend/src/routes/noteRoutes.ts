import { Router } from 'express';
import { noteController } from '../controllers/noteController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createNoteSchema,
  updateNoteSchema,
  noteQuerySchema,
  noteIdParamSchema,
} from '../validators/noteValidators.js';

const router = Router();

// Tất cả endpoints đều yêu cầu xác thực JWT
router.use(requireAuth);

router.get('/', (req, res, next) => {
  const parsed = noteQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || 'Query parameter không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  req.query = parsed.data as never;
  noteController.getNotes(req, res, next);
});

router.get('/:id', (req, res, next) => {
  const parsed = noteIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Note ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  noteController.getNoteById(req, res, next);
});

router.post('/', validateRequest(createNoteSchema), (req, res, next) => {
  noteController.createNote(req, res, next);
});

router.patch('/:id', validateRequest(updateNoteSchema), (req, res, next) => {
  const parsed = noteIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Note ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  noteController.updateNote(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  const parsed = noteIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Note ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  noteController.deleteNote(req, res, next);
});

export default router;