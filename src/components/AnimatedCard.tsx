import React from 'react';
import { motion } from 'framer-motion';
import { useFeedback } from '@/contexts/FeedbackContext';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outline' | 'glass';
  hoverEffect?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  delay = 0,
  onClick,
  variant = 'default',
  hoverEffect = true,
}) => {
  const { triggerFeedback, isLowBattery } = useFeedback();

  const handleClick = () => {
    if (onClick) {
      triggerFeedback('click');
      onClick();
    }
  };

  const variantStyles = {
    default: 'bg-card border border-border shadow-sm',
    elevated: 'bg-card border border-border shadow-lg shadow-primary/5',
    outline: 'bg-transparent border-2 border-border',
    glass: 'bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg',
  };

  return (
    <motion.div
      initial={isLowBattery ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: isLowBattery ? 0 : delay,
        duration: 0.4, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={hoverEffect && !isLowBattery ? { 
        y: -4, 
        boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.15)' 
      } : {}}
      onClick={handleClick}
      className={cn(
        "rounded-3xl p-6 transition-colors duration-200",
        variantStyles[variant],
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
