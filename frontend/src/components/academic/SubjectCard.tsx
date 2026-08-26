import React, { useState } from 'react';
import { Subject } from '../../types/subject';
import { Award, Target, MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group relative flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-xs text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/60">
          {subject.code}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
            {subject.name}
          </h4>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <span>{subject.credits} tín chỉ</span>
            </div>

            {subject.targetGrade !== null && (
              <div className="flex items-center space-x-1 font-medium text-emerald-600 dark:text-emerald-400">
                <Target className="h-3.5 w-3.5" />
                <span>Mục tiêu: {Number(subject.targetGrade).toFixed(1)}/10</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="relative shrink-0 pl-2">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Tùy chọn môn học"
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
                  onEdit(subject);
                }}
                className="flex w-full items-center space-x-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(subject);
                }}
                className="flex w-full items-center space-x-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Xóa môn học</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};