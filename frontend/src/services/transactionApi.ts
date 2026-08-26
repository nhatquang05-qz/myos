import api from './api';
import { ApiResponse } from '../types/api';
import {
  Transaction,
  TransactionSummary,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionFilterParams,
  TransactionListResponseData,
  TransactionSingleResponseData,
  TransactionSummaryResponseData,
  TransactionCategoriesResponseData,
} from '../types/transaction';

export const transactionApi = {
  async getTransactions(params?: TransactionFilterParams): Promise<TransactionListResponseData> {
    const res = await api.get<ApiResponse<TransactionListResponseData>>('/transactions', { params });
    return res.data.data!;
  },

  async getTransaction(id: string): Promise<Transaction> {
    const res = await api.get<ApiResponse<TransactionSingleResponseData>>(`/transactions/${id}`);
    return res.data.data!.transaction;
  },

  async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
    const res = await api.post<ApiResponse<TransactionSingleResponseData>>('/transactions', data);
    return res.data.data!.transaction;
  },

  async updateTransaction(id: string, data: UpdateTransactionRequest): Promise<Transaction> {
    const res = await api.patch<ApiResponse<TransactionSingleResponseData>>(`/transactions/${id}`, data);
    return res.data.data!.transaction;
  },

  async deleteTransaction(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/transactions/${id}`);
  },

  async getSummary(from?: string, to?: string): Promise<TransactionSummary> {
    const res = await api.get<ApiResponse<TransactionSummaryResponseData>>('/transactions/summary', {
      params: { from, to },
    });
    return res.data.data!.summary;
  },

  async getCategories(): Promise<string[]> {
    const res = await api.get<ApiResponse<TransactionCategoriesResponseData>>('/transactions/categories');
    return res.data.data!.categories;
  },
};