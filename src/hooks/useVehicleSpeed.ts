import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeedData {
  currentSpeed: number;
  maxSpeed: number;
  isOverspeed: boolean;
  isTracking: boolean;
  accuracy: number | null;
  lastUpdate: Date | null;
}

const SPEED_THRESHOLD_KMH = 85;
const GPS_INTERVAL_MS = 1000;
const ALARM_DURATION_MS = 10000;

function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const useVehicleSpeed = () => {
  const [data, setData] = useState<SpeedData>({
    currentSpeed: 0,
    maxSpeed: 0,
    isOverspeed: false,
    isTracking: false,
    accuracy: null,
    lastUpdate: null,
  });

  const prevPositionRef = useRef<{ lat: number; lon: number; time: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const alarmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alarmActiveRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const alarmOscRef = useRef<OscillatorNode | null>(null);
  const alarmGainRef = useRef<GainNode | null>(null);
  const wasOverspeedRef = useRef(false);
  const speedBufferRef = useRef<number[]>([]);

  const stopAlarm = useCallback(() => {
    if (alarmOscRef.current) {
      try {
        alarmGainRef.current?.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current!.currentTime + 0.3);
        setTimeout(() => {
          alarmOscRef.current?.stop();
          alarmOscRef.current = null;
          alarmGainRef.current = null;
        }, 350);
      } catch { /* already stopped */ }
    }
    alarmActiveRef.current = false;
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
  }, []);

  const playAlarm = useCallback(() => {
    if (alarmActiveRef.current) return;
    alarmActiveRef.current = true;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      // Pulsing alarm pattern
      const now = ctx.currentTime;
      for (let i = 0; i < 20; i++) {
        osc.frequency.setValueAtTime(880, now + i * 0.5);
        osc.frequency.setValueAtTime(660, now + i * 0.5 + 0.25);
      }
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      alarmOscRef.current = osc;
      alarmGainRef.current = gain;

      // Auto-stop after 10 seconds
      alarmTimeoutRef.current = setTimeout(() => {
        stopAlarm();
      }, ALARM_DURATION_MS);
    } catch (err) {
      console.warn('Alarm playback failed:', err);
      alarmActiveRef.current = false;
    }
  }, [stopAlarm]);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    setData(prev => ({ ...prev, isTracking: true }));
    prevPositionRef.current = null;
    speedBufferRef.current = [];

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed: nativeSpeed } = position.coords;
        const now = position.timestamp;

        let calculatedSpeed = 0;

        // Prefer native speed if available (more accurate)
        if (nativeSpeed !== null && nativeSpeed >= 0) {
          calculatedSpeed = nativeSpeed * 3.6; // m/s to km/h
        } else if (prevPositionRef.current) {
          const prev = prevPositionRef.current;
          const dist = haversineDistance(prev.lat, prev.lon, latitude, longitude);
          const timeDiff = (now - prev.time) / 1000; // seconds
          if (timeDiff > 0 && dist > 0) {
            calculatedSpeed = (dist / timeDiff) * 3.6; // m/s to km/h
          }
        }

        prevPositionRef.current = { lat: latitude, lon: longitude, time: now };

        // Smooth with rolling average (last 3 readings)
        speedBufferRef.current.push(calculatedSpeed);
        if (speedBufferRef.current.length > 3) speedBufferRef.current.shift();
        const smoothedSpeed = speedBufferRef.current.reduce((a, b) => a + b, 0) / speedBufferRef.current.length;

        const isOver = smoothedSpeed > SPEED_THRESHOLD_KMH;

        // Trigger alarm only on transition from safe → overspeed
        if (isOver && !wasOverspeedRef.current) {
          playAlarm();
        }
        // If speed drops below threshold, reset so alarm can trigger again
        if (!isOver) {
          wasOverspeedRef.current = false;
          if (alarmActiveRef.current) stopAlarm();
        } else {
          wasOverspeedRef.current = true;
        }

        setData(prev => ({
          currentSpeed: Math.round(smoothedSpeed * 10) / 10,
          maxSpeed: Math.max(prev.maxSpeed, smoothedSpeed),
          isOverspeed: isOver,
          isTracking: true,
          accuracy: accuracy,
          lastUpdate: new Date(now),
        }));
      },
      (err) => {
        console.warn('GPS error:', err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: GPS_INTERVAL_MS * 2,
      }
    );
  }, [playAlarm, stopAlarm]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    stopAlarm();
    prevPositionRef.current = null;
    speedBufferRef.current = [];
    wasOverspeedRef.current = false;
    setData(prev => ({ ...prev, isTracking: false, currentSpeed: 0, isOverspeed: false }));
  }, [stopAlarm]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      stopAlarm();
    };
  }, [stopAlarm]);

  return { ...data, startTracking, stopTracking, SPEED_THRESHOLD: SPEED_THRESHOLD_KMH };
};
