import React from 'react';
import { Grade } from '../../types/grade';
import { Edit2, Trash2 } from 'lucide-react';

interface GradeComponentCardProps {
  grade: Grade;
  onEdit: (grade: Grade) => void;
  onDelete: (grade: Grade) => void;
}

export const GradeComponentCard: React.FC<GradeComponentCardProps> = ({
  grade,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/50">
      <div className="min-w-0 flex-1">
        <div className="flex items-center space-x-2">
          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {grade.componentName}
          </h5>
          <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            {grade.weight}%
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3 shrink-0">
        <div className="text-right">
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
            {Number(grade.score).toFixed(1)}
          </span>
          <span className="text-[10px] text-slate-400 pl-0.5">/10</span>
        </div>

        <div className="flex items-center space-x-1 pl-2 border-l border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onEdit(grade)}
            className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            aria-label="Sửa cột điểm"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(grade)}
            className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
            aria-label="Xóa cột điểm"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};