import app from './app.js';
import { env } from './config/env.js';
import { checkDatabaseConnection } from './config/database.js';

const startServer = async (): Promise<void> => {
  console.log('[Server] Dang kiem tra ket noi MySQL Database...');
  const isDbConnected = await checkDatabaseConnection();

  if (!isDbConnected) {
    console.error('[Server Fatal Error] Khong the ket noi MySQL Database. Server huy khoi dong.');
    process.exit(1);
  }

  console.log(`[Server] Ket noi MySQL (${env.DB_NAME}) thanh cong.`);

  app.listen(env.PORT, () => {
    console.log(`[Server] MyOS API running tai http://localhost:${env.PORT}`);
    console.log(`[Server] Environment: ${env.NODE_ENV}`);
  });
};

startServer();