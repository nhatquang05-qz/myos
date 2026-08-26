import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { HealthCheckData } from '../types/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { LoadingState, ErrorState } from '../components/common/StateFeedback';
import { Activity, Server, Database, CheckCircle2 } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [health, setHealth] = useState<HealthCheckData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<HealthCheckData>('/health');
      setHealth(res.data);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || 'Không thể kết nối đến Backend Server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Trạng thái hạ tầng hệ thống MyOS Foundation và kết nối dịch vụ.
        </p>
      </div>

      <Card title="System Health Status" description="Trực quan hóa kết nối thời gian thực Frontend ↔ Backend ↔ MySQL">
        {loading && <LoadingState message="Đang kiểm tra kết nối hệ thống..." />}

        {error && <ErrorState message={error} onRetry={fetchHealthStatus} />}

        {!loading && !error && health && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-3 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <Server className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Backend API</p>
                <div className="mt-1 flex items-center space-x-2">
                  <Badge variant="success">Online</Badge>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Port 5000</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <Database className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">MySQL Database</p>
                <div className="mt-1 flex items-center space-x-2">
                  <Badge variant={health.database === 'connected' ? 'success' : 'danger'}>
                    {health.database === 'connected' ? 'Connected' : 'Disconnected'}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">myos_db</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <Activity className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Foundation Status</p>
                <div className="mt-1 flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-semibold">Phase 0 Ready</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card title="Task & Productivity" description="Sẵn sàng kết nối trong Phase 2." />
        <Card title="Study & GPA Calculator" description="Sẵn sàng kết nối trong Phase 3." />
        <Card title="Personal Finance" description="Sẵn sàng kết nối trong Phase 4." />
      </div>
    </div>
  );
};
