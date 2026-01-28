import { useCallback, useRef, useState, useEffect } from 'react';

type SoundType = 'click' | 'success' | 'error' | 'notification' | 'emergency' | 'toggle' | 'hover';

interface AudioSettings {
  enabled: boolean;
  volume: number;
}

const SOUND_FREQUENCIES: Record<SoundType, { frequency: number; duration: number; type: OscillatorType; gain: number }> = {
  click: { frequency: 800, duration: 50, type: 'sine', gain: 0.15 },
  success: { frequency: 600, duration: 150, type: 'sine', gain: 0.2 },
  error: { frequency: 200, duration: 200, type: 'square', gain: 0.15 },
  notification: { frequency: 880, duration: 100, type: 'sine', gain: 0.2 },
  emergency: { frequency: 440, duration: 500, type: 'sawtooth', gain: 0.4 },
  toggle: { frequency: 1000, duration: 30, type: 'sine', gain: 0.1 },
  hover: { frequency: 1200, duration: 20, type: 'sine', gain: 0.05 },
};

export const useAudioFeedback = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [settings, setSettings] = useState<AudioSettings>(() => {
    const saved = localStorage.getItem('audio-settings');
    return saved ? JSON.parse(saved) : { enabled: true, volume: 0.5 };
  });

  useEffect(() => {
    localStorage.setItem('audio-settings', JSON.stringify(settings));
  }, [settings]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!settings.enabled) return;

    try {
      const ctx = getAudioContext();
      const config = SOUND_FREQUENCIES[type];
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(config.gain * settings.volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration / 1000);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + config.duration / 1000);

      // For success sound, add a second tone
      if (type === 'success') {
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(800, ctx.currentTime);
          gain2.gain.setValueAtTime(0.2 * settings.volume, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.15);
        }, 100);
      }

      // For emergency, create alarm pattern
      if (type === 'emergency') {
        let i = 0;
        const interval = setInterval(() => {
          if (i >= 4) {
            clearInterval(interval);
            return;
          }
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(i % 2 === 0 ? 440 : 880, ctx.currentTime);
          gain.gain.setValueAtTime(0.3 * settings.volume, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
          i++;
        }, 200);
      }
    } catch (err) {
      console.warn('Audio playback failed:', err);
    }
  }, [settings, getAudioContext]);

  const toggleAudio = useCallback(() => {
    setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setSettings(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  return {
    playSound,
    playClick: () => playSound('click'),
    playSuccess: () => playSound('success'),
    playError: () => playSound('error'),
    playNotification: () => playSound('notification'),
    playEmergency: () => playSound('emergency'),
    playToggle: () => playSound('toggle'),
    playHover: () => playSound('hover'),
    toggleAudio,
    setVolume,
    isEnabled: settings.enabled,
    volume: settings.volume,
  };
};
