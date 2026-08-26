import fs from 'fs';
import path from 'path';
import { pool } from './database.js';

async function runMigration() {
  try {
    const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf-8');

    // Tách các câu lệnh theo dấu chấm phẩy
    const statements = sql
      .split(/;\s*$/m)
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log('[Migration] Dang khoi tao cac bang trong MySQL...');

    const connection = await pool.getConnection();
    for (const stmt of statements) {
      await connection.query(stmt);
    }
    connection.release();

    console.log('[Migration] Thanh cong: Tat ca cac bang da duoc tao!');
    process.exit(0);
  } catch (error) {
    console.error('[Migration Error]:', (error as Error).message);
    process.exit(1);
  }
}

runMigration();