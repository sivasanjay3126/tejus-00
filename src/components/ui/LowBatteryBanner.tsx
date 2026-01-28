import React from 'react';
import { BatteryLow, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useState } from 'react';

export const LowBatteryBanner: React.FC = () => {
  const { isLowBattery } = useFeedback();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {isLowBattery && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-warning text-warning-foreground px-4 py-3 shadow-lg"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BatteryLow className="h-5 w-5" />
              <span className="font-medium">Low battery mode enabled. Animations reduced.</span>
            </div>
            <button 
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
