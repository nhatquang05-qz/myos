import React from 'react';
import { TransactionSummary } from '../../types/transaction';
import { Card } from '../common/Card';
import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react';

interface FinanceSummaryProps {
  summary: TransactionSummary | null;
}

export const FinanceSummary: React.FC<FinanceSummaryProps> = ({ summary }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val);
  };

  const totalIncome = summary?.totalIncome || 0;
  const totalExpense = summary?.totalExpense || 0;
  const balance = summary?.balance || 0;
  const expenseByCategory = summary?.expenseByCategory || [];

  return (
    <div className="space-y-4">
      {/* 3 Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Income */}
        <Card className="border-emerald-200/60 bg-emerald-50/30 dark:border-emerald-950/60 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Tổng Thu Nhập</p>
              <h3 className="mt-1.5 text-2xl font-black text-emerald-800 dark:text-emerald-300">
                +{formatCurrency(totalIncome)}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* Total Expense */}
        <Card className="border-rose-200/60 bg-rose-50/30 dark:border-rose-950/60 dark:bg-rose-950/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">Tổng Chi Tiêu</p>
              <h3 className="mt-1.5 text-2xl font-black text-rose-800 dark:text-rose-300">
                -{formatCurrency(totalExpense)}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* Current Balance */}
        <Card className="border-indigo-200/60 bg-indigo-50/30 dark:border-indigo-950/60 dark:bg-indigo-950/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">Số Dư Khả Dụng</p>
              <h3
                className={`mt-1.5 text-2xl font-black ${
                  balance >= 0
                    ? 'text-indigo-900 dark:text-indigo-300'
                    : 'text-rose-700 dark:text-rose-400'
                }`}
              >
                {balance >= 0 ? '+' : ''}
                {formatCurrency(balance)}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Category Breakdown (If any) */}
      {expenseByCategory.length > 0 && (
        <Card title="Phân bổ chi tiêu theo danh mục" description="Thống kê cơ cấu các khoản chi lớn nhất">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-1">
            {expenseByCategory.map((item) => (
              <div
                key={item.category}
                className="flex items-center space-x-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <PieChart className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                    {item.category}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(item.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};