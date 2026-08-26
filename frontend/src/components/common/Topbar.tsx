import React from 'react';
import { Menu, Moon, Sun, Search, Bell, User, LogOut } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useThemeStore } from '../../stores/themeStore';
import { useAuthStore } from '../../stores/authStore';

export const Topbar: React.FC = () => {
  const { toggleSidebar } = useUIStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh (Ctrl + K)..."
            disabled
            className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs text-slate-600 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          title="Chuyển chế độ giao diện"
        >
          {isDark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-slate-600" />}
        </button>

        <button
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          title="Thông báo"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

        <div className="flex items-center space-x-2 pl-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold text-xs border border-indigo-200 dark:border-indigo-800">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
          </div>
          <div className="hidden text-left lg:block">
            <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
              {user?.name || 'Khách'}
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              {user?.email || 'Chưa đăng nhập'}
            </span>
          </div>

          <button
            onClick={logout}
            className="ml-2 rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
            title="Đăng xuất"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};