import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const STORAGE_KEY = 'jobverse_theme';
const DEFAULT_THEME = 'light';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(true);

  // localStorage'dan tema tercihini yükle
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(STORAGE_KEY);
      if (storedTheme === 'dark' || storedTheme === 'light') {
        setTheme(storedTheme);
        applyTheme(storedTheme);
      } else {
        // Sistem tercihini kontrol et
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'light';
        setTheme(initialTheme);
        applyTheme(initialTheme);
      }
    } catch (error) {
      console.error('Tema yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tema değiştiğinde DOM'a uygula
  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // Tema değiştir
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Tema kaydedilirken hata:', error);
    }
  };

  // Tema ayarla (programatik)
  const setThemeMode = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
      applyTheme(newTheme);
      try {
        localStorage.setItem(STORAGE_KEY, newTheme);
      } catch (error) {
        console.error('Tema kaydedilirken hata:', error);
      }
    }
  };

  const value = {
    theme,
    isLoading,
    toggleTheme,
    setTheme: setThemeMode,
    isDark: theme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

