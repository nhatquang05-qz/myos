import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  const moduleName = location.pathname.replace('/', '').toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {moduleName} Module
            </h2>
            <Badge variant="info">Coming in Next Phase</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tính năng này đang được thiết kế và sẽ được kích hoạt theo lộ trình phát triển.
          </p>
        </div>
        <Link to="/dashboard">
          <Button variant="outline" size="sm" className="space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Về Dashboard</span>
          </Button>
        </Link>
      </div>

      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
          Phân hệ {moduleName} đang được chuẩn bị
        </h3>
        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Cơ sở dữ liệu và API cho phân hệ này đã sẵn sàng ở tầng Backend. Logic nghiệp vụ chi tiết sẽ được kết nối ở các Phase tiếp theo.
        </p>
      </Card>
    </div>
  );
};