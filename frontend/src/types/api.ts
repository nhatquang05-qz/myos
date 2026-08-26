export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
}

export interface HealthCheckData {
  success: boolean;
  message: string;
  database: 'connected' | 'disconnected';
}
