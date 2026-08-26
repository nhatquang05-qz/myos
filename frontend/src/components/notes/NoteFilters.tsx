import React, { useState, useEffect } from 'react';
import { Search, X, Pin, Archive, FileText } from 'lucide-react';
import { useNoteStore } from '../../stores/noteStore';

export const NoteFilters: React.FC = () => {
  const { filters, setFilters, resetFilters } = useNoteStore();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        setFilters({ search: searchTerm.trim() || undefined });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, setFilters]);

  const currentTab = filters.archived ? 'archived' : filters.pinned ? 'pinned' : 'all';

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
      {/* Search Box */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm ghi chú theo tiêu đề hoặc nội dung..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 py-2 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Xóa từ khóa tìm kiếm"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setFilters({ archived: undefined, pinned: undefined })}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            currentTab === 'all'
              ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Tất cả</span>
        </button>

        <button
          onClick={() => setFilters({ pinned: true, archived: undefined })}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            currentTab === 'pinned'
              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Pin className="h-3.5 w-3.5" />
          <span>Đã ghim</span>
        </button>

        <button
          onClick={() => setFilters({ archived: true, pinned: undefined })}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            currentTab === 'archived'
              ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Archive className="h-3.5 w-3.5" />
          <span>Lưu trữ</span>
        </button>

        {(searchTerm || currentTab !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              resetFilters();
            }}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Xóa tất cả bộ lọc"
          >
            <X className="h-3.5 w-3.5" />
            <span>Xóa lọc</span>
          </button>
        )}
      </div>
    </div>
  );
};