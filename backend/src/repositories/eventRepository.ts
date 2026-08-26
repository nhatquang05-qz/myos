import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/database.js';
import { EventRecord, EventFilterParams } from '../types/event.js';

export class EventRepository {
  async findEventsByUser(userId: string, filters: EventFilterParams): Promise<EventRecord[]> {
    const conditions: string[] = ['user_id = ?'];
    const params: unknown[] = [userId];

    if (filters.from && filters.to) {
      conditions.push('start_at < ? AND end_at > ?');
      params.push(new Date(filters.to), new Date(filters.from));
    } else if (filters.from) {
      conditions.push('end_at > ?');
      params.push(new Date(filters.from));
    } else if (filters.to) {
      conditions.push('start_at < ?');
      params.push(new Date(filters.to));
    }

    if (filters.search) {
      conditions.push('(title LIKE ? OR description LIKE ? OR location LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    const whereClause = conditions.join(' AND ');
    const query = `
      SELECT id, user_id, title, description, start_at, end_at, location, created_at, updated_at
      FROM events
      WHERE ${whereClause}
      ORDER BY start_at ASC
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as EventRecord[];
  }

  async findEventByIdAndUser(id: string, userId: string): Promise<EventRecord | null> {
    const query = `
      SELECT id, user_id, title, description, start_at, end_at, location, created_at, updated_at
      FROM events
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [id, userId]);
    if (rows.length === 0) return null;
    return rows[0] as EventRecord;
  }

  async createEvent(event: {
    id: string;
    userId: string;
    title: string;
    description?: string | null;
    startAt: Date;
    endAt: Date;
    location?: string | null;
  }): Promise<void> {
    const query = `
      INSERT INTO events (id, user_id, title, description, start_at, end_at, location)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query<ResultSetHeader>(query, [
      event.id,
      event.userId,
      event.title,
      event.description || null,
      event.startAt,
      event.endAt,
      event.location || null,
    ]);
  }

  async updateEvent(
    id: string,
    userId: string,
    updates: {
      title?: string;
      description?: string | null;
      startAt?: Date;
      endAt?: Date;
      location?: string | null;
    }
  ): Promise<boolean> {
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
    if (updates.startAt !== undefined) {
      fields.push('start_at = ?');
      params.push(updates.startAt);
    }
    if (updates.endAt !== undefined) {
      fields.push('end_at = ?');
      params.push(updates.endAt);
    }
    if (updates.location !== undefined) {
      fields.push('location = ?');
      params.push(updates.location);
    }

    if (fields.length === 0) return true;

    const query = `UPDATE events SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
    const [result] = await pool.query<ResultSetHeader>(query, [...params, id, userId]);
    return result.affectedRows > 0;
  }

  async deleteEvent(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM events WHERE id = ? AND user_id = ?';
    const [result] = await pool.query<ResultSetHeader>(query, [id, userId]);
    return result.affectedRows > 0;
  }
}

export const eventRepository = new EventRepository();