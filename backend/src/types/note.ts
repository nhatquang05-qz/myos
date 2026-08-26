import { TagItem } from './task.js';

export interface NoteRecord {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_favorite: number | boolean;
  is_archived: number | boolean;
  created_at: Date;
  updated_at: Date;
}

export interface NoteResponse {
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

export interface NoteFilterParams {
  search?: string;
  pinned?: boolean;
  archived?: boolean;
  tagId?: string;
  page?: number;
  limit?: number;
}