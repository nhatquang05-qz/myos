import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggleTheme: () =>
    set((state) => {
      const nextState = !state.isDark;
      if (nextState) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('myos_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('myos_theme', 'light');
      }
      return { isDark: nextState };
    }),
  initTheme: () => {
    const saved = localStorage.getItem('myos_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'dark' || (!saved && prefersDark);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ isDark });
  },
}));
