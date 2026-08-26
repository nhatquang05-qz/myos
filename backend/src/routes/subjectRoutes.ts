import { Router } from 'express';
import { subjectController } from '../controllers/subjectController.js';
import { gradeController } from '../controllers/gradeController.js';
import { gpaController } from '../controllers/gpaController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  updateSubjectSchema,
  subjectIdParamSchema,
} from '../validators/subjectValidators.js';
import {
  createGradeSchema,
  subjectIdParamSchema as gradeSubjectParamSchema,
} from '../validators/gradeValidators.js';

const router = Router();

router.use(requireAuth);

router.get('/:id', (req, res, next) => {
  const parsed = subjectIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Subject ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  subjectController.getSubjectById(req, res, next);
});

router.patch('/:id', validateRequest(updateSubjectSchema), (req, res, next) => {
  const parsed = subjectIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Subject ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  subjectController.updateSubject(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  const parsed = subjectIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Subject ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  subjectController.deleteSubject(req, res, next);
});

// Nested Grades Routes inside Subject
router.get('/:subjectId/grades', (req, res, next) => {
  const parsed = gradeSubjectParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Subject ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  gradeController.getGradesBySubject(req, res, next);
});

router.post('/:subjectId/grades', validateRequest(createGradeSchema), (req, res, next) => {
  const parsed = gradeSubjectParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Subject ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  gradeController.createGrade(req, res, next);
});

router.get('/:subjectId/summary', (req, res, next) => {
  const parsed = gradeSubjectParamSchema.safeParse(req.params);
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