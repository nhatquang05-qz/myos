export type TransactionType = 'INCOME' | 'EXPENSE';

export interface TransactionRecord {
  id: string;
  user_id: string;
  type: TransactionType;
  category: string;
  amount: string | number;
  description: string | null;
  transaction_date: Date | string;
  created_at: Date;
}

export interface TransactionResponse {
  id: string;
  userId: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string | null;
  transactionDate: string;
  createdAt: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  expenseByCategory: { category: string; total: number }[];
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