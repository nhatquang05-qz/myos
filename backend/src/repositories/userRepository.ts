import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database.js';
import { UserRecord } from '../types/auth.js';

export class UserRepository {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const query = `
      SELECT id, name, email, password_hash, avatar_url, created_at, updated_at
      FROM users
      WHERE email = ?
      LIMIT 1
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [email.toLowerCase()]);
    if (rows.length === 0) return null;
    return rows[0] as UserRecord;
  }

  async findById(id: string): Promise<UserRecord | null> {
    const query = `
      SELECT id, name, email, password_hash, avatar_url, created_at, updated_at
      FROM users
      WHERE id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
    if (rows.length === 0) return null;
    return rows[0] as UserRecord;
  }

  async create(user: { id: string; name: string; email: string; password_hash: string }): Promise<void> {
    const query = `
      INSERT INTO users (id, name, email, password_hash)
      VALUES (?, ?, ?, ?)
    `;
    await pool.query<ResultSetHeader>(query, [
      user.id,
      user.name,
      user.email.toLowerCase(),
      user.password_hash,
    ]);
  }
}

export const userRepository = new UserRepository();