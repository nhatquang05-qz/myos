import React from 'react';
import { CalendarEvent } from '../../types/event';
import { Clock } from 'lucide-react';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectDate: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  events,
  onSelectEvent,
  onSelectDate,
}) => {
  const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Ngày đầu tiên và số ngày của tháng hiện tại
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Chuyển đổi getDay() (Chủ nhật = 0, Thứ 2 = 1,...) sang Thứ 2 là index 0
  let startingDayIndex = firstDayOfMonth.getDay() - 1;
  if (startingDayIndex === -1) startingDayIndex = 6;

  // Số ngày của tháng trước
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Tạo mảng 42 ô (6 tuần x 7 ngày)
  const calendarCells: { date: Date; isCurrentMonth: boolean }[] = [];

  // 1. Ngày của tháng trước
  for (let i = startingDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // 2. Ngày của tháng hiện tại
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // 3. Ngày của tháng kế tiếp
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  const today = new Date();
  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  // Lấy các events diễn ra trong ngày d (hỗ trợ multi-day overlap)
  const getEventsForDay = (cellDate: Date) => {
    const cellStart = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate(), 0, 0, 0, 0);
    const cellEnd = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate(), 23, 59, 59, 999);

    return events.filter((e) => {
      const eventStart = new Date(e.startAt);
      const eventEnd = new Date(e.endAt);
      return eventStart <= cellEnd && eventEnd >= cellStart;
    });
  };

  const formatEventTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 text-center">
        {weekDays.map((day, idx) => (
          <div
            key={day}
            className={`py-2.5 text-xs font-bold uppercase tracking-wider ${
              idx >= 5
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid (6 rows x 7 cols) */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800">
        {calendarCells.map(({ date, isCurrentMonth }, index) => {
          const dayEvents = getEventsForDay(date);
          const activeToday = isToday(date);

          return (
            <div
              key={index}
              onClick={() => onSelectDate(date)}
              className={`min-h-[110px] p-1.5 flex flex-col justify-between transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer ${
                !isCurrentMonth ? 'bg-slate-50/40 dark:bg-slate-900/30' : ''
              }`}
            >
              {/* Date Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    activeToday
                      ? 'bg-indigo-600 text-white'
                      : isCurrentMonth
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {date.getDate()}
                </span>

                {dayEvents.length > 2 && (
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 pr-1">
                    +{dayEvents.length - 2}
                  </span>
                )}
              </div>

              {/* Event Badges List */}
              <div className="mt-1 flex-1 space-y-1 overflow-hidden">
                {dayEvents.slice(0, 2).map((ev) => (
                  <div
                    key={ev.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(ev);
                    }}
                    className="group flex flex-col rounded px-1.5 py-0.5 text-[11px] font-medium bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-900/60 dark:text-indigo-300 transition-colors"
                  >
                    <span className="truncate font-semibold">{ev.title}</span>
                    <div className="flex items-center space-x-1 text-[9px] text-indigo-500 dark:text-indigo-400">
                      <Clock className="h-2.5 w-2.5" />
                      <span>{formatEventTime(ev.startAt)}</span>
                      {ev.location && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[60px]">{ev.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};