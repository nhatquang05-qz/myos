import { Router } from 'express';
import { semesterController } from '../controllers/semesterController.js';
import { subjectController } from '../controllers/subjectController.js';
import { gpaController } from '../controllers/gpaController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createSemesterSchema,
  updateSemesterSchema,
  semesterIdParamSchema,
} from '../validators/semesterValidators.js';
import {
  createSubjectSchema,
  semesterSubjectParamSchema,
} from '../validators/subjectValidators.js';
import { semesterIdParamSchema as gpaSemesterParamSchema } from '../validators/gradeValidators.js';

const router = Router();

router.use(requireAuth);

router.get('/', (req, res, next) => {
  semesterController.getSemesters(req, res, next);
});

router.get('/:id', (req, res, next) => {
  const parsed = semesterIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Semester ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  semesterController.getSemesterById(req, res, next);
});

router.post('/', validateRequest(createSemesterSchema), (req, res, next) => {
  semesterController.createSemester(req, res, next);
});

router.patch('/:id', validateRequest(updateSemesterSchema), (req, res, next) => {
  const parsed = semesterIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Semester ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  semesterController.updateSemester(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  const parsed = semesterIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Semester ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  semesterController.deleteSemester(req, res, next);
});

// Nested Subjects Routes inside Semester
router.get('/:semesterId/subjects', (req, res, next) => {
  const parsed = semesterSubjectParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Semester ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  subjectController.getSubjectsBySemester(req, res, next);
});

router.post('/:semesterId/subjects', validateRequest(createSubjectSchema), (req, res, next) => {
  const parsed = semesterSubjectParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Semester ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  subjectController.createSubject(req, res, next);
});

// Nested GPA Route inside Semester
router.get('/:semesterId/gpa', (req, res, next) => {
  const parsed = gpaSemesterParamSchema.safeParse(req.params);
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

export default router;