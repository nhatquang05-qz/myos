import { PaginationMeta } from './task';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string | null;
  transactionDate: string;
  createdAt: string;
}

export interface ExpenseByCategoryItem {
  category: string;
  total: number;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  expenseByCategory: ExpenseByCategoryItem[];
}

export interface TransactionListResponseData {
  transactions: Transaction[];
  pagination: PaginationMeta;
}

export interface TransactionSingleResponseData {
  transaction: Transaction;
}

export interface TransactionSummaryResponseData {
  summary: TransactionSummary;
}

export interface TransactionCategoriesResponseData {
  categories: string[];
}

export interface CreateTransactionRequest {
  type: TransactionType;
  category: string;
  amount: number;
  description?: string | null;
  transactionDate: string;
}

export interface UpdateTransactionRequest {
  type?: TransactionType;
  category?: string;
  amount?: number;
  description?: string | null;
  transactionDate?: string;
}

export interface TransactionFilterParams {
  type?: TransactionType;
  category?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  limit?: number;
}