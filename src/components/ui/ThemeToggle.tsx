import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFeedback } from '@/contexts/FeedbackContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  showSystemOption?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  showSystemOption = false,
  className 
}) => {
  const { theme, setTheme, toggleTheme, isDark, triggerFeedback } = useFeedback();

  const handleToggle = () => {
    triggerFeedback('click');
    toggleTheme();
  };

  const handleThemeSelect = (newTheme: 'light' | 'dark' | 'system') => {
    triggerFeedback('click');
    setTheme(newTheme);
  };

  if (showSystemOption) {
    return (
      <div className={cn("flex items-center gap-1 p-1 rounded-full bg-muted/50", className)}>
        {(['light', 'dark', 'system'] as const).map((t) => (
          <button
            key={t}
            onClick={() => handleThemeSelect(t)}
            className={cn(
              "p-2 rounded-full transition-all duration-300",
              theme === t 
                ? "bg-primary text-primary-foreground shadow-lg" 
                : "hover:bg-muted text-muted-foreground"
            )}
            aria-label={`Switch to ${t} theme`}
          >
            {t === 'light' && <Sun className="h-4 w-4" />}
            {t === 'dark' && <Moon className="h-4 w-4" />}
            {t === 'system' && <Monitor className="h-4 w-4" />}
          </button>
        ))}
      </div>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={cn(
        "relative p-3 rounded-2xl bg-card border border-border",
        "hover:bg-accent hover:border-primary/30 transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? 'moon' : 'sun'}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Moon className="h-5 w-5 text-primary" />
          ) : (
            <Sun className="h-5 w-5 text-primary" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};
