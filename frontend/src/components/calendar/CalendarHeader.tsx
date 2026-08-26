import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Search, X } from 'lucide-react';
import { useEventStore } from '../../stores/eventStore';
import { Button } from '../common/Button';

export const CalendarHeader: React.FC = () => {
  const { currentDate, prevMonth, nextMonth, goToToday, searchQuery, setSearchQuery } = useEventStore();
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== searchQuery) {
        setSearchQuery(searchTerm);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, searchQuery, setSearchQuery]);

  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  const formattedMonthYear = `${monthNames[currentDate.getMonth()]}, ${currentDate.getFullYear()}`;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
      {/* Left: Navigation Controls */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={goToToday} className="space-x-1">
          <CalendarIcon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Hôm nay</span>
        </Button>

        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
          <button
            onClick={prevMonth}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            aria-label="Tháng trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <button
            onClick={nextMonth}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            aria-label="Tháng sau"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white pl-2">
          {formattedMonthYear}
        </h3>
      </div>

      {/* Right: Search Bar */}
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm sự kiện theo tiêu đề, địa điểm..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-8 py-1.5 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Xóa từ khóa"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};