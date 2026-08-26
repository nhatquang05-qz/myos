import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerInputProps {
  value: string; // Định dạng YYYY-MM-DD
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'dd/mm/yyyy',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse YYYY-MM-DD sang Date
  const parseValueToDate = (val: string): Date => {
    if (!val || !/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      return new Date();
    }
    const [y, m, d] = val.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const currentDate = parseValueToDate(value);
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());

  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const d = parseValueToDate(value);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format YYYY-MM-DD sang DD/MM/YYYY để hiển thị text
  const displayValue = value && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value.split('-')[2]}/${value.split('-')[1]}/${value.split('-')[0]}`
    : '';

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setIsOpen(false);
  };

  // Tính số ngày trong tháng view
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Thứ 2 = 0

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: firstDayIndex }, (_, i) => i);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 transition-all hover:border-slate-300 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <span className={displayValue ? 'font-semibold' : 'text-slate-400'}>
          {displayValue || placeholder}
        </span>
        <CalendarIcon className="h-4 w-4 text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-10 z-50 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          {/* Header tháng / năm */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {monthNames[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Thứ trong tuần */}
          <div className="grid grid-cols-7 pt-2 text-center text-[10px] font-bold text-slate-400">
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
            <span className="text-indigo-600 dark:text-indigo-400">CN</span>
          </div>

          {/* Ngày trong tháng */}
          <div className="grid grid-cols-7 gap-1 pt-1 text-center text-xs">
            {emptyCells.map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {daysArray.map((day) => {
              const mm = String(viewMonth + 1).padStart(2, '0');
              const dd = String(day).padStart(2, '0');
              const cellDateStr = `${viewYear}-${mm}-${dd}`;
              const isSelected = value === cellDateStr;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-7 w-7 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center mx-auto ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};