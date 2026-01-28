import { useState, useCallback, useRef, useEffect } from 'react';

interface VoiceCommand {
  phrases: string[];
  action: () => void;
}

interface VoiceControlState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
}

export const useVoiceControl = (commands: VoiceCommand[]) => {
  const [state, setState] = useState<VoiceControlState>({
    isListening: false,
    isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    transcript: '',
    error: null,
  });

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!state.isSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('')
        .toLowerCase()
        .trim();

      setState(prev => ({ ...prev, transcript }));

      // Check for commands
      for (const command of commands) {
        for (const phrase of command.phrases) {
          if (transcript.includes(phrase.toLowerCase())) {
            command.action();
            recognition.stop();
            setState(prev => ({ ...prev, isListening: false }));
            return;
          }
        }
      }
    };

    recognition.onerror = (event: any) => {
      setState(prev => ({ ...prev, error: event.error, isListening: false }));
    };

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [commands, state.isSupported]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !state.isSupported) return;
    
    setState(prev => ({ ...prev, isListening: true, error: null, transcript: '' }));
    recognitionRef.current.start();
  }, [state.isSupported]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    recognitionRef.current.stop();
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    speak,
  };
};
