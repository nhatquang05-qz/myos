import api from './api';
import { ApiResponse } from '../types/api';
import {
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
  NoteFilterParams,
  NoteListResponseData,
  NoteSingleResponseData,
} from '../types/note';

export const noteApi = {
  async getNotes(params?: NoteFilterParams): Promise<NoteListResponseData> {
    const res = await api.get<ApiResponse<NoteListResponseData>>('/notes', { params });
    return res.data.data!;
  },

  async getNote(id: string): Promise<Note> {
    const res = await api.get<ApiResponse<NoteSingleResponseData>>(`/notes/${id}`);
    return res.data.data!.note;
  },

  async createNote(data: CreateNoteRequest): Promise<Note> {
    const res = await api.post<ApiResponse<NoteSingleResponseData>>('/notes', data);
    return res.data.data!.note;
  },

  async updateNote(id: string, data: UpdateNoteRequest): Promise<Note> {
    const res = await api.patch<ApiResponse<NoteSingleResponseData>>(`/notes/${id}`, data);
    return res.data.data!.note;
  },

  async deleteNote(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/notes/${id}`);
  },
};