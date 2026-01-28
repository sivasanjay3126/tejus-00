import React, { createContext, useContext, ReactNode } from 'react';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useTheme } from '@/hooks/useTheme';
import { useDeviceContext } from '@/hooks/useDeviceContext';

interface FeedbackContextType {
  // Audio
  playClick: () => void;
  playSuccess: () => void;
  playError: () => void;
  playNotification: () => void;
  playEmergency: () => void;
  playToggle: () => void;
  playHover: () => void;
  isAudioEnabled: boolean;
  audioVolume: number;
  toggleAudio: () => void;
  setAudioVolume: (volume: number) => void;

  // Haptic
  isHapticSupported: boolean;
  vibrateLight: () => void;
  vibrateMedium: () => void;
  vibrateHeavy: () => void;
  vibrateSuccess: () => void;
  vibrateError: () => void;
  vibrateWarning: () => void;
  vibrateEmergency: () => void;

  // Theme
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  isDark: boolean;
  isHighContrast: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  toggleHighContrast: () => void;

  // Device
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isOnline: boolean;
  isLowBattery: boolean;
  orientation: 'portrait' | 'landscape';

  // Combined feedback
  triggerFeedback: (type: 'click' | 'success' | 'error' | 'notification' | 'emergency') => void;
}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const audio = useAudioFeedback();
  const haptic = useHapticFeedback();
  const theme = useTheme();
  const device = useDeviceContext();

  const triggerFeedback = (type: 'click' | 'success' | 'error' | 'notification' | 'emergency') => {
    switch (type) {
      case 'click':
        audio.playClick();
        haptic.vibrateLight();
        break;
      case 'success':
        audio.playSuccess();
        haptic.vibrateSuccess();
        break;
      case 'error':
        audio.playError();
        haptic.vibrateError();
        break;
      case 'notification':
        audio.playNotification();
        haptic.vibrateMedium();
        break;
      case 'emergency':
        audio.playEmergency();
        haptic.vibrateEmergency();
        break;
    }
  };

  const value: FeedbackContextType = {
    // Audio
    playClick: audio.playClick,
    playSuccess: audio.playSuccess,
    playError: audio.playError,
    playNotification: audio.playNotification,
    playEmergency: audio.playEmergency,
    playToggle: audio.playToggle,
    playHover: audio.playHover,
    isAudioEnabled: audio.isEnabled,
    audioVolume: audio.volume,
    toggleAudio: audio.toggleAudio,
    setAudioVolume: audio.setVolume,

    // Haptic
    isHapticSupported: haptic.isSupported,
    vibrateLight: haptic.vibrateLight,
    vibrateMedium: haptic.vibrateMedium,
    vibrateHeavy: haptic.vibrateHeavy,
    vibrateSuccess: haptic.vibrateSuccess,
    vibrateError: haptic.vibrateError,
    vibrateWarning: haptic.vibrateWarning,
    vibrateEmergency: haptic.vibrateEmergency,

    // Theme
    theme: theme.theme,
    resolvedTheme: theme.resolvedTheme,
    isDark: theme.isDark,
    isHighContrast: theme.isHighContrast,
    setTheme: theme.setTheme,
    toggleTheme: theme.toggleTheme,
    toggleHighContrast: theme.toggleHighContrast,

    // Device
    isMobile: device.isMobile,
    isTablet: device.isTablet,
    isDesktop: device.isDesktop,
    isOnline: device.isOnline,
    isLowBattery: device.isLowBattery,
    orientation: device.orientation,

    // Combined
    triggerFeedback,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
