import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { TaskPriority, TaskStatus } from '../../types/task';

export const TaskFilters: React.FC = () => {
  const { filters, setFilters, resetFilters } = useTaskStore();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        setFilters({ search: searchTerm.trim() || undefined });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, setFilters]);

  const hasActiveFilters = Boolean(filters.search || filters.status || filters.priority);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
      {/* Search Box */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm công việc theo tiêu đề, mô tả..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 py-2 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Select Dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Filter className="h-3.5 w-3.5" />
          <span>Lọc:</span>
        </div>

        {/* Status Filter */}
        <select
          value={filters.status || ''}
          onChange={(e) => setFilters({ status: (e.target.value as TaskStatus) || undefined })}
          aria-label="Lọc theo trạng thái"
          className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none transition-all focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="TODO">Cần làm (To Do)</option>
          <option value="IN_PROGRESS">Đang làm (In Progress)</option>
          <option value="COMPLETED">Hoàn thành (Completed)</option>
          <option value="CANCELLED">Đã hủy (Cancelled)</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority || ''}
          onChange={(e) => setFilters({ priority: (e.target.value as TaskPriority) || undefined })}
          aria-label="Lọc theo mức ưu tiên"
          className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none transition-all focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="">Tất cả ưu tiên</option>
          <option value="URGENT">Khẩn cấp (Urgent)</option>
          <option value="HIGH">Cao (High)</option>
          <option value="MEDIUM">Vừa (Medium)</option>
          <option value="LOW">Thấp (Low)</option>
        </select>

        {/* Reset Filter Button */}
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