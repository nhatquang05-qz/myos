import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { pool } from '../config/database.js';
import { TaskRecord, TagItem, TaskFilterParams, TaskPriority, TaskStatus } from '../types/task.js';

export class TaskRepository {
  async findTasksByUser(
    userId: string,
    filters: TaskFilterParams
  ): Promise<{ tasks: (TaskRecord & { tags_json?: string })[]; total: number }> {
    const conditions: string[] = ['t.user_id = ?'];
    const params: unknown[] = [userId];

    if (filters.status) {
      conditions.push('t.status = ?');
      params.push(filters.status);
    }

    if (filters.priority) {
      conditions.push('t.priority = ?');
      params.push(filters.priority);
    }

    if (filters.search) {
      conditions.push('(t.title LIKE ? OR t.description LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.tagId) {
      conditions.push('EXISTS (SELECT 1 FROM task_tags tt WHERE tt.task_id = t.id AND tt.tag_id = ?)');
      params.push(filters.tagId);
    }

    const whereClause = conditions.join(' AND ');

    // 1. Get total count
    const countSql = `SELECT COUNT(*) as total FROM tasks t WHERE ${whereClause}`;
    const [countRows] = await pool.query<RowDataPacket[]>(countSql, params);
    const total = Number(countRows[0]?.total || 0);

    // 2. Get paginated tasks with aggregated tags
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const dataSql = `
      SELECT 
        t.id, t.user_id, t.title, t.description, t.priority, t.status, 
        t.due_date, t.completed_at, t.created_at, t.updated_at,
        COALESCE(
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT('id', tg.id, 'name', tg.name)
            )
            FROM task_tags tt
            JOIN tags tg ON tt.tag_id = tg.id
            WHERE tt.task_id = t.id
          ),
          JSON_ARRAY()
        ) as tags_json
      FROM tasks t
      WHERE ${whereClause}
      ORDER BY 
        CASE t.status
          WHEN 'IN_PROGRESS' THEN 1
          WHEN 'TODO' THEN 2
          WHEN 'COMPLETED' THEN 3
          WHEN 'CANCELLED' THEN 4
          ELSE 5
        END,
        t.due_date IS NULL, t.due_date ASC,
        t.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const dataParams = [...params, limit, offset];
    const [rows] = await pool.query<RowDataPacket[]>(dataSql, dataParams);

    return {
      tasks: rows as (TaskRecord & { tags_json?: string })[],
      total,
    };
  }

  async findTaskByIdAndUser(id: string, userId: string): Promise<(TaskRecord & { tags_json?: string }) | null> {
    const query = `
      SELECT 
        t.id, t.user_id, t.title, t.description, t.priority, t.status, 
        t.due_date, t.completed_at, t.created_at, t.updated_at,
        COALESCE(
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT('id', tg.id, 'name', tg.name)
            )
            FROM task_tags tt
            JOIN tags tg ON tt.tag_id = tg.id
            WHERE tt.task_id = t.id
          ),
          JSON_ARRAY()
        ) as tags_json
      FROM tasks t
      WHERE t.id = ? AND t.user_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [id, userId]);
    if (rows.length === 0) return null;
    return rows[0] as TaskRecord & { tags_json?: string };
  }

  async validateUserTags(userId: string, tagIds: string[]): Promise<TagItem[]> {
    if (tagIds.length === 0) return [];
    const placeholders = tagIds.map(() => '?').join(',');
    const query = `
      SELECT id, name
      FROM tags
      WHERE user_id = ? AND id IN (${placeholders})
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [userId, ...tagIds]);
    return rows as TagItem[];
  }

  async createTaskWithTransaction(
    task: {
      id: string;
      userId: string;
      title: string;
      description?: string | null;
      priority: TaskPriority;
      status: TaskStatus;
      dueDate?: Date | null;
      completedAt?: Date | null;
    },
    tagIds: string[]
  ): Promise<void> {
    const connection: PoolConnection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const insertTaskSql = `
        INSERT INTO tasks (id, user_id, title, description, priority, status, due_date, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.query<ResultSetHeader>(insertTaskSql, [
        task.id,
        task.userId,
        task.title,
        task.description || null,
        task.priority,
        task.status,
        task.dueDate || null,
        task.completedAt || null,
      ]);

      if (tagIds.length > 0) {
        const tagValues = tagIds.map((tagId) => [task.id, tagId]);
        const insertTagsSql = `INSERT INTO task_tags (task_id, tag_id) VALUES ?`;
        await connection.query(insertTagsSql, [tagValues]);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateTaskWithTransaction(
    id: string,
    userId: string,
    updates: {
      title?: string;
      description?: string | null;
      priority?: TaskPriority;
      status?: TaskStatus;
      dueDate?: Date | null;
      completedAt?: Date | null;
    },
    tagIds?: string[]
  ): Promise<boolean> {
    const connection: PoolConnection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const fields: string[] = [];
      const params: unknown[] = [];

      if (updates.title !== undefined) {
        fields.push('title = ?');
        params.push(updates.title);
      }
      if (updates.description !== undefined) {
        fields.push('description = ?');
        params.push(updates.description);
      }
      if (updates.priority !== undefined) {
        fields.push('priority = ?');
        params.push(updates.priority);
      }
      if (updates.status !== undefined) {
        fields.push('status = ?');
        params.push(updates.status);
      }
      if (updates.dueDate !== undefined) {
        fields.push('due_date = ?');
        params.push(updates.dueDate);
      }
      if (updates.completedAt !== undefined) {
        fields.push('completed_at = ?');
        params.push(updates.completedAt);
      }

      if (fields.length > 0) {
        const updateSql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
        const [result] = await connection.query<ResultSetHeader>(updateSql, [...params, id, userId]);
        if (result.affectedRows === 0) {
          await connection.rollback();
          return false;
        }
      }

      if (tagIds !== undefined) {
        await connection.query('DELETE FROM task_tags WHERE task_id = ?', [id]);
        if (tagIds.length > 0) {
          const tagValues = tagIds.map((tagId) => [id, tagId]);
          await connection.query('INSERT INTO task_tags (task_id, tag_id) VALUES ?', [tagValues]);
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
    const [result] = await pool.query<ResultSetHeader>(query, [id, userId]);
    return result.affectedRows > 0;
  }
}

export const taskRepository = new TaskRepository();