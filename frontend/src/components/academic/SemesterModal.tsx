import React, { useState, useEffect } from 'react';
import { Semester, CreateSemesterRequest, UpdateSemesterRequest } from '../../types/semester';
import { Button } from '../common/Button';
import { DatePickerInput } from '../common/DatePickerInput';
import { X, AlertCircle } from 'lucide-react';

interface SemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSemesterRequest | UpdateSemesterRequest) => Promise<void>;
  semester?: Semester | null;
  isSubmitting: boolean;
}

export const SemesterModal: React.FC<SemesterModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  semester,
  isSubmitting,
}) => {
  const [name, setName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (semester) {
      setName(semester.name);
      setAcademicYear(semester.academicYear);
      setStartDate(semester.startDate);
      setEndDate(semester.endDate);
      setIsCurrent(semester.isCurrent);
    } else {
      setName('');
      setAcademicYear('2026-2027');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate(new Date().toISOString().split('T')[0]);
      setIsCurrent(false);
    }
    setFormError('');
  }, [semester, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Tên học kỳ là bắt buộc.');
      return;
    }

    if (!academicYear.trim()) {
      setFormError('Năm học là bắt buộc.');
      return;
    }

    if (startDate > endDate) {
      setFormError('Ngày bắt đầu phải trước hoặc cùng ngày kết thúc.');
      return;
    }

    try {
      const payload: CreateSemesterRequest = {
        name: name.trim(),
        academicYear: academicYear.trim(),
        startDate,
        endDate,
        isCurrent,
      };

      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setFormError(errorObj.message || 'Lỗi khi lưu học kỳ.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {semester ? 'Chỉnh sửa học kỳ' : 'Thêm học kỳ mới'}
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
              Tên học kỳ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Học kỳ 1 (2026-2027)"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Năm học <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="VD: 2026-2027"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ngày bắt đầu (dd/mm/yyyy) <span className="text-rose-500">*</span>
              </label>
              <DatePickerInput
                value={startDate}
                onChange={setStartDate}
                placeholder="Ngày bắt đầu"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ngày kết thúc (dd/mm/yyyy) <span className="text-rose-500">*</span>
              </label>
              <DatePickerInput
                value={endDate}
                onChange={setEndDate}
                placeholder="Ngày kết thúc"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
              />
              <span>Đặt làm học kỳ hiện tại (Current Semester)</span>
            </label>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {semester ? 'Lưu thay đổi' : 'Tạo học kỳ'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};