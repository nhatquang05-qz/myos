import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { pool } from '../config/database.js';
import { SemesterRecord, CreateSemesterInput, UpdateSemesterInput } from '../types/semester.js';

export class SemesterRepository {
  async findSemestersByUser(userId: string): Promise<(SemesterRecord & { subject_count: number; total_credits: number })[]> {
    const query = `
      SELECT 
        s.id, s.user_id, s.name, s.academic_year, s.start_date, s.end_date, s.is_current, 
        s.created_at, s.updated_at,
        COUNT(sub.id) AS subject_count,
        COALESCE(SUM(sub.credits), 0) AS total_credits
      FROM semesters s
      LEFT JOIN subjects sub ON s.id = sub.semester_id AND sub.user_id = s.user_id
      WHERE s.user_id = ?
      GROUP BY s.id
      ORDER BY s.is_current DESC, s.start_date DESC
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);
    return rows as (SemesterRecord & { subject_count: number; total_credits: number })[];
  }

  async findSemesterByIdAndUser(id: string, userId: string): Promise<(SemesterRecord & { subject_count: number; total_credits: number }) | null> {
    const query = `
      SELECT 
        s.id, s.user_id, s.name, s.academic_year, s.start_date, s.end_date, s.is_current, 
        s.created_at, s.updated_at,
        COUNT(sub.id) AS subject_count,
        COALESCE(SUM(sub.credits), 0) AS total_credits
      FROM semesters s
      LEFT JOIN subjects sub ON s.id = sub.semester_id AND sub.user_id = s.user_id
      WHERE s.id = ? AND s.user_id = ?
      GROUP BY s.id
      LIMIT 1
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [id, userId]);
    if (rows.length === 0) return null;
    return rows[0] as SemesterRecord & { subject_count: number; total_credits: number };
  }

  async createSemester(id: string, userId: string, input: CreateSemesterInput): Promise<void> {
    const connection: PoolConnection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      if (input.isCurrent) {
        await connection.query('UPDATE semesters SET is_current = 0 WHERE user_id = ?', [userId]);
      }

      const insertSql = `
        INSERT INTO semesters (id, user_id, name, academic_year, start_date, end_date, is_current)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.query<ResultSetHeader>(insertSql, [
        id,
        userId,
        input.name,
        input.academicYear,
        input.startDate,
        input.endDate,
        input.isCurrent ? 1 : 0,
      ]);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateSemester(id: string, userId: string, input: UpdateSemesterInput): Promise<boolean> {
    const connection: PoolConnection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      if (input.isCurrent) {
        await connection.query('UPDATE semesters SET is_current = 0 WHERE user_id = ?', [userId]);
      }

      const fields: string[] = [];
      const params: unknown[] = [];

      if (input.name !== undefined) {
        fields.push('name = ?');
        params.push(input.name);
      }
      if (input.academicYear !== undefined) {
        fields.push('academic_year = ?');
        params.push(input.academicYear);
      }
      if (input.startDate !== undefined) {
        fields.push('start_date = ?');
        params.push(input.startDate);
      }
      if (input.endDate !== undefined) {
        fields.push('end_date = ?');
        params.push(input.endDate);
      }
      if (input.isCurrent !== undefined) {
        fields.push('is_current = ?');
        params.push(input.isCurrent ? 1 : 0);
      }

      if (fields.length > 0) {
        const updateSql = `UPDATE semesters SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
        const [result] = await connection.query<ResultSetHeader>(updateSql, [...params, id, userId]);
        if (result.affectedRows === 0) {
          await connection.rollback();
          return false;
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

  async deleteSemester(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM semesters WHERE id = ? AND user_id = ?';
    const [result] = await pool.query<ResultSetHeader>(query, [id, userId]);
    return result.affectedRows > 0;
  }
}

export const semesterRepository = new SemesterRepository();