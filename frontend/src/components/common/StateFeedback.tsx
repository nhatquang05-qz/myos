import React from 'react';
import { AlertCircle, Inbox, Loader2 } from 'lucide-react';
import { Button } from './Button';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Đang tải dữ liệu...' }) => (
  <div className="flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400">
    <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
    <p className="mt-3 text-sm font-medium">{message}</p>
  </div>
);

export const EmptyState: React.FC<{ title?: string; description?: string; actionLabel?: string; onAction?: () => void }> = ({
  title = 'Chưa có dữ liệu',
  description = 'Hiện tại danh sách này đang trống.',
  actionLabel,
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
    <Inbox className="h-10 w-10 text-slate-400" />
    <h4 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{title}</h4>
    <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
    {actionLabel && onAction && (
      <Button variant="outline" size="sm" className="mt-4" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = 'Đã có lỗi xảy ra khi kết nối máy chủ.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
    <AlertCircle className="h-10 w-10 text-rose-600 dark:text-rose-400" />
    <h4 className="mt-3 text-base font-semibold text-rose-900 dark:text-rose-200">Không thể tải thông tin</h4>
    <p className="mt-1 max-w-sm text-sm text-rose-600 dark:text-rose-400">{message}</p>
    {onRetry && (
      <Button variant="danger" size="sm" className="mt-4" onClick={onRetry}>
        Thử lại
      </Button>
    )}
  </div>
);
