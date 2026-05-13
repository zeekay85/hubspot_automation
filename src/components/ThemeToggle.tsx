type ThemeToggleProps = {
  theme: 'light' | 'dark';
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-brand-200 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-500 dark:hover:text-brand-200"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-xs text-brand-700 dark:bg-slate-800 dark:text-brand-200">
        {isDark ? 'D' : 'L'}
      </span>
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
