import React from 'react';
import { CalendarEvent } from '../../types/event';
import { Button } from '../common/Button';
import { X, Clock, MapPin, Edit2, Trash2 } from 'lucide-react';

interface EventDetailModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !event) return null;

  const start = new Date(event.startAt);
  const end = new Date(event.endAt);

  const formattedDateRange = `${start.toLocaleDateString('vi-VN')} ${start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleDateString('vi-VN')} ${end.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Chi tiết sự kiện
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Đóng cửa sổ"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {event.title}
          </h2>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>{formattedDateRange}</span>
            </div>

            {event.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {event.description && (
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm text-slate-800 dark:border-slate-800/80 dark:bg-slate-800/30 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {event.description}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 border-t border-slate-100 p-4 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(event);
            }}
            className="space-x-1"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Sửa</span>
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onClose();
              onDelete(event);
            }}
            className="space-x-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Xóa</span>
          </Button>
        </div>
      </div>
    </div>
  );
};