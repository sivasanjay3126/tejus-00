import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, MapPin, X, Siren } from 'lucide-react';
import { useFeedback } from '@/contexts/FeedbackContext';
import { InteractiveButton } from './InteractiveButton';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  emergencyType?: 'accident' | 'medical' | 'fire';
  location?: { lat: number; lng: number };
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  emergencyType = 'accident',
  location,
}) => {
  const { playEmergency, vibrateEmergency, isDark } = useFeedback();

  useEffect(() => {
    if (isOpen) {
      playEmergency();
      vibrateEmergency();
      
      // Lock scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, playEmergency, vibrateEmergency]);

  const emergencyInfo = {
    accident: { title: 'Accident Detected', color: 'hsl(var(--emergency))', icon: Siren },
    medical: { title: 'Medical Emergency', color: 'hsl(var(--emergency))', icon: AlertTriangle },
    fire: { title: 'Fire Emergency', color: 'hsl(25 95% 53%)', icon: AlertTriangle },
  };

  const info = emergencyInfo[emergencyType];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with pulsing red effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <motion.div
              animate={{
                backgroundColor: ['hsl(var(--emergency) / 0.3)', 'hsl(var(--emergency) / 0.5)', 'hsl(var(--emergency) / 0.3)'],
              }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0 bg-black/80"
            />
          </motion.div>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md bg-card border-2 border-emergency rounded-3xl overflow-hidden shadow-2xl shadow-emergency/30">
              {/* Emergency header */}
              <motion.div
                animate={{
                  backgroundColor: ['hsl(var(--emergency))', 'hsl(0 84% 50%)', 'hsl(var(--emergency))'],
                }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="p-6 text-center text-white"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="inline-flex p-4 rounded-full bg-white/20 mb-4"
                >
                  <info.icon className="h-10 w-10" />
                </motion.div>
                <h2 className="text-2xl font-black">{info.title}</h2>
                <p className="text-white/80 mt-1">Emergency services are being notified</p>
              </motion.div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {location && (
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-2xl">
                    <MapPin className="h-5 w-5 text-emergency" />
                    <div>
                      <p className="text-sm text-muted-foreground">Current Location</p>
                      <p className="font-mono text-sm">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <a href="tel:108" className="block">
                    <InteractiveButton
                      variant="emergency"
                      size="lg"
                      icon={<Phone className="h-5 w-5" />}
                      feedbackType="emergency"
                      className="w-full"
                    >
                      Call Ambulance (108)
                    </InteractiveButton>
                  </a>

                  <a href="tel:100" className="block">
                    <InteractiveButton
                      variant="primary"
                      size="lg"
                      icon={<Phone className="h-5 w-5" />}
                      className="w-full"
                    >
                      Call Police (100)
                    </InteractiveButton>
                  </a>
                </div>

                <button
                  onClick={onClose}
                  className="w-full p-3 text-muted-foreground hover:text-foreground transition-colors text-center"
                >
                  Dismiss Alert
                </button>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                aria-label="Close emergency modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
