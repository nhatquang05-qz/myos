import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <Card className="w-full max-w-md" title="Đăng nhập vào MyOS" description="Chức năng xác thực JWT sẽ được kích hoạt tại Phase 1.">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              disabled
              placeholder="demo@example.com"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Mật khẩu</label>
            <input
              type="password"
              disabled
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800"
            />
          </div>
          <Link to="/dashboard">
            <Button className="w-full mt-2">Bỏ qua để vào Dashboard (Phase 0)</Button>
          </Link>
          <p className="text-center text-xs text-slate-500 mt-2">
            Chưa có tài khoản? <Link to="/register" className="text-indigo-600 underline">Đăng ký</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <Card className="w-full max-w-md" title="Đăng ký tài khoản MyOS" description="Chức năng tạo tài khoản sẽ được triển khai tại Phase 1.">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Họ và tên</label>
            <input
              type="text"
              disabled
              placeholder="Quang Duong"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              disabled
              placeholder="demo@example.com"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800"
            />
          </div>
          <Link to="/login">
            <Button variant="outline" className="w-full mt-2">Quay lại Đăng nhập</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
