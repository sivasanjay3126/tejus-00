import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFeedback } from '@/contexts/FeedbackContext';
import { cn } from '@/lib/utils';

interface AudioToggleProps {
  className?: string;
}

export const AudioToggle: React.FC<AudioToggleProps> = ({ className }) => {
  const { isAudioEnabled, toggleAudio, triggerFeedback } = useFeedback();

  const handleToggle = () => {
    triggerFeedback('click');
    toggleAudio();
  };

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
      aria-label={isAudioEnabled ? 'Mute sounds' : 'Enable sounds'}
    >
      <motion.div
        initial={false}
        animate={{ scale: isAudioEnabled ? 1 : 0.9 }}
        transition={{ duration: 0.2 }}
      >
        {isAudioEnabled ? (
          <Volume2 className="h-5 w-5 text-primary" />
        ) : (
          <VolumeX className="h-5 w-5 text-muted-foreground" />
        )}
      </motion.div>
    </motion.button>
  );
};
