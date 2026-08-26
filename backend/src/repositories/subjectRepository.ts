import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/database.js';
import { SubjectRecord, CreateSubjectInput, UpdateSubjectInput } from '../types/subject.js';

export class SubjectRepository {
  async findSubjectsBySemesterAndUser(semesterId: string, userId: string): Promise<SubjectRecord[]> {
    const query = `
      SELECT id, user_id, semester_id, code, name, credits, target_grade, created_at, updated_at
      FROM subjects
      WHERE semester_id = ? AND user_id = ?
      ORDER BY code ASC
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [semesterId, userId]);
    return rows as SubjectRecord[];
  }

  async findSubjectByIdAndUser(id: string, userId: string): Promise<SubjectRecord | null> {
    const query = `
      SELECT id, user_id, semester_id, code, name, credits, target_grade, created_at, updated_at
      FROM subjects
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [id, userId]);
    if (rows.length === 0) return null;
    return rows[0] as SubjectRecord;
  }

  async findSubjectByCodeInSemester(code: string, semesterId: string, userId: string): Promise<SubjectRecord | null> {
    const query = `
      SELECT id, user_id, semester_id, code, name, credits, target_grade, created_at, updated_at
      FROM subjects
      WHERE code = ? AND semester_id = ? AND user_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [code, semesterId, userId]);
    if (rows.length === 0) return null;
    return rows[0] as SubjectRecord;
  }

  async createSubject(id: string, userId: string, semesterId: string, input: CreateSubjectInput): Promise<void> {
    const query = `
      INSERT INTO subjects (id, user_id, semester_id, code, name, credits, target_grade)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query<ResultSetHeader>(query, [
      id,
      userId,
      semesterId,
      input.code,
      input.name,
      input.credits ?? 3,
      input.targetGrade ?? null,
    ]);
  }

  async updateSubject(id: string, userId: string, input: UpdateSubjectInput): Promise<boolean> {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (input.code !== undefined) {
      fields.push('code = ?');
      params.push(input.code);
    }
    if (input.name !== undefined) {
      fields.push('name = ?');
      params.push(input.name);
    }
    if (input.credits !== undefined) {
      fields.push('credits = ?');
      params.push(input.credits);
    }
    if (input.targetGrade !== undefined) {
      fields.push('target_grade = ?');
      params.push(input.targetGrade);
    }

    if (fields.length === 0) return true;

    const query = `UPDATE subjects SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
    const [result] = await pool.query<ResultSetHeader>(query, [...params, id, userId]);
    return result.affectedRows > 0;
  }

  async deleteSubject(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM subjects WHERE id = ? AND user_id = ?';
    const [result] = await pool.query<ResultSetHeader>(query, [id, userId]);
    return result.affectedRows > 0;
  }
}

export const subjectRepository = new SubjectRepository();