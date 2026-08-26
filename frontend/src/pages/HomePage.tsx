import React from 'react';
import { AppLayout } from '../layouts/AppLayout';

export const HomePage: React.FC = () => {
  return (
    <AppLayout>
      <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Phase 0.1 Foundation Setup</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          React + Vite + TypeScript + Tailwind CSS và Node.js + Express + TypeScript đã được khởi tạo thành công ở cấu trúc độc lập.
        </p>
      </div>
    </AppLayout>
  );
};