import { TagItem, PaginationMeta } from './task';

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
  tags: TagItem[];
  createdAt: string;
  updatedAt: string;
}

export interface NoteListResponseData {
  notes: Note[];
  pagination: PaginationMeta;
}

export interface NoteSingleResponseData {
  note: Note;
}

export interface CreateNoteRequest {
  title: string;
  content?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  tagIds?: string[];
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  tagIds?: string[];
}

export interface NoteFilterParams {
  search?: string;
  pinned?: boolean;
  archived?: boolean;
  tagId?: string;
  page?: number;
  limit?: number;
}