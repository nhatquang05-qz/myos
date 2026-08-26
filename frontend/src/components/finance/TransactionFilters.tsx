import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useFinanceStore } from '../../stores/financeStore';
import { TransactionType } from '../../types/transaction';
import { DatePickerInput } from '../common/DatePickerInput';

export const TransactionFilters: React.FC = () => {
  const { filters, categories, setFilters, resetFilters } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        setFilters({ search: searchTerm.trim() || undefined });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, setFilters]);

  const hasActiveFilters = Boolean(
    filters.search || filters.type || filters.category || filters.from || filters.to
  );

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm giao dịch theo mô tả, danh mục..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 py-2 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Xóa từ khóa"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            <span>Lọc:</span>
          </div>

          <select
            value={filters.type || ''}
            onChange={(e) => setFilters({ type: (e.target.value as TransactionType) || undefined })}
            aria-label="Lọc theo loại giao dịch"
            className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none transition-all focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">Tất cả loại (Thu & Chi)</option>
            <option value="INCOME">Thu nhập (+)</option>
            <option value="EXPENSE">Chi tiêu (-)</option>
          </select>

          <select
            value={filters.category || ''}
            onChange={(e) => setFilters({ category: e.target.value || undefined })}
            aria-label="Lọc theo danh mục"
            className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none transition-all focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-1.5">
            <span>Từ ngày:</span>
            <DatePickerInput
              value={filters.from || ''}
              onChange={(val) => setFilters({ from: val || undefined })}
              placeholder="dd/mm/yyyy"
              className="w-36"
            />
          </div>

          <div className="flex items-center space-x-1.5">
            <span>Đến ngày:</span>
            <DatePickerInput
              value={filters.to || ''}
              onChange={(val) => setFilters({ to: val || undefined })}
              placeholder="dd/mm/yyyy"
              className="w-36"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearchTerm('');
              resetFilters();
            }}
            className="flex h-8 items-center space-x-1 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X className="h-3.5 w-3.5" />
            <span>Xóa lọc</span>
          </button>
        )}
      </div>
    </div>
  );
};