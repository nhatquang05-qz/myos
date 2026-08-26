import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Nạp .env từ backend/ hoặc từ root
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'myos_db',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    return true;
  } catch (error) {
    const err = error as Error & { code?: string; errno?: number };
    console.error(`[MySQL Connection Error] Code: ${err.code || 'UNKNOWN'} | Message: ${err.message}`);
    return false;
  }
};
