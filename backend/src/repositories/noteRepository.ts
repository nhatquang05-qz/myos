import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { pool } from '../config/database.js';
import { NoteRecord, NoteFilterParams } from '../types/note.js';
import { TagItem } from '../types/task.js';

export class NoteRepository {
  async findNotesByUser(
    userId: string,
    filters: NoteFilterParams
  ): Promise<{ notes: (NoteRecord & { tags_json?: string })[]; total: number }> {
    const conditions: string[] = ['n.user_id = ?'];
    const params: unknown[] = [userId];

    if (filters.archived !== undefined) {
      conditions.push('n.is_archived = ?');
      params.push(filters.archived ? 1 : 0);
    } else {
      conditions.push('n.is_archived = 0');
    }

    if (filters.pinned !== undefined) {
      conditions.push('n.is_favorite = ?');
      params.push(filters.pinned ? 1 : 0);
    }

    if (filters.search) {
      conditions.push('(n.title LIKE ? OR n.content LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.tagId) {
      conditions.push('EXISTS (SELECT 1 FROM note_tags nt WHERE nt.note_id = n.id AND nt.tag_id = ?)');
      params.push(filters.tagId);
    }

    const whereClause = conditions.join(' AND ');

    const countSql = `SELECT COUNT(*) as total FROM notes n WHERE ${whereClause}`;
    const [countRows] = await pool.query<RowDataPacket[]>(countSql, params);
    const total = Number(countRows[0]?.total || 0);

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const dataSql = `
      SELECT 
        n.id, n.user_id, n.title, n.content, n.is_favorite, n.is_archived,
        n.created_at, n.updated_at,
        COALESCE(
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT('id', tg.id, 'name', tg.name)
            )
            FROM note_tags nt
            JOIN tags tg ON nt.tag_id = tg.id
            WHERE nt.note_id = n.id
          ),
          JSON_ARRAY()
        ) as tags_json
      FROM notes n
      WHERE ${whereClause}
      ORDER BY n.is_favorite DESC, n.updated_at DESC
      LIMIT ? OFFSET ?
    `;

    const dataParams = [...params, limit, offset];
    const [rows] = await pool.query<RowDataPacket[]>(dataSql, dataParams);

    return {
      notes: rows as (NoteRecord & { tags_json?: string })[],
      total,
    };
  }

  async findNoteByIdAndUser(id: string, userId: string): Promise<(NoteRecord & { tags_json?: string }) | null> {
    const query = `
      SELECT 
        n.id, n.user_id, n.title, n.content, n.is_favorite, n.is_archived,
        n.created_at, n.updated_at,
        COALESCE(
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT('id', tg.id, 'name', tg.name)
            )
            FROM note_tags nt
            JOIN tags tg ON nt.tag_id = tg.id
            WHERE nt.note_id = n.id
          ),
          JSON_ARRAY()
        ) as tags_json
      FROM notes n
      WHERE n.id = ? AND n.user_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [id, userId]);
    if (rows.length === 0) return null;
    return rows[0] as NoteRecord & { tags_json?: string };
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

  async createNoteWithTransaction(
    note: {
      id: string;
      userId: string;
      title: string;
      content: string;
      isPinned: boolean;
      isArchived: boolean;
    },
    tagIds: string[]
  ): Promise<void> {
    const connection: PoolConnection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const insertNoteSql = `
        INSERT INTO notes (id, user_id, title, content, is_favorite, is_archived)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await connection.query<ResultSetHeader>(insertNoteSql, [
        note.id,
        note.userId,
        note.title,
        note.content,
        note.isPinned ? 1 : 0,
        note.isArchived ? 1 : 0,
      ]);

      if (tagIds.length > 0) {
        const tagValues = tagIds.map((tagId) => [note.id, tagId]);
        const insertTagsSql = `INSERT INTO note_tags (note_id, tag_id) VALUES ?`;
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

  async updateNoteWithTransaction(
    id: string,
    userId: string,
    updates: {
      title?: string;
      content?: string;
      isPinned?: boolean;
      isArchived?: boolean;
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
      if (updates.content !== undefined) {
        fields.push('content = ?');
        params.push(updates.content);
      }
      if (updates.isPinned !== undefined) {
        fields.push('is_favorite = ?');
        params.push(updates.isPinned ? 1 : 0);
      }
      if (updates.isArchived !== undefined) {
        fields.push('is_archived = ?');
        params.push(updates.isArchived ? 1 : 0);
      }

      if (fields.length > 0) {
        const updateSql = `UPDATE notes SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
        const [result] = await connection.query<ResultSetHeader>(updateSql, [...params, id, userId]);
        if (result.affectedRows === 0) {
          await connection.rollback();
          return false;
        }
      }

      if (tagIds !== undefined) {
        await connection.query('DELETE FROM note_tags WHERE note_id = ?', [id]);
        if (tagIds.length > 0) {
          const tagValues = tagIds.map((tagId) => [id, tagId]);
          await connection.query('INSERT INTO note_tags (note_id, tag_id) VALUES ?', [tagValues]);
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

  async deleteNote(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM notes WHERE id = ? AND user_id = ?';
    const [result] = await pool.query<ResultSetHeader>(query, [id, userId]);
    return result.affectedRows > 0;
  }
}

export const noteRepository = new NoteRepository();