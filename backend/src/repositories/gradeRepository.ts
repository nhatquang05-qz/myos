import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/database.js';
import { GradeRecord, CreateGradeInput, UpdateGradeInput } from '../types/grade.js';

export class GradeRepository {
  async findGradesBySubjectAndUser(subjectId: string, userId: string): Promise<GradeRecord[]> {
    const query = `
      SELECT id, user_id, subject_id, component_name, weight, score, grade_point, created_at, updated_at
      FROM grades
      WHERE subject_id = ? AND user_id = ?
      ORDER BY created_at ASC
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [subjectId, userId]);
    return rows as GradeRecord[];
  }

  async findGradeByIdAndUser(id: string, userId: string): Promise<GradeRecord | null> {
    const query = `
      SELECT id, user_id, subject_id, component_name, weight, score, grade_point, created_at, updated_at
      FROM grades
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [id, userId]);
    if (rows.length === 0) return null;
    return rows[0] as GradeRecord;
  }

  async createGrade(
    id: string,
    userId: string,
    subjectId: string,
    input: CreateGradeInput,
    gradePoint: number
  ): Promise<void> {
    const query = `
      INSERT INTO grades (id, user_id, subject_id, component_name, weight, score, grade_point)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query<ResultSetHeader>(query, [
      id,
      userId,
      subjectId,
      input.componentName,
      input.weight,
      input.score,
      gradePoint,
    ]);
  }

  async updateGrade(
    id: string,
    userId: string,
    updates: {
      componentName?: string;
      weight?: number;
      score?: number;
      gradePoint?: number;
    }
  ): Promise<boolean> {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (updates.componentName !== undefined) {
      fields.push('component_name = ?');
      params.push(updates.componentName);
    }
    if (updates.weight !== undefined) {
      fields.push('weight = ?');
      params.push(updates.weight);
    }
    if (updates.score !== undefined) {
      fields.push('score = ?');
      params.push(updates.score);
    }
    if (updates.gradePoint !== undefined) {
      fields.push('grade_point = ?');
      params.push(updates.gradePoint);
    }

    if (fields.length === 0) return true;

    const query = `UPDATE grades SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
    const [result] = await pool.query<ResultSetHeader>(query, [...params, id, userId]);
    return result.affectedRows > 0;
  }

  async deleteGrade(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM grades WHERE id = ? AND user_id = ?';
    const [result] = await pool.query<ResultSetHeader>(query, [id, userId]);
    return result.affectedRows > 0;
  }
}

export const gradeRepository = new GradeRepository();