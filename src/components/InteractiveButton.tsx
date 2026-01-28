import React from 'react';
import { motion } from 'framer-motion';
import { useFeedback } from '@/contexts/FeedbackContext';
import { cn } from '@/lib/utils';

interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'emergency';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  feedbackType?: 'click' | 'success' | 'error' | 'notification' | 'emergency';
  children: React.ReactNode;
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  feedbackType = 'click',
  children,
  className,
  onClick,
  disabled,
  ...props
}) => {
  const { triggerFeedback, isLowBattery } = useFeedback();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    triggerFeedback(feedbackType);
    onClick?.(e);
  };

  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/25',
    ghost: 'bg-transparent hover:bg-accent text-foreground',
    emergency: 'bg-emergency text-white hover:bg-emergency/90 shadow-emergency/40 animate-pulse',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  };

  return (
    <motion.button
      whileHover={!isLowBattery && !disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isLowBattery && !disabled ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={cn(
        "relative font-semibold transition-all duration-200",
        "flex items-center justify-center gap-3",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "shadow-lg hover:shadow-xl",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
        />
      ) : icon ? (
        <motion.span
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          {icon}
        </motion.span>
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
};
