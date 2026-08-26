import React from 'react';
import { Task, TaskStatus } from '../../types/task';
import { TaskPriorityBadge, TaskStatusBadge } from './TaskBadges';
import { Calendar, Tag, MoreVertical, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null;

  const isOverdue =
    task.dueDate &&
    task.status !== 'COMPLETED' &&
    task.status !== 'CANCELLED' &&
    new Date(task.dueDate) < new Date();

  return (
    <div className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        {/* Title and Quick Status Toggle */}
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <button
            onClick={() => onStatusChange(task, task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED')}
            className={`mt-0.5 shrink-0 rounded-full transition-colors ${
              task.status === 'COMPLETED'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-300 hover:text-slate-500 dark:text-slate-700 dark:hover:text-slate-400'
            }`}
            title={task.status === 'COMPLETED' ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
          >
            <CheckCircle className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <h4
              className={`text-sm font-semibold leading-snug break-words ${
                task.status === 'COMPLETED'
                  ? 'text-slate-400 line-through dark:text-slate-500'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {task.title}
            </h4>

            {task.description && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-6 z-20 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-800">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(task);
                  }}
                  className="flex w-full items-center space-x-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Chỉnh sửa</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(task);
                  }}
                  className="flex w-full items-center space-x-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Xóa task</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Meta Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center gap-1.5">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />

          {formattedDueDate && (
            <span
              className={`inline-flex items-center space-x-1 text-[11px] font-medium px-2 py-0.5 rounded ${
                isOverdue
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                  : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
              }`}
            >
              <Clock className="h-3 w-3" />
              <span>{formattedDueDate}</span>
            </span>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {task.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center space-x-1 text-[10px] font-medium text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800 px-1.5 py-0.5 rounded"
              >
                <Tag className="h-2.5 w-2.5 text-slate-400" />
                <span>{tag.name}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};