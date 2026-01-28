import { useState, useEffect, useCallback } from 'react';

interface DeviceContext {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isOnline: boolean;
  isLowBattery: boolean;
  batteryLevel: number | null;
  orientation: 'portrait' | 'landscape';
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export const useDeviceContext = () => {
  const [context, setContext] = useState<DeviceContext>(() => {
    const width = window.innerWidth;
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      isOnline: navigator.onLine,
      isLowBattery: false,
      batteryLevel: null,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      deviceType: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop',
    };
  });

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setContext(prev => ({
        ...prev,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        deviceType: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop',
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setContext(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setContext(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Battery detection
  useEffect(() => {
    const getBattery = async () => {
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          
          const updateBattery = () => {
            setContext(prev => ({
              ...prev,
              batteryLevel: battery.level * 100,
              isLowBattery: battery.level < 0.2 && !battery.charging,
            }));
          };

          updateBattery();
          battery.addEventListener('levelchange', updateBattery);
          battery.addEventListener('chargingchange', updateBattery);

          return () => {
            battery.removeEventListener('levelchange', updateBattery);
            battery.removeEventListener('chargingchange', updateBattery);
          };
        }
      } catch (err) {
        console.warn('Battery API not available:', err);
      }
    };

    getBattery();
  }, []);

  // Orientation change
  useEffect(() => {
    const handleOrientation = () => {
      setContext(prev => ({
        ...prev,
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      }));
    };

    window.addEventListener('orientationchange', handleOrientation);
    return () => window.removeEventListener('orientationchange', handleOrientation);
  }, []);

  return context;
};
