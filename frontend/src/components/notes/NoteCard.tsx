import React, { useState } from 'react';
import { Note } from '../../types/note';
import { Pin, Archive, ArchiveRestore, MoreVertical, Edit2, Trash2, Tag, Calendar } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onTogglePin: (note: Note) => void;
  onToggleArchive: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const formattedDate = new Date(note.updatedAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const previewContent =
    note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content;

  return (
    <div
      onClick={() => onView(note)}
      className={`group relative flex flex-col justify-between rounded-xl border p-5 shadow-sm transition-all duration-200 cursor-pointer ${
        note.isPinned
          ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400 dark:border-amber-900/60 dark:bg-amber-950/10'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
      }`}
    >
      <div>
        {/* Header with Title and Pin Indicator */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-2 min-w-0">
            {note.isPinned && (
              <Pin className="h-4 w-4 shrink-0 text-amber-500 fill-amber-500" />
            )}
            <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
              {note.title}
            </h4>
          </div>

          {/* Actions Menu */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Thao tác ghi chú"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-6 z-20 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-800">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onTogglePin(note);
                    }}
                    className="flex w-full items-center space-x-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <Pin className="h-3.5 w-3.5" />
                    <span>{note.isPinned ? 'Bỏ ghim' : 'Ghim ghi chú'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onToggleArchive(note);
                    }}
                    className="flex w-full items-center space-x-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    {note.isArchived ? (
                      <>
                        <ArchiveRestore className="h-3.5 w-3.5" />
                        <span>Khôi phục</span>
                      </>
                    ) : (
                      <>
                        <Archive className="h-3.5 w-3.5" />
                        <span>Lưu trữ</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(note);
                    }}
                    className="flex w-full items-center space-x-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Chỉnh sửa</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(note);
                    }}
                    className="flex w-full items-center space-x-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Xóa ghi chú</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content Preview */}
        <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-4 leading-relaxed whitespace-pre-line">
          {previewContent || 'Không có nội dung chi tiết.'}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
        <div className="flex items-center space-x-1 text-[11px] text-slate-400 dark:text-slate-500">
          <Calendar className="h-3 w-3" />
          <span>{formattedDate}</span>
        </div>

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {note.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center space-x-1 text-[10px] font-medium text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/50 px-1.5 py-0.5 rounded"
              >
                <Tag className="h-2.5 w-2.5 text-indigo-400" />
                <span>{tag.name}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};