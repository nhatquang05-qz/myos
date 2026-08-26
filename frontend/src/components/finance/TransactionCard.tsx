import React, { useState } from 'react';
import { Transaction } from '../../types/transaction';
import { ArrowDownLeft, ArrowUpRight, MoreVertical, Edit2, Trash2, Tag, Calendar } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val);
  };

  const isIncome = transaction.type === 'INCOME';

  const formattedDate = new Date(transaction.transactionDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="group relative flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      {/* Left: Icon & Info */}
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${
            isIncome
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60'
              : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60'
          }`}
        >
          {isIncome ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {transaction.description || transaction.category}
            </h4>
            <span className="inline-flex items-center space-x-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Tag className="h-2.5 w-2.5" />
              <span>{transaction.category}</span>
            </span>
          </div>

          <div className="mt-1 flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Right: Amount & Actions */}
      <div className="flex items-center space-x-3 shrink-0 pl-3">
        <div className="text-right">
          <p
            className={`text-base font-black ${
              isIncome
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Tùy chọn giao dịch"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-7 z-20 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-800">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(transaction);
                  }}
                  className="flex w-full items-center space-x-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Chỉnh sửa</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(transaction);
                  }}
                  className="flex w-full items-center space-x-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Xóa giao dịch</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};