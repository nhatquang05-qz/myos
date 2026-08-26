import { randomUUID } from 'crypto';
import { noteRepository, NoteRepository } from '../repositories/noteRepository.js';
import { CreateNoteInput, UpdateNoteInput, NoteQueryInput } from '../validators/noteValidators.js';
import { NoteResponse, NoteRecord } from '../types/note.js';
import { TagItem } from '../types/task.js';
import { AppError } from '../middleware/errorHandler.js';

export class NoteService {
  constructor(private noteRepo: NoteRepository) {}

  private mapNoteToResponse(record: NoteRecord & { tags_json?: string | TagItem[] }): NoteResponse {
    let tags: TagItem[] = [];
    if (typeof record.tags_json === 'string') {
      try {
        tags = JSON.parse(record.tags_json) as TagItem[];
      } catch {
        tags = [];
      }
    } else if (Array.isArray(record.tags_json)) {
      tags = record.tags_json;
    }

    return {
      id: record.id,
      userId: record.user_id,
      title: record.title,
      content: record.content,
      isPinned: Boolean(record.is_favorite),
      isArchived: Boolean(record.is_archived),
      tags: Array.isArray(tags) ? tags : [],
      createdAt: new Date(record.created_at).toISOString(),
      updatedAt: new Date(record.updated_at).toISOString(),
    };
  }

  async getNotes(
    userId: string,
    query: NoteQueryInput
  ): Promise<{ notes: NoteResponse[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const { notes: records, total } = await this.noteRepo.findNotesByUser(userId, query);
    const notes = records.map((record) => this.mapNoteToResponse(record));
    const limit = query.limit;
    const page = query.page;
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getNoteById(id: string, userId: string): Promise<NoteResponse> {
    const record = await this.noteRepo.findNoteByIdAndUser(id, userId);
    if (!record) {
      throw new AppError('Không tìm thấy ghi chú hoặc bạn không có quyền truy cập', 404, 'NOTE_NOT_FOUND');
    }
    return this.mapNoteToResponse(record);
  }

  async createNote(userId: string, input: CreateNoteInput): Promise<NoteResponse> {
    if (input.tagIds && input.tagIds.length > 0) {
      const validTags = await this.noteRepo.validateUserTags(userId, input.tagIds);
      if (validTags.length !== input.tagIds.length) {
        throw new AppError('Một hoặc nhiều nhãn (tags) không hợp lệ hoặc không thuộc quyền sở hữu của bạn', 400, 'INVALID_TAGS');
      }
    }

    const noteId = randomUUID();

    await this.noteRepo.createNoteWithTransaction(
      {
        id: noteId,
        userId,
        title: input.title,
        content: input.content,
        isPinned: Boolean(input.isPinned),
        isArchived: Boolean(input.isArchived),
      },
      input.tagIds || []
    );

    return this.getNoteById(noteId, userId);
  }

  async updateNote(id: string, userId: string, input: UpdateNoteInput): Promise<NoteResponse> {
    const existing = await this.noteRepo.findNoteByIdAndUser(id, userId);
    if (!existing) {
      throw new AppError('Không tìm thấy ghi chú hoặc bạn không có quyền truy cập', 404, 'NOTE_NOT_FOUND');
    }

    if (input.tagIds && input.tagIds.length > 0) {
      const validTags = await this.noteRepo.validateUserTags(userId, input.tagIds);
      if (validTags.length !== input.tagIds.length) {
        throw new AppError('Một hoặc nhiều nhãn (tags) không hợp lệ hoặc không thuộc quyền sở hữu của bạn', 400, 'INVALID_TAGS');
      }
    }

    const updated = await this.noteRepo.updateNoteWithTransaction(
      id,
      userId,
      {
        title: input.title,
        content: input.content,
        isPinned: input.isPinned,
        isArchived: input.isArchived,
      },
      input.tagIds
    );

    if (!updated) {
      throw new AppError('Cập nhật ghi chú thất bại', 400, 'NOTE_UPDATE_FAILED');
    }

    return this.getNoteById(id, userId);
  }

  async deleteNote(id: string, userId: string): Promise<void> {
    const deleted = await this.noteRepo.deleteNote(id, userId);
    if (!deleted) {
      throw new AppError('Không tìm thấy ghi chú hoặc bạn không có quyền truy cập', 404, 'NOTE_NOT_FOUND');
    }
  }
}

export const noteService = new NoteService(noteRepository);