import React, { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <aside className="w-64 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 hidden md:flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MyOS</h1>
          <p className="text-xs text-slate-500 mt-1">Personal Operating System</p>
        </div>
        <div className="text-xs text-slate-400">Phase 0.1 Ready</div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between dark:border-slate-800 dark:bg-slate-900">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Status: Foundation Initialized</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};