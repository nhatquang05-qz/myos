import { Router } from 'express';
import { transactionController } from '../controllers/transactionController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionQuerySchema,
  transactionSummaryQuerySchema,
  transactionIdParamSchema,
} from '../validators/transactionValidators.js';

const router = Router();

// Tất cả endpoints đều yêu cầu xác thực JWT
router.use(requireAuth);

router.get('/summary', (req, res, next) => {
  const parsed = transactionSummaryQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || 'Query parameter không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  req.query = parsed.data as never;
  transactionController.getSummary(req, res, next);
});

router.get('/categories', (req, res, next) => {
  transactionController.getCategories(req, res, next);
});

router.get('/', (req, res, next) => {
  const parsed = transactionQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || 'Query parameter không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  req.query = parsed.data as never;
  transactionController.getTransactions(req, res, next);
});

router.get('/:id', (req, res, next) => {
  const parsed = transactionIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Transaction ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  transactionController.getTransactionById(req, res, next);
});

router.post('/', validateRequest(createTransactionSchema), (req, res, next) => {
  transactionController.createTransaction(req, res, next);
});

router.patch('/:id', validateRequest(updateTransactionSchema), (req, res, next) => {
  const parsed = transactionIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Transaction ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  transactionController.updateTransaction(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  const parsed = transactionIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Transaction ID không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
    });
    return;
  }
  transactionController.deleteTransaction(req, res, next);
});

export default router;