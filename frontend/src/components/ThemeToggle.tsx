'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse border border-border"></div>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-slate-500 hover:text-primary dark:hover:text-yellow-400 transition-all duration-300 hover:scale-105 active:scale-95 group shadow-sm hover:border-primary/50"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {resolvedTheme === 'dark' ? (
          <Moon className="w-5 h-5 fill-current animate-in zoom-in-50 duration-500 text-yellow-100" />
        ) : (
          <Sun className="w-5 h-5 fill-current animate-in spin-in-180 zoom-in-50 duration-500 text-amber-500" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
