import React from 'react';
import { SubjectGradeSummary, Grade } from '../../types/grade';
import { GradeComponentCard } from './GradeComponentCard';
import { Button } from '../common/Button';
import { Plus, Target, CheckCircle2, AlertCircle } from 'lucide-react';

interface SubjectGradeSummaryCardProps {
  summary: SubjectGradeSummary;
  onAddGrade: (subjectId: string) => void;
  onEditGrade: (grade: Grade) => void;
  onDeleteGrade: (grade: Grade) => void;
}

export const SubjectGradeSummaryCard: React.FC<SubjectGradeSummaryCardProps> = ({
  summary,
  onAddGrade,
  onEditGrade,
  onDeleteGrade,
}) => {
  const isComplete = summary.isComplete;
  const totalWeight = summary.totalWeight;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-bold text-xs text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/60">
              {summary.subjectCode}
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {summary.subjectName}
            </h4>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>{summary.credits} tín chỉ</span>
            {summary.targetGrade !== null && (
              <span className="flex items-center space-x-1 text-slate-600 dark:text-slate-300">
                <Target className="h-3 w-3 text-indigo-500" />
                <span>Mục tiêu: {Number(summary.targetGrade).toFixed(1)}/10</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start">
          {isComplete ? (
            <div className="text-right">
              <div className="flex items-center justify-end space-x-1.5">
                <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                  {summary.finalScore10?.toFixed(1)} {/* Định dạng 1 chữ số thập phân */}
                  <span className="text-xs font-medium text-slate-400 pl-0.5">/10</span>
                </span>
                <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                  {summary.letterGrade}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-right">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                Chưa đủ 100% điểm
              </span>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs pb-1.5">
          <span className="font-medium text-slate-600 dark:text-slate-400 flex items-center space-x-1">
            {isComplete ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Đã hoàn thành 100% trọng số
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                <span>Tổng trọng số đã nhập: {totalWeight}% (còn thiếu {Number((100 - totalWeight).toFixed(2))}%)</span>
              </>
            )}
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{totalWeight}%</span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isComplete ? 'bg-emerald-500' : 'bg-indigo-600 dark:bg-indigo-500'
            }`}
            style={{ width: `${Math.min(totalWeight, 100)}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 pt-1">
        {summary.grades.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-3 border border-dashed border-slate-200 rounded-lg dark:border-slate-800">
            Chưa có thành phần điểm nào. Hãy bấm "Thêm cột điểm" bên dưới.
          </p>
        ) : (
          summary.grades.map((g) => (
            <GradeComponentCard
              key={g.id}
              grade={g}
              onEdit={onEditGrade}
              onDelete={onDeleteGrade}
            />
          ))
        )}
      </div>

      {totalWeight < 100 && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddGrade(summary.subjectId)}
            className="w-full space-x-1 border-dashed"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm cột điểm thành phần</span>
          </Button>
        </div>
      )}
    </div>
  );
};