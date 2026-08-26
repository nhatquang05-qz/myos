import React, { useEffect, useState } from 'react';
import { useEventStore } from '../stores/eventStore';
import { CalendarEvent, CreateEventRequest, UpdateEventRequest } from '../types/event';
import { CalendarHeader } from '../components/calendar/CalendarHeader';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { EventModal } from '../components/calendar/EventModal';
import { EventDetailModal } from '../components/calendar/EventDetailModal';
import { EventDeleteModal } from '../components/calendar/EventDeleteModal';
import { Button } from '../components/common/Button';
import { LoadingState, ErrorState } from '../components/common/StateFeedback';
import { Plus, CheckCircle2 } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const {
    events,
    currentDate,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    clearSuccessMessage,
  } = useEventStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<CalendarEvent | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(null);
  const [selectedDateForCreate, setSelectedDateForCreate] = useState<Date | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccessMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);

  const handleOpenCreate = (date?: Date) => {
    setEditingEvent(null);
    setSelectedDateForCreate(date || new Date());
    setModalOpen(true);
  };

  const handleOpenEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleOpenView = (event: CalendarEvent) => {
    setViewingEvent(event);
    setDetailModalOpen(true);
  };

  const handleOpenDelete = (event: CalendarEvent) => {
    setDeletingEvent(event);
    setDeleteModalOpen(true);
  };

  const handleModalSubmit = async (data: CreateEventRequest | UpdateEventRequest) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, data);
    } else {
      await createEvent(data as CreateEventRequest);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingEvent) {
      await deleteEvent(deletingEvent.id);
      setDeleteModalOpen(false);
      setDeletingEvent(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Lịch biểu & Sự kiện
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quản trị thời gian biểu học tập, công việc và các cột mốc quan trọng.
          </p>
        </div>

        <Button onClick={() => handleOpenCreate()} className="space-x-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Thêm sự kiện</span>
        </Button>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="flex items-center space-x-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Calendar Navigation & Filters */}
      <CalendarHeader />

      {/* Calendar Content */}
      {isLoading && <LoadingState message="Đang tải lịch sự kiện..." />}

      {error && !isLoading && <ErrorState message={error} onRetry={() => fetchEvents()} />}

      {!isLoading && !error && (
        <CalendarGrid
          currentDate={currentDate}
          events={events}
          onSelectEvent={handleOpenView}
          onSelectDate={(date) => handleOpenCreate(date)}
        />
      )}

      {/* Modals */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        event={editingEvent}
        selectedDate={selectedDateForCreate}
        isSubmitting={isSubmitting}
      />

      <EventDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        event={viewingEvent}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <EventDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        event={deletingEvent}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};