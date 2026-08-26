import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { HealthCheckData } from '../types/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { LoadingState, ErrorState, EmptyState } from '../components/common/StateFeedback';
import { useAuthStore } from '../stores/authStore';
import {
  Server,
  Database,
  ShieldCheck,
  CheckSquare,
  FileText,
  Calendar,
  Wallet,
  ArrowRight,
  GraduationCap,
  Calculator,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const quickActions = [
    { title: 'Công việc & Nhiệm vụ', path: '/tasks', icon: CheckSquare, desc: 'Phase 2.2' },
    { title: 'Ghi chú tri thức', path: '/notes', icon: FileText, desc: 'Phase 3' },
    { title: 'Lịch biểu & Sự kiện', path: '/calendar', icon: Calendar, desc: 'Phase 3' },
    { title: 'Tài chính cá nhân', path: '/finance', icon: Wallet, desc: 'Phase 4' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Hero Greeting Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white shadow-sm sm:p-8">
        <div className="max-w-3xl">
          <Badge className="bg-indigo-500/30 text-indigo-100 border-indigo-400/30 mb-3">
            MyOS Personal Workspace
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {getGreeting()}, {user?.name || 'User'}!
          </h1>
          <p className="mt-2 text-sm text-indigo-100/90 sm:text-base">
            Chào mừng bạn quay trở lại với không gian làm việc và quản trị cá nhân MyOS.
          </p>
        </div>
      </div>

      {/* 2. System Status & Quick Stats Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* System Health Card (2 cols on lg) */}
        <Card
          className="lg:col-span-2"
          title="Trạng thái kết nối hạ tầng"
          description="Giám sát kết nối thời gian thực Frontend ↔ Backend ↔ MySQL"
        >
          {loading && <LoadingState message="Đang kiểm tra kết nối hệ thống..." />}

          {error && <ErrorState message={error} onRetry={fetchHealthStatus} />}

          {!loading && !error && health && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center space-x-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <Server className="h-7 w-7 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">API Gateway</p>
                  <div className="mt-1 flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Port 5000</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <Database className="h-7 w-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Database</p>
                  <div className="mt-1 flex items-center space-x-1.5">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        health.database === 'connected' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {health.database === 'connected' ? 'myos_db (8.x)' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <ShieldCheck className="h-7 w-7 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Xác thực</p>
                  <div className="mt-1 flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">JWT Authenticated</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* User Identity Snapshot Card (1 col on lg) */}
        <Card title="Hồ sơ tài khoản" description="Thông tin phiên đăng nhập hiện tại">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Họ và tên</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Email</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-500 dark:text-slate-400">Phân quyền</span>
              <Badge variant="success">Personal Owner</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Quick Actions Grid */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Truy cập nhanh</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.path} to={action.path} className="group">
                <Card className="h-full transition-all duration-200 hover:border-indigo-300 hover:shadow-md dark:hover:border-indigo-700">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="neutral">{action.desc}</Badge>
                  </div>
                  <h4 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {action.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                    <span>Xem phân hệ</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Module Quick Stats (Coming Soon Indicators) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card title="Học tập & Tiến độ GPA" description="Theo dõi tín chỉ và điểm số">
          <div className="flex items-center space-x-4 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Study Engine</h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Quản lý môn học, điểm quá trình và tính GPA hệ 4 tự động.
              </p>
            </div>
          </div>
        </Card>

        <Card title="Quản lý Ngân sách & Chi tiêu" description="Thống kê tài chính cá nhân">
          <div className="flex items-center space-x-4 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Finance Engine</h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ghi nhận thu chi, hạn mức ngân sách và thống kê số dư.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 5. Recent Activity Section */}
      <Card title="Hoạt động gần đây" description="Nhật ký các thao tác và cập nhật mới nhất">
        <EmptyState
          title="Chưa có hoạt động gần đây"
          description="Các thao tác cập nhật công việc, ghi chú và tài chính sẽ được ghi nhận tự động tại đây khi các phân hệ hoạt động."
        />
      </Card>
    </div>
  );
};