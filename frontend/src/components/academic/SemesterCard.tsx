import React, { useState } from 'react';
import { Semester } from '../../types/semester';
import { Badge } from '../common/Badge';
import { Calendar, BookOpen, Award, MoreVertical, Edit2, Trash2, CheckCircle } from 'lucide-react';

interface SemesterCardProps {
  semester: Semester;
  isSelected: boolean;
  onSelect: (semester: Semester) => void;
  onEdit: (semester: Semester) => void;
  onDelete: (semester: Semester) => void;
  onSetCurrent: (semester: Semester) => void;
}

export const SemesterCard: React.FC<SemesterCardProps> = ({
  semester,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onSetCurrent,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const formatDate = (dStr: string) => {
    const d = new Date(dStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div
      onClick={() => onSelect(semester)}
      className={`group relative flex flex-col justify-between rounded-xl border p-4 shadow-sm transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500 dark:border-indigo-500 dark:bg-indigo-950/20'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="truncate text-base font-bold text-slate-900 dark:text-white">
                {semester.name}
              </h4>
              {semester.isCurrent && (
                <Badge variant="success" className="shrink-0 text-[10px] px-1.5 py-0.2">
                  Hiện tại
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Năm học {semester.academicYear}
            </p>
          </div>

          {/* Action Menu */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Tùy chọn học kỳ"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-6 z-20 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-800">
                  {!semester.isCurrent && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onSetCurrent(semester);
                      }}
                      className="flex w-full items-center space-x-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Đặt làm kỳ hiện tại</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(semester);
                    }}
                    className="flex w-full items-center space-x-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Chỉnh sửa</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(semester);
                    }}
                    className="flex w-full items-center space-x-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Xóa học kỳ</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Date Period */}
        <div className="mt-3 flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>
            {formatDate(semester.startDate)} - {formatDate(semester.endDate)}
          </span>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <div className="flex items-center space-x-1">
          <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
          <span>{semester.subjectCount ?? 0} môn học</span>
        </div>

        <div className="flex items-center space-x-1">
          <Award className="h-3.5 w-3.5 text-amber-500" />
          <span>{semester.totalCredits ?? 0} tín chỉ</span>
        </div>
      </div>
    </div>
  );
};