import React, { useState, useEffect } from 'react';
import { Grade, CreateGradeRequest, UpdateGradeRequest } from '../../types/grade';
import { Button } from '../common/Button';
import { X, AlertCircle } from 'lucide-react';

interface GradeComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGradeRequest | UpdateGradeRequest) => Promise<void>;
  grade?: Grade | null;
  isSubmitting: boolean;
}

const PREDEFINED_COMPONENTS = ['Quá trình', 'Giữa kỳ', 'Thực hành', 'Cuối kỳ'];

export const GradeComponentModal: React.FC<GradeComponentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  grade,
  isSubmitting,
}) => {
  const [componentName, setComponentName] = useState(PREDEFINED_COMPONENTS[0]);
  const [weight, setWeight] = useState('30');
  const [score, setScore] = useState('8.5');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (grade) {
      setComponentName(grade.componentName);
      setWeight(String(grade.weight));
      setScore(String(grade.score));
    } else {
      setComponentName(PREDEFINED_COMPONENTS[0]);
      setWeight('30');
      setScore('8.5');
    }
    setFormError('');
  }, [grade, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!componentName.trim()) {
      setFormError('Vui lòng chọn thành phần điểm.');
      return;
    }

    const cleanWeight = weight.replace('%', '').trim();
    const numericWeight = parseFloat(cleanWeight);
    if (isNaN(numericWeight) || numericWeight <= 0 || numericWeight > 100) {
      setFormError('Trọng số điểm phải từ 10% đến 100% (bước nhảy 10%).');
      return;
    }

    const numericScore = parseFloat(score);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 10) {
      setFormError('Điểm số phải nằm trong khoảng từ 0.0 đến 10.0.');
      return;
    }

    try {
      const payload: CreateGradeRequest = {
        componentName: componentName.trim(),
        weight: Number(numericWeight.toFixed(2)),
        score: Number(numericScore.toFixed(2)),
      };

      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setFormError(errorObj.message || 'Lỗi khi lưu cột điểm.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {grade ? 'Chỉnh sửa cột điểm' : 'Thêm cột điểm mới'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {formError && (
          <div className="mt-4 flex items-center space-x-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Thành phần điểm <span className="text-rose-500">*</span>
            </label>
            <select
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
            >
              {PREDEFINED_COMPONENTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Trọng số (%) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="10"
                min="10"
                max="100"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="30"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Điểm số (/10) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="8.5"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {grade ? 'Lưu thay đổi' : 'Thêm điểm'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};