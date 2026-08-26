import React from 'react';
import { CalendarEvent } from '../../types/event';
import { Button } from '../common/Button';
import { AlertTriangle, X } from 'lucide-react';

interface EventDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  event: CalendarEvent | null;
  isSubmitting: boolean;
}

export const EventDeleteModal: React.FC<EventDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  event,
  isSubmitting,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Xác nhận xóa sự kiện</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Hủy"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Bạn có chắc chắn muốn xóa sự kiện <span className="font-semibold text-slate-900 dark:text-white">"{event.title}"</span> khỏi lịch? Hành động này không thể hoàn tác.
        </p>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button variant="danger" size="sm" isLoading={isSubmitting} onClick={onConfirm}>
            Xác nhận xóa
          </Button>
        </div>
      </div>
    </div>
  );
};