import React, { useState, useEffect } from 'react';
import { CalendarEvent, CreateEventRequest, UpdateEventRequest } from '../../types/event';
import { Button } from '../common/Button';
import { DatePickerInput } from '../common/DatePickerInput';
import { X, AlertCircle, MapPin } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEventRequest | UpdateEventRequest) => Promise<void>;
  event?: CalendarEvent | null;
  selectedDate?: Date | null;
  isSubmitting: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  event,
  selectedDate,
  isSubmitting,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('09:00');
  const [allDay, setAllDay] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setLocation(event.location || '');

      const s = new Date(event.startAt);
      const e = new Date(event.endAt);

      setStartDate(s.toISOString().split('T')[0]);
      setStartTime(s.toTimeString().slice(0, 5));
      setEndDate(e.toISOString().split('T')[0]);
      setEndTime(e.toTimeString().slice(0, 5));
      setAllDay(false);
    } else {
      const baseDate = selectedDate || new Date();
      const dateStr = baseDate.toISOString().split('T')[0];

      setTitle('');
      setDescription('');
      setLocation('');
      setStartDate(dateStr);
      setStartTime('08:00');
      setEndDate(dateStr);
      setEndTime('09:00');
      setAllDay(false);
    }
    setFormError('');
  }, [event, selectedDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Tiêu đề sự kiện là bắt buộc.');
      return;
    }

    if (!startDate || !endDate) {
      setFormError('Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc.');
      return;
    }

    const startDateTime = allDay
      ? new Date(`${startDate}T00:00:00.000Z`)
      : new Date(`${startDate}T${startTime}:00.000Z`);

    const endDateTime = allDay
      ? new Date(`${endDate}T23:59:59.999Z`)
      : new Date(`${endDate}T${endTime}:00.000Z`);

    if (startDateTime >= endDateTime) {
      setFormError('Thời gian bắt đầu phải trước thời gian kết thúc.');
      return;
    }

    try {
      const payload: CreateEventRequest = {
        title: title.trim(),
        description: description.trim() || null,
        location: location.trim() || null,
        startAt: startDateTime.toISOString(),
        endAt: endDateTime.toISOString(),
      };

      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setFormError(errorObj.message || 'Lỗi khi lưu sự kiện.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {event ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Đóng form"
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
              Tiêu đề sự kiện <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Họp nhóm đồ án Web Full-Stack"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Địa điểm
            </label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="VD: Phòng B304 hoặc Google Meet"
                className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
              />
              <span>Sự kiện cả ngày (All-day event)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bắt đầu (dd/mm/yyyy) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center space-x-1.5">
                <DatePickerInput
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Ngày bắt đầu"
                  className="flex-1"
                />
                {!allDay && (
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kết thúc (dd/mm/yyyy) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center space-x-1.5">
                <DatePickerInput
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="Ngày kết thúc"
                  className="flex-1"
                />
                {!allDay && (
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Mô tả chi tiết
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập nội dung, ghi chú cuộc họp..."
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100"
            />
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {event ? 'Lưu thay đổi' : 'Tạo sự kiện'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};