import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Layers, Database, Cpu } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 flex flex-col justify-between">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">M</div>
          <span className="font-bold text-lg tracking-tight">MyOS</span>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Đăng nhập</Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm">Vào Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16 text-center">
        <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300">
          <ShieldCheck className="h-4 w-4" />
          <span>Hệ Thống Quản Lý Cá Nhân Toàn Diện</span>
        </div>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Quản trị công việc, học tập và tài chính với <span className="text-indigo-600 dark:text-indigo-400">MyOS</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
          Kiến trúc hiện đại, phân tầng chặt chẽ với React, Vite, Node.js Express và MySQL 8.x. Bảo mật phân lập dữ liệu người dùng 100%.
        </p>

        <div className="mt-8 flex justify-center space-x-4">
          <Link to="/dashboard">
            <Button size="lg" className="space-x-2">
              <span>Bắt đầu khám phá</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg">Đăng ký tài khoản</Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
          <Card title="Phân Tầng Chuẩn" description="Route -> Controller -> Service -> Repository -> MySQL.">
            <Layers className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mb-2" />
          </Card>
          <Card title="MySQL 8.x Relational" description="19 bảng quan hệ 1-N, N-N, Indexing, Decimal cho tài chính.">
            <Database className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mb-2" />
          </Card>
          <Card title="Typesafe & Responsive" description="TypeScript Strict Mode, Tailwind CSS, Dark Mode đồng bộ.">
            <Cpu className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mb-2" />
          </Card>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800">
        MyOS – Personal Operating System &copy; 2026. Built with Precision.
      </footer>
    </div>
  );
};
