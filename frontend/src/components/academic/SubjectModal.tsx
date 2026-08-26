import React, { useState, useEffect } from 'react';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../../types/subject';
import { Button } from '../common/Button';
import { X, AlertCircle } from 'lucide-react';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubjectRequest | UpdateSubjectRequest) => Promise<void>;
  subject?: Subject | null;
  isSubmitting: boolean;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  subject,
  isSubmitting,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState('3');
  const [targetGrade, setTargetGrade] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (subject) {
      setCode(subject.code);
      setName(subject.name);
      setCredits(String(subject.credits));
      setTargetGrade(subject.targetGrade !== null ? String(subject.targetGrade) : '');
    } else {
      setCode('');
      setName('');
      setCredits('3');
      setTargetGrade('8.5');
    }
    setFormError('');
  }, [subject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!code.trim()) {
      setFormError('Mã môn học là bắt buộc.');
      return;
    }

    if (!name.trim()) {
      setFormError('Tên môn học là bắt buộc.');
      return;
    }

    const numericCredits = parseInt(credits, 10);
    if (isNaN(numericCredits) || numericCredits < 1) {
      setFormError('Số tín chỉ phải là số nguyên từ 1 trở lên.');
      return;
    }

    let parsedTarget: number | null = null;
    if (targetGrade.trim() !== '') {
      parsedTarget = parseFloat(targetGrade);
      if (isNaN(parsedTarget) || parsedTarget < 0 || parsedTarget > 10) {
        setFormError('Điểm mục tiêu phải nằm trong khoảng từ 0.0 đến 10.0');
        return;
      }
    }

    try {
      const payload: CreateSubjectRequest = {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        credits: numericCredits,
        targetGrade: parsedTarget,
      };

      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setFormError(errorObj.message || 'Lỗi khi lưu môn học.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {subject ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}
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
              Mã môn học <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="VD: IT002, CS101..."
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 uppercase outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tên môn học <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Cấu trúc Dữ liệu & Giải thuật"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Số tín chỉ <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="20"
                required
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Điểm mục tiêu (hệ 10)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
                placeholder="VD: 8.5"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {subject ? 'Lưu thay đổi' : 'Thêm môn học'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};