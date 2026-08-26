import { randomUUID } from 'crypto';
import { taskRepository, TaskRepository } from '../repositories/taskRepository.js';
import { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../validators/taskValidators.js';
import { TaskResponse, TagItem, TaskRecord } from '../types/task.js';
import { AppError } from '../middleware/errorHandler.js';

export class TaskService {
  constructor(private taskRepo: TaskRepository) {}

  private mapTaskToResponse(record: TaskRecord & { tags_json?: string | TagItem[] }): TaskResponse {
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
      description: record.description,
      priority: record.priority,
      status: record.status,
      dueDate: record.due_date ? new Date(record.due_date).toISOString() : null,
      completedAt: record.completed_at ? new Date(record.completed_at).toISOString() : null,
      tags: Array.isArray(tags) ? tags : [],
      createdAt: new Date(record.created_at).toISOString(),
      updatedAt: new Date(record.updated_at).toISOString(),
    };
  }

  async getTasks(
    userId: string,
    query: TaskQueryInput
  ): Promise<{ tasks: TaskResponse[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const { tasks: records, total } = await this.taskRepo.findTasksByUser(userId, query);
    const tasks = records.map((record) => this.mapTaskToResponse(record));
    const limit = query.limit;
    const page = query.page;
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getTaskById(id: string, userId: string): Promise<TaskResponse> {
    const record = await this.taskRepo.findTaskByIdAndUser(id, userId);
    if (!record) {
      throw new AppError('Không tìm thấy nhiệm vụ hoặc bạn không có quyền truy cập', 404, 'TASK_NOT_FOUND');
    }
    return this.mapTaskToResponse(record);
  }

  async createTask(userId: string, input: CreateTaskInput): Promise<TaskResponse> {
    if (input.tagIds && input.tagIds.length > 0) {
      const validTags = await this.taskRepo.validateUserTags(userId, input.tagIds);
      if (validTags.length !== input.tagIds.length) {
        throw new AppError('Một hoặc nhiều nhãn (tags) không hợp lệ hoặc không thuộc quyền sở hữu của bạn', 400, 'INVALID_TAGS');
      }
    }

    const taskId = randomUUID();
    const dueDate = input.dueDate ? new Date(input.dueDate) : null;
    const completedAt = input.status === 'COMPLETED' ? new Date() : null;

    await this.taskRepo.createTaskWithTransaction(
      {
        id: taskId,
        userId,
        title: input.title,
        description: input.description,
        priority: input.priority,
        status: input.status,
        dueDate,
        completedAt,
      },
      input.tagIds || []
    );

    return this.getTaskById(taskId, userId);
  }

  async updateTask(id: string, userId: string, input: UpdateTaskInput): Promise<TaskResponse> {
    const existing = await this.taskRepo.findTaskByIdAndUser(id, userId);
    if (!existing) {
      throw new AppError('Không tìm thấy nhiệm vụ hoặc bạn không có quyền truy cập', 404, 'TASK_NOT_FOUND');
    }

    if (input.tagIds && input.tagIds.length > 0) {
      const validTags = await this.taskRepo.validateUserTags(userId, input.tagIds);
      if (validTags.length !== input.tagIds.length) {
        throw new AppError('Một hoặc nhiều nhãn (tags) không hợp lệ hoặc không thuộc quyền sở hữu của bạn', 400, 'INVALID_TAGS');
      }
    }

    let completedAt: Date | null | undefined = undefined;
    if (input.status !== undefined) {
      if (input.status === 'COMPLETED' && existing.status !== 'COMPLETED') {
        completedAt = new Date();
      } else if (input.status !== 'COMPLETED' && existing.status === 'COMPLETED') {
        completedAt = null;
      }
    }

    const dueDate = input.dueDate !== undefined ? (input.dueDate ? new Date(input.dueDate) : null) : undefined;

    const updated = await this.taskRepo.updateTaskWithTransaction(
      id,
      userId,
      {
        title: input.title,
        description: input.description,
        priority: input.priority,
        status: input.status,
        dueDate,
        completedAt,
      },
      input.tagIds
    );

    if (!updated) {
      throw new AppError('Cập nhật nhiệm vụ thất bại', 400, 'TASK_UPDATE_FAILED');
    }

    return this.getTaskById(id, userId);
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    const deleted = await this.taskRepo.deleteTask(id, userId);
    if (!deleted) {
      throw new AppError('Không tìm thấy nhiệm vụ hoặc bạn không có quyền truy cập', 404, 'TASK_NOT_FOUND');
    }
  }
}

export const taskService = new TaskService(taskRepository);