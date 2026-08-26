import api from './api';
import { ApiResponse } from '../types/api';
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilterParams,
  TaskListResponseData,
  TaskSingleResponseData,
} from '../types/task';

export const taskApi = {
  async getTasks(params?: TaskFilterParams): Promise<TaskListResponseData> {
    const res = await api.get<ApiResponse<TaskListResponseData>>('/tasks', { params });
    return res.data.data!;
  },

  async getTask(id: string): Promise<Task> {
    const res = await api.get<ApiResponse<TaskSingleResponseData>>(`/tasks/${id}`);
    return res.data.data!.task;
  },

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const res = await api.post<ApiResponse<TaskSingleResponseData>>('/tasks', data);
    return res.data.data!.task;
  },

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const res = await api.patch<ApiResponse<TaskSingleResponseData>>(`/tasks/${id}`, data);
    return res.data.data!.task;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/tasks/${id}`);
  },
};