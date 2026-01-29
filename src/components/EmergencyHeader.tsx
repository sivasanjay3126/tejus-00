import React from 'react';
import { Heart, Accessibility } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AudioToggle } from '@/components/ui/AudioToggle';
import LanguageSelector from './LanguageSelector';

const EmergencyHeader = () => {
  const { t } = useLanguage();
  const { toggleHighContrast, isHighContrast, triggerFeedback } = useFeedback();

  const handleAccessibilityClick = () => {
    triggerFeedback('click');
    toggleHighContrast();
  };

  return (
    <header className="relative overflow-hidden bg-card border-b border-border">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="icon-container-emergency"
              >
                <Heart className="h-7 w-7" fill="currentColor" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                {t('app.title')}
              </h1>
              <p className="text-muted-foreground text-sm font-medium mt-0.5">{t('app.subtitle')}</p>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <ThemeToggle />
            <AudioToggle />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAccessibilityClick}
              className={`p-3 rounded-2xl border transition-all duration-200 ${
                isHighContrast 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-card border-border hover:bg-accent hover:border-primary/30'
              }`}
              aria-label="Toggle high contrast mode"
            >
              <Accessibility className="h-5 w-5" />
            </motion.button>
            <LanguageSelector />
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default EmergencyHeader;
