import { useCallback } from 'react';

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' | 'emergency';

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 20],
  error: [50, 100, 50],
  warning: [30, 50, 30, 50, 30],
  emergency: [100, 50, 100, 50, 100, 50, 200],
};

export const useHapticFeedback = () => {
  const isSupported = 'vibrate' in navigator;

  const vibrate = useCallback((pattern: HapticPattern) => {
    if (!isSupported) return false;
    
    try {
      navigator.vibrate(HAPTIC_PATTERNS[pattern]);
      return true;
    } catch (err) {
      console.warn('Haptic feedback failed:', err);
      return false;
    }
  }, [isSupported]);

  const stopVibration = useCallback(() => {
    if (!isSupported) return;
    navigator.vibrate(0);
  }, [isSupported]);

  return {
    isSupported,
    vibrate,
    vibrateLight: () => vibrate('light'),
    vibrateMedium: () => vibrate('medium'),
    vibrateHeavy: () => vibrate('heavy'),
    vibrateSuccess: () => vibrate('success'),
    vibrateError: () => vibrate('error'),
    vibrateWarning: () => vibrate('warning'),
    vibrateEmergency: () => vibrate('emergency'),
    stopVibration,
  };
};
