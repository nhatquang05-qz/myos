import React, { useEffect, useState } from 'react';
import { useNoteStore } from '../stores/noteStore';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/note';
import { NoteFilters } from '../components/notes/NoteFilters';
import { NoteCard } from '../components/notes/NoteCard';
import { NoteModal } from '../components/notes/NoteModal';
import { NoteDetailModal } from '../components/notes/NoteDetailModal';
import { NoteDeleteModal } from '../components/notes/NoteDeleteModal';
import { Button } from '../components/common/Button';
import { LoadingState, ErrorState, EmptyState } from '../components/common/StateFeedback';
import { Plus, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export const NotesPage: React.FC = () => {
  const {
    notes,
    pagination,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
    setPage,
    clearSuccessMessage,
  } = useNoteStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccessMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleOpenView = (note: Note) => {
    setViewingNote(note);
    setDetailModalOpen(true);
  };

  const handleOpenDelete = (note: Note) => {
    setDeletingNote(note);
    setDeleteModalOpen(true);
  };

  const handleModalSubmit = async (data: CreateNoteRequest | UpdateNoteRequest) => {
    if (editingNote) {
      await updateNote(editingNote.id, data);
    } else {
      await createNote(data as CreateNoteRequest);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingNote) {
      await deleteNote(deletingNote.id);
      setDeleteModalOpen(false);
      setDeletingNote(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Primary Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Ghi chú & Tri thức
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Lưu trữ ý tưởng, tài liệu học tập và tổng kết kinh nghiệm làm việc.
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="space-x-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Thêm ghi chú</span>
        </Button>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="flex items-center space-x-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 2. Filters & Search */}
      <NoteFilters />

      {/* 3. Main Notes Content */}
      {isLoading && <LoadingState message="Đang tải danh sách ghi chú..." />}

      {error && !isLoading && <ErrorState message={error} onRetry={() => fetchNotes()} />}

      {!isLoading && !error && notes.length === 0 && (
        <EmptyState
          title="Chưa có ghi chú nào"
          description="Hãy tạo ghi chú đầu tiên để bắt đầu lưu trữ tài liệu và kinh nghiệm cá nhân của bạn."
          actionLabel="+ Tạo ghi chú mới"
          onAction={handleOpenCreate}
        />
      )}

      {!isLoading && !error && notes.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onView={handleOpenView}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onTogglePin={togglePin}
                onToggleArchive={toggleArchive}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hiển thị trang <span className="font-semibold text-slate-800 dark:text-slate-200">{pagination.page}</span> / {pagination.totalPages} ({pagination.total} ghi chú)
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
      <NoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        note={editingNote}
        isSubmitting={isSubmitting}
      />

      <NoteDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        note={viewingNote}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onTogglePin={togglePin}
        onToggleArchive={toggleArchive}
      />

      <NoteDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        note={deletingNote}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};