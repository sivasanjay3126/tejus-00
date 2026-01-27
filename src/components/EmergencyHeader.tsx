
import React from 'react';
import { Heart, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const EmergencyHeader = () => {
  const { t } = useLanguage();

  return (
    <header className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan opacity-90" />
      
      {/* Animated glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center flex-1">
            <div className="relative">
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="relative p-3 rounded-full bg-white/20 backdrop-blur-sm">
                <Heart className="h-8 w-8 text-white animate-bounce-soft" fill="currentColor" />
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                {t('app.title')}
                <Zap className="h-6 w-6 text-yellow-300 animate-glow-pulse" fill="currentColor" />
              </h1>
              <p className="text-white/80 text-sm md:text-base font-medium mt-0.5">{t('app.subtitle')}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </div>

      {/* Bottom edge glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </header>
  );
};

export default EmergencyHeader;
