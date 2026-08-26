import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../stores/authStore';
import { AlertCircle, CheckCircle2, Lock, Mail, User } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!name.trim() || !email.trim() || !password) {
      setValidationError('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    if (password.length < 8) {
      setValidationError('Mật khẩu phải có tối thiểu 8 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch {
      // Error handled by Zustand store
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg" title="Đăng ký tài khoản MyOS" description="Tạo tài khoản mới để bắt đầu sử dụng toàn bộ tính năng MyOS.">
        {isSuccess ? (
          <div className="my-6 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <h4 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">Đăng ký thành công!</h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Đang chuyển hướng bạn sang trang đăng nhập...</p>
          </div>
        ) : (
          <>
            {(validationError || error) && (
              <div className="mb-4 flex items-center space-x-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{validationError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Họ và tên
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Quang Duong"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Địa chỉ Email
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="demo@example.com"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Mật khẩu (Tối thiểu 8 ký tự)
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Xác nhận mật khẩu
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <Button type="submit" isLoading={isLoading} className="w-full mt-2">
                Tạo tài khoản
              </Button>

              <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                Đã có tài khoản?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                  Đăng nhập
                </Link>
              </div>
            </form>
          </>
        )}
      </Card>
    </div>
  );
};