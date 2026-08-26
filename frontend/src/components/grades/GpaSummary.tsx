import React from 'react';
import { SemesterGpaSummary, CumulativeGpaSummary } from '../../types/grade';
import { Card } from '../common/Card';
import { Calculator, Award, BookOpen, CheckCircle } from 'lucide-react';

interface GpaSummaryProps {
  semesterGpa: SemesterGpaSummary | null;
  cumulativeGpa: CumulativeGpaSummary | null;
}

export const GpaSummary: React.FC<GpaSummaryProps> = ({ semesterGpa, cumulativeGpa }) => {
  const formatGpa = (gpa: number | null) => (gpa !== null ? gpa.toFixed(2) : '--');

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-indigo-200/60 bg-indigo-50/30 dark:border-indigo-950/60 dark:bg-indigo-950/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
              Điểm TB Học Kỳ (Hệ 10)
            </p>
            <h3 className="mt-1.5 text-2xl font-black text-indigo-900 dark:text-indigo-200">
              {formatGpa(semesterGpa?.gpa ?? null)}
              <span className="text-xs font-medium text-indigo-500 pl-1">/ 10.0</span>
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
            <Calculator className="h-5 w-5" />
          </div>
        </div>
      </Card>

      <Card className="border-amber-200/60 bg-amber-50/30 dark:border-amber-950/60 dark:bg-amber-950/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Điểm TB Tích Lũy (Hệ 10)
            </p>
            <h3 className="mt-1.5 text-2xl font-black text-amber-900 dark:text-amber-200">
              {formatGpa(cumulativeGpa?.cumulativeGpa ?? null)}
              <span className="text-xs font-medium text-amber-500 pl-1">/ 10.0</span>
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
            <Award className="h-5 w-5" />
          </div>
        </div>
      </Card>

      <Card className="border-emerald-200/60 bg-emerald-50/30 dark:border-emerald-950/60 dark:bg-emerald-950/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Tín Chỉ Hoàn Thành
            </p>
            <h3 className="mt-1.5 text-2xl font-black text-emerald-800 dark:text-emerald-300">
              {semesterGpa?.completedCredits ?? 0}
              <span className="text-xs font-medium text-emerald-600 pl-1">
                / {semesterGpa?.totalCredits ?? 0} tín chỉ
              </span>
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Môn Học Đã Đủ Điểm
            </p>
            <h3 className="mt-1.5 text-2xl font-black text-slate-900 dark:text-white">
              {semesterGpa?.completedSubjects ?? 0}
              <span className="text-xs font-medium text-slate-500 pl-1">
                / {semesterGpa?.totalSubjects ?? 0} môn
              </span>
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </div>
  );
};