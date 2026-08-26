import React, { useEffect, useState } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { Task, TaskStatus, CreateTaskRequest, UpdateTaskRequest } from '../types/task';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDeleteModal } from '../components/tasks/TaskDeleteModal';
import { Button } from '../components/common/Button';
import { LoadingState, ErrorState, EmptyState } from '../components/common/StateFeedback';
import {
  Plus,
  LayoutList,
  Kanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    pagination,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setPage,
    clearSuccessMessage,
  } = useTaskStore();

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccessMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleOpenDelete = (task: Task) => {
    setDeletingTask(task);
    setDeleteModalOpen(true);
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    try {
      await updateTask(task.id, { status: newStatus });
    } catch {
      // Error handled in store
    }
  };

  const handleModalSubmit = async (data: CreateTaskRequest | UpdateTaskRequest) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data as CreateTaskRequest);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingTask) {
      await deleteTask(deletingTask.id);
      setDeleteModalOpen(false);
      setDeletingTask(null);
    }
  };

  // Stats calculation
  const totalTasks = pagination.total;
  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* 1. Header & Primary Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Nhiệm vụ & Công việc
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quản trị tiến độ, ưu tiên và hoàn thành mục tiêu học tập, cá nhân.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Switcher */}
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="Chế độ danh sách (List View)"
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="Chế độ bảng (Kanban Board)"
            >
              <Kanban className="h-4 w-4" />
            </button>
          </div>

          <Button onClick={handleOpenCreate} className="space-x-1.5 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Thêm nhiệm vụ</span>
          </Button>
        </div>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="flex items-center space-x-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 2. Mini Stats Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Tổng số nhiệm vụ</p>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{totalTasks}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Cần làm (To Do)</p>
          <p className="mt-1 text-xl font-bold text-indigo-600 dark:text-indigo-400">{todoCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Đang thực hiện</p>
          <p className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">{inProgressCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Đã hoàn thành</p>
          <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
        </div>
      </div>

      {/* 3. Search & Filters Bar */}
      <TaskFilters />

      {/* 4. Main Tasks View (Loading / Error / Empty / List / Kanban) */}
      {isLoading && <LoadingState message="Đang tải danh sách nhiệm vụ..." />}

      {error && !isLoading && <ErrorState message={error} onRetry={() => fetchTasks()} />}

      {!isLoading && !error && tasks.length === 0 && (
        <EmptyState
          title="Chưa có nhiệm vụ nào"
          description="Hãy tạo nhiệm vụ đầu tiên để bắt đầu theo dõi tiến độ công việc và học tập của bạn."
          actionLabel="+ Tạo nhiệm vụ mới"
          onAction={handleOpenCreate}
        />
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <>
          {viewMode === 'list' ? (
            /* LIST VIEW */
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            /* KANBAN BOARD VIEW */
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 items-start">
              {(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as TaskStatus[]).map((status) => {
                const columnTasks = tasks.filter((t) => t.status === status);
                const statusTitles: Record<TaskStatus, string> = {
                  TODO: 'Cần làm (To Do)',
                  IN_PROGRESS: 'Đang làm (In Progress)',
                  COMPLETED: 'Hoàn thành (Done)',
                  CANCELLED: 'Đã hủy (Cancelled)',
                };

                return (
                  <div
                    key={status}
                    className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/50"
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {statusTitles[status]}
                      </h4>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {columnTasks.length}
                      </span>
                    </div>

                    <div className="mt-3 space-y-3">
                      {columnTasks.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 rounded-lg dark:border-slate-800">
                          Trống
                        </div>
                      ) : (
                        columnTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={handleOpenEdit}
                            onDelete={handleOpenDelete}
                            onStatusChange={handleStatusChange}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hiển thị trang <span className="font-semibold text-slate-800 dark:text-slate-200">{pagination.page}</span> / {pagination.totalPages} ({pagination.total} nhiệm vụ)
              </p>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage(pagination.page - 1)}
                  className="space-x-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Trang trước</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage(pagination.page + 1)}
                  className="space-x-1"
                >
                  <span>Trang sau</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        task={editingTask}
        isSubmitting={isSubmitting}
      />

      <TaskDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        task={deletingTask}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};