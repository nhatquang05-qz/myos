import { Router } from 'express';
import { gpaController } from '../controllers/gpaController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { semesterIdParamSchema, subjectIdParamSchema } from '../validators/gradeValidators.js';

const router = Router();

router.use(requireAuth);

// Cumulative GPA summary of authenticated user
router.get('/cumulative', (req, res, next) => {
  gpaController.getCumulativeGpa(req, res, next);
});

// Semester GPA summary
router.get('/semesters/:semesterId', (req, res, next) => {
  const parsed = semesterIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Semester ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  gpaController.getSemesterGpa(req, res, next);
});

// Subject Grade Summary with weights and calculation
router.get('/subjects/:subjectId', (req, res, next) => {
  const parsed = subjectIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Subject ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  gpaController.getSubjectGradeSummary(req, res, next);
});

export default router;