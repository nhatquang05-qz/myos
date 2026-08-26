import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/database.js';
import {
  TransactionRecord,
  TransactionFilterParams,
  TransactionSummary,
  TransactionType,
} from '../types/transaction.js';

export class TransactionRepository {
  async findTransactionsByUser(
    userId: string,
    filters: TransactionFilterParams
  ): Promise<{ transactions: TransactionRecord[]; total: number }> {
    const conditions: string[] = ['user_id = ?'];
    const params: unknown[] = [userId];

    if (filters.type) {
      conditions.push('type = ?');
      params.push(filters.type);
    }

    if (filters.category) {
      conditions.push('category = ?');
      params.push(filters.category);
    }

    if (filters.from && filters.to) {
      conditions.push('transaction_date BETWEEN ? AND ?');
      params.push(filters.from, filters.to);
    } else if (filters.from) {
      conditions.push('transaction_date >= ?');
      params.push(filters.from);
    } else if (filters.to) {
      conditions.push('transaction_date <= ?');
      params.push(filters.to);
    }

    if (filters.search) {
      conditions.push('(description LIKE ? OR category LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const whereClause = conditions.join(' AND ');

    // 1. Total count
    const countSql = `SELECT COUNT(*) as total FROM transactions WHERE ${whereClause}`;
    const [countRows] = await pool.query<RowDataPacket[]>(countSql, params);
    const total = Number(countRows[0]?.total || 0);

    // 2. Paginated rows
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const dataSql = `
      SELECT id, user_id, type, category, amount, description, transaction_date, created_at
      FROM transactions
      WHERE ${whereClause}
      ORDER BY transaction_date DESC, created_at DESC
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, limit, offset];
    const [rows] = await pool.query<RowDataPacket[]>(dataSql, dataParams);

    return {
      transactions: rows as TransactionRecord[],
      total,
    };
  }

  async findTransactionByIdAndUser(id: string, userId: string): Promise<TransactionRecord | null> {
    const query = `
      SELECT id, user_id, type, category, amount, description, transaction_date, created_at
      FROM transactions
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [id, userId]);
    if (rows.length === 0) return null;
    return rows[0] as TransactionRecord;
  }

  async createTransaction(tx: {
    id: string;
    userId: string;
    type: TransactionType;
    category: string;
    amount: number;
    description?: string | null;
    transactionDate: string;
  }): Promise<void> {
    const query = `
      INSERT INTO transactions (id, user_id, type, category, amount, description, transaction_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query<ResultSetHeader>(query, [
      tx.id,
      tx.userId,
      tx.type,
      tx.category,
      tx.amount,
      tx.description || null,
      tx.transactionDate,
    ]);
  }

  async updateTransaction(
    id: string,
    userId: string,
    updates: {
      type?: TransactionType;
      category?: string;
      amount?: number;
      description?: string | null;
      transactionDate?: string;
    }
  ): Promise<boolean> {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (updates.type !== undefined) {
      fields.push('type = ?');
      params.push(updates.type);
    }
    if (updates.category !== undefined) {
      fields.push('category = ?');
      params.push(updates.category);
    }
    if (updates.amount !== undefined) {
      fields.push('amount = ?');
      params.push(updates.amount);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      params.push(updates.description);
    }
    if (updates.transactionDate !== undefined) {
      fields.push('transaction_date = ?');
      params.push(updates.transactionDate);
    }

    if (fields.length === 0) return true;

    const query = `UPDATE transactions SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
    const [result] = await pool.query<ResultSetHeader>(query, [...params, id, userId]);
    return result.affectedRows > 0;
  }

  async deleteTransaction(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM transactions WHERE id = ? AND user_id = ?';
    const [result] = await pool.query<ResultSetHeader>(query, [id, userId]);
    return result.affectedRows > 0;
  }

  async getSummaryByUser(userId: string, from?: string, to?: string): Promise<TransactionSummary> {
    const conditions: string[] = ['user_id = ?'];
    const params: unknown[] = [userId];

    if (from && to) {
      conditions.push('transaction_date BETWEEN ? AND ?');
      params.push(from, to);
    } else if (from) {
      conditions.push('transaction_date >= ?');
      params.push(from);
    } else if (to) {
      conditions.push('transaction_date <= ?');
      params.push(to);
    }

    const whereClause = conditions.join(' AND ');

    // 1. Overall Income, Expense & Balance
    const summarySql = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) as total_expense
      FROM transactions
      WHERE ${whereClause}
    `;
    const [summaryRows] = await pool.query<RowDataPacket[]>(summarySql, params);
    const totalIncome = Number(summaryRows[0]?.total_income || 0);
    const totalExpense = Number(summaryRows[0]?.total_expense || 0);
    const balance = totalIncome - totalExpense;

    // 2. Expense by Category
    const categorySql = `
      SELECT category, COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE ${whereClause} AND type = 'EXPENSE'
      GROUP BY category
      ORDER BY total DESC
    `;
    const [categoryRows] = await pool.query<RowDataPacket[]>(categorySql, params);
    const expenseByCategory = categoryRows.map((r) => ({
      category: r.category as string,
      total: Number(r.total || 0),
    }));

    return {
      totalIncome,
      totalExpense,
      balance,
      expenseByCategory,
    };
  }

  async findDistinctCategoriesByUser(userId: string): Promise<string[]> {
    const query = `
      SELECT DISTINCT category 
      FROM transactions 
      WHERE user_id = ? 
      ORDER BY category ASC
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);
    return rows.map((r) => r.category as string);
  }
}

export const transactionRepository = new TransactionRepository();