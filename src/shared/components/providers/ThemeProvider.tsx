"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { PaintTransitionOverlay } from './PaintTransitionOverlay';

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState('light');
  const triggerPaintRef = useRef<((nextTheme: string) => void) | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('aputrak_theme') || 'light';
    setTheme(stored);
    
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${stored}`);
  }, []);

  const applyThemeChange = useCallback((newTheme: string) => {
    localStorage.setItem('aputrak_theme', newTheme);
    setTheme(newTheme);
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${newTheme}`);
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    if (triggerPaintRef.current) {
      triggerPaintRef.current(nextTheme);
    } else {
      applyThemeChange(nextTheme);
    }
  }, [theme, applyThemeChange]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      <PaintTransitionOverlay
        triggerRef={triggerPaintRef}
        onMidpoint={(nextTheme) => {
          applyThemeChange(nextTheme);
        }}
      />
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
