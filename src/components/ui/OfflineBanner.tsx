import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFeedback } from '@/contexts/FeedbackContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useFeedback();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-warning text-warning-foreground px-4 py-3 shadow-lg"
        >
          <div className="container mx-auto flex items-center justify-center gap-3">
            <WifiOff className="h-5 w-5" />
            <span className="font-medium">You're offline. Some features may be limited.</span>
            <button 
              onClick={() => window.location.reload()}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Refresh page"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
