import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'button';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  variant = 'text',
  count = 1,
}) => {
  const variantStyles = {
    text: 'h-4 rounded-lg',
    card: 'h-32 rounded-3xl',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-12 w-32 rounded-2xl',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            "bg-muted overflow-hidden relative",
            variantStyles[variant],
            className
          )}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        </motion.div>
      ))}
    </>
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("p-6 bg-card rounded-3xl border border-border space-y-4", className)}>
    <div className="flex items-center gap-4">
      <SkeletonLoader variant="avatar" />
      <div className="space-y-2 flex-1">
        <SkeletonLoader className="w-1/2" />
        <SkeletonLoader className="w-1/3" />
      </div>
    </div>
    <SkeletonLoader className="w-full h-20 rounded-2xl" />
    <div className="flex gap-3">
      <SkeletonLoader variant="button" className="flex-1" />
      <SkeletonLoader variant="button" className="flex-1" />
    </div>
  </div>
);

export const StatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="p-4 bg-card rounded-2xl border border-border space-y-3">
        <SkeletonLoader className="w-8 h-8 rounded-xl" />
        <SkeletonLoader className="w-1/2 h-8" />
        <SkeletonLoader className="w-3/4" />
      </div>
    ))}
  </div>
);
