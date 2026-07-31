import React, { createContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'dark-neon' | 'light-breeze' | 'cyber-violet' | 'emerald-forest';

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  badgeColor: string;
  previewGradient: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'dark-neon', name: 'Dark Neon', badgeColor: '#6366f1', previewGradient: 'linear-gradient(135deg, #0f172a, #6366f1)' },
  { id: 'light-breeze', name: 'Light Breeze', badgeColor: '#4f46e5', previewGradient: 'linear-gradient(135deg, #ffffff, #4f46e5)' },
  { id: 'cyber-violet', name: 'Cyber Violet', badgeColor: '#d946ef', previewGradient: 'linear-gradient(135deg, #0d0914, #d946ef)' },
  { id: 'emerald-forest', name: 'Emerald Forest', badgeColor: '#10b981', previewGradient: 'linear-gradient(135deg, #061e14, #10b981)' },
];

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  themes: ThemeOption[];
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('taskflow_theme') as ThemeMode;
    return saved || 'dark-neon';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('taskflow_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEME_OPTIONS }}>
      {children}
    </ThemeContext.Provider>
  );
};
