import { randomUUID } from 'crypto';
import { transactionRepository, TransactionRepository } from '../repositories/transactionRepository.js';
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionQueryInput,
  TransactionSummaryQueryInput,
} from '../validators/transactionValidators.js';
import {
  TransactionResponse,
  TransactionRecord,
  TransactionSummary,
} from '../types/transaction.js';
import { AppError } from '../middleware/errorHandler.js';

export class TransactionService {
  constructor(private txRepo: TransactionRepository) {}

  private mapTransactionToResponse(record: TransactionRecord): TransactionResponse {
    let dateStr = '';
    if (record.transaction_date instanceof Date) {
      dateStr = record.transaction_date.toISOString().split('T')[0];
    } else {
      dateStr = String(record.transaction_date).split('T')[0];
    }

    return {
      id: record.id,
      userId: record.user_id,
      type: record.type,
      category: record.category,
      amount: Number(record.amount),
      description: record.description,
      transactionDate: dateStr,
      createdAt: new Date(record.created_at).toISOString(),
    };
  }

  async getTransactions(
    userId: string,
    query: TransactionQueryInput
  ): Promise<{
    transactions: TransactionResponse[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { transactions: records, total } = await this.txRepo.findTransactionsByUser(userId, query);
    const transactions = records.map((r) => this.mapTransactionToResponse(r));
    const limit = query.limit;
    const page = query.page;
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getTransactionById(id: string, userId: string): Promise<TransactionResponse> {
    const record = await this.txRepo.findTransactionByIdAndUser(id, userId);
    if (!record) {
      throw new AppError('Không tìm thấy giao dịch hoặc bạn không có quyền truy cập', 404, 'TRANSACTION_NOT_FOUND');
    }
    return this.mapTransactionToResponse(record);
  }

  async createTransaction(userId: string, input: CreateTransactionInput): Promise<TransactionResponse> {
    const txId = randomUUID();

    await this.txRepo.createTransaction({
      id: txId,
      userId,
      type: input.type,
      category: input.category,
      amount: input.amount,
      description: input.description,
      transactionDate: input.transactionDate,
    });

    return this.getTransactionById(txId, userId);
  }

  async updateTransaction(
    id: string,
    userId: string,
    input: UpdateTransactionInput
  ): Promise<TransactionResponse> {
    const existing = await this.txRepo.findTransactionByIdAndUser(id, userId);
    if (!existing) {
      throw new AppError('Không tìm thấy giao dịch hoặc bạn không có quyền truy cập', 404, 'TRANSACTION_NOT_FOUND');
    }

    const updated = await this.txRepo.updateTransaction(id, userId, input);
    if (!updated) {
      throw new AppError('Cập nhật giao dịch thất bại', 400, 'TRANSACTION_UPDATE_FAILED');
    }

    return this.getTransactionById(id, userId);
  }

  async deleteTransaction(id: string, userId: string): Promise<void> {
    const deleted = await this.txRepo.deleteTransaction(id, userId);
    if (!deleted) {
      throw new AppError('Không tìm thấy giao dịch hoặc bạn không có quyền truy cập', 404, 'TRANSACTION_NOT_FOUND');
    }
  }

  async getSummary(userId: string, query: TransactionSummaryQueryInput): Promise<TransactionSummary> {
    return this.txRepo.getSummaryByUser(userId, query.from, query.to);
  }

  async getCategories(userId: string): Promise<string[]> {
    const defaultCategories = [
      'Salary',
      'Food',
      'Transport',
      'Education',
      'Entertainment',
      'Shopping',
      'Bills',
      'Other',
    ];
    const userCategories = await this.txRepo.findDistinctCategoriesByUser(userId);
    const combined = Array.from(new Set([...defaultCategories, ...userCategories]));
    return combined.sort();
  }
}

export const transactionService = new TransactionService(transactionRepository);