import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const storageKey = 'marketing-ops-hub:theme';

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme(): Theme {
  const savedTheme = window.localStorage.getItem(storageKey);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return getSystemTheme();
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  useEffect(() => {
    if (window.localStorage.getItem(storageKey)) {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystemTheme = () => setTheme(mediaQuery.matches ? 'dark' : 'light');

    mediaQuery.addEventListener('change', syncSystemTheme);

    return () => mediaQuery.removeEventListener('change', syncSystemTheme);
  }, []);

  return {
    theme,
    toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark')),
  };
}
