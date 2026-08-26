import React from 'react';
import { Note } from '../../types/note';
import { Button } from '../common/Button';
import { X, Pin, Archive, Edit2, Trash2, Tag, Calendar, Clock } from 'lucide-react';

interface NoteDetailModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onTogglePin: (note: Note) => void;
  onToggleArchive: (note: Note) => void;
}

export const NoteDetailModal: React.FC<NoteDetailModalProps> = ({
  note,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
}) => {
  if (!isOpen || !note) return null;

  const formattedCreatedAt = new Date(note.createdAt).toLocaleString('vi-VN');
  const formattedUpdatedAt = new Date(note.updatedAt).toLocaleString('vi-VN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            {note.isPinned && <Pin className="h-4 w-4 text-amber-500 fill-amber-500" />}
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Chi tiết ghi chú
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Đóng cửa sổ"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {note.title}
          </h2>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm text-slate-800 dark:border-slate-800/80 dark:bg-slate-800/30 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
            {note.content || 'Ghi chú này không có nội dung văn bản.'}
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Nhãn:</span>
              {note.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center space-x-1 text-xs font-medium text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md"
                >
                  <Tag className="h-3 w-3" />
                  <span>{tag.name}</span>
                </span>
              ))}
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="flex items-center space-x-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Tạo ngày: {formattedCreatedAt}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Cập nhật: {formattedUpdatedAt}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-100 p-4 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 gap-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTogglePin(note)}
              className="space-x-1"
            >
              <Pin className="h-3.5 w-3.5" />
              <span>{note.isPinned ? 'Bỏ ghim' : 'Ghim'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleArchive(note)}
              className="space-x-1"
            >
              <Archive className="h-3.5 w-3.5" />
              <span>{note.isArchived ? 'Khôi phục' : 'Lưu trữ'}</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(note);
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
                onDelete(note);
              }}
              className="space-x-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Xóa</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};