import { Router } from 'express';
import { gradeController } from '../controllers/gradeController.js';
import { gpaController } from '../controllers/gpaController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createGradeSchema,
  updateGradeSchema,
  gradeIdParamSchema,
  subjectIdParamSchema,
} from '../validators/gradeValidators.js';

const router = Router();

// Toàn bộ routes yêu cầu xác thực JWT
router.use(requireAuth);

// Direct Grade Entity endpoints
router.get('/:id', (req, res, next) => {
  const parsed = gradeIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Grade ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  gradeController.getGradeById(req, res, next);
});

router.patch('/:id', validateRequest(updateGradeSchema), (req, res, next) => {
  const parsed = gradeIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Grade ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  gradeController.updateGrade(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  const parsed = gradeIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Grade ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  gradeController.deleteGrade(req, res, next);
});

export default router;