import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  isHighContrast: boolean;
}

export const useTheme = () => {
  const [state, setState] = useState<ThemeState>(() => {
    const saved = localStorage.getItem('theme-preference');
    const highContrast = localStorage.getItem('high-contrast') === 'true';
    const theme = (saved as Theme) || 'dark';
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolvedTheme: ResolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
    
    return { theme, resolvedTheme, isHighContrast: highContrast };
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(state.resolvedTheme);
    
    if (state.isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    localStorage.setItem('theme-preference', state.theme);
    localStorage.setItem('high-contrast', state.isHighContrast.toString());
  }, [state]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (state.theme === 'system') {
        setState(prev => ({
          ...prev,
          resolvedTheme: e.matches ? 'dark' : 'light',
        }));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.theme]);

  // Auto-adjust based on time of day
  useEffect(() => {
    if (state.theme !== 'system') return;
    
    const checkTime = () => {
      const hour = new Date().getHours();
      const isDark = hour < 6 || hour >= 20;
      setState(prev => ({
        ...prev,
        resolvedTheme: isDark ? 'dark' : 'light',
      }));
    };

    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state.theme]);

  const setTheme = useCallback((theme: Theme) => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolvedTheme: ResolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
    
    setState(prev => ({ ...prev, theme, resolvedTheme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState(prev => {
      const newTheme = prev.resolvedTheme === 'dark' ? 'light' : 'dark';
      return { ...prev, theme: newTheme, resolvedTheme: newTheme };
    });
  }, []);

  const toggleHighContrast = useCallback(() => {
    setState(prev => ({ ...prev, isHighContrast: !prev.isHighContrast }));
  }, []);

  return {
    theme: state.theme,
    resolvedTheme: state.resolvedTheme,
    isDark: state.resolvedTheme === 'dark',
    isHighContrast: state.isHighContrast,
    setTheme,
    toggleTheme,
    toggleHighContrast,
  };
};
